from django.shortcuts import render
import os
import stripe
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Payment, Plan, Subscription
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
def create_checkout_session(request):
    try:
        # Check if Stripe key is configured
        if not settings.STRIPE_SECRET_KEY:
            print("ERROR: STRIPE_SECRET_KEY not configured")
            return Response({'error': 'Stripe configuration missing'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        print(f"Creating checkout session with Stripe key: {settings.STRIPE_SECRET_KEY[:10]}...")
        
        # Get plan from request
        plan_id = request.data.get('plan_id')
        if not plan_id:
            return Response({'error': 'Plan ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            plan = Plan.objects.get(id=plan_id, is_active=True)
        except Plan.DoesNotExist:
            return Response({'error': 'Invalid plan'}, status=status.HTTP_400_BAD_REQUEST)
        
        # You can customize the line_items as needed
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': plan.currency.lower(),
                    'product_data': {
                        'name': f'Resume Parser - {plan.name}',
                        'description': plan.description,
                    },
                    'unit_amount': int(plan.price * 100),  # Convert to cents
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:8080/cancel',
            metadata={
                'plan_id': str(plan.id),
                'user_id': str(request.user.id) if request.user.is_authenticated else ''
            }
        )
        
        print(f"Stripe session created: {session.id}")
        
        # Create a payment record
        payment = Payment.objects.create(
            stripe_session_id=session.id,
            user=request.user if request.user.is_authenticated else None,
            amount=plan.price,
            currency=plan.currency,
            status='pending'
        )
        
        print(f"Payment record created: {payment.id}")
        
        return Response({'id': session.id, 'url': session.url})
    except stripe.error.StripeError as e:
        print(f"Stripe error: {e}")
        return Response({'error': f'Stripe error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print(f"Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_publishable_key(request):
    """Return the Stripe publishable key for frontend use"""
    return Response({'publishable_key': settings.STRIPE_PUBLISHABLE_KEY})

@api_view(['GET'])
def payment_success(request):
    """Handle successful payment redirect"""
    session_id = request.GET.get('session_id')
    
    if session_id:
        try:
            payment = Payment.objects.get(stripe_session_id=session_id)
            
            # Get plan from metadata
            plan_id = request.GET.get('plan_id')
            if plan_id:
                try:
                    plan = Plan.objects.get(id=plan_id)
                    
                    # Create or update subscription
                    if payment.user:
                        subscription, created = Subscription.objects.get_or_create(
                            user=payment.user,
                            defaults={
                                'plan': plan,
                                'status': 'active',
                                'stripe_customer_id': payment.stripe_session_id  # This would be customer ID in real implementation
                            }
                        )
                        
                        if not created:
                            subscription.plan = plan
                            subscription.status = 'active'
                            subscription.save()
                        
                        # Update payment with subscription
                        payment.subscription = subscription
                        payment.status = 'completed'
                        payment.save()
                        
                        return Response({
                            'status': 'success',
                            'message': 'Payment completed and subscription activated!',
                            'session_id': session_id,
                            'amount': payment.amount,
                            'currency': payment.currency,
                            'plan': {
                                'name': plan.name,
                                'features': {
                                    'max_resumes_per_month': plan.max_resumes_per_month,
                                    'ats_analysis': plan.ats_analysis,
                                    'job_matching': plan.job_matching,
                                    'resume_templates': plan.resume_templates,
                                    'priority_support': plan.priority_support,
                                    'api_access': plan.api_access,
                                }
                            }
                        })
                    else:
                        return Response({
                            'status': 'success',
                            'message': 'Payment completed successfully!',
                            'session_id': session_id,
                            'amount': payment.amount,
                            'currency': payment.currency
                        })
                        
                except Plan.DoesNotExist:
                    return Response({
                        'status': 'error',
                        'message': 'Plan not found'
                    }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'status': 'success',
                'message': 'Payment completed successfully!',
                'session_id': session_id,
                'amount': payment.amount,
                'currency': payment.currency
            })
        except Payment.DoesNotExist:
            return Response({
                'status': 'error',
                'message': 'Payment not found'
            }, status=status.HTTP_404_NOT_FOUND)
    
    return Response({
        'status': 'success',
        'message': 'Payment completed successfully!'
    })

@api_view(['GET'])
def payment_cancel(request):
    """Handle cancelled payment redirect"""
    return Response({
        'status': 'cancelled',
        'message': 'Payment was cancelled'
    })

@csrf_exempt
def webhook(request):
    """Handle Stripe webhooks"""
    if request.method != 'POST':
        return HttpResponse(status=405)
    
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    if not sig_header:
        return HttpResponse(status=400)
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        print(f"Invalid payload: {e}")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        print(f"Invalid signature: {e}")
        return HttpResponse(status=400)
    
    # Handle the event
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Update payment status
        try:
            payment = Payment.objects.get(stripe_session_id=session.id)
            payment.status = 'completed'
            payment.save()
            print(f"Payment {session.id} marked as completed")
            
            # Create subscription if user exists
            if payment.user and session.metadata.get('plan_id'):
                try:
                    plan = Plan.objects.get(id=session.metadata['plan_id'])
                    subscription, created = Subscription.objects.get_or_create(
                        user=payment.user,
                        defaults={
                            'plan': plan,
                            'status': 'active',
                            'stripe_customer_id': session.customer if hasattr(session, 'customer') else None
                        }
                    )
                    
                    if not created:
                        subscription.plan = plan
                        subscription.status = 'active'
                        subscription.save()
                    
                    payment.subscription = subscription
                    payment.save()
                    
                    print(f"Subscription created/updated for user {payment.user.email}")
                except Plan.DoesNotExist:
                    print(f"Plan {session.metadata['plan_id']} not found")
                    
        except Payment.DoesNotExist:
            print(f"Payment {session.id} not found in database")
    
    elif event['type'] == 'payment_intent.payment_failed':
        session = event['data']['object']
        try:
            payment = Payment.objects.get(stripe_session_id=session.id)
            payment.status = 'failed'
            payment.save()
            print(f"Payment {session.id} marked as failed")
        except Payment.DoesNotExist:
            print(f"Payment {session.id} not found in database")
    
    return HttpResponse(status=200)

# Feature Management Views

class PlanListView(APIView):
    """Get all available subscription plans"""
    
    def get(self, request):
        plans = Plan.objects.filter(is_active=True)
        plan_data = []
        
        for plan in plans:
            plan_data.append({
                'id': plan.id,
                'name': plan.name,
                'price': float(plan.price),
                'currency': plan.currency,
                'description': plan.description,
                'features': {
                    'max_resumes_per_month': plan.max_resumes_per_month,
                    'ats_analysis': plan.ats_analysis,
                    'job_matching': plan.job_matching,
                    'resume_templates': plan.resume_templates,
                    'priority_support': plan.priority_support,
                    'api_access': plan.api_access,
                }
            })
        
        return Response(plan_data)

class SubscriptionStatusView(APIView):
    """Get current user's subscription status and features"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            subscription = Subscription.objects.filter(
                user=request.user,
                status='active'
            ).first()
            
            if not subscription:
                return Response({
                    'has_subscription': False,
                    'message': 'No active subscription found'
                })
            
            return Response({
                'has_subscription': True,
                'subscription': {
                    'id': subscription.id,
                    'plan_name': subscription.plan.name,
                    'status': subscription.status,
                    'start_date': subscription.start_date,
                    'end_date': subscription.end_date,
                    'is_active': subscription.is_active(),
                    'resumes_processed_this_month': subscription.resumes_processed_this_month,
                    'remaining_resumes': subscription.get_remaining_resumes(),
                    'features': {
                        'max_resumes_per_month': subscription.plan.max_resumes_per_month,
                        'ats_analysis': subscription.plan.ats_analysis,
                        'job_matching': subscription.plan.job_matching,
                        'resume_templates': subscription.plan.resume_templates,
                        'priority_support': subscription.plan.priority_support,
                        'api_access': subscription.plan.api_access,
                    }
                }
            })
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FeatureAccessView(APIView):
    """Check if user has access to specific features"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        feature = request.data.get('feature')
        if not feature:
            return Response({
                'error': 'Feature name is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            subscription = Subscription.objects.filter(
                user=request.user,
                status='active'
            ).first()
            
            if not subscription:
                return Response({
                    'has_access': False,
                    'message': 'No active subscription'
                })
            
            # Check specific feature access
            if feature == 'resume_processing':
                can_process = subscription.can_process_resume()
                return Response({
                    'has_access': can_process,
                    'remaining_resumes': subscription.get_remaining_resumes(),
                    'max_resumes': subscription.plan.max_resumes_per_month
                })
            
            # Check other features
            feature_map = {
                'ats_analysis': subscription.plan.ats_analysis,
                'job_matching': subscription.plan.job_matching,
                'resume_templates': subscription.plan.resume_templates,
                'priority_support': subscription.plan.priority_support,
                'api_access': subscription.plan.api_access,
            }
            
            has_access = feature_map.get(feature, False)
            
            return Response({
                'has_access': has_access,
                'feature': feature
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class IncrementUsageView(APIView):
    """Increment resume processing usage"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            subscription = Subscription.objects.filter(
                user=request.user,
                status='active'
            ).first()
            
            if not subscription:
                return Response({
                    'error': 'No active subscription'
                }, status=status.HTTP_403_FORBIDDEN)
            
            if not subscription.can_process_resume():
                return Response({
                    'error': 'Monthly resume limit reached',
                    'remaining_resumes': subscription.get_remaining_resumes()
                }, status=status.HTTP_403_FORBIDDEN)
            
            subscription.increment_resume_usage()
            
            return Response({
                'message': 'Usage incremented successfully',
                'remaining_resumes': subscription.get_remaining_resumes()
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CancelSubscriptionView(APIView):
    """Cancel user subscription"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            subscription = Subscription.objects.filter(
                user=request.user,
                status='active'
            ).first()
            
            if not subscription:
                return Response({
                    'error': 'No active subscription found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            cancel_type = request.data.get('cancel_type', 'end_of_period')  # 'immediate' or 'end_of_period'
            
            if cancel_type == 'immediate':
                # Cancel immediately
                subscription.status = 'cancelled'
                subscription.cancelled_at = timezone.now()
                subscription.save()
                
                # If using Stripe subscriptions, cancel there too
                if subscription.stripe_subscription_id:
                    try:
                        stripe.Subscription.modify(
                            subscription.stripe_subscription_id,
                            cancel_at_period_end=False
                        )
                        stripe.Subscription.delete(subscription.stripe_subscription_id)
                    except stripe.error.StripeError as e:
                        print(f"Stripe cancellation error: {e}")
                
                return Response({
                    'message': 'Subscription cancelled immediately',
                    'subscription_status': 'cancelled',
                    'cancelled_at': subscription.cancelled_at
                })
            
            elif cancel_type == 'end_of_period':
                # Cancel at end of current period
                subscription.status = 'cancelled'
                subscription.cancelled_at = timezone.now()
                subscription.save()
                
                # If using Stripe subscriptions, set to cancel at period end
                if subscription.stripe_subscription_id:
                    try:
                        stripe.Subscription.modify(
                            subscription.stripe_subscription_id,
                            cancel_at_period_end=True
                        )
                    except stripe.error.StripeError as e:
                        print(f"Stripe cancellation error: {e}")
                
                return Response({
                    'message': 'Subscription will be cancelled at the end of the current period',
                    'subscription_status': 'cancelled',
                    'cancelled_at': subscription.cancelled_at,
                    'active_until': subscription.end_date or 'End of current period'
                })
            
            else:
                return Response({
                    'error': 'Invalid cancel_type. Use "immediate" or "end_of_period"'
                }, status=status.HTTP_400_BAD_REQUEST)
                
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ReactivateSubscriptionView(APIView):
    """Reactivate a cancelled subscription"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            subscription = Subscription.objects.filter(
                user=request.user,
                status='cancelled'
            ).first()
            
            if not subscription:
                return Response({
                    'error': 'No cancelled subscription found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Reactivate subscription
            subscription.status = 'active'
            subscription.cancelled_at = None
            subscription.save()
            
            # If using Stripe subscriptions, reactivate there too
            if subscription.stripe_subscription_id:
                try:
                    stripe.Subscription.modify(
                        subscription.stripe_subscription_id,
                        cancel_at_period_end=False
                    )
                except stripe.error.StripeError as e:
                    print(f"Stripe reactivation error: {e}")
            
            return Response({
                'message': 'Subscription reactivated successfully',
                'subscription_status': 'active',
                'plan_name': subscription.plan.name
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SubscriptionHistoryView(APIView):
    """Get user's subscription history"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        try:
            subscriptions = Subscription.objects.filter(
                user=request.user
            ).order_by('-created_at')
            
            history = []
            for sub in subscriptions:
                history.append({
                    'id': sub.id,
                    'plan_name': sub.plan.name,
                    'status': sub.status,
                    'start_date': sub.start_date,
                    'end_date': sub.end_date,
                    'cancelled_at': sub.cancelled_at,
                    'created_at': sub.created_at,
                    'price': float(sub.plan.price),
                    'currency': sub.plan.currency
                })
            
            return Response({
                'subscription_history': history
            })
            
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UpgradeSubscriptionView(APIView):
    """Upgrade user subscription to a different plan"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            new_plan_id = request.data.get('plan_id')
            if not new_plan_id:
                return Response({
                    'error': 'Plan ID is required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                new_plan = Plan.objects.get(id=new_plan_id, is_active=True)
            except Plan.DoesNotExist:
                return Response({
                    'error': 'Invalid plan'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Get current subscription
            current_subscription = Subscription.objects.filter(
                user=request.user,
                status='active'
            ).first()
            
            if current_subscription:
                # Update existing subscription
                old_plan = current_subscription.plan
                current_subscription.plan = new_plan
                current_subscription.save()
                
                # If using Stripe, update there too
                if current_subscription.stripe_subscription_id:
                    try:
                        stripe.Subscription.modify(
                            current_subscription.stripe_subscription_id,
                            items=[{
                                'id': current_subscription.stripe_subscription_id,
                                'price': new_plan.stripe_price_id
                            }]
                        )
                    except stripe.error.StripeError as e:
                        print(f"Stripe upgrade error: {e}")
                
                return Response({
                    'message': f'Subscription upgraded from {old_plan.name} to {new_plan.name}',
                    'old_plan': old_plan.name,
                    'new_plan': new_plan.name,
                    'new_price': float(new_plan.price),
                    'currency': new_plan.currency
                })
            else:
                # Create new subscription (for users without active subscription)
                subscription = Subscription.objects.create(
                    user=request.user,
                    plan=new_plan,
                    status='active'
                )
                
                return Response({
                    'message': f'New subscription created with {new_plan.name} plan',
                    'plan_name': new_plan.name,
                    'price': float(new_plan.price),
                    'currency': new_plan.currency
                })
                
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

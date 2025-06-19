from django.shortcuts import render
import os
import stripe
from django.conf import settings
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Payment

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
def create_checkout_session(request):
    try:
        # You can customize the line_items as needed
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Resume Parser Subscription',
                    },
                    'unit_amount': 9900,  # $99.00
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url='http://localhost:8080/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:8080/cancel',
        )
        
        # Create a payment record
        Payment.objects.create(
            stripe_session_id=session.id,
            amount=99.00,
            currency='usd',
            status='pending'
        )
        
        return Response({'id': session.id, 'url': session.url})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_publishable_key(request):
    """Return the Stripe publishable key for frontend use"""
    return Response({'publishable_key': settings.STRIPE_PUBLISHABLE_KEY})

@api_view(['POST'])
def webhook(request):
    """Handle Stripe webhooks"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError as e:
        return HttpResponse(status=400)
    
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        
        # Update payment status
        try:
            payment = Payment.objects.get(stripe_session_id=session.id)
            payment.status = 'completed'
            payment.save()
        except Payment.DoesNotExist:
            pass
    
    return HttpResponse(status=200)

from django.urls import path
from .views import (
    create_checkout_session, 
    get_publishable_key, 
    webhook, 
    payment_success, 
    payment_cancel,
    PlanListView,
    SubscriptionStatusView,
    FeatureAccessView,
    IncrementUsageView,
    CancelSubscriptionView,
    ReactivateSubscriptionView,
    SubscriptionHistoryView,
    UpgradeSubscriptionView
)

urlpatterns = [
    path('create-checkout-session/', create_checkout_session, name='create_checkout_session'),
    path('publishable-key/', get_publishable_key, name='get_publishable_key'),
    path('webhook/', webhook, name='webhook'),
    path('success/', payment_success, name='payment_success'),
    path('cancel/', payment_cancel, name='payment_cancel'),
    
    # Subscription and Feature Management
    path('plans/', PlanListView.as_view(), name='plans'),
    path('subscription/status/', SubscriptionStatusView.as_view(), name='subscription_status'),
    path('features/check/', FeatureAccessView.as_view(), name='feature_access'),
    path('usage/increment/', IncrementUsageView.as_view(), name='increment_usage'),
    
    # Subscription Management
    path('subscription/cancel/', CancelSubscriptionView.as_view(), name='cancel_subscription'),
    path('subscription/reactivate/', ReactivateSubscriptionView.as_view(), name='reactivate_subscription'),
    path('subscription/history/', SubscriptionHistoryView.as_view(), name='subscription_history'),
    path('subscription/upgrade/', UpgradeSubscriptionView.as_view(), name='upgrade_subscription'),
] 
from django.urls import path
from .views import create_checkout_session, get_publishable_key, webhook

urlpatterns = [
    path('create-checkout-session/', create_checkout_session, name='create_checkout_session'),
    path('publishable-key/', get_publishable_key, name='get_publishable_key'),
    path('webhook/', webhook, name='webhook'),
] 
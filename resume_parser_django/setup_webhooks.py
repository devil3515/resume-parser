#!/usr/bin/env python
"""
Script to set up Stripe webhooks for the resume parser application.
Run this script after setting up your Stripe account and getting your API keys.
"""

import os
import stripe
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set your Stripe secret key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

def setup_webhooks():
    """Set up webhooks for the application"""
    
    # Your webhook endpoint URL (update this for production)
    webhook_url = "http://localhost:8000/api/payments/webhook/"
    
    # Events to listen for
    events = [
        "checkout.session.completed",
        "payment_intent.payment_failed",
        "invoice.payment_succeeded",
        "invoice.payment_failed"
    ]
    
    try:
        # Create the webhook
        webhook = stripe.WebhookEndpoint.create(
            url=webhook_url,
            enabled_events=events,
            description="Resume Parser Payment Webhooks"
        )
        
        print(f"✅ Webhook created successfully!")
        print(f"Webhook ID: {webhook.id}")
        print(f"Webhook URL: {webhook.url}")
        print(f"Webhook Secret: {webhook.secret}")
        print(f"Events: {', '.join(webhook.enabled_events)}")
        
        print("\n🔑 Add this to your .env file:")
        print(f"STRIPE_WEBHOOK_SECRET={webhook.secret}")
        
        return webhook.secret
        
    except stripe.error.StripeError as e:
        print(f"❌ Error creating webhook: {e}")
        return None

def list_webhooks():
    """List all existing webhooks"""
    try:
        webhooks = stripe.WebhookEndpoint.list()
        print(f"📋 Found {len(webhooks.data)} webhook(s):")
        
        for webhook in webhooks.data:
            print(f"\nWebhook ID: {webhook.id}")
            print(f"URL: {webhook.url}")
            print(f"Status: {'Active' if webhook.status == 'enabled' else 'Inactive'}")
            print(f"Events: {', '.join(webhook.enabled_events)}")
            
    except stripe.error.StripeError as e:
        print(f"❌ Error listing webhooks: {e}")

def delete_webhook(webhook_id):
    """Delete a webhook by ID"""
    try:
        stripe.WebhookEndpoint.delete(webhook_id)
        print(f"✅ Webhook {webhook_id} deleted successfully!")
    except stripe.error.StripeError as e:
        print(f"❌ Error deleting webhook: {e}")

if __name__ == "__main__":
    print("🚀 Stripe Webhook Setup for Resume Parser")
    print("=" * 50)
    
    # Check if Stripe key is set
    if not os.getenv("STRIPE_SECRET_KEY"):
        print("❌ STRIPE_SECRET_KEY not found in environment variables")
        print("Please add your Stripe secret key to the .env file")
        exit(1)
    
    print("1. Create new webhook")
    print("2. List existing webhooks")
    print("3. Delete webhook")
    
    choice = input("\nEnter your choice (1-3): ").strip()
    
    if choice == "1":
        setup_webhooks()
    elif choice == "2":
        list_webhooks()
    elif choice == "3":
        webhook_id = input("Enter webhook ID to delete: ").strip()
        if webhook_id:
            delete_webhook(webhook_id)
    else:
        print("Invalid choice!") 
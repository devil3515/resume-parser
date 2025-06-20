# Stripe Webhook Setup Guide

This guide will help you set up Stripe webhooks for the Resume Parser application.

## Prerequisites

1. **Stripe Account**: You need a Stripe account with API access
2. **API Keys**: Your Stripe secret key should be in your `.env` file
3. **Django Server**: Your Django server should be running

## Setup Steps

### 1. Environment Variables

Make sure your `.env` file contains:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # This will be generated
```

### 2. Run the Webhook Setup Script

```bash
cd resume_parser_django
python setup_webhooks.py
```

Choose option 1 to create a new webhook. The script will:
- Create a webhook endpoint in Stripe
- Generate a webhook secret
- Show you the secret to add to your `.env` file

### 3. Manual Setup (Alternative)

If you prefer to set up webhooks manually through the Stripe Dashboard:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Set the endpoint URL to: `http://localhost:8000/api/payments/webhook/`
4. Select these events:
   - `checkout.session.completed`
   - `payment_intent.payment_failed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add it to your `.env` file

### 4. Test the Webhook

You can test webhooks using the Stripe CLI:

```bash
# Install Stripe CLI first
stripe listen --forward-to localhost:8000/api/payments/webhook/
```

Or use the Stripe Dashboard to send test events.

## Webhook Events Handled

The application currently handles these webhook events:

- **`checkout.session.completed`**: When a payment is successfully completed
- **`payment_intent.payment_failed`**: When a payment fails

## Production Setup

For production, you'll need to:

1. **Update the webhook URL** to your production domain
2. **Use production API keys** instead of test keys
3. **Set up SSL** (webhooks require HTTPS)
4. **Configure proper logging** instead of print statements

### Example Production Webhook URL:
```
https://yourdomain.com/api/payments/webhook/
```

## Troubleshooting

### Common Issues:

1. **Webhook signature verification fails**
   - Check that `STRIPE_WEBHOOK_SECRET` is correct
   - Ensure the secret is from the right environment (test/live)

2. **Webhook not receiving events**
   - Verify the webhook URL is accessible
   - Check that the webhook is active in Stripe Dashboard
   - Ensure your Django server is running

3. **CSRF errors**
   - The webhook endpoint is already exempt from CSRF protection
   - If you're still getting errors, check your Django settings

### Debug Mode

To debug webhook issues, you can temporarily add more logging:

```python
# In payments/views.py webhook function
print(f"Received webhook: {event['type']}")
print(f"Event data: {event['data']}")
```

## Security Notes

- **Never expose your webhook secret** in client-side code
- **Always verify webhook signatures** (already implemented)
- **Use HTTPS in production** (required by Stripe)
- **Rotate webhook secrets** periodically

## Next Steps

After setting up webhooks:

1. Test the payment flow end-to-end
2. Monitor webhook events in Stripe Dashboard
3. Set up proper logging for production
4. Consider adding more webhook events as needed



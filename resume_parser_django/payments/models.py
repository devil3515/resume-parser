from django.db import models
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class Plan(models.Model):
    """Subscription plans with different feature sets"""
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    stripe_price_id = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True)
    
    # Feature flags
    max_resumes_per_month = models.IntegerField(default=5)
    ats_analysis = models.BooleanField(default=True)
    job_matching = models.BooleanField(default=True)
    resume_templates = models.BooleanField(default=True)
    priority_support = models.BooleanField(default=False)
    api_access = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - ${self.price}"
    
    class Meta:
        ordering = ['price']

class Subscription(models.Model):
    """User subscription tracking"""
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
        ('past_due', 'Past Due'),
        ('unpaid', 'Unpaid'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Stripe fields
    stripe_subscription_id = models.CharField(max_length=100, blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True)
    
    # Subscription dates
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(blank=True, null=True)
    cancelled_at = models.DateTimeField(blank=True, null=True)
    
    # Usage tracking
    resumes_processed_this_month = models.IntegerField(default=0)
    last_usage_reset = models.DateTimeField(default=timezone.now)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.plan.name} ({self.status})"
    
    def is_active(self):
        """Check if subscription is currently active"""
        if self.status != 'active':
            return False
        if self.end_date and timezone.now() > self.end_date:
            return False
        return True
    
    def can_process_resume(self):
        """Check if user can process a resume based on plan limits"""
        if not self.is_active():
            return False
        
        # Reset monthly usage if it's a new month
        if timezone.now().month != self.last_usage_reset.month:
            self.resumes_processed_this_month = 0
            self.last_usage_reset = timezone.now()
            self.save()
        
        return self.resumes_processed_this_month < self.plan.max_resumes_per_month
    
    def increment_resume_usage(self):
        """Increment the resume processing count"""
        self.resumes_processed_this_month += 1
        self.save()
    
    def get_remaining_resumes(self):
        """Get remaining resumes for this month"""
        return max(0, self.plan.max_resumes_per_month - self.resumes_processed_this_month)

class Payment(models.Model):
    """Payment tracking"""
    stripe_session_id = models.CharField(max_length=100, unique=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name='payments', null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Payment {self.stripe_session_id} - {self.amount} {self.currency}"

    class Meta:
        ordering = ['-created_at']

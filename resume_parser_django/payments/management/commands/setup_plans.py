from django.core.management.base import BaseCommand
from payments.models import Plan

class Command(BaseCommand):
    help = 'Set up default subscription plans'

    def handle(self, *args, **options):
        plans_data = [
            {
                'name': 'Free',
                'price': 0.00,
                'currency': 'USD',
                'description': 'Basic resume parsing with limited features',
                'max_resumes_per_month': 2,
                'ats_analysis': True,
                'job_matching': False,
                'resume_templates': False,
                'priority_support': False,
                'api_access': False,
            },
            {
                'name': 'Basic',
                'price': 9.99,
                'currency': 'USD',
                'description': 'Essential resume parsing and analysis',
                'max_resumes_per_month': 10,
                'ats_analysis': True,
                'job_matching': True,
                'resume_templates': True,
                'priority_support': False,
                'api_access': False,
            },
            {
                'name': 'Professional',
                'price': 29.99,
                'currency': 'USD',
                'description': 'Advanced features for professionals',
                'max_resumes_per_month': 50,
                'ats_analysis': True,
                'job_matching': True,
                'resume_templates': True,
                'priority_support': True,
                'api_access': False,
            },
            {
                'name': 'Enterprise',
                'price': 99.99,
                'currency': 'USD',
                'description': 'Full access with API and unlimited processing',
                'max_resumes_per_month': -1,  # Unlimited
                'ats_analysis': True,
                'job_matching': True,
                'resume_templates': True,
                'priority_support': True,
                'api_access': True,
            },
        ]

        for plan_data in plans_data:
            plan, created = Plan.objects.get_or_create(
                name=plan_data['name'],
                defaults=plan_data
            )
            
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f'Created plan: {plan.name} - ${plan.price}')
                )
            else:
                # Update existing plan
                for key, value in plan_data.items():
                    setattr(plan, key, value)
                plan.save()
                self.stdout.write(
                    self.style.WARNING(f'Updated plan: {plan.name} - ${plan.price}')
                )

        self.stdout.write(
            self.style.SUCCESS('Successfully set up all subscription plans')
        ) 
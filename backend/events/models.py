from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    CATEGORY_CHOICES = [
        ('Trip', 'Trip'),
        ('Birthday', 'Birthday'),
        ('Launch', 'Launch'),
        ('Wedding', 'Wedding'),
        ('Exam', 'Exam'),
        ('Anniversary', 'Anniversary'),
        ('Other', 'Other'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='Other')
    target_date = models.DateTimeField()
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='events')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['target_date']

    def __str__(self):
        return f"{self.title} ({self.owner.username})"

from django.contrib import admin
from .models import Event

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'target_date', 'owner', 'created_at')
    search_fields = ('title', 'description', 'owner__username')
    list_filter = ('category', 'owner', 'created_at')
    ordering = ('target_date',)
    date_hierarchy = 'target_date'

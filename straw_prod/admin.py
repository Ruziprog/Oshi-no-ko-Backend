from django.contrib import admin
from .models import Person

@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'gender', 'debut_date', 'agency', 'followers', 'popularity_rank', 'status', 'talent_type')
    list_filter = ('gender', 'status', 'talent_type')
    search_fields = ('name', 'agency')
from rest_framework import serializers
from .models import Person

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person  # This will be overridden in the specific serializers
        fields = '__all__'
from rest_framework import serializers
from .models import Person
from datetime import date

class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

    def validate_age(self, value):
        if value < 0:
            raise serializers.ValidationError("Age cannot be negative")
        if value > 100:
            raise serializers.ValidationError("Age cannot be more than 100")
        return value
    
    def validate_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Name cannot be empty")
        return value
    
    def validate_gender(self, value):
        if value not in ['M', 'F']:
            raise serializers.ValidationError("Gender must be 'M' or 'F'")
        return value
    
    def validate_followers(self, value):
        if value < 0:
            raise serializers.ValidationError("Followers cannot be negative")
        
    def validate_debut_date(self, value):
        if value > date.today():
            raise serializers.ValidationError("Debut cannot be in the future")
        return value
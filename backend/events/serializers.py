from rest_framework import serializers
from django.contrib.auth.models import User
from django.utils.dateparse import parse_datetime
from .models import Event

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'password_confirm')
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True}
        }

    def validate(self, attrs):
        if 'password_confirm' in attrs:
            if attrs['password'] != attrs.pop('password_confirm'):
                raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')


class EventSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'category', 'target_date', 'owner', 'created_at', 'updated_at')
        read_only_fields = ('id', 'owner', 'created_at', 'updated_at')

    def validate_title(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Title is required and cannot be empty.")
        if len(value) > 200:
            raise serializers.ValidationError("Title cannot exceed 200 characters.")
        return value.strip()

    def validate_target_date(self, value):
        if value is None:
            raise serializers.ValidationError("Target date is required.")
        return value

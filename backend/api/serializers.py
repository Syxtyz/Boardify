from rest_framework import serializers
from .models import AccountUser

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccountUser
        fields = ['id', 'email', 'password']
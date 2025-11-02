from rest_framework import serializers
from .models import Board, Card, List
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined', 'is_staff']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True , min_length=6)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        return user

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = ['id', 'list_id', 'title', 'description', 'created_at']
        read_only_fields = ['id', 'list_id', 'created_at']

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'board_id', 'title', 'created_at', 'cards']
        read_only_fields = ['id', 'board_id', 'created_at', 'cards']

class BoardSerializer(serializers.ModelSerializer):
    lists = ListSerializer(many=True, read_only=True)
    public_url = serializers.SerializerMethodField()

    class Meta:
        model = Board
        fields = ['id', 'owner_id', 'title', 'created_at', 'is_public', 'public_id', 'public_url', 'lists']
        read_only_fields = ['id', 'owner_id']

    def get_public_url(self, obj):
        request = self.context.get('request')
        if obj.is_public and request:
            return request.build_absolute_uri(f"/api/boards/public/{obj.public_id}/")
        return None
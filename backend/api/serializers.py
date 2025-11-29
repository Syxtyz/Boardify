from rest_framework import serializers
from .models import Board, Card, List, ActivityLog
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
        fields = ['id', 'list_id', 'title', 'card_type','description', 'checkbox_items', 'created_at', 'order']
        read_only_fields = ['id', 'created_at']

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)

    class Meta:
        model = List
        fields = ['id', 'board_id', 'title', 'created_at', 'order', 'cards']
        read_only_fields = ['id', 'board_id', 'created_at', 'cards']

class BoardSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    lists = ListSerializer(many=True, read_only=True)
    public_url = serializers.SerializerMethodField()
    shared_users = UserSerializer(many=True, read_only=True, source='shared_with')

    class Meta:
        model = Board
        fields = ['id', 'owner', 'title', 'created_at', 'is_public', 'public_id', 'public_url', 'lists', 'shared_users']
        read_only_fields = ['id', 'owner']

    def get_public_url(self, obj):
        request = self.context.get('request')
        if obj.is_public and request:
            return request.build_absolute_uri(f"/api/boards/public/{obj.public_id}/")
        return None
    
class BoardShareSerializer(serializers.Serializer):
    email = serializers.EmailField()

class BoardUnshareSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()

class ActivityLogSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    board = BoardSerializer(read_only=True)
    list = ListSerializer(read_only=True)
    card = CardSerializer(read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'user', 'action', 'board', 'list', 'card', 'timestamp', 'details']
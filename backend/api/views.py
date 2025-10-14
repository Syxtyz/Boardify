from rest_framework import generics, permissions
from .models import Board, List, Card
from .serializers import UserSerializer, RegisterSerializer, BoardSerializer, ListSerializer, CardSerializer
from django.contrib.auth.models import User

# Create your views here.
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    # permission_classes = [permissions.IsAdminUser]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class BoardCreate(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class BoardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(owner=self.request.user)
    
class ListCreate(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return List.objects.filter(board__id=board_id, board__owner=self.request.user)
    
    def perform_create(self, serializer):
        board_id = self.kwargs['board_id']
        board = Board.objects.get(id=board_id, owner=self.request.user)
        serializer.save(board=board)

class ListDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return List.objects.filter(board__id=board_id, board__owner=self.request.user)

    
class CardCreate(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        list_id = self.kwargs['list_id']
        return Card.objects.filter(list__id=list_id, list__board__owner=self.request.user)

    def perform_create(self, serializer):
        list_id = self.kwargs['list_id']
        list_obj = List.objects.get(id=list_id, board__owner=self.request.user)
        serializer.save(list=list_obj)

class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        list_id = self.kwargs['list_id']
        return Card.objects.filter(list__id=list_id, list__board__owner=self.request.user)
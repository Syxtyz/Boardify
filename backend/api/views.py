from rest_framework import generics, permissions, status
from .models import Board, List, Card
from .serializers import UserSerializer, RegisterSerializer, BoardSerializer, ListSerializer, CardSerializer
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound

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
    
class PublicBoardView(generics.RetrieveAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        public_id = self.kwargs['public_id']
        board = Board.objects.filter(public_id=public_id, is_public=True).first()
        if not board:
            raise NotFound(detail='This board is private or does not exist.')
        return board
    
class ToggleBoardPublicView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        board = get_object_or_404(Board, pk=pk, owner=self.request.user)
        board.is_public = not board.is_public
        board.save()

        serializer = BoardSerializer(board, context={'request': request})

        if board.is_public:
            message = "Board is now public."
        else:
            message = "Board is now private."

        return Response({
            "message": message,
            "board": serializer.data
        }, status=status.HTTP_200_OK)
    
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
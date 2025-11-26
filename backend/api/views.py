from rest_framework import generics, permissions, status
from .models import Board, List, Card
from .serializers import UserSerializer, RegisterSerializer, BoardSerializer, BoardShareSerializer, BoardUnshareSerializer, ListSerializer, CardSerializer
from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import NotFound
from django.core.exceptions import ObjectDoesNotExist

# Create your views here.
class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]
    # permission_classes = [permissions.IsAdminUser]

class CurrentUserView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class BoardCreate(generics.ListCreateAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(Q(owner=self.request.user) | Q(shared_with=self.request.user)).distinct()
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class BoardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(Q(owner=self.request.user) | Q(shared_with=self.request.user)).distinct()
    
class PublicBoardView(generics.RetrieveAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.AllowAny]

    def get_object(self):
        public_id = self.kwargs['public_id']
        board = Board.objects.filter(public_id=public_id, is_public=True).first()
        if not board:
            raise NotFound(detail='This board is private or does not exist.')
        return board
    
class ToggleBoardPublicView(generics.GenericAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        board = get_object_or_404(Board, pk=pk, owner=self.request.user)
        board.is_public = not board.is_public
        board.save()

        serializer = self.get_serializer(board)
        
        message = "Board is now public." if board.is_public else "Board is now private."

        return Response({ "message": message, "board": serializer.data }, status=status.HTTP_200_OK)
    
class ShareBoardView(generics.GenericAPIView):
    serializer_class = BoardShareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        board = get_object_or_404(Board, pk=pk, owner=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user_to_share = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        
        board.shared_with.add(user_to_share)
        board.save()

        response_serializer = BoardSerializer(board, context={"request": request})
        return Response(response_serializer.data, status=status.HTTP_200_OK)
    
class UnshareBoardView(generics.GenericAPIView):
    serializer_class = BoardUnshareSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        board = get_object_or_404(Board, pk=pk, owner=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user_id = serializer.validated_data['user_id']

        try:
            user_to_remove = User.objects.get(id=user_id)
        except ObjectDoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        board.shared_with.remove(user_to_remove)
        return Response({"message": f"Access removed for user ID {user_id}."}, status=status.HTTP_200_OK)
    
class ListCreate(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return List.objects.filter(board__id=board_id).filter(Q(board__owner=self.request.user) | Q(board__shared_with=self.request.user)).distinct()
    
    def perform_create(self, serializer):
        board_id = self.kwargs['board_id']
        board = Board.objects.get(id=board_id, owner=self.request.user)
        serializer.save(board=board)

class ListDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return List.objects.filter(board__id=board_id).filter(Q(board__owner=self.request.user) | Q(board__shared_with=self.request.user)).distinct()

class CardCreate(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        list_id = self.kwargs['list_id']
        return Card.objects.filter(list__id=list_id).filter(Q(list__board__owner=self.request.user) | Q(list__board__shared_with=self.request.user)).distinct()

    def perform_create(self, serializer):
        list_id = self.kwargs['list_id']
        list_obj = List.objects.get(id=list_id, board__owner=self.request.user)
        serializer.save(list=list_obj)

class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        list_id = self.kwargs['list_id']
        return Card.objects.filter(list__id=list_id).filter(Q(list__board__owner=self.request.user) | Q(list__board__shared_with=self.request.user)).distinct()
    
class ReorderListsView(generics.GenericAPIView):
    queryset = List.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        lists = request.data.get('lists', [])
        user_boards = Board.objects.filter(Q(owner=request.user) | Q(shared_with=request.user))
        for item in lists:
            list_id = item.get('id')
            new_order = item.get('order')

            list_obj = List.objects.filter(
                id=list_id,
                board__in=user_boards
            ).first()

            if not list_obj:
                continue

            list_obj.order = new_order
            list_obj.save(update_fields=['order'])
        return Response({'status': 'ok'}, status=status.HTTP_200_OK)

class ReorderCardsView(generics.GenericAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cards = request.data.get('cards', [])

        user_boards = Board.objects.filter(
            Q(owner=request.user) | Q(shared_with=request.user)
        )

        for item in cards:
            card = Card.objects.filter(
                id=item['id'],
                list__board__in=user_boards
            ).first()

            if not card:
                continue

            card.list_id = item['list']
            card.order = item['order']
            card.save(update_fields=['list', 'order'])
            
        return Response({"status": "ok"}, status=status.HTTP_200_OK)
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.exceptions import NotFound, PermissionDenied
from .models import Board, List, Card, ActivityLog, Comment
from .serializers import UserSerializer, RegisterSerializer, BoardSerializer, BoardShareSerializer, BoardUnshareSerializer, ListSerializer, CardSerializer, ActivityLogSerializer, CommentSerializer
from django.contrib.auth.models import User
from rest_framework.pagination import LimitOffsetPagination

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

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
        board = serializer.save(owner=self.request.user)
        ActivityLog.objects.create(
            user=self.request.user,
            action='board_created',
            board=board,
            details=f"has created the board '{board.title}'"
        )

class BoardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BoardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Board.objects.filter(Q(owner=self.request.user) | Q(shared_with=self.request.user)).distinct()
    
    def perform_update(self, serializer):
        board = serializer.instance
        old_title = board.title
        board = serializer.save()
        if old_title != board.title:
            ActivityLog.objects.create(
                user=self.request.user,
                action='board_updated',
                board=board,
                details=f"has renamed the board '{old_title}' to '{board.title}'"
            )

    def perform_destroy(self, instance):
        ActivityLog.objects.create(
            user=self.request.user,
            action='board_deleted',
            board=instance,
            details=f"board '{instance.title}' deleted"
        )
        instance.delete()

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

        ActivityLog.objects.create(
            user=self.request.user,
            action='board_updated',
            board=board,
            details=f"has set the board to {'public' if board.is_public else 'private'} view"
        )

        serializer = self.get_serializer(board)
        message = "Board is now public." if board.is_public else "Board is now private."
        return Response({"message": message, "board": serializer.data}, status=status.HTTP_200_OK)

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

        ActivityLog.objects.create(
            user=request.user,
            action='board_shared',
            board=board,
            details=f"shared board with {user_to_share.username} ({user_to_share.email})"
        )

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

        ActivityLog.objects.create(
            user=request.user,
            action='board_unshared',
            board=board,
            details=f"removed access for {user_to_remove.username}"
        )

        return Response({"message": f"Access removed for user ID {user_id}."}, status=status.HTTP_200_OK)

class ListCreate(generics.ListCreateAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return List.objects.filter(board__id=board_id).filter(Q(board__owner=self.request.user) | Q(board__shared_with=self.request.user)).distinct()
    
    def perform_create(self, serializer):
        board_id = self.kwargs['board_id']
        board = get_object_or_404(Board, Q(id=board_id) & (Q(owner=self.request.user) | Q(shared_with=self.request.user)))
        list_obj = serializer.save(board=board)

        ActivityLog.objects.create(
            user=self.request.user,
            action='list_created',
            list=list_obj,
            board=board,
            details=f"has created a new list '{list_obj.title}'"
        )

class ListDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return List.objects.filter(board__id=board_id).filter(Q(board__owner=self.request.user) | Q(board__shared_with=self.request.user)).distinct()

    def perform_update(self, serializer):
        list_obj = serializer.instance
        old_title = list_obj.title
        list_obj = serializer.save()
        if old_title != list_obj.title:
            ActivityLog.objects.create(
                user=self.request.user,
                action='list_updated',
                list=list_obj,
                board=list_obj.board,
                details=f"has renamed the list '{old_title}' to '{list_obj.title}'"
            )

    def perform_destroy(self, instance):
        ActivityLog.objects.create(
            user=self.request.user,
            action='list_deleted',
            list=instance,
            board=instance.board,
            details=f"has deleted the List '{instance.title}'"
        )
        instance.delete()

class CardCreate(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        list_id = self.kwargs['list_id']
        return Card.objects.filter(list__id=list_id).filter(Q(list__board__owner=self.request.user) | Q(list__board__shared_with=self.request.user)).distinct()

    def perform_create(self, serializer):
        list_id = self.kwargs['list_id']
        list_obj = get_object_or_404(List, id=list_id)
        board = list_obj.board

        if not (board.owner == self.request.user or self.request.user in board.shared_with.all()):
            raise PermissionDenied("You do not have access to this board.")

        card = serializer.save(list=list_obj)

        ActivityLog.objects.create(
            user=self.request.user,
            action='card_created',
            card=card,
            list=list_obj,
            board=board,
            details=f"has created a card '{card.title}' in '{list_obj.title}'"
        )

class CardDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        list_id = self.kwargs['list_id']
        return Card.objects.filter(list__id=list_id).filter(Q(list__board__owner=self.request.user) | Q(list__board__shared_with=self.request.user)).distinct()
    
    def perform_update(self, serializer):
        card = serializer.instance
        old_list = card.list
        card = serializer.save()

        if serializer.validated_data.get('list') and serializer.validated_data['list'] != old_list:
            ActivityLog.objects.create(
                user=self.request.user,
                action='card_moved',
                card=card,
                list=serializer.validated_data['list'],
                board=card.list.board,
                details=f"moved from list '{old_list.title}' to '{serializer.validated_data['list'].title}'"
            )
        else:
            ActivityLog.objects.create(
                user=self.request.user,
                action='card_updated',
                card=card,
                list=card.list,
                board=card.list.board,
                details=f"has edited '{card.title}'"
            )

    def perform_destroy(self, instance):
        ActivityLog.objects.create(
            user=self.request.user,
            action='card_deleted',
            card=instance,
            list=instance.list,
            board=instance.list.board,
            details=f"has deleted the card '{instance.title}'"
        )
        instance.delete()

class ReorderListsView(generics.GenericAPIView):
    queryset = List.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        lists = request.data.get('lists', [])
        user_boards = Board.objects.filter(Q(owner=request.user) | Q(shared_with=request.user))
        updated_lists = []

        for item in lists:
            list_id = item.get('id')
            new_order = item.get('order')
            list_obj = List.objects.filter(id=list_id, board__in=user_boards).first()
            if not list_obj:
                continue

            list_obj.order = new_order
            list_obj.save(update_fields=['order'])
            updated_lists.append(list_obj)

        if updated_lists:
            details = "has changed the order of lists"
            board = updated_lists[0].board
            ActivityLog.objects.create(
                user=request.user,
                action='lists_reordered',
                board=board,
                details=details
            )

        return Response({'status': 'ok'}, status=status.HTTP_200_OK)
    
class ReorderCardsView(generics.GenericAPIView):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        cards = request.data.get('cards', [])
        user_boards = Board.objects.filter(Q(owner=request.user) | Q(shared_with=request.user))

        moved_cards = []

        for item in cards:
            card = Card.objects.filter(id=item['id'], list__board__in=user_boards).first()
            if not card:
                continue

            old_list = card.list
            card.list_id = item['list']
            card.order = item['order']
            card.save(update_fields=['list', 'order'])

            if card.list != old_list:
                moved_cards.append((card, old_list))

        for card, old_list in moved_cards:
            details = f"has moved the card '{card.title}' from '{old_list.title}' to '{card.list.title}'"
            ActivityLog.objects.create(
                user=request.user,
                action='card_moved',
                card=card,
                list=card.list,
                board=card.list.board,
                details=details
            )

        return Response({"status": "ok"}, status=status.HTTP_200_OK)

class ActivityLogPagination(LimitOffsetPagination):
    default_limit = 50

class ActivityLogList(generics.ListAPIView):
    serializer_class = ActivityLogSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = ActivityLogPagination

    def get_queryset(self):
        board_id = self.kwargs['board_id']
        return ActivityLog.objects.filter(board__id=board_id)

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        card_id = self.kwargs.get('card_id')
        return Comment.objects.filter(card_id=card_id)

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        card_id = self.kwargs.get('card_id')
        card = Card.objects.get(id=card_id)
        serializer.save(user=user, card=card)

class CommentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [permissions.AllowAny]
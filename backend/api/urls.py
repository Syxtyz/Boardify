from django.urls import path
from .views import (
    UserList,
    RegisterView,
    BoardCreate,
    BoardDetail,
    PublicBoardView,
    ToggleBoardPublicView,
    ListCreate,
    ListDetail,
    CardCreate,
    CardDetail,
    ShareBoardView,
    UnshareBoardView,
    CurrentUserView,
    ReorderListsView,
    ReorderCardsView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),
    path('user/', CurrentUserView.as_view(), name='current-user'),

    path('register/', RegisterView.as_view(), name='registration'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('boards/', BoardCreate.as_view(), name='board-list'),
    path('boards/<int:pk>/', BoardDetail.as_view(), name='board-detail'),
    path('boards/public/<uuid:public_id>/', PublicBoardView.as_view(), name='public-board-view'),

    path('boards/<int:pk>/toggle-public/', ToggleBoardPublicView.as_view(), name='toggle-board-public'),
    path('boards/<int:pk>/share/', ShareBoardView.as_view(), name='share-board'),
    path('boards/<int:pk>/unshare/', UnshareBoardView.as_view(), name='unshare-board'),

    path('boards/<int:board_id>/lists/', ListCreate.as_view(), name='list-list-create'),
    path('boards/<int:board_id>/lists/<int:pk>/', ListDetail.as_view(), name='list-detail'),
    
    path('boards/<int:board_id>/lists/<int:list_id>/cards/', CardCreate.as_view(), name='card-list-create'),
    path('boards/<int:board_id>/lists/<int:list_id>/cards/<int:pk>/', CardDetail.as_view(), name='card-detail'),

    path('lists/reorder/', ReorderListsView.as_view(), name='reorder-lists'),
    path('cards/reorder/', ReorderCardsView.as_view(), name='reorder-cards'),
]
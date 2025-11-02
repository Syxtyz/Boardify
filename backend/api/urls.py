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
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),

    path('register/', RegisterView.as_view(), name='registration'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('boards/', BoardCreate.as_view(), name='board-list'),
    path('boards/<int:pk>/', BoardDetail.as_view(), name='board-detail'),

    path('boards/public/<uuid:public_id>/', PublicBoardView.as_view(), name='public-board-view'),
    path('boards/<int:pk>/share/', ToggleBoardPublicView.as_view(), name='toggle-board-public'),

    path('boards/<int:board_id>/lists/', ListCreate.as_view(), name='list-list-create'),
    path('boards/<int:board_id>/lists/<int:pk>/', ListDetail.as_view(), name='list-detail'),
    
    path('boards/<int:board_id>/lists/<int:list_id>/cards/', CardCreate.as_view(), name='card-list-create'),
    path('boards/<int:board_id>/lists/<int:list_id>/cards/<int:pk>/', CardDetail.as_view(), name='card-detail'),
]
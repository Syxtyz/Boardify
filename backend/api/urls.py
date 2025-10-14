from django.urls import path
from .views import (
    UserList,
    RegisterView,
    BoardCreate,
    BoardDetail,
    ListCreate,
    ListDetail,
    CardCreate,
    CardDetail,
)

urlpatterns = [
    path('users/', UserList.as_view(), name='user-list'),

    path('register/', RegisterView.as_view(), name='registration'),

    path('boards/', BoardCreate.as_view(), name='board-list'),
    path('boards/<int:pk>/', BoardDetail.as_view(), name='board-detail'),

    path('boards/<int:board_id>/lists/', ListCreate.as_view(), name='list-list-create'),
    path('boards/<int:board_id>/lists/<int:pk>/', ListDetail.as_view(), name='list-detail'),
    
    path('boards/<int:board_id>/lists/<int:list_id>/cards/', CardCreate.as_view(), name='card-list-create'),
    path('boards/<int:board_id>/lists/<int:list_id>/cards/<int:pk>/', CardDetail.as_view(), name='card-detail'),
]
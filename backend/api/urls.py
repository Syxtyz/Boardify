from django.urls import path, include
from .views import users, login, register, get_boards, create_boards

urlpatterns = [
    path('users/', users, name='users'),
    path('users/login/', login, name='login'),
    path('users/register/', register, name='register'),

    path('boards/', get_boards, name='boards'),
    path('boards/create/', create_boards, name='create'),
]
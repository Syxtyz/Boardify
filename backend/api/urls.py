from django.urls import path, include
from .views import users, login, register

urlpatterns = [
    path('users/', users, name='users'),
    path('users/login/', login, name='login'),
    path('users/register/', register, name='register'),
]
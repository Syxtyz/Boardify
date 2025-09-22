from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import AccountUser
from rest_framework import status
from .serializers import UsersSerializer
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

@api_view(['GET'])
def users(request):
    users = AccountUser.objects.all()
    serializedData = UsersSerializer(users, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = AccountUser.objects.get(email=email)

        if check_password(password, user.password):
            return Response ({'message': 'Login successful', 'userEmail': user.email}, status=status.HTTP_200_OK)
        else:
            return Response ({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    except AccountUser.DoesNotExist:
        return Response ({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if AccountUser.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    hashed_password = make_password(password)
    new_user_info = AccountUser(email=email, password=hashed_password)
    new_user_info.save()

    return Response({'message': f'Registered Successfully', 'email': new_user_info.email}, status=status.HTTP_201_CREATED)
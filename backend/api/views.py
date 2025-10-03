from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Board
from rest_framework import status
from .serializers import UserSerializer, BoardSerializer
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User


@api_view(['GET'])
def users(request):
    users = User.objects.all()
    serializedData = UserSerializer(users, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = User.objects.get(email=email)

        if check_password(password, user.password):
            return Response ({'message': 'Login successful', 'userEmail': user.email, 'userId': user.id}, status=status.HTTP_200_OK)
        else:
            return Response ({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)
    except User.DoesNotExist:
        return Response ({'message': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if User.objects.filter(email=email).exists():
        return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    hashed_password = make_password(password)
    new_user_info = User(email=email, password=hashed_password)
    new_user_info.save()

    return Response({'message': f'Registered Successfully', 'email': new_user_info.email}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_boards(request):
    boards = Board.objects.all()
    serializedData = BoardSerializer(boards, many=True).data
    return Response(serializedData)

@api_view(['POST'])
def create_boards(request):
    data = request.data
    serializer = BoardSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
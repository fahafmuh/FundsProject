from rest_framework import authentication
from rest_framework.authtoken.views import ObtainAuthToken
from .serializers import AuthTokenSerializer
from rest_framework.settings import api_settings
from rest_framework.decorators import api_view, authentication_classes,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.views import APIView
from rest_framework import status
from django.contrib.auth import logout

# Create your views here.

class UserLoginView(ObtainAuthToken):
    serializer_class=AuthTokenSerializer
    renderer_classes=api_settings.DEFAULT_RENDERER_CLASSES

@api_view(['GET',])
@authentication_classes([TokenAuthentication,])
@permission_classes([IsAuthenticated])
def example_view(request, format=None):
    content = {
        'user': str(request.user),
        'desgination':request.user.user_type  # `django.contrib.auth.User` instance.
    }
    return Response(content)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def Logout(request):
    request.user.auth_token.delete()
    logout(request)
    return Response('User Logged out successfully')



from rest_framework import authentication
from rest_framework.authtoken.views import ObtainAuthToken
from core.models import Director
from .serializers import AuthTokenSerializer, DirectorSerializer
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

@api_view(["GET","POST","DELETE"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def Director_API(request):
    if request.method=='GET':
        Directors=Director.objects.all()
        return Response(DirectorSerializer(Directors,many=True).data)
    elif request.method=='POST':
        for directors in request.POST.getlist('name'):
            Director_object=Director(director_name=directors)
            Director_object.save()
        return Response(DirectorSerializer(Director_object).data)
    elif request.method=='DELETE':
        id=request.POST.get('id')
        Director.objects.get(pk=int(id)).delete()
        return Response('Director Deleted Successfully')





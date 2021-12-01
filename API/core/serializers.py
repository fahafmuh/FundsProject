from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _


class AuthTokenSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(
        style={'input_type':'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        username=attrs.get('username')
        password=attrs.get('password')
        user=authenticate(username=username,password=password)

        if not user:
            raise serializers.ValidationError(_("Username or password is incorrect"))
        attrs['user']=user
        return attrs


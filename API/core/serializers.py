from django.db.models import fields
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

from core.models import Director,Fund, User


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

class DirectorSerializer(serializers.ModelSerializer):
    class Meta:
        model=Director
        fields=('id','director_name')

class UserSerializer(serializers.ModelSerializer):
    
    user_type=serializers.CharField(source='get_user_type_display')

    class Meta:
        model=User
        fields=('username','first_name','last_name','email','user_type')
    

class BaseFundSerializer(serializers.ModelSerializer):
    supervisor_approval=serializers.CharField(source='get_supervisor_approval_display')
    manager_approval=serializers.CharField(source='get_manager_approval_display')
    fund_type=serializers.CharField(source='get_fund_type_display')
    fund_structure=serializers.CharField(source='get_fund_structure_display')
    fund_status=serializers.CharField(source='get_fund_status_display')
    fund_year_end=serializers.CharField(source='get_fund_year_end_display')
    user=UserSerializer()

    class Meta:
        model=Fund
        fields='__all__'
        depth=1
    


class FundSerializer(BaseFundSerializer):
    sub_fund=BaseFundSerializer()

    
    

    

from django.db.models import fields
from rest_framework import serializers
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _

from core.models import Director,Fund, User,FundLifeClose,FundLifeOpen, FundLifeOpenDocument,closingperiod,BoardResolution,Subscriber


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
    
class FundLifeCloseSerializer(serializers.ModelSerializer):
    class Meta:
        model=FundLifeClose
        fields=('fundlife',)

class FundLifeOpenDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model=FundLifeOpenDocument
        fields=('document',)

class FundLifeOpenSerializer(serializers.ModelSerializer):
    fundlifeopendoc=FundLifeOpenDocumentSerializer(many=True)
    class Meta:
        model=FundLifeOpen
        fields=('fundlife','Board_Extension','Investor_Extension','fundlifeopendoc')

class ClosingPeriodSerializer(serializers.ModelSerializer):
    class Meta:
        model=closingperiod
        fields=('closing_Date',)

class BoardResolutionSerializer(serializers.ModelSerializer):
    class Meta:
        model=BoardResolution
        fields=('board_resolution',)

class SubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model=Subscriber
        fields=('subscriber_name','subscriber_commitment')

class BaseFundSerializer(serializers.ModelSerializer):
    supervisor_approval=serializers.CharField(source='get_supervisor_approval_display')
    manager_approval=serializers.CharField(source='get_manager_approval_display')
    fund_type=serializers.CharField(source='get_fund_type_display')
    fund_structure=serializers.CharField(source='get_fund_structure_display')
    fund_status=serializers.CharField(source='get_fund_status_display')
    fund_year_end=serializers.CharField(source='get_fund_year_end_display')
    user=UserSerializer()
    fundlifeclose=FundLifeCloseSerializer()
    fundlifeopen=FundLifeOpenSerializer()
    closingDates=ClosingPeriodSerializer(many=True)
    boardResolution=BoardResolutionSerializer(many=True)
    subscribers=SubscriberSerializer(many=True)

    class Meta:
        model=Fund
        fields='__all__'
        depth=1
    


class FundSerializer(BaseFundSerializer):
    sub_fund=BaseFundSerializer()

    
    

    

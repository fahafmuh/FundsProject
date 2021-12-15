from rest_framework.authtoken.views import ObtainAuthToken
from core.models import Director
from .serializers import AuthTokenSerializer, DirectorSerializer,FundSerializer
from rest_framework.settings import api_settings
from rest_framework.decorators import api_view, authentication_classes,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import logout
import json
from .models import (BoardResolution, Fund,FundCountry,Director,FUND_TYPE,FUND_STRUCTURE,
                    FUND_STATUS,FUND_YEAR_END_MONTH,ReportingCurrency,ProductType,FUND_APPROVAL_STATUS,
                    ReportingFrequency,ReclassificationFrequency,Bank,FundLifeClose,
                    FundLifeOpen,closingperiod,Subscriber)
                
from .utils import get_id_of_tuple,get_object_or_none

# Create your views here.

def create_fund_object(data,request,sub_fund=False):
    domicile_obj=get_object_or_none(FundCountry,'domicile',data['domicile'])
    report_currency=get_object_or_none(ReportingCurrency,'report_currency',data['reportingCurrency'])
    product_type=get_object_or_none(ProductType,'product_type',data['productType'])
    reporting_frequency=get_object_or_none(ReportingFrequency,'reporting_frequency',data['reportingFrequency'])
    AuthorizedSignatory=get_object_or_none(Director,'None',data['authorizedSignatory'][0])
    fundManagerRep=get_object_or_none(Director,'None',data['fundManagerRep'][0])

    if AuthorizedSignatory!=None and AuthorizedSignatory.director_signature is None:
        AuthorizedSignatory.director_signature=request.FILES.get('signature' if not sub_fund else 's_signature',None)
        AuthorizedSignatory.save()

    ReclassificationFrequency_obj=get_object_or_none(ReclassificationFrequency,'ReclassificationFrequency',data['reclassificationFreq'])
    Bank_obj=get_object_or_none(Bank,'Bank',data['bank'])
    Approver=get_object_or_none(Director,'None',data['approver'][0])

    fund_obj=Fund(user=request.user,
                fund_name=data['fundName'],
                registration_no=data['registrationNumber'],
                fund_description=data['fundDescription'],
                sub_fund=None,
                domicile=domicile_obj,
                fund_type=get_id_of_tuple(data['fundType'],FUND_TYPE),
                fund_structure=get_id_of_tuple(data['fundStructure'],FUND_STRUCTURE),
                fund_manager_entity=data['fundManagerEntity'],
                fund_manager_rep=fundManagerRep,
                offer_price=float(data['offerPrice']),
                issued_shares=int(data['issuedShares']),
                ordinary_shares=int(data['ordinaryShare']),
                fund_status=get_id_of_tuple(data['fundStatus'],FUND_STATUS),
                reason_to_change='',
                report_currency=report_currency,
                fund_size=float(data['fundSize']),
                lock_up_period=int(data['lockupPeriod']),
                fund_year_end=get_id_of_tuple(data['fundYearEnd'],FUND_YEAR_END_MONTH),
                product_type=product_type,
                fund_end_date=data['fundEndDate'],
                catch_up=float(data['catchup']),
                reporting_frequency=reporting_frequency,
                legal_counsel=data['legalCounsel'],
                legal_counsel_rep=data['legalCounselRep'],
                Auditor=data['auditor'],
                Auditor_rep=data['auditorRep'],
                Custodian=data['trustee'],
                Custodian_rep=data['trusteeRep'],
                asset_under_management=float(data['assetUnderManagement']),
                AuthorizedSignatory=AuthorizedSignatory,
                FundAdministrator=data['fundAdmin'],
                GIIN=data['GIIN'],
                Preparer=data['preparer'],
                ReclassificationFrequency=ReclassificationFrequency_obj,
                Approver=Approver,
                Subscription_Agreement=request.FILES.get('subscriptionAgreement' if not sub_fund else 's_subscriptionAgreement',None),
                Investment_Agreement=request.FILES.get('investmentAgreement' if not sub_fund else 's_investmentAgreement',None),
                PPM=request.FILES.get('PPM' if not sub_fund else 's_PPM',None),
                Director_Fees=float(data['directorFee']),
                Management_Fee=float(data['managementFee']),
                Hurdle_Rate=float(data['hurdleRate']),
                CTC=float(data['CTC']),
                Bank=Bank_obj,
                BankAccount=data['bankAccount'],
                BankAccessID=data['bankAccessId'],
                BankAccessPassword=data['bankAccessPassword'],
                redeem=data['redeem'],
                redeemReason=data['redeemReason'],
                liquidate=data['liquidate'],
                liquidateReason=data['liquidateReason']
            )
    fund_obj.save()

    #Adding Directors to fund
    if len(data['directors'])>0:
        
        for director_pk in data['directors']:
            obj=Director.objects.get(pk=director_pk)
            if 'director_{}'.format(director_pk) in request.FILES:
                obj.director_signature=request.FILES['director_{}'.format(director_pk)]
                obj.save()

            fund_obj.directors.add(obj)
        fund_obj.save()
    
    # #adding fund_manager_entity 
    # if(len(data['fundManagerEntity'])>0):
    #     for director_pk in data['fundManagerEntity']:
    #         obj=Director.objects.get(pk=director_pk)
    #         fund_obj.fund_manager_entity.add(obj)
    #     fund_obj.save()
    
    # #adding fund_manager_rep    
    # if(len(data['fundManagerRep'])>0):
    #     for director_pk in data['fundManagerRep']:
    #         obj=Director.objects.get(pk=director_pk)
    #         fund_obj.fund_manager_rep.add(obj)
    #     fund_obj.save()
    
    #adding investment committee
    if(len(data['investmentComittee'])>0):
        for director_pk in data['investmentComittee']:
            obj=Director.objects.get(pk=director_pk)
            fund_obj.investment_committee.add(obj)
        fund_obj.save()


    #open close table creation
    if data['fundStructure']=='open-ended':
        obj=FundLifeOpen(fund=fund_obj,fundlife=int(data['fundLife']),
                        #below fields not given from frontend assumed!
                        Board_Extension=int(data['boardExtension']),Investor_Extension=int(data['investorExtension']))
        obj.save()
    else:
        obj=FundLifeClose(fund=fund_obj,fundlife=int(data['fundLife']))
        obj.save()
    #end
    
    #closingPeriod object creation
    for date in data['closingPeriod']:
        obj=closingperiod(fund=fund_obj,closing_Date=date)
        obj.save()
    #end

    #subscriber creation
    if(len(data['subscribers'])!=0):
        for obj in data['subscribers']:
            obj=Subscriber(fund=fund_obj,subscriber_name=obj['name'],subscriber_commitment=float(obj['amount']))
            obj.save()
    #end

    #boardresolution creation
    if 'boardResolutions' or 's_boardResolutions' in request.FILES:
        for file in request.FILES.getlist('boardResolutions' if not sub_fund else 's_boardResolutions' ):
            obj=BoardResolution(fund=fund_obj,board_resolution=file)
            obj.save()
    
    return fund_obj


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

@api_view(["GET","POST"])
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
    

@api_view(["POST"])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def director_delete_view(request):
    id=request.POST.get('id')
    Director.objects.get(pk=int(id)).delete()
    return Response('Director Deleted Successfully')


@api_view(["POST",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def create_fund_view(request):
    '''
      fundName: ['', [Validators.required, Validators.maxLength(5)]],
      registrationNumber: ['', [Validators.required, Validators.maxLength(50)]],
      fundDescription: ['', [Validators.required, Validators.maxLength(2048)]],
      subFund: ['N', []],
      domicile: ['singapore', []],
      fundType: ['regulated', []],
      fundManagerEntity: ['', []],
      fundManagerRep: ['', [Validators.required]],
      fundStructure: ['open-end', []],
      offerPrice: [1.0, []],
      fundSize: [0.0, []],
      issuedShares: [1, []],
      ordinaryShare: [1, []],
      fundStatus: ['onboarding', []],
      reportingCurrency: ['USD', []],
      lockupPeriod: [0, []],
      fundYearEnd: ['Dec', []],
      productType: ['private-equity', []],
      fundLife: [null, [Validators.required]],
      fundEndDate: [null, []],
      catchup: [0.0, []],

      // Section 2:
      reportingFrequency: ['month', []],
      legalCounsel: ['', []],
      legalCounselRep: ['', []],
      auditor: ['', []],
      auditorRep: ['', []],
      trustee: ['', []],
      trusteeRep: ['', []],
      investmentComittee: [new FormArray([]), [Validators.required]], 
      directors: [new FormArray([]), [Validators.required]],    to discuss
      directorSignature: ['', [Validators.required]],        
      subscribers: [new FormArray([]), [Validators.required]],
      subscribersCommitment: [0.0, [Validators.required]],      

      // Section 3:
      authorizedSignatory: [[], [Validators.required]],
      signature: [null, [Validators.required]], -- add in signature endpoint
      boardResolutions: [null, [Validators.required]],
      fundAdmin: ['', [Validators.required]],
      GIIN: ['', [Validators.required]],
      preparer: ['', []],
      closingPeriod: [[], [Validators.required]],
      reclassificationFreq: ['month', []],
      approver: ['', [Validators.required]],
      subscriptionAgreement: [null, [Validators.required]],
      investmentAgreement: [null, [Validators.required]],
      PPM: [null, [Validators.required]],
      directorFee: [0.0, []],
      managementFee: [0.0, []],
      hurdleRate: [0.0, []],
      CTC: [0.0, []],
      bank: ['ocbc', []],
      bankAccount: ['', [Validators.required]],
      bankAccessId: ['', [Validators.required]],
      bankAccessPassword: ['', [Validators.required]],

      // Section 4:  -- not defined in model
      freeze: ['', []],
      freezeReason: ['', []],
      unfreeze: ['', []],
      unfreezeReason: ['', []],
      refund: [0.0, []],
      refundReason: ['', []],
      redeem: ['', []],
      redeemReason: ['', []],
      extend: ['', []],
      extendReason: ['', []],
      liquidate: ['', []],
      liquidateReason: ['', []], 

      created_at: ['', []], -- Not defined in model
      updated_at: ['', []], -- Not defined in model
    '''
    data=json.loads(request.POST['json'])
    fund_obj=create_fund_object(data,request)
    if data['subFund']!='N':
        fund_obj.sub_fund=create_fund_object(data['subFundData'],request,sub_fund=True)
        fund_obj.save()
        
    return Response(FundSerializer(fund_obj).data)

@api_view(["POST",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def manager_approval_view(request):
    status=json.loads(request.body)
    fund_id=status['fund_id']
    fund_status=get_id_of_tuple(status['fund_approval_status'],FUND_APPROVAL_STATUS)
    reason=''
    if 'reason' in status:
        reason=status['reason']
    try:
        fund_obj=Fund.objects.get(pk=fund_id)
    except:
        return Response({'id':fund_id,"status":"Fund doesn't exist with provided id"})
    
    fund_obj.manager_approval=fund_status
    fund_obj.manager_reason=reason
    fund_obj.save()
    return Response({'id':fund_id,"status":"Fund Approval Status Successfully Updated"})

@api_view(["POST",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def supervisor_approval_view(request):
    status=json.loads(request.body)
    fund_id=status['fund_id']
    fund_status=get_id_of_tuple(status['fund_approval_status'],FUND_APPROVAL_STATUS)
    reason=''
    if 'reason' in status:
        reason=status['reason']
    try:
        fund_obj=Fund.objects.get(pk=fund_id)
    except:
        return Response({'id':fund_id,"status":"Fund doesn't exist with provided id"})
    
    fund_obj.supervisor_approval=fund_status
    fund_obj.supervisor_reason=reason
    fund_obj.save()
    return Response({'id':fund_id,"status":"Fund Approval Status Successfully Updated"})


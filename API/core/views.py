from django.http.response import Http404
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from core.models import Director
from .serializers import AuthTokenSerializer, DirectorSerializer,FundSerializer
from rest_framework.settings import api_settings
from rest_framework.decorators import api_view, authentication_classes,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth import logout
import json
from .models import (BoardResolution, Fund,FundCountry,Director,FUND_TYPE,FUND_STRUCTURE,USER_DESIGNATION,
                    FUND_STATUS,FUND_YEAR_END_MONTH, FundLifeOpenDocument,ReportingCurrency,ProductType,FUND_APPROVAL_STATUS,
                    ReportingFrequency,ReclassificationFrequency,Bank,FundLifeClose,
                    FundLifeOpen,closingperiod,Subscriber)
                
from .utils import get_id_of_tuple,get_object_or_none,get_file_or_none

# Create your views here.

def create_fund_object(data,request,sub_fund=False):
    domicile_obj=get_object_or_none(FundCountry,'domicile',data['domicile'])
    report_currency=get_object_or_none(ReportingCurrency,'report_currency',data['reportingCurrency'])
    product_type=get_object_or_none(ProductType,'product_type',data['productType'])
    reporting_frequency=get_object_or_none(ReportingFrequency,'reporting_frequency',data['reportingFrequency'])
    AuthorizedSignatory=get_object_or_none(Director,'None',data['authorizedSignatory'][0])
    fundManagerRep=get_object_or_none(Director,'None',data['fundManagerRep'][0])

    if AuthorizedSignatory!=None and AuthorizedSignatory.director_signature is None:
        AuthorizedSignatory.director_signature=request.FILES.get('signature' if not sub_fund else 'S_signature',None)
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
                Subscription_Agreement=request.FILES.get('subscriptionAgreement' if not sub_fund else 'S_subscriptionAgreement',None),
                Investment_Agreement=request.FILES.get('investmentAgreement' if not sub_fund else 'S_investmentAgreement',None),
                PPM=request.FILES.get('PPM' if not sub_fund else 'S_PPM',None),
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
        if 'fundLifedocuments' or 'S_fundLifedocuments' in request.FILES:
            for file in request.FILES.getlist('fundLifedocuments' if not sub_fund else 'S_fundLifedocuments' ):
                obj1=FundLifeOpenDocument(fundlifeopen=obj,document=file)
                obj1.save()
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
            obj=Subscriber(fund=fund_obj,subscriber_name=obj['name'],subscriber_commitment=float(obj['commitment']))
            obj.save()
    #end

    #boardresolution creation
    if 'boardResolutions' or 'S_boardResolutions' in request.FILES:
        for file in request.FILES.getlist('boardResolutions' if not sub_fund else 'S_boardResolutions' ):
            obj=BoardResolution(fund=fund_obj,board_resolution=file)
            obj.save()
    
    return fund_obj


class UserLoginView(ObtainAuthToken):
    serializer_class=AuthTokenSerializer
    renderer_classes=api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                       context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.pk,
            'role': [type for id,type in USER_DESIGNATION if int(user.user_type)==id][0]
        })

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
def approval_view(request):
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
    if request.user.user_type==2:
        fund_obj.manager_approval=fund_status
        fund_obj.manager_reason=reason
        fund_obj.save()
    elif request.user.user_type==3:
        fund_obj.supervisor_approval=fund_status
        fund_obj.supervisor_reason=reason
        fund_obj.save()
    return Response({'id':fund_id,"status":"Fund Approval Status Successfully Updated"})


@api_view(["GET",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def getallfunds_view(request):
    all_funds=Fund.objects.filter(active=True).order_by('-created_at')
    return Response({'data':FundSerializer(all_funds,many=True).data})

@api_view(["POST",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def delete_fund(request):
    try:
        obj=Fund.objects.get(pk=request.POST['id'],active=True)
    except:
        obj=None
    
    if obj==None:
        raise Http404()
    obj.active=False
    obj.save()
    return Response("Fund deleted Successfully")


@api_view(["GET",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def getfundsbyrole_view(request):
    if request.user.user_type==2:
        fundsdata=Fund.objects.filter(supervisor_approval=2,manager_approval=1)
    elif request.user.user_type==3:
        fundsdata=Fund.objects.filter(supervisor_approval=1,manager_approval=1)
    return Response({'data':FundSerializer(fundsdata,many=True).data})

def update_fund_object(fund_obj,data,request,sub_fund=False):
    domicile_obj=get_object_or_none(FundCountry,'domicile',data['domicile'])
    report_currency=get_object_or_none(ReportingCurrency,'report_currency',data['reportingCurrency'])
    product_type=get_object_or_none(ProductType,'product_type',data['productType'])
    reporting_frequency=get_object_or_none(ReportingFrequency,'reporting_frequency',data['reportingFrequency'])
    AuthorizedSignatory=get_object_or_none(Director,'None',data['authorizedSignatory'][0])
    fundManagerRep=get_object_or_none(Director,'None',data['fundManagerRep'][0])

    if AuthorizedSignatory!=None and AuthorizedSignatory.director_signature is None:
        file=get_file_or_none(request,'signature','S_signature',sub_fund)
        if file!=-1:
            AuthorizedSignatory.director_signature=file
            AuthorizedSignatory.save()

    ReclassificationFrequency_obj=get_object_or_none(ReclassificationFrequency,'ReclassificationFrequency',data['reclassificationFreq'])
    Bank_obj=get_object_or_none(Bank,'Bank',data['bank'])
    Approver=get_object_or_none(Director,'None',data['approver'][0])

    fund_obj.fund_name=data['fundName']
    fund_obj.registration_no=data['registrationNumber']
    fund_obj.fund_description=data['fundDescription']
    fund_obj.domicile=domicile_obj
    fund_obj.fund_type=get_id_of_tuple(data['fundType'],FUND_TYPE)
    fund_obj.fund_manager_entity=data['fundManagerEntity']
    fund_obj.fund_manager_rep=fundManagerRep
    fund_obj.offer_price=float(data['offerPrice'])
    fund_obj.issued_shares=int(data['issuedShares'])
    fund_obj.ordinary_shares=int(data['ordinaryShare'])
    fund_obj.fund_status=get_id_of_tuple(data['fundStatus'],FUND_STATUS)
    fund_obj.reason_to_change=''    # what ??
    fund_obj.report_currency=report_currency
    fund_obj.fund_size=float(data['fundSize'])
    fund_obj.lock_up_period=int(data['lockupPeriod'])
    fund_obj.fund_year_end=get_id_of_tuple(data['fundYearEnd'],FUND_YEAR_END_MONTH)
    fund_obj.product_type=product_type
    fund_obj.fund_end_date=data['fundEndDate']
    fund_obj.catch_up=float(data['catchup'])
    fund_obj.reporting_frequency=reporting_frequency
    fund_obj.legal_counsel=data['legalCounsel']
    fund_obj.legal_counsel_rep=data['legalCounselRep']
    fund_obj.Auditor=data['auditor']
    fund_obj.Auditor_rep=data['auditorRep']
    fund_obj.Custodian=data['trustee']
    fund_obj.Custodian_rep=data['trusteeRep']
    fund_obj.asset_under_management=float(data['assetUnderManagement'])
    fund_obj.AuthorizedSignatory=AuthorizedSignatory
    fund_obj.FundAdministrator=data['fundAdmin']
    fund_obj.GIIN=data['GIIN']
    fund_obj.Preparer=data['preparer']
    fund_obj.ReclassificationFrequency=ReclassificationFrequency_obj
    fund_obj.Approver=Approver
    
    if get_file_or_none(request,'subscriptionAgreement','S_subscriptionAgreement',sub_fund)!=-1:
        fund_obj.Subscription_Agreement=get_file_or_none(request,'subscriptionAgreement','S_subscriptionAgreement',sub_fund)
    
    if get_file_or_none(request,'investmentAgreement','S_investmentAgreement',sub_fund)!=-1:
        fund_obj.Investment_Agreement=get_file_or_none(request,'investmentAgreement','S_investmentAgreement',sub_fund)
    
    if get_file_or_none(request,'PPM','S_PPM',sub_fund)!=-1:
        fund_obj.PPM=get_file_or_none(request,'PPM','S_PPM',sub_fund)
    
    fund_obj.Director_Fees=float(data['directorFee'])
    fund_obj.Management_Fee=float(data['managementFee'])
    fund_obj.Hurdle_Rate=float(data['hurdleRate'])
    fund_obj.CTC=float(data['CTC'])
    fund_obj.Bank=Bank_obj
    fund_obj.BankAccount=data['bankAccount']
    fund_obj.BankAccessID=data['bankAccessId']
    fund_obj.BankAccessPassword=data['bankAccessPassword']
    fund_obj.redeem=data['redeem']
    fund_obj.redeemReason=data['redeemReason']
    fund_obj.liquidate=data['liquidate']
    fund_obj.liquidateReason=data['liquidateReason']
    # fund_obj.save()

    #Adding Directors to fund
    fund_obj.directors.clear()
    if len(data['directors'])>0:

        
        for director_pk in data['directors']:
            obj=Director.objects.get(pk=director_pk)
            file=get_file_or_none(request,'director_{}'.format(director_pk),'director_{}'.format(director_pk),sub_fund)
            if file!=-1:
                obj.director_signature=file
                obj.save()

            fund_obj.directors.add(obj)
        # fund_obj.save()
    
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
    fund_obj.investment_committee.clear()
    if(len(data['investmentComittee'])>0):
        for director_pk in data['investmentComittee']:
            obj=Director.objects.get(pk=director_pk)
            fund_obj.investment_committee.add(obj)
        


    #open close table creation
    if fund_obj.get_fund_structure_display()!=data['fundStructure']:
        fund_obj.fund_structure=get_id_of_tuple(data['fundStructure'],FUND_STRUCTURE)    
        if data['fundStructure']=='open-ended':
            FundLifeClose.objects.get(fund=fund_obj.pk).delete()
            obj=FundLifeOpen(fund=fund_obj,fundlife=int(data['fundLife']),
                            #below fields not given from frontend assumed!
                            Board_Extension=int(data['boardExtension']),Investor_Extension=int(data['investorExtension']))
            obj.save()
             #ADDED WORK FOR FUND LIFE OPEN DOCUMENT BELOW
            if 'fundLifedocuments' or 'S_fundLifedocuments' in request.FILES:
                for file in request.FILES.getlist('fundLifedocuments' if not sub_fund else 'S_fundLifedocuments' ):
                    f_obj=FundLifeOpenDocument(fundlifeopen=obj,document=file)
                    f_obj.save() 
        else:
            FundLifeOpen.objects.get(fund=fund_obj.pk).delete()
            obj=FundLifeClose(fund=fund_obj,fundlife=int(data['fundLife']))
            obj.save()
    else:
        
        if fund_obj.get_fund_structure_display()=='open-ended':
            obj=FundLifeOpen.objects.get(fund=fund_obj.pk)
            obj.fundlife=int(data['fundLife'])
            obj.Board_Extension=int(data['boardExtension'])
            obj.Investor_Extension=int(data['investorExtension'])
            obj.save()
            #ADDED WORK FOR FUND LIFE OPEN DOCUMENT BELOW 
            file=get_file_or_none(request,'fundLifedocuments','S_fundLifedocuments',sub_fund)
            obj.fundlifeopendocument.all().delete()
            if file!=-1:
                if file!=None:
                    f_obj=FundLifeOpenDocument(fundlifeopen=obj,document=file)
                    f_obj.save()
        else:
            obj=FundLifeClose.objects.get(fund=fund_obj.pk)
            obj.fundlife=int(data['fundLife'])
            obj.save()
    #end
    
    #closingPeriod object creation
    fund_obj.closingDates.all().delete()
    for date in data['closingPeriod']:
        obj=closingperiod(fund=fund_obj,closing_Date=date)
        obj.save()
    #end

    #subscriber creation
    fund_obj.subscribers.all().delete()
    if(len(data['subscribers'])!=0):
        for obj in data['subscribers']:
            obj=Subscriber(fund=fund_obj,subscriber_name=obj['name'],subscriber_commitment=float(obj['commitment']))
            obj.save()
    #end

    #boardresolution creation
    file=get_file_or_none(request,'boardResolutions','S_boardResolutions',sub_fund)
    
    if file!=-1:
        fund_obj.boardResolution.all().delete()
        if file!=None:
            obj=BoardResolution(fund=fund_obj,board_resolution=file)
            obj.save()
    
    fund_obj.save()
    return fund_obj


@api_view(["POST",])
@permission_classes([IsAuthenticated])
@authentication_classes([TokenAuthentication,])
def update_fund(request):
    fund_id=request.POST['fund_id']
    data=json.loads(request.POST['json'])
    
    try:
        fund_obj=Fund.objects.get(pk=fund_id)
    except:
        return Response("Fund Object not Found")
    
    fund_obj=update_fund_object(fund_obj,data,request)
    
    
    if data['subFund']!='N':
        if fund_obj.sub_fund!=None:
            try:
                sub_fund_obj=Fund.objects.get(pk=fund_obj.sub_fund.pk)
            except:
                return Response("Sub Fund Object not Found")
            
            sub_fund_obj=update_fund_object(sub_fund_obj,data['subFundData'],request,sub_fund=True)
        else:
            fund_obj.sub_fund=create_fund_object(data['subFundData'],request,sub_fund=True)
            fund_obj.save()
    elif fund_obj.sub_fund!=None:
        obj=Fund.objects.get(pk=fund_obj.sub_fund.pk)
        obj.delete()
    

    fund_obj=Fund.objects.get(pk=fund_id)
    return Response(FundSerializer(fund_obj).data)

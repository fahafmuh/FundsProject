from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.translation import ugettext_lazy as _
# Create your models here.

USER_DESIGNATION=(
    (1,'Admin'),
    (2,'Funds Manager'),
    (3,'Supervisor'),
    (4,'None')
)

FUND_TYPE=(
    (0,'regulated'),
    (1,'unregulated')
)

FUND_STRUCTURE=(
    (0,'open-ended'),
    (1,'close-ended')
)

FUND_STATUS=(
    (0,'onboarding'),
    (1,'open'),
    (2,'funded'),
    (3,'refund'),
    (4,'freeze'),
    (5,'unfreeze'),
    (6,'close'),
    (7,'extendterm')
)

FUND_YEAR_END_MONTH=(
    (0,'Jan'),
    (1,'Feb'),
    (2,'Mar'),
    (3,'Apr'),
    (4,'May'),
    (5,'Jun'),
    (6,'Jul'),
    (7,'Aug'),
    (8,'Sep'),
    (9,'Oct'),
    (10,'Nov'),
    (11,'Dec'),
)

FUND_APPROVAL_STATUS=(
    (1,'Pending'),
    (2,'Approved'),
    (3,'Rejected')
)

class User(AbstractUser):
    user_type=models.IntegerField(choices=USER_DESIGNATION,default=4,verbose_name=_("User Designation"),
              help_text="This field determines the designation of the user")

class FundCountry(models.Model):
    country_name=models.CharField(max_length=256,blank=False,null=False)

    def __str__(self):
        return self.country_name

class Director(models.Model):
    director_name=models.CharField(max_length=256)
    director_signature=models.FileField(upload_to='DirectorSignature/',null=True,blank=True)

    def __str__(self):
        return self.director_name

class ReportingCurrency(models.Model):
    currency=models.CharField(max_length=256,unique=True,null=False)

    def __str__(self):
        return self.currency


class ProductType(models.Model):
    product_type_name=models.CharField(max_length=256)

    def __str__(self):
        return self.product_type_name


class ReportingFrequency(models.Model):
    reporting_frequency_name=models.CharField(max_length=256)

    def __str__(self):
        return self.reporting_frequency_name



class ReclassificationFrequency(models.Model):
    reclassification_frequency_name=models.CharField(max_length=256)

    def __str__(self):
        return self.reclassification_frequency_name

class Bank(models.Model):
    Bank_name=models.CharField(max_length=256)

    def __str__(self):
        return self.Bank_name


class Fund(models.Model):
    user=models.ForeignKey(User,on_delete=models.CASCADE,null=True)
    fund_name=models.CharField(max_length=256,blank=False,null=False)
    registration_no=models.CharField(max_length=50,blank=False,null=False)
    fund_description=models.TextField(blank=False,null=False)
    supervisor_approval=models.IntegerField(choices=FUND_APPROVAL_STATUS,default=1)
    supervisor_reason=models.TextField(blank=True)
    manager_approval=models.IntegerField(choices=FUND_APPROVAL_STATUS,default=1)
    manager_reason=models.TextField(blank=True)
    sub_fund=models.ForeignKey('self',null=True,on_delete=models.SET_NULL,related_name='subfund',blank=True)
    domicile=models.ForeignKey(FundCountry,null=True,on_delete=models.SET_NULL)
    fund_type=models.IntegerField(choices=FUND_TYPE,default=0)
    fund_manager_entity=models.CharField(max_length=256,blank=True)
    fund_manager_rep=models.ForeignKey(Director,related_name='fund_manager_representator',null=True,on_delete=models.SET_NULL)
    fund_structure=models.IntegerField(choices=FUND_STRUCTURE,default=0)
    offer_price=models.DecimalField(max_digits=6,decimal_places=2,default=1.00)
    issued_shares=models.IntegerField(default=1)
    ordinary_shares=models.IntegerField(default=1)
    fund_status=models.IntegerField(choices=FUND_STATUS,default=0)
    reason_to_change=models.TextField(blank=True)
    report_currency=models.ForeignKey(ReportingCurrency,null=True,on_delete=models.SET_NULL)
    fund_size=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    lock_up_period=models.IntegerField(default=0,help_text=_('Time in years'))
    fund_year_end=models.IntegerField(choices=FUND_YEAR_END_MONTH,default=11)
    product_type=models.ForeignKey(ProductType,on_delete=models.SET_NULL,null=True)
    # fund_life='done'
    fund_end_date=models.DateField()
    catch_up=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    reporting_frequency=models.ForeignKey(ReportingFrequency,on_delete=models.SET_NULL,null=True,blank=True)
    
    legal_counsel=models.CharField(max_length=256,blank=True)
    legal_counsel_rep=models.CharField(max_length=256,blank=True)
    Auditor=models.CharField(max_length=256,blank=True)
    Auditor_rep=models.CharField(max_length=256,blank=True)
    Custodian=models.CharField(max_length=256,blank=True)
    Custodian_rep=models.CharField(max_length=256,blank=True)
    investment_committee=models.ManyToManyField(Director,related_name='investment_committ')
    asset_under_management=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    directors=models.ManyToManyField(Director,related_name='directors_all')
    AuthorizedSignatory=models.ForeignKey(Director,null=True,on_delete=models.SET_NULL,related_name='authorized_sign')

    FundAdministrator=models.CharField(max_length=256,blank=False,null=False)
    GIIN=models.CharField(max_length=50,blank=False,null=False)
    Preparer=models.CharField(max_length=256,blank=True,null=True)
    ReclassificationFrequency=models.ForeignKey(ReclassificationFrequency,null=True,on_delete=models.SET_NULL)
    Approver=models.ForeignKey(Director,null=True,on_delete=models.SET_NULL,related_name='approve')
    Subscription_Agreement=models.FileField(upload_to='subscription_agreement/',null=False,blank=False)
    Investment_Agreement=models.FileField(upload_to='investment_agreement/',null=False,blank=False)
    PPM=models.FileField(upload_to='ppm/',null=False,blank=False)
    Director_Fees=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    Management_Fee=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    Hurdle_Rate=models.DecimalField(max_digits=6,decimal_places=4,default=0.0000)
    CTC=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)
    Bank=models.ForeignKey(Bank,on_delete=models.SET_NULL,null=True)
    BankAccount=models.PositiveIntegerField(null=False,blank=False)
    BankAccessID=models.CharField(max_length=50,blank=False,null=False)
    BankAccessPassword=models.CharField(max_length=50,null=False,blank=False)
    redeem=models.CharField(max_length=256,blank=True)
    redeemReason=models.TextField(blank=True)
    liquidate=models.CharField(max_length=256,blank=True)
    liquidateReason=models.TextField(blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    active=models.BooleanField(default=True)

    
class FundLifeClose(models.Model):
    fund=models.OneToOneField(Fund,on_delete=models.CASCADE,related_name='fundlifeclose')
    fundlife=models.PositiveIntegerField()

class FundLifeOpen(models.Model):
    fund=models.OneToOneField(Fund,on_delete=models.CASCADE,related_name='fundlifeopen')
    fundlife=models.PositiveIntegerField()
    Board_Extension=models.PositiveIntegerField()
    Investor_Extension=models.PositiveIntegerField()
    # Documents='done'

class FundLifeOpenDocument(models.Model):
    fundlifeopen=models.ForeignKey(FundLifeOpen,on_delete=models.CASCADE,related_name='fundlifeopendoc')
    # document_name=models.CharField(max_length=256)
    # upload_date=models.DateField(auto_now_add=True)
    # description=models.TextField(blank=True)
    document=models.FileField(upload_to='fundlife_opendocument/',null=True,blank=True)

class closingperiod(models.Model):
    fund=models.ForeignKey(Fund,on_delete=models.CASCADE,related_name="closingDates")
    closing_Date=models.DateField(blank=False,null=False)

class Subscriber(models.Model):
    fund=models.ForeignKey(Fund,on_delete=models.CASCADE,related_name="subscribers")
    subscriber_name=models.CharField(max_length=256)
    subscriber_commitment=models.DecimalField(max_digits=6,decimal_places=2,default=0.00)

class BoardResolution(models.Model):
    fund=models.ForeignKey(Fund,on_delete=models.CASCADE,related_name="boardResolution")
    board_resolution=models.FileField(upload_to='board_resolution/',null=True,blank=True)
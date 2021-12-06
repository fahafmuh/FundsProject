from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.base import Model
from django.utils.translation import ugettext_lazy as _
# Create your models here.

USER_DESIGNATION=(
    (1,'Admin'),
    (2,'Funds Manager'),
    (3,'Supervisor'),
    (4,'None')
)

FUND_TYPE=(
    (0,'Regulated'),
    (1,'Unregulated')
)

FUND_STRUCTURE=(
    (0,'Open-End'),
    (1,'Closed-End')
)

FUND_STATUS=(
    (0,'Onboarding'),
    (1,'Open'),
    (2,'Funded'),
    (3,'Re-fund'),
    (4,'Frozen'),
    (5,'Unfrozen'),
    (6,'Close'),
    (7,'Extend Term')
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

class User(AbstractUser):
    user_type=models.IntegerField(choices=USER_DESIGNATION,default=4,verbose_name=_("User Designation"),
              help_text="This field determines the designation of the user")


class FundCountry(models.Model):
    country_name=models.CharField(max_length=256,blank=False,null=False)

class Director(models.Model):
    director_name=models.CharField(max_length=256)
    director_signature=models.FileField(upload_to='DirectorSignature/',null=True,blank=True)

    def __str__(self):
        return self.director_name

# class Subscriber(models.Model):
#     subscriber_name=models.CharField(max_length=256)
#     subscriber_commitment=models.DecimalField(decimal_places=2,default=0.00)


class ReportingCurrency(models.Model):
    currency=models.CharField(max_length=256,unique=True,null=False)

class ProductType(models.Model):
    product_type_name=models.CharField(max_length=256)

class ReportingFrequency(models.Model):
    reporting_frequency_name=models.CharField(max_length=256)

class ReclassificationFrequency(models.Model):
    reclassification_frequency_name=models.CharField(max_length=256)

class Bank(models.Model):
    Bank_name=models.CharField(max_length=256)




# class Fund(models.Model):
#     '''
#     things to do
#     1) Director

#     '''
#     fund_name=models.CharField(max_length=256,blank=False,null=False)
#     registration_no=models.CharField(max_length=50,blank=False,null=False)
#     fund_description=models.TextField(blank=False,null=False)
#     sub_fund=models.ForeignKey('self',null=True,on_delete=models.SET_NULL)
#     domicile=models.ForeignKey(FundCountry,null=False)
#     fund_type=models.IntegerField(choices=FUND_TYPE,default=0)
#     fund_manager_entity=models.CharField(max_length=256,null=True,blank=True)
#     fund_manager_rep=models.ForeignKey(Director,null=True,on_delete=models.SET_NULL)
#     fund_structure=models.IntegerField(choices=FUND_STRUCTURE,default=0)
#     offer_price=models.DecimalField(decimal_places=2,default=1.00)
#     issued_shares=models.IntegerField(default=1)
#     ordinary_shares=models.IntegerField(default=1)
#     fund_status=models.IntegerField(choices=FUND_STATUS,default=0)
#     report_currency=models.ForeignKey(ReportingCurrency,null=False,on_delete=models.SET_NULL)
#     fund_size=models.DecimalField(decimal_places=2,default=0.00)
#     lock_up_period=models.IntegerField(default=0,help_text=_('Time in years'))
#     fund_year_end=models.IntegerField(choices=FUND_YEAR_END_MONTH,default=11)
#     product_type=models.ForeignKey(ProductType,on_delete=models.SET_NULL)
#     # fund_life='done'
#     fund_end_date=models.DateField()
#     catch_up=models.DecimalField(decimal_places=2,default=0.00)
#     reporting_frequency=models.ForeignKey(ReportingFrequency,on_delete=models.SET_NULL)
    
#     legal_counsel=models.CharField(max_length=256,blank=True)
#     legal_counsel_rep=models.CharField(max_length=256,blank=True)
#     Auditor=models.CharField(max_length=256,blank=True)
#     Auditor_rep=models.CharField(max_length=256,blank=True)
#     Custodian=models.CharField(max_length=256,blank=True)
#     Custodian_rep=models.CharField(max_length=256,blank=True)
#     investment_committee=models.ForeignKey(Director,null=False,on_delete=models.SET_NULL)

#     asset_under_management=models.DecimalField(decimal_places=2,default=0.00)
#     directors=models.ManyToManyField(Director)
#     subscribers=models.ManyToManyField(Subscriber)
#     AuthorizedSignatory=models.ForeignKey(Director,null=False,on_delete=models.SET_NULL)
#     BoardResolutions=models.FileField(upload_to='',null=True,blank=True)
#     FundAdministrator=models.CharField(max_length=256,blank=False,null=False)
#     GIIN=models.CharField(max_length=50,blank=False,null=False)
#     Preparer=models.CharField(max_length=256,blank=True,null=True)
#     # ClosingPeriod=Done
#     ReclassificationFrequency=models.ForeignKey(ReclassificationFrequency,on_delete=models.SET_NULL)
#     Approver=models.ForeignKey(Director,null=False,on_delete=models.SET_NULL)
#     Subscription_Agreement=models.FileField(upload_to='',null=False,blank=False)
#     Investment_Agreement=models.FileField(upload_to='',null=False,blank=False)
#     PPM=models.FileField(upload_to='',null=False,blank=False)
#     Director_Fees=models.DecimalField(decimal_places=2,default=0.00)
#     Management_Fee=models.DecimalField(decimal_places=2,default=0.00)
#     Hurdle_Rate=models.DecimalField(decimal_places=4,default=0.0000)
#     CTC=models.DecimalField(decimal_places=2,default=0.00)
#     Bank=models.ForeignKey(Bank)
#     BankAccount=models.PositiveIntegerField(max_length=50,null=False,blank=False)
#     BankAccessID=models.CharField(max_length=50,blank=False,null=False)
#     BankAccessPassword=models.CharField(max_length=50,null=False,blank=False)

    
# class FundLife_Close(models.Model):
#     fund=models.OneToOneField(Fund,on_delete=models.CASCADE)
#     fundlife=models.PositiveIntegerField()

# class FundLife_Open(models.Model):
#     fund=models.OneToOneField(Fund,on_delete=models.CASCADE)
#     fundlife=models.PositiveIntegerField()
#     Board_Extension=models.PositiveIntegerField()
#     Investor_Extension=models.PositiveIntegerField()
#     # Documents=''

    
# class closingperiod(models.Model):
#     fund=models.ForeignKey(Fund,on_delete=models.CASCADE)
#     closing_Date=models.DateField(blank=False,null=False)









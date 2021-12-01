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


class User(AbstractUser):
    user_type=models.IntegerField(choices=USER_DESIGNATION,default=4,verbose_name=_("User Designation"),
              help_text="This field determines the designation of the user")
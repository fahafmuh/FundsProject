from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

# Register your models here.

class UserAdmin(BaseUserAdmin):
    ordering=['id']
    list_display =['id','username','user_type','is_superuser']
    readonly_fields = ['date_joined',]
    search_fields = ('username', 'user_type')
    fieldsets=(
        (
            None,
            {'fields':('username','password','user_type')}
        ),
        (
            _('Personal Info'),
            {'fields':('email','first_name','last_name')}
        ),
        (
            _('Permissions'),
            {'fields':('is_active','is_staff','is_superuser','groups','user_permissions')}
        ),
        (
            _('Important dates'),
            {'fields':('last_login','date_joined')}
        )
    )




admin.site.register(User,UserAdmin)
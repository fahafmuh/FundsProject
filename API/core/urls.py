from django.urls import path
from . import views

app_name='user_app'

urlpatterns = [
    path('login/',views.UserLoginView.as_view(),name="user_login"),
    path('check/',views.example_view,name="check"),
    path('logout/',views.Logout),
    path('Directors/',views.Director_API),
    path('create-fund/',views.create_fund_view),
    path('fund-approval/',views.approval_view),
    path('director-delete/',views.director_delete_view),
    path('getallfunds/',views.getallfunds_view),
    path('getfundsbyrole/',views.getfundsbyrole_view),
    path('delete-fund/',views.delete_fund),
    path('edit-fund/',views.update_fund)
]

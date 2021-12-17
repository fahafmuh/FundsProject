from django.urls import path
from . import views

app_name='user_app'

urlpatterns = [
    path('login/',views.UserLoginView.as_view(),name="user_login"),
    path('check/',views.example_view,name="check"),
    path('logout/',views.Logout),
    path('Directors/',views.Director_API),
    path('create-fund/',views.create_fund_view),
    path('update-manager-approval/',views.manager_approval_view),
    path('update-supervisor-approval/',views.supervisor_approval_view),
    path('director-delete/',views.director_delete_view)
]

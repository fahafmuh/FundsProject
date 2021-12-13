from django.urls import path
from . import views

app_name='user_app'

urlpatterns = [
    path('login/',views.UserLoginView.as_view(),name="user_login"),
    path('check/',views.example_view,name="check"),
    path('logout/',views.Logout),
    path('Directors/',views.Director_API),
    path('create-fund/',views.create_fund_view)
]

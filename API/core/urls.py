from django.urls import path
from .views import Logout, UserLoginView,example_view
from . import views

app_name='user_app'

urlpatterns = [
    path('login/',UserLoginView.as_view(),name="user_login"),
    path('check/',example_view,name="check"),
    path('logout/',Logout),
    path('Directors/',views.Director_API),
]

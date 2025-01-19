from django.urls import path
from users import views

urlpatterns = [
    path("login/", views.LoginApi.as_view(), name="login"),
    path("register/", views.RegisterApi.as_view(), name="register"),
    path("verify/", views.VerifyEmailApi.as_view(), name="verify-email"),
    path("verify/resend/", views.VerifyResendEmailApi.as_view(), name="verify-resend-email"),
]

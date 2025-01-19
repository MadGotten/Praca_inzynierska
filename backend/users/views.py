from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from rest_framework.permissions import AllowAny
from .serializers import (
    LoginSerializer,
    RegisterSerializer,
    VerifyEmailSerializer,
    EmailResendSerializer,
)
from django.contrib.auth import authenticate
from .jwt import get_tokens_for_user
from .models import User, Code


class LoginApi(APIView):
    serializer_class = LoginSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(request, **serializer.validated_data)

            if user:
                if not user.is_active:
                    user.send_activation_code()
                    return Response(
                        {
                            "non_field_error": "Konto jest nieaktywne. Sprawdź swój adres email.",
                            "email": user.email,
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

                tokens = get_tokens_for_user(user)
                return Response(status=status.HTTP_200_OK, data=tokens)
            else:
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED,
                    data={"non_field_error": "Użytkownik nie został znaleziony."},
                )
        return Response(status=status.HTTP_400_BAD_REQUEST, data=serializer.errors)


class RegisterApi(APIView):
    serializer_class = RegisterSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save(is_active=False)
        user.send_activation_code()
        return Response(
            status=status.HTTP_201_CREATED,
            data={"detail": "Wysłano email z linkiem aktywacyjnym."},
        )


class VerifyEmailApi(APIView):
    serializer_class = VerifyEmailSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            code = Code.objects.get(
                email=serializer.validated_data["email"],
                code=serializer.validated_data["code"],
            )

            if code.is_code_valid():
                user = User.objects.get(email=code.email)

                if not user.is_active:
                    user.activate_account()
                    code.delete()
                    return Response(
                        {"detail": "Konto zostało zweryfikowane pomyślnie."},
                        status=status.HTTP_200_OK,
                    )
                return Response(
                    {"detail": "Konto już zostało zweryfikowane."},
                    status=status.HTTP_200_OK,
                )
            else:
                return ParseError(
                    detail="Nieprawidłowy albo wygaśnięty kod weryfikacyjny."
                )
        except (Code.DoesNotExist, User.DoesNotExist):
            raise ParseError(detail="Nieprawidłowy albo wygaśnięty kod weryfikacyjny.")


class VerifyResendEmailApi(APIView):
    serializer_class = EmailResendSerializer
    authentication_classes = []
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data["email"])
            if not user.is_active:
                user.send_activation_code()
                return Response(
                    {"detail": "Wysłano email z linkiem aktywacyjnym."},
                    status=status.HTTP_200_OK,
                )
            return Response(
                {"detail": "Konto już zostało zweryfikowane."},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            return Response(
                {"detail": "Wysłano email z linkiem aktywacyjnym."},
                status=status.HTTP_200_OK,
            )

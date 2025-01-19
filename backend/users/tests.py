from django.urls import reverse
from rest_framework.test import APITestCase, override_settings
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from users.jwt import CustomTokenObtainPairSerializer, get_tokens_for_user
from users.models import User, Code
from unittest.mock import patch


@override_settings(PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"])
class AuthApiTests(APITestCase):
    def setUp(self):
        self.login_url = reverse("login")
        self.register_url = reverse("register")

        self.user_data = {
            "username": "Testuser",
            "password": "Testpassword123",
        }

        self.user = User.objects.create_user(**self.user_data)

    def test_register_user(self):
        register_data = {
            "username": "Newuser",
            "password": "Newpassword123",
            "email": "testmail@testmail.pl",
        }

        with patch("users.models.send_activation_email") as mock_send_activation_email:
            response = self.client.post(self.register_url, data=register_data)
            user = User.objects.filter(username=register_data["username"]).first()
            self.assertEqual(response.status_code, status.HTTP_201_CREATED)
            self.assertTrue(Code.objects.filter(email=register_data["email"]).exists())
            self.assertTrue(user)
            self.assertFalse(user.is_active)
            mock_send_activation_email.assert_called_once()

    def test_register_user_password_too_short(self):
        register_data = {
            "username": "Newuser",
            "password": "Short",
        }
        response = self.client.post(self.register_url, data=register_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", response.data)
        self.assertFalse(
            User.objects.filter(username=register_data["username"]).exists()
        )

    def test_login_user(self):
        response = self.client.post(self.login_url, data=self.user_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_invalid_credentials(self):
        invalid_data = {
            "username": "Wronguser",
            "password": "Wrongpassword123",
        }
        response = self.client.post(self.login_url, data=invalid_data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("non_field_error", response.data)

    def test_register_invalid_data(self):
        invalid_data = {
            "username": "",
            "password": "",
        }
        response = self.client.post(self.register_url, data=invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)
        self.assertIn("password", response.data)

    def test_register_taken_username(self):
        invalid_data = {
            "username": "Testuser",
            "password": "Newpassword123",
        }
        response = self.client.post(self.register_url, data=invalid_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("username", response.data)

    def test_custom_token_obtain_pair_serializer(self):
        token = CustomTokenObtainPairSerializer.get_token(self.user)

        self.assertIn("username", token)
        self.assertIn("email", token)
        self.assertEqual(token["username"], self.user.username)
        self.assertEqual(token["email"], self.user.email)

    def test_get_tokens_for_user(self):
        tokens = get_tokens_for_user(self.user)
        refresh_token = RefreshToken(tokens["refresh"])

        self.assertIn("username", refresh_token)
        self.assertIn("email", refresh_token)
        self.assertEqual(refresh_token["username"], self.user.username)
        self.assertEqual(refresh_token["email"], self.user.email)

        access_token = refresh_token.access_token
        self.assertIn("username", access_token)
        self.assertIn("email", access_token)
        self.assertEqual(access_token["username"], self.user.username)
        self.assertEqual(access_token["email"], self.user.email)

from rest_framework.test import APITestCase, override_settings
from rest_framework import status
from family.models import Family
from members.models import FamilyMember
from users.jwt import get_tokens_for_user
from users.models import User


@override_settings(PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"])
class FamilyApiTests(APITestCase):
    def setUp(self):
        self.family_api = "/api/v1/family/"
        self.user = User.objects.create_user(username="Testuser", password="Testpassword123")
        self.family = Family.objects.create(name="Test Family", owner=self.user)
        self.access_token = get_tokens_for_user(self.user)["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_list_families(self):
        response = self.client.get(self.family_api)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "Test Family")

    def test_create_family(self):
        response = self.client.post(self.family_api, {"name": "New Family"})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Family.objects.count(), 2)
        self.assertTrue(
            FamilyMember.objects.filter(
                family=response.data["id"], user=self.user, role=FamilyMember.Role.OWNER
            ).exists()
        )

    def test_retrieve_family(self):
        response = self.client.get(f"{self.family_api}{self.family.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Family")

    def test_update_family(self):
        response = self.client.put(
            f"{self.family_api}{self.family.id}/", {"name": "Updated Family"}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.family.refresh_from_db()
        self.assertEqual(self.family.name, "Updated Family")

    def test_delete_family(self):
        response = self.client.delete(f"{self.family_api}{self.family.id}/")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Family.objects.filter(id=self.family.id).exists())

    def test_get_family_role_owner(self):
        response = self.client.get(f"{self.family_api}{self.family.id}/role/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], FamilyMember.Role.OWNER)

    def test_get_family_role_admin(self):
        self.family.familymember_set.update(user=self.user, role=FamilyMember.Role.ADMIN)
        response = self.client.get(f"{self.family_api}{self.family.id}/role/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], FamilyMember.Role.ADMIN)

    def test_get_family_role_member(self):
        self.family.familymember_set.update(user=self.user, role=FamilyMember.Role.MEMBER)
        response = self.client.get(f"{self.family_api}{self.family.id}/role/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["role"], FamilyMember.Role.MEMBER)

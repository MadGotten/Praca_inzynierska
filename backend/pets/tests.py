from rest_framework.test import APITestCase, override_settings
from rest_framework import status
from pets.models import Pet
from family.models import Family
from users.jwt import get_tokens_for_user
from users.models import User
import datetime
from django.urls import reverse


@override_settings(PASSWORD_HASHERS=["django.contrib.auth.hashers.MD5PasswordHasher"])
class FamilyApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="Testuser", password="Testpassword123"
        )
        self.family = Family.objects.create(name="Test Family", owner=self.user)
        self.pet = Pet.objects.create(
            name="Test Pet",
            species="Dog",
            breed="Spaniel",
            date_of_birth=datetime.date.today(),
            family=self.family,
        )
        self.access_token = get_tokens_for_user(self.user)["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.access_token}")

    def test_list_pets(self):
        response = self.client.get(
            reverse("pet-list-create", kwargs={"family_id": self.family.id})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["name"], "Test Pet")

    def test_create_pet(self):
        new_pet = {
            "name": "New Pet",
            "species": "Cat",
            "breed": "Siamese",
            "weight": 10,
            "date_of_birth": datetime.date.today(),
        }
        response = self.client.post(reverse("pet-list-create", kwargs={"family_id": self.family.id}), data=new_pet, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Pet.objects.count(), 2)
        self.assertTrue(
            Pet.objects.filter(id=response.data["id"], family=self.family.id).exists()
        )

    def test_retrieve_pet(self):
        response = self.client.get(reverse("pet-detail", kwargs={"pet_id": self.pet.id}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "Test Pet")

    def test_delete_pet(self):
        response = self.client.delete(reverse("pet-detail", kwargs={"pet_id": self.pet.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Pet.objects.filter(id=self.pet.id).exists())
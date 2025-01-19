from django.db import models
import random
from django.utils.timezone import now, timedelta
from .utils import send_activation_email
from django.contrib.auth.models import AbstractUser, UserManager


class User(AbstractUser):
    objects = UserManager()

    def send_activation_code(self):
        Code.objects.filter(email=self.email).delete()
        code = Code.objects.create(email=self.email)
        send_activation_email(self.email, code)

    def activate_account(self):
        self.is_active = True
        self.save()


class Code(models.Model):
    email = models.EmailField(unique=True)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_code_valid(self):
        expiry_time = self.created_at + timedelta(minutes=15)
        return now() < expiry_time

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = f"{random.randint(100000, 999999)}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} Code: {self.code}"

from django.db import models, transaction, DatabaseError
from django.conf import settings
from rest_framework.exceptions import ParseError
from members.models import FamilyMember


class FamilyManager(models.Manager):
    def create(self, **obj_data):
        try:
            with transaction.atomic():
                family = super().create(**obj_data)

                FamilyMember.objects.create(
                    family=family, user=family.owner, role=FamilyMember.Role.OWNER
                )

                return family
        except DatabaseError:
            raise ParseError("Wystąpił błąd podczas tworzenia rodziny")


class Family(models.Model):
    name = models.CharField(max_length=100)
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="owned_families",
        on_delete=models.CASCADE,
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL, through=FamilyMember, related_name="family"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = FamilyManager()

    class Meta:
        indexes = [
            models.Index(fields=["created_at"]),
        ]
        verbose_name = "Family"
        verbose_name_plural = "Families"

    def __str__(self):
        return "Rodzina: %s - Właściciel: %s" % (self.name, self.owner.username)

    def is_member(self, user):
        return self.members.filter(id=user).exists()

    def add_member(self, user):
        if self.is_member(user):
            raise ParseError("Użytkownik już należy do tej rodziny.")

        member = self.familymember_set.create(
            user_id=user, role=FamilyMember.Role.MEMBER
        )
        return member

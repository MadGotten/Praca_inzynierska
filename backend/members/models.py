from django.db import models
from django.conf import settings
from django.db.models.constraints import UniqueConstraint


class FamilyMember(models.Model):
    class Role(models.IntegerChoices):
        OWNER = 1, "Właściciel"
        ADMIN = 2, "Administrator"
        MEMBER = 3, "Członek rodziny"

    family = models.ForeignKey("family.Family", on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    role = models.SmallIntegerField(choices=Role.choices, default=Role.MEMBER)
    joined_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "family"]),
        ]
        constraints = [
            UniqueConstraint(name="unique_family_user", fields=["family", "user"])
        ]

    def __str__(self):
        return "Członek: %s - Rodzina: %s Rola: %s" % (
            self.user.username,
            self.family.name,
            self.get_role_display(),
        )

    def has_permission(self, action, user):
        if action == "view":
            return True
        elif action == "edit":
            return self.role <= self.Role.ADMIN
        elif action == "delete":
            return self.role == self.Role.OWNER

from django.db import models
from django.conf import settings


class FamilyInvitationQuerySet(models.QuerySet):
    def get_user_pending_invites(self, user_id):
        return self.filter(invited_id=user_id, status="pending")


class FamilyInvitation(models.Model):
    family = models.ForeignKey("family.Family", related_name="invites", on_delete=models.CASCADE)
    invited = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="invited", on_delete=models.CASCADE)
    status = models.CharField(
        max_length=10,
        choices=[("pending", "Oczekuje"), ("accepted", "Zaakceptowany"), ("declined", "Odrzucony")],
        default="pending",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    objects = FamilyInvitationQuerySet.as_manager()

    class Meta:
        unique_together = ["family", "invited"]

    def accept(self):
        """
        Accept the invitation by adding user to family members and delete the invitation.
        """
        self.family.add_member(self.invited_id)
        self.status = "accepted"
        self.save()

    def decline(self):
        """
        Decline the invitation by simply deleting it.
        """
        self.status = "declined"
        self.save()

    def __str__(self):
        return f"Zaproszenie do rodziny {self.family.name} do {self.invited.username}"

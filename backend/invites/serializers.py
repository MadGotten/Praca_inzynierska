from rest_framework import serializers
from invites.models import FamilyInvitation
from users.models import User
from rest_framework.exceptions import ParseError, NotFound


class StatusSerializer(serializers.Serializer):
    name = serializers.CharField(source="status")
    label = serializers.CharField(source="get_status_display", read_only=True)


class MeInviteSerializer(serializers.ModelSerializer):
    family = serializers.ReadOnlyField(source="family.name")
    status = StatusSerializer(source="*")

    class Meta:
        model = FamilyInvitation
        fields = ["id", "family", "status", "created_at"]
        read_only_fields = ["status", "created_at"]


class InviteSimpleSerializer(serializers.ModelSerializer):
    user = serializers.CharField(write_only=True)
    invited = serializers.ReadOnlyField(source="invited.username")
    status = StatusSerializer(source="*", read_only=True)

    class Meta:
        model = FamilyInvitation
        fields = ["id", "status", "created_at", "invited", "user"]
        read_only_fields = ["status", "created_at"]

    def validate_user(self, value):
        try:
            user = User.objects.get(username=value)
        except User.DoesNotExist:
            raise NotFound(detail="Użytkownik o takiej nazwie nie istnieje")

        if user.id == self.context["request"].user.id:
            raise ParseError(detail="Nie możesz zaprosić samego siebie")

        return user


class InviteSerializer(serializers.ModelSerializer):
    invited = serializers.ReadOnlyField(source="invited.username")
    status = StatusSerializer(source="*")

    class Meta:
        model = FamilyInvitation
        fields = ["id", "status", "created_at", "invited", "family"]
        read_only_fields = ["status", "created_at"]

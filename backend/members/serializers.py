from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from .models import FamilyMember


class FamilyMemberSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = FamilyMember
        fields = ["id", "role", "user"]
        extra_kwargs = {
            "role": {"required": True},
        }

    def validate_role(self, value):
        if value == 1:
            raise ValidationError(
                detail="Nie możesz ustawić roli właściciela dla innego członka rodziny."
            )
        return value

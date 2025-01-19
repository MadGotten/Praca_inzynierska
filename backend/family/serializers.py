from rest_framework import serializers
from .models import Family
from members.models import FamilyMember
from pets.serializers import PetSimpleSerializer
from members.serializers import FamilyMemberSerializer


class FamilySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source="owner.username")

    class Meta:
        model = Family
        fields = ["id", "name", "owner"]


class FamilySimpleSerializer(serializers.ModelSerializer):
    """Return family details with hidden related fields"""

    owner = serializers.ReadOnlyField(source="owner.username")
    members_total = serializers.IntegerField(read_only=True)
    pets_total = serializers.IntegerField(read_only=True)

    class Meta:
        model = Family
        fields = ["id", "name", "owner", "members_total", "pets_total"]


class FamilyFullSerializer(serializers.ModelSerializer):
    """Return family details with related fields"""

    owner = serializers.ReadOnlyField(source="owner.username")
    members = serializers.SerializerMethodField()
    pets = serializers.SerializerMethodField()

    class Meta:
        model = Family
        fields = ["id", "name", "owner", "members", "pets"]

    def get_members(self, obj):
        """Get members of the family and limit to 6 records"""
        members = obj.familymember_set.select_related("user").only(
            "id", "family_id", "role", "user__username"
        )[:6]
        return FamilyMemberSerializer(members, many=True, read_only=True).data

    def get_pets(self, obj):
        """Get pets of the family and limit to 6 records"""
        pets = obj.pets.all().with_weight()[:6]
        return PetSimpleSerializer(pets, many=True, read_only=True).data


class FamilyRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyMember
        fields = ["id", "role", "joined_at", "family"]

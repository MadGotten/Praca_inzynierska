from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count
from .serializers import (
    FamilySimpleSerializer,
    FamilyFullSerializer,
    FamilySerializer,
    FamilyRoleSerializer,
)
from .models import Family, FamilyMember
from family.permissions import IsFamilyOwner


class FamilyListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilySimpleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner_id=self.request.user.id)

    def get_queryset(self):
        return (
            self.queryset.select_related("owner")
            .annotate(
                members_total=Count("members", distinct=True),
                pets_total=Count("pets", distinct=True),
            )
            .filter(members__id=self.request.user.id)
            .order_by("created_at")
            .only("id", "name", "owner__username", "created_at")
        )


class FamilyViewSetApi(viewsets.ViewSet, generics.RetrieveUpdateDestroyAPIView):
    queryset = Family.objects.all()
    serializer_class = FamilyFullSerializer
    lookup_url_kwarg = "family_id"

    def get_serializer_class(self):
        if self.action == "update" or self.action == "partial_update":
            return FamilySerializer
        return super().get_serializer_class()

    def get_permissions(self):
        """Family owners can perform all actions, on their family."""
        if self.action in ["destroy", "update", "partial_update"]:
            permission_classes = [IsAuthenticated, IsFamilyOwner]
        else:
            permission_classes = [IsAuthenticated]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Lists all families the user is member of.
        Additionally, follows owner relation and prefetches only id of members and pets
        """
        return (
            self.queryset.select_related("owner")
            .filter(members=self.request.user.id)
            .only("name", "owner__username")
        )


class FamilyRoleRetrieve(viewsets.ViewSet, generics.RetrieveAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyRoleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "family_id"
    lookup_url_kwarg = "family_id"

    def get_queryset(self):
        return self.queryset.filter(user_id=self.request.user.id)

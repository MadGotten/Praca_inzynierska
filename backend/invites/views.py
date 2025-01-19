from rest_framework import status, generics, viewsets
from rest_framework.response import Response
from rest_framework.exceptions import ParseError
from petsapp.exceptions import Conflict
from invites.models import FamilyInvitation
from family.models import FamilyMember
from django.db import IntegrityError
from invites.serializers import (
    InviteSimpleSerializer,
    InviteSerializer,
    MeInviteSerializer,
)
from rest_framework.permissions import IsAuthenticated
from family.permissions import IsFamilyOwner, IsFamilyMember
from django_filters.rest_framework import DjangoFilterBackend


class MeListInvitesView(generics.ListAPIView):
    queryset = FamilyInvitation.objects.select_related("family").all()
    serializer_class = MeInviteSerializer

    def get_queryset(self):
        return self.queryset.get_user_pending_invites(self.request.user.id)


class MeInviteResponseView(generics.RetrieveDestroyAPIView):
    queryset = FamilyInvitation.objects.all()
    serializer_class = MeInviteSerializer
    lookup_url_kwarg = "invite_id"

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.accept()

        return Response(status=status.HTTP_204_NO_CONTENT)

    def get_queryset(self):
        return self.queryset.get_user_pending_invites(self.request.user.id)


class InviteListCreateView(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = FamilyInvitation.objects.select_related("invited").all()
    serializer_class = InviteSimpleSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status"]

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyOwner]

        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        family_id = self.kwargs.get("family_id")
        user = serializer.validated_data.pop("user")

        if FamilyMember.objects.filter(family_id=family_id, user_id=user.id).exists():
            raise ParseError(detail="Użytkownik już należy do rodziny")

        try:
            return serializer.save(invited=user, family_id=family_id)
        except IntegrityError:
            raise Conflict(
                detail="Użytkownik już został zaproszony do rodziny",
            )

    def get_queryset(self):
        family = self.kwargs.get("family_id")
        return self.queryset.filter(family_id=family).only(
            "id", "status", "family_id", "created_at", "invited__username"
        )


class InviteRetrieveDestroyView(viewsets.ViewSet, generics.RetrieveDestroyAPIView):
    queryset = FamilyInvitation.objects.select_related("invited").all()
    serializer_class = InviteSerializer
    lookup_url_kwarg = "invite_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyOwner]

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return self.queryset.only(
            "id", "status", "family_id", "created_at", "invited__username"
        )

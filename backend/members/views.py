from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError
from .serializers import FamilyMemberSerializer
from .models import FamilyMember
from family.permissions import IsFamilyOwner, IsFamilyMember
from rest_framework.filters import OrderingFilter


# Create your views here.
class FamilyMemberListApi(viewsets.ViewSet, generics.ListAPIView):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    permission_classes = [IsAuthenticated, IsFamilyMember]
    filter_backends = [OrderingFilter]
    ordering = ["-joined_at"]

    def get_queryset(self):
        family_id = self.kwargs.get("family_id")
        return (
            self.queryset.select_related("user")
            .filter(family_id=family_id)
            .only("id", "family_id", "role", "user__username")
        )


class FamilyMemberViewSetApi(viewsets.ModelViewSet):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer
    lookup_url_kwarg = "member_id"

    def perform_update(self, serializer):
        if serializer.instance.user_id == self.request.user.id:
            raise ParseError(detail="Nie możesz edytować swojej roli.")

        serializer.save()

    def perform_destroy(self, instance):
        if instance.user_id == self.request.user.id:
            raise ParseError(detail="Nie możesz usunąć siebie z rodziny.")
        instance.delete()

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyOwner]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        return self.queryset.select_related("family", "user").only(
            "id", "family_id", "role", "user__username"
        )

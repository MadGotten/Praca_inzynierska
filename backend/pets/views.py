from rest_framework import viewsets, generics
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from pets import serializers
from .models import Pet, Health, Vaccination, Note, Weight, Activity
from family.models import Family
from family.permissions import IsFamilyMember, IsFamilyAdmin
from petsapp.pagination import PagePagination
from rest_framework.filters import OrderingFilter


class PetListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Pet.objects.all()
    serializer_class = serializers.PetSimpleSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        family = self.kwargs.get("family_id")
        family = get_object_or_404(Family, pk=family)

        serializer.save(family=family)

    def get_queryset(self):
        family = self.kwargs.get("family_id")
        return self.queryset.filter(family=family).with_weight()


class PetViewSetApi(viewsets.ModelViewSet):
    queryset = Pet.objects.all().with_weight()
    serializer_class = serializers.PetSerializer
    lookup_url_kwarg = "pet_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]


class DetailsListApi(viewsets.ViewSet, generics.ListAPIView):
    pagination_class = PagePagination
    serializer_class = serializers.PetDetailSerializer
    permission_classes = [IsAuthenticated, IsFamilyMember]

    def get_queryset(self):
        pet_id = self.kwargs.get("pet_id")
        health_records = Health.objects.common_values(pet_id)
        vaccination_records = Vaccination.objects.common_values(pet_id)
        activity_records = Activity.objects.common_values(pet_id)
        note_records = Note.objects.common_values(pet_id)

        combined_records = health_records.union(
            vaccination_records, note_records, activity_records, all=True
        ).order_by("-created_at")

        return combined_records


class HealthListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Health.objects.all()
    serializer_class = serializers.HealthSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        pet_id = self.kwargs.get("pet_id")
        pet = get_object_or_404(Pet, pk=pet_id)

        serializer.save(pet=pet)

    def get_queryset(self):
        pet_id = self.kwargs.get("pet_id")
        return self.queryset.filter(pet=pet_id)


class HealthViewSetApi(viewsets.ModelViewSet):
    queryset = Health.objects.all().select_related("pet")
    serializer_class = serializers.HealthFullSerializer
    lookup_url_kwarg = "health_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]


class VaccinationListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Vaccination.objects.all()
    serializer_class = serializers.VaccinationSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        pet_id = self.kwargs.get("pet_id")
        pet = get_object_or_404(Pet, pk=pet_id)

        serializer.save(pet=pet)

    def get_queryset(self):
        pet_id = self.kwargs.get("pet_id")
        return self.queryset.filter(pet=pet_id)


class VaccinationViewSetApi(viewsets.ModelViewSet):
    queryset = Vaccination.objects.all().select_related("pet")
    serializer_class = serializers.VaccinationFullSerializer
    lookup_url_kwarg = "vaccination_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]


class NoteListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = serializers.NoteSerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        pet_id = self.kwargs.get("pet_id")
        pet = get_object_or_404(Pet, pk=pet_id)

        serializer.save(pet=pet)

    def get_queryset(self):
        pet_id = self.kwargs.get("pet_id")
        return self.queryset.filter(pet=pet_id)


class NoteViewSetApi(viewsets.ModelViewSet):
    queryset = Note.objects.all().select_related("pet")
    serializer_class = serializers.NoteFullSerializer
    lookup_url_kwarg = "note_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]


class WeightListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Weight.objects.all()
    serializer_class = serializers.WeightSerializer
    filter_backends = [OrderingFilter]
    ordering = ["-date"]

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        pet_id = self.kwargs.get("pet_id")
        pet = get_object_or_404(Pet, pk=pet_id)

        serializer.save(pet=pet)

    def get_queryset(self):
        pet_id = self.kwargs.get("pet_id")
        return self.queryset.filter(pet=pet_id)


class WeightViewSetApi(viewsets.ModelViewSet):
    queryset = Weight.objects.all().select_related("pet")
    serializer_class = serializers.WeightFullSerializer
    lookup_url_kwarg = "weight_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]


class ActivityListCreateApi(viewsets.ViewSet, generics.ListCreateAPIView):
    queryset = Activity.objects.all()
    serializer_class = serializers.ActivitySerializer

    def get_permissions(self):
        if self.action == "list":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        else:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        pet_id = self.kwargs.get("pet_id")
        pet = get_object_or_404(Pet, pk=pet_id)

        serializer.save(pet=pet)

    def get_queryset(self):
        pet_id = self.kwargs.get("pet_id")
        return self.queryset.filter(pet=pet_id)


class ActivityViewSetApi(viewsets.ModelViewSet):
    queryset = Activity.objects.all().select_related("pet")
    serializer_class = serializers.ActivityFullSerializer
    lookup_url_kwarg = "activity_id"

    def get_permissions(self):
        if self.action == "retrieve":
            permission_classes = [IsAuthenticated, IsFamilyMember]
        elif self.action in ["update", "partial_update", "destroy"]:
            permission_classes = [IsAuthenticated, IsFamilyAdmin]
        return [permission() for permission in permission_classes]

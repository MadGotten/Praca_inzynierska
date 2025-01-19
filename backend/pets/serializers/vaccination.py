from rest_framework import serializers
from pets.models import Vaccination


class VaccinationFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Vaccination
        fields = "__all__"
        read_only_fields = ["pet"]


class VaccinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vaccination
        exclude = ["pet"]

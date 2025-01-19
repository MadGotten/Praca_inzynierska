from rest_framework import serializers
from pets.models import Health


class HealthFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Health
        fields = "__all__"
        read_only_fields = ["pet"]


class HealthSerializer(serializers.ModelSerializer):
    class Meta:
        model = Health
        exclude = ["pet"]

from rest_framework import serializers
from pets.models import Weight


class WeightFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Weight
        fields = "__all__"
        read_only_fields = ["pet"]


class WeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = Weight
        exclude = ["pet"]

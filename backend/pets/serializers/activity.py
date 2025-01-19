from rest_framework import serializers
from pets.models import Activity
import datetime


class ActivityFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Activity
        fields = "__all__"
        read_only_fields = ["pet"]


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        exclude = ["pet"]

    def validate_duration(self, value):
        if value <= datetime.timedelta():
            raise serializers.ValidationError("Czas aktywności musi być liczbą dodatnią.")
        return value

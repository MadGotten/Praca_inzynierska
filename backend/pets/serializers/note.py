from rest_framework import serializers
from pets.models import Note


class NoteFullSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = "__all__"
        read_only_fields = ["pet"]


class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        exclude = ["pet"]

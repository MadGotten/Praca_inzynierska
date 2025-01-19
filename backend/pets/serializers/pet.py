from rest_framework import serializers
from pets.models import Pet, Weight


class PetSimpleSerializer(serializers.ModelSerializer):
    weight = serializers.DecimalField(
        max_digits=5, decimal_places=2, write_only=False, required=True
    )

    class Meta:
        model = Pet
        exclude = ["family", "updated_at"]

    def create(self, validated_data):
        weight = validated_data.pop("weight")
        instance = super().create(validated_data)
        if weight is not None:
            Weight.objects.create(pet=instance, weight=weight)
        instance.weight = weight
        return instance


class PetSerializer(serializers.ModelSerializer):
    weight = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = "__all__"
        read_only_fields = ["family"]

    def get_weight(self, obj):
        if obj.weight is not None:
            return f"{obj.weight:.2f}"
        return None


class PetDetailSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    pet = serializers.IntegerField()
    detail_type = serializers.CharField()
    created_at = serializers.DateTimeField()
    name = serializers.CharField(required=False)

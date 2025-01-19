from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Value, CharField
from family.models import Family
import datetime


class PetQuerySet(models.QuerySet):
    def with_weight(self):
        return self.annotate(
            weight=models.Subquery(
                Weight.objects.filter(pet=models.OuterRef("id"))
                .order_by("-date")
                .values("weight")[:1]
            )
        )


class PetManager(models.Manager):
    def get_queryset(self):
        return PetQuerySet(self.model)

    def with_weight(self):
        return self.get_queryset().with_weight()


class Pet(models.Model):
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=100)
    breed = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date_of_birth = models.DateField(
        validators=[
            MaxValueValidator(datetime.date.today()),
            MinValueValidator(
                datetime.date.today() - datetime.timedelta(days=365 * 100)
            ),
        ]
    )
    family = models.ForeignKey(Family, on_delete=models.CASCADE, related_name="pets")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = PetManager()

    class Meta:
        indexes = [
            models.Index(fields=["family", "-created_at"]),
        ]

    def __str__(self):
        return "Zwierze: %s - Rodzina: %s" % (self.name, self.family.name)


class PetRecordQueryset(models.QuerySet):
    def common_values(self, pet_id):
        return (
            self.filter(pet_id=pet_id)
            .annotate(
                detail_type=Value(
                    self.model._meta.verbose_name_plural, output_field=CharField()
                )
            )
            .values(
                "id",
                "pet",
                "created_at",
                "name",
                "detail_type",
            )
        )


class PetRecord(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    objects = PetRecordQueryset.as_manager()

    class Meta:
        abstract = True


class Weight(PetRecord):
    date = models.DateField(db_index=True, default=datetime.datetime.now)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="weights")

    class Meta:
        indexes = [
            models.Index(fields=["pet", "-date"]),
        ]

    def __str__(self):
        return "Waga: %s - Zwierze: %s" % (self.weight, self.pet.name)


class Health(PetRecord):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, max_length=250)
    place = models.CharField(max_length=100, blank=True)
    date = models.DateField()
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="health")

    class Meta:
        verbose_name_plural = "health"
        indexes = [
            models.Index(fields=["pet", "-created_at"]),
        ]

    def __str__(self):
        return "Wizyta: %s - Zwierze: %s" % (self.date, self.pet.name)


class Vaccination(PetRecord):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, max_length=250)
    date = models.DateField()
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="vaccinations")

    class Meta:
        indexes = [
            models.Index(fields=["pet", "-created_at"]),
        ]

    def __str__(self):
        return "Szczepienie: %s - Zwierze: %s" % (self.date, self.pet.name)


class Note(PetRecord):
    name = models.CharField(max_length=100)
    description = models.TextField(max_length=500)
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="notes")

    class Meta:
        indexes = [
            models.Index(fields=["pet", "-created_at"]),
        ]

    def __str__(self):
        return "Notatka: %s - Zwierze: %s" % (self.description, self.pet.name)


class Activity(PetRecord):
    name = models.CharField(max_length=100)
    duration = models.DurationField()
    date = models.DateField()
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name="activities")

    class Meta:
        verbose_name_plural = "activities"
        indexes = [
            models.Index(fields=["pet", "-created_at"]),
        ]

    def __str__(self):
        return "Aktywność: %s - Zwierze: %s" % (self.name, self.pet.name)

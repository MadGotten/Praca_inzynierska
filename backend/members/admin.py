from django.contrib import admin
from .models import FamilyMember


class FamilyAdmin(admin.ModelAdmin):
    readonly_fields = ("id",)


# Register your models here.
admin.site.register(FamilyMember, FamilyAdmin)

from django.contrib import admin
from pets.models import Pet, Health, Vaccination, Note, Weight, Activity

admin.site.register(Pet)
admin.site.register(Health)
admin.site.register(Vaccination)
admin.site.register(Note)
admin.site.register(Weight)
admin.site.register(Activity)

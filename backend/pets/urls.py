from django.urls import path
from pets import views

records = views.DetailsListApi.as_view({"get": "list"})
health = views.HealthListCreateApi.as_view({"get": "list", "post": "create"})
vaccinations = views.VaccinationListCreateApi.as_view({"get": "list", "post": "create"})
notes = views.NoteListCreateApi.as_view({"get": "list", "post": "create"})
weights = views.WeightListCreateApi.as_view({"get": "list", "post": "create"})
activities = views.ActivityListCreateApi.as_view({"get": "list", "post": "create"})

pets_detail = views.PetViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)
health_detail = views.HealthViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)
vaccination_detail = views.VaccinationViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)
notes_detail = views.NoteViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)
weights_detail = views.WeightViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)
activities_detail = views.ActivityViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path("pets/<int:pet_id>/", pets_detail, name="pet-detail"),
    path("pets/<int:pet_id>/records/", records, name="records-list"),
    path("pets/<int:pet_id>/records/health/", health, name="health-list"),
    path(
        "pets/<int:pet_id>/records/vaccinations/",
        vaccinations,
        name="vaccinations-list",
    ),
    path("pets/<int:pet_id>/records/notes/", notes, name="notes-list"),
    path("pets/<int:pet_id>/records/weights/", weights, name="weights-list"),
    path("pets/<int:pet_id>/records/activities/", activities, name="activities-list"),
    path("health/<int:health_id>/", health_detail, name="health-detail"),
    path(
        "vaccinations/<int:vaccination_id>/",
        vaccination_detail,
        name="vaccination-detail",
    ),
    path("notes/<int:note_id>/", notes_detail, name="note-detail"),
    path("pets/<int:pet_id>/records/weights/", weights, name="weights-list"),
    path("weights/<int:weight_id>/", weights_detail, name="weight-detail"),
    path("activities/<int:activity_id>/", activities_detail, name="activity-detail"),
]

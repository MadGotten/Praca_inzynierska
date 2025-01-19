from django.urls import path
from members import views

members_detail = views.FamilyMemberViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)

urlpatterns = [
    path("members/<int:member_id>/", members_detail, name="members-detail"),
]

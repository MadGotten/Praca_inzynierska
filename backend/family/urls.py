from django.urls import path
from family import views
from members import views as member_views
from pets import views as pet_views
from invites import views as invite_views

family_list = views.FamilyListCreateApi.as_view({"get": "list", "post": "create"})
family_detail = views.FamilyViewSetApi.as_view(
    {"get": "retrieve", "put": "update", "patch": "partial_update", "delete": "destroy"}
)
members_list = member_views.FamilyMemberListApi.as_view({"get": "list"})
pets_list = pet_views.PetListCreateApi.as_view({"get": "list", "post": "create"})
invite_list = invite_views.InviteListCreateView.as_view({"get": "list", "post": "create"})


urlpatterns = [
    path("family/", family_list, name="family-list"),
    path("family/<int:family_id>/", family_detail, name="family-detail"),
    path("family/<int:family_id>/role/", views.FamilyRoleRetrieve.as_view({"get": "retrieve"}), name="family-role"),
    path("family/<int:family_id>/members/", members_list, name="pet-members-list"),
    path("family/<int:family_id>/members/invites/", invite_list, name="pet-members-invites"),
    path("family/<int:family_id>/pets/", pets_list, name="pet-list-create"),
]

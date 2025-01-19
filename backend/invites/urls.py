from django.urls import path
from invites import views


urlpatterns = [
    path("me/invites/", views.MeListInvitesView.as_view(), name="me-invite-list"),
    path(
        "me/invites/<int:invite_id>/", views.MeInviteResponseView.as_view(), name="me-invite-detail"
    ),
    path(
        "invites/<int:invite_id>/",
        views.InviteRetrieveDestroyView.as_view({"get": "retrieve", "delete": "destroy"}),
        name="invite-detail",
    ),
]

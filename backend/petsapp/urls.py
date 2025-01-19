from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/schema/swagger-ui/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
    path("api/schema/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
    path(
        "api/v1/",
        include(
            [
                path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
                path("users/", include("users.urls")),
                path("", include("family.urls")),
                path("", include("members.urls")),
                path("", include("pets.urls")),
                path("", include("invites.urls")),
            ]
        ),
    ),
]

urlpatterns += [path("silk/", include("silk.urls", namespace="silk"))]

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from cors_settings import viewsets

router = DefaultRouter()
router.register(r"apps", viewsets.AppViewSet, basename="app")

urlpatterns = [
    path("", include(router.urls)),
]

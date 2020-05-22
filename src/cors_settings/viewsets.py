import uuid
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from cors_settings.models import App
from cors_settings.permissions import IsAppOwner
from cors_settings.serializers import AppSerializer


class AppViewSet(ModelViewSet):
    serializer_class = AppSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsAppOwner]

    def get_queryset(self):
        return App.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        secret = uuid.uuid4()
        serializer.save(user=self.request.user, secret=secret)

    @action(methods=["post"], detail=True)
    def gen_secret(self, request, pk=None):
        app = self.get_object()
        app.set_secret(uuid.uuid4())
        app.save()

        serializer = AppSerializer(app)
        return Response(data=serializer.data)

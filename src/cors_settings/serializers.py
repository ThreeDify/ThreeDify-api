from rest_framework.serializers import (
    ModelSerializer,
    PrimaryKeyRelatedField,
    CurrentUserDefault,
    CharField,
)

from cors_settings.models import App


class AppSerializer(ModelSerializer):
    user = PrimaryKeyRelatedField(read_only=True, default=CurrentUserDefault())
    raw_secret = CharField(read_only=True, max_length=256)

    class Meta:
        model = App
        read_only_fields = ["key"]
        exclude = ["secret"]

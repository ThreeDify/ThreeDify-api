import uuid
from django.db import models
from django.conf import settings
from django.contrib.auth.hashers import make_password


class App(models.Model):
    name = models.CharField(max_length=50)
    key = models.UUIDField(unique=True, editable=False, default=uuid.uuid4)
    secret = models.CharField(
        max_length=256,
        default=uuid.uuid4,
        help_text="Save this secret key. You won't be able to see this after this.",
    )
    allowed_host = models.CharField(max_length=200)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    def save(self, **kwargs):
        print(self.secret)
        self.secret = make_password(self.secret)
        super().save(**kwargs)

from django.forms import CharField, EmailField
from django.contrib.auth.forms import UsernameField, UserCreationForm

from users.models import AppUser


class AppUserCreationForm(UserCreationForm):
    class Meta:
        model = AppUser
        fields = ("username", "full_name", "email")
        field_classes = {
            "username": UsernameField,
            "full_name": CharField,
            "email": EmailField,
        }

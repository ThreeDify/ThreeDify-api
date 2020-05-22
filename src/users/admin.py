from django.contrib import admin
from django.utils.translation import gettext_lazy as _

from users.models import AppUser
from users.forms import AppUserCreationForm


class AppUserAdmin(admin.ModelAdmin):
    list_display = ("username", "email", "full_name", "is_staff")
    search_fields = ("username", "full_name", "email")

    add_form = AppUserCreationForm

    def get_form(self, request, obj=None, **kwargs):
        defaults = {}
        if obj is None:
            defaults["form"] = self.add_form
        defaults.update(kwargs)
        return super().get_form(request, obj, **defaults)


admin.site.register(AppUser, AppUserAdmin)

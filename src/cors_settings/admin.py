from django.contrib import admin

from cors_settings.models import App


@admin.register(App)
class AppAdmin(admin.ModelAdmin):
    list_display = ["name", "key", "allowed_host", "user"]

    def get_exclude(self, request, obj=None):
        if obj == None:
            return []

        return ["secret"]

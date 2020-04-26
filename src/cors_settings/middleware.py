import uuid
from django.http import HttpResponseForbidden
from django.contrib.auth.hashers import check_password, make_password

from cors_settings.models import App


X_THREEDIFY_APP_KEY = "X-THREEDIFY-APP-KEY"
X_THREEDIFY_APP_SECRET = "X-THREEDIFY-APP-SECRET"


class AppAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        headers = request.headers
        path = request.path

        app_key = headers.get(X_THREEDIFY_APP_KEY, "")
        app_secret = headers.get(X_THREEDIFY_APP_SECRET, "")

        if path.split("/")[1] == "api" and not self.authenticate(app_key, app_secret):
            return HttpResponseForbidden("Could not authenticate application.")

        return self.get_response(request)

    def authenticate(self, api_key, api_secret):
        try:
            app = App.objects.filter(key=uuid.UUID(hex=api_key)).get()
        except:
            return False

        return check_password(api_secret, app.secret)

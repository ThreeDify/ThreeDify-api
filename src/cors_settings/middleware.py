import re
import uuid
from django.http import HttpResponseForbidden
from corsheaders.middleware import CorsMiddleware
from django.contrib.auth.hashers import check_password

from cors_settings.models import App


X_THREEDIFY_APP_KEY = "X-THREEDIFY-APP-KEY"
X_THREEDIFY_APP_SECRET = "X-THREEDIFY-APP-SECRET"


class AppAuthMiddleware(CorsMiddleware):
    def __call__(self, request):
        headers = request.headers
        self.is_pre_flight = request.method == "OPTIONS"

        if self.is_enabled(request) and not self.is_pre_flight:
            app_key = headers.get(X_THREEDIFY_APP_KEY, "")
            app_secret = headers.get(X_THREEDIFY_APP_SECRET, "")

            if not self.authenticate(app_key, app_secret):
                return HttpResponseForbidden("Could not authenticate application.")

        return super().__call__(request)

    def authenticate(self, api_key, api_secret):
        try:
            self.app = App.objects.filter(key=uuid.UUID(hex=api_key)).get()
        except:
            return False

        return check_password(api_secret, self.app.secret)

    def regex_domain_match(self, origin):
        if self.is_pre_flight:
            for app in App.objects.all():
                if re.match(app.allowed_host, origin):
                    return origin
        elif re.match(self.app.allowed_host, origin):
            return origin

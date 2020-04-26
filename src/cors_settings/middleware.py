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

        if (self.is_enabled(request)):
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
        if re.match(self.app.allowed_host, origin):
            return origin

import uuid
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from cors_settings.models import App


class Command(BaseCommand):
    help = "Regenerate CORS App Secret"

    def add_arguments(self, parser):
        parser.add_argument("-k", "--key", type=str, required=True, help="App Key")

    def handle(self, *args, **options):
        app_key = options["key"]
        try:
            app = App.objects.get(key=app_key)
            app.set_secret(uuid.uuid4())
            self.stdout.write("CORS App Secret generated.")
            self.stdout.write("Name: {}".format(app.name))
            self.stdout.write("Allowed Host: {}".format(app.allowed_host))
            self.stdout.write("Key: {}".format(app.key))
            self.stdout.write("Secret: {}".format(app.raw_secret))
            self.stdout.write("Save the secret you won't be able to see it again.")

        except App.DoesNotExist as e:
            raise CommandError("App doesn't exists with key: {}".format(app_key))

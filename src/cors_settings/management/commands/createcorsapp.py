from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from cors_settings.models import App


class Command(BaseCommand):
    help = "Create a cors app"

    def add_arguments(self, parser):
        parser.add_argument(
            "-n", "--name", type=str, nargs="+", required=True, help="Name of the app"
        )

        parser.add_argument(
            "-ah",
            "--allowed-host",
            type=str,
            required=True,
            help="Allowed host for the app",
        )

        parser.add_argument(
            "-u",
            "--user",
            type=str,
            required=True,
            help="Username to associate the app",
        )

    def handle(self, *args, **options):
        user_model = get_user_model()

        username = options["user"]
        app_name = (
            " ".join(options["name"])
            if type(options["name"]) is list
            else options["name"]
        )
        allowed_host = options["allowed_host"]
        try:
            user = user_model.objects.get(username=username)

            app = App.objects.create(
                name=app_name, allowed_host=allowed_host, user=user
            )
            self.stdout.write("CORS App created.")
            self.stdout.write("Name: {}".format(app.name))
            self.stdout.write("Allowed Host: {}".format(app.allowed_host))
            self.stdout.write("Key: {}".format(app.key))
            self.stdout.write("Secret: {}".format(app.raw_secret))
            self.stdout.write("Save the secret you won't be able to see it again.")

        except user_model.DoesNotExist as e:
            raise CommandError("User doesn't exists with username: {}".format(username))

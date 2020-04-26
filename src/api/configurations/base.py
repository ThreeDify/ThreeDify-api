import os

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "obo@w^bz9w^ibj1a9pf=^hk4wk+!_-jg3&7#mm_c60g5xzhyka"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = False if os.environ.get("THREEDIFY_ENV", "production") == "production" else True

ROOT_URLCONF = "api.urls"

WSGI_APPLICATION = "api.wsgi.application"

# Internationalization
# https://docs.djangoproject.com/en/3.0/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.0/howto/static-files/

STATIC_URL = "/static/"

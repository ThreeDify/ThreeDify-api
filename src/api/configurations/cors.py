from corsheaders.defaults import default_headers

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-THREEDIFY-APP-KEY",
    "X-THREEDIFY-APP-SECRET",
]

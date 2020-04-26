from corsheaders.defaults import default_headers

CORS_ALLOW_HEADERS = list(default_headers) + [
    "X-THREEDIFY-APP-KEY",
    "X-THREEDIFY-APP-SECRET",
]

CORS_URLS_REGEX = r'^/api/.*$'

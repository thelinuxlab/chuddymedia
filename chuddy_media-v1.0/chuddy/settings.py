import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# Load variables from a local .env file (copy .env.example to .env). Real environment variables win.
_env_file = BASE_DIR / ".env"
if _env_file.exists():
    for _line in _env_file.read_text().splitlines():
        _line = _line.strip()
        if _line and not _line.startswith("#") and "=" in _line:
            _key, _value = _line.split("=", 1)
            os.environ.setdefault(_key.strip(), _value.strip().strip('"').strip("'"))
SECRET_KEY = os.environ.get("SECRET_KEY", "change-me-in-production")
DEBUG = os.environ.get("DEBUG", "1") == "1"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "*").split(",")

INSTALLED_APPS = [
    "django.contrib.admin", "django.contrib.auth", "django.contrib.contenttypes",
    "django.contrib.sessions", "django.contrib.messages", "django.contrib.staticfiles",
    "studio",
]
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]
ROOT_URLCONF = "chuddy.urls"
TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [], "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
        "studio.context_processors.site",
    ]},
}]
WSGI_APPLICATION = "chuddy.wsgi.application"
DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": BASE_DIR / "db.sqlite3"}}
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Africa/Lagos"
USE_I18N = True
USE_TZ = True
STATIC_URL = "/static/"
STATICFILES_DIRS = [BASE_DIR / "static"]
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Studio identity: edit here, or override social URLs via environment variables.
STUDIO = {
    "name": "Chuddy Media",
    "tagline": "Photography & Videography",
    "address": "23 Olutosin Ajayi Street, beside CPM Church, M/M Airport Road, Ajao Estate, Lagos",
    "phones": ["+2347031638982", "+2347078188644"],
    "email": "chuddymedia@gmail.com",
    "whatsapp": "2347031638982",
    "social": {
        "facebook": os.environ.get("URL_FACEBOOK", "https://www.facebook.com/search/top?q=chuddy%20media"),
        "instagram": os.environ.get("URL_INSTAGRAM", "https://instagram.com/oscarchuddy"),
        "tiktok": os.environ.get("URL_TIKTOK", ""),
        "x": os.environ.get("URL_X", ""),
        "youtube": os.environ.get("URL_YOUTUBE", ""),
    },
}

# Email: messages are delivered straight to the studio Gmail inbox.
# Create a Gmail App Password (Google Account > Security > 2-Step Verification > App passwords)
# and set it as the GMAIL_APP_PASSWORD environment variable.
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = STUDIO["email"]
EMAIL_HOST_PASSWORD = os.environ.get("GMAIL_APP_PASSWORD", "")
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
EMAIL_BACKEND = ("django.core.mail.backends.smtp.EmailBackend" if EMAIL_HOST_PASSWORD
                 else "django.core.mail.backends.console.EmailBackend")

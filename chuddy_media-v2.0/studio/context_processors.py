from django.conf import settings
from .models import Category


def site(request):
    s = settings.STUDIO
    return {
        "studio": s,
        "nav_categories": Category.objects.all(),
        "social": {k: v for k, v in s["social"].items() if v},
        "gmail_link": f"https://mail.google.com/mail/?view=cm&to={s['email']}",
        "wa_link": f"https://wa.me/{s['whatsapp']}",
    }

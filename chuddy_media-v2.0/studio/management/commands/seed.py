from django.core.management.base import BaseCommand
from studio.models import Category

DATA = [
    ("Event", "event", "Weddings, parties and celebrations told in motion and stills."),
    ("Photoshoots", "photoshoots", "Portraits and lifestyle sessions with a signature look."),
    ("Corporate", "corporate", "Headshots, conferences and brand films for serious business."),
    ("Architecture", "architecture", "Interiors and exteriors shot with precision and light."),
    ("Modeling", "modeling", "Editorial and portfolio work for models and agencies."),
    ("Product", "product", "Clean, scroll-stopping imagery that sells."),
]

class Command(BaseCommand):
    help = "Create the default service categories."

    def handle(self, *args, **opts):
        for i, (title, slug, tag) in enumerate(DATA):
            Category.objects.update_or_create(slug=slug, defaults={"title": title, "tagline": tag, "order": i})
        self.stdout.write(self.style.SUCCESS("Categories ready."))

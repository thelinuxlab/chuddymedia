import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, render
from django.views.decorators.http import require_POST

from .forms import InquiryForm
from .models import Category, Client, HeroSlide, Project

logger = logging.getLogger(__name__)


def home(request):
    return render(request, "studio/home.html", {
        "slides": HeroSlide.objects.all(),
        "featured": Project.objects.filter(featured=True).select_related("category")[:12],
        "companies": Client.objects.filter(kind="company"),
        "vendors": Client.objects.filter(kind="vendor"),
        "form": InquiryForm(),
    })


def category(request, slug):
    cat = get_object_or_404(Category, slug=slug)
    return render(request, "studio/category.html", {"cat": cat, "projects": cat.projects.all()})


def about(request):
    return render(request, "studio/about.html")


def _notify(inq):
    body = (f"Name: {inq.name}\nEmail: {inq.email}\nPhone: {inq.phone or '-'}\n"
            f"Service: {inq.service or '-'}\n\n{inq.message}")
    try:
        EmailMessage(f"New inquiry from {inq.name}", body,
                     to=[settings.STUDIO["email"]], reply_to=[inq.email]).send()
        return True
    except Exception:
        logger.exception("Inquiry email failed")
        return False


@require_POST
def contact(request):
    form = InquiryForm(request.POST)
    if not form.is_valid():
        return JsonResponse({"ok": False, "errors": form.errors.get_json_data()}, status=400)
    inq = form.save()
    return JsonResponse({"ok": True, "emailed": _notify(inq)})


def api_projects(request):
    qs = Project.objects.select_related("category")
    cat = request.GET.get("cat")
    qs = qs.filter(category__slug=cat) if cat else qs.filter(featured=True)
    return JsonResponse({"projects": [
        {"id": p.id, "title": p.title, "cat": p.category.title, "image": p.image.url if p.image else "",
         "video": p.video.url if p.video else ""}
        for p in qs[:40]]})

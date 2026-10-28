from django.db import models
from django.urls import reverse


class Category(models.Model):
    title = models.CharField(max_length=60)
    slug = models.SlugField(unique=True)
    tagline = models.CharField(max_length=160, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "title"]
        verbose_name_plural = "categories"

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("category", args=[self.slug])


class Project(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="projects")
    title = models.CharField(max_length=120)
    image = models.ImageField(upload_to="projects/", blank=True)
    video_url = models.URLField(blank=True, help_text="Optional YouTube link")
    featured = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]

    def __str__(self):
        return self.title


class Client(models.Model):
    KINDS = [("company", "Company"), ("vendor", "Vendor")]
    name = models.CharField(max_length=100)
    kind = models.CharField(max_length=10, choices=KINDS, default="company")
    logo = models.ImageField(upload_to="clients/", blank=True)
    url = models.URLField(blank=True)

    class Meta:
        ordering = ["kind", "name"]

    def __str__(self):
        return f"{self.name} ({self.kind})"


class Inquiry(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    service = models.ForeignKey(Category, null=True, blank=True, on_delete=models.SET_NULL)
    message = models.TextField()
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created"]
        verbose_name_plural = "inquiries"

    def __str__(self):
        return f"{self.name} - {self.created:%Y-%m-%d}"


class HeroSlide(models.Model):
    image = models.ImageField(upload_to="slides/")
    caption = models.CharField(max_length=80, blank=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.caption or f"Slide {self.pk}"

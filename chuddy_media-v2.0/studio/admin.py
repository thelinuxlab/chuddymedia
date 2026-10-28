from django.contrib import admin
from .models import Category, Client, HeroSlide, Inquiry, Project

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "order")
    prepopulated_fields = {"slug": ("title",)}

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "featured", "created")
    list_filter = ("category", "featured")

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ("name", "kind")
    list_filter = ("kind",)

@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "service", "created")
    readonly_fields = ("created",)

@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ("__str__", "order")

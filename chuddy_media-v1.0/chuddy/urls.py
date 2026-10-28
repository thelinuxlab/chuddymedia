from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Chuddy Media Admin"
urlpatterns = [path("admin/", admin.site.urls), path("", include("studio.urls"))]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

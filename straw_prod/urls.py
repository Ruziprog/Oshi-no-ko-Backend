from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import PersonViewSet

router = DefaultRouter()
router.register(r'talents', PersonViewSet)

urlpatterns = [
    path('', views.talent_list, name='talent_list'),
    path('api/talents/', views.talent_api, name='talent_api'),
]
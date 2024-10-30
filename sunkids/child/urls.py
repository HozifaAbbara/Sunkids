from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ChildViewSet, RelationshipViewSet

router = DefaultRouter()
router.register(r'children', ChildViewSet, basename='child')
router.register(r'relationships', RelationshipViewSet, basename='relationship')

urlpatterns = [
    path('', include(router.urls)),
]

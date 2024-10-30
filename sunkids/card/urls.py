from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CardViewSet, SoldCardsViewSet, CardConsumptionViewSet

router = DefaultRouter()
router.register(r'cards', CardViewSet, basename='card')
router.register(r'sold-cards', SoldCardsViewSet, basename='sold-cards')
router.register(r'card-consumptions', CardConsumptionViewSet, basename='card-consumptions')

urlpatterns = [
    path('', include(router.urls)),
]

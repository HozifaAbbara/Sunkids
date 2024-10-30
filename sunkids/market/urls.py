from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MarketItemViewSet, SoldItemsViewSet

router = DefaultRouter()
router.register(r'market-items', MarketItemViewSet, basename='marketitem')
router.register(r'sold-items', SoldItemsViewSet, basename='solditems')

urlpatterns = [
    path('', include(router.urls)),
]

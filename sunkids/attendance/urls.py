from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HourPricingViewSet, AttendanceViewSet

router = DefaultRouter()
router.register(r'hour-pricing', HourPricingViewSet, basename='hourpricing')
router.register(r'attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('', include(router.urls)),
]

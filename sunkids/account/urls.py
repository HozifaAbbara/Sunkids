from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LoginView, LogoutView, EmployeeViewSet, ParentViewSet

router = DefaultRouter()
router.register(r'employees', EmployeeViewSet, basename='employee')
router.register(r'parents', ParentViewSet, basename='parent')

urlpatterns = [
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('logout/', LogoutView.as_view(), name='token_blacklist'),
    path('', include(router.urls)),
]

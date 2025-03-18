from rest_framework import viewsets, filters
from rest_framework_simplejwt.views import TokenObtainPairView, TokenBlacklistView
from rest_framework.permissions import IsAuthenticated
from .models import Employee, Parent
from .serializers import AccountSerializer, EmployeeSerializer, ParentSerializer, CustomTokenObtainPairSerializer
from .permissions import IsAdmin, IsEmployeeOrAdmin
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView

# Login view
class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# Logout view
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out"}, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

# Employee management viewset, restricted to admins only
class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAuthenticated, IsAdmin]

# Parent management viewset, restricted to employees and admins
class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsEmployeeOrAdmin]
    filter_backends = [filters.SearchFilter]
    search_fields = ['account__first_name', 'account__last_name', 'account__username']  # Fields to search by

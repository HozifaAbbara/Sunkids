from rest_framework import viewsets, filters
from .models import Child, Relationship
from .serializers import ChildSerializer, RelationshipSerializer
from rest_framework.permissions import IsAuthenticated
from account.permissions import IsEmployeeOrAdmin  # Adjust this import based on your permission logic
from django_filters.rest_framework import DjangoFilterBackend

class ChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer
    permission_classes = [IsAuthenticated, IsEmployeeOrAdmin]  # Requires user to be authenticated and have specific role permissions
    filter_backends = [filters.SearchFilter, DjangoFilterBackend]
    search_fields = ['first_name', 'last_name', 'parent__account__username']  # Fields to search by

    def get_queryset(self):
        user = self.request.user
        if user.role in ['EMPLOYEE', 'ADMIN']:
            return Child.objects.all()
        return Child.objects.filter(parent=user.parent_profile)  # Assumes user is a parent and has a related profile

class RelationshipViewSet(viewsets.ModelViewSet):
    queryset = Relationship.objects.all()
    serializer_class = RelationshipSerializer
    permission_classes = [IsEmployeeOrAdmin]  # Only allow access to authenticated employees or admins
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name', 'parent']  # Fields to search by

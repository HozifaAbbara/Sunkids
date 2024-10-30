from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        print(f"User: {request.user}, Role: {request.user.role}") 
        return request.user.is_authenticated and request.user.role == 'Admin'

class IsEmployeeOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['Employee', 'Admin']

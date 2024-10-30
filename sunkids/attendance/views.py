from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import *
from .serializers import *
from django.utils import timezone
from account.permissions import IsAdmin, IsEmployeeOrAdmin
from rest_framework.permissions import IsAuthenticated


class HourPricingViewSet(viewsets.ModelViewSet):
    queryset = HourPricing
    serializer_class = HourPricingSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class AttendanceViewSet(viewsets.ModelViewSet):
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated, IsEmployeeOrAdmin]

    # Action to get children currently in the center
    @action(detail=False, methods=['get'], url_path='currently-in-center')
    def currently_in_center(self, request):
        current_time = timezone.now()
        # Filter attendances where exit_time is null (not yet exited)
        current_attendances = Attendance.objects.filter(exit_time__isnull=True)
        serializer = self.get_serializer(current_attendances, many=True)
        return Response(serializer.data)

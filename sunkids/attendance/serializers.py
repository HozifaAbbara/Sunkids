from rest_framework.serializers import ModelSerializer
from .models import *


class HourPricingSerializer(ModelSerializer):
    class Meta:
        model = HourPricing
        fields = '__all__'


class AttendanceSerializer(ModelSerializer):
    class Meta:
        model = Attendance
        fields = '__all__'
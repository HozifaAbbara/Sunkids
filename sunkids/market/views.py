from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import MarketItem, SoldItems
from .serializers import MarketItemSerializer, SoldItemsSerializer
from account.permissions import *

class MarketItemViewSet(viewsets.ModelViewSet):
    queryset = MarketItem.objects.all()
    serializer_class = MarketItemSerializer
    permission_classes = [IsAuthenticated, IsAdmin]


class SoldItemsViewSet(viewsets.ModelViewSet):
    queryset = SoldItems.objects.all()
    serializer_class = SoldItemsSerializer
    permission_classes = [IsAuthenticated, IsEmployeeOrAdmin]


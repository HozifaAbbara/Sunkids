from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Card, SoldCards, CardConsumption
from .serializers import CardSerializer, SoldCardsSerializer, CardConsumptionSerializer
from account.permissions import IsEmployeeOrAdmin

class CardViewSet(viewsets.ModelViewSet):
    queryset = Card.objects.all()
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated, IsEmployeeOrAdmin]

class SoldCardsViewSet(viewsets.ModelViewSet):
    queryset = SoldCards.objects.all()
    serializer_class = SoldCardsSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'PARENT':
            return SoldCards.objects.filter(parent=user.parent_profile)
        return SoldCards.objects.all()

class CardConsumptionViewSet(viewsets.ModelViewSet):
    queryset = CardConsumption.objects.all()
    serializer_class = CardConsumptionSerializer
    permission_classes = [IsAuthenticated, IsEmployeeOrAdmin]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'PARENT':
            return CardConsumption.objects.filter(card__parent=user.parent_profile)
        return CardConsumption.objects.all()

from rest_framework import serializers
from .models import MarketItem, SoldItems

class MarketItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketItem
        fields = '__all__'


class SoldItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoldItems
        fields = '__all__'

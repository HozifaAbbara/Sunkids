from rest_framework import serializers
from django.utils import timezone
from .models import Card, SoldCards, CardConsumption

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = '__all__'

class SoldCardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoldCards
        fields = '__all__'
        read_only_fields = ['sold_date', 'expiry_date', 'remaining_hours']

    def create(self, validated_data):
        # Automatically set expiry date and remaining hours on creation
        card_instance = super().create(validated_data)
        card_instance.save()  # This will trigger the save method to set expiry and remaining hours
        return card_instance

class CardConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardConsumption
        fields = ['id', 'card', 'attendance', 'number_of_consumed_hours']

    def validate_number_of_consumed_hours(self, value):
        if value <= 0:
            raise serializers.ValidationError("The number of consumed hours must be greater than zero.")
        return value

    def validate(self, data):
        sold_card = data['card']

        # Check if the card has expired
        if sold_card.expiry_date < timezone.now().date():
            raise serializers.ValidationError("This card has expired and cannot be used.")

        # Check if there are enough remaining hours on the card
        if data['number_of_consumed_hours'] > sold_card.remaining_hours:
            raise serializers.ValidationError("Not enough hours remaining on the card.")
        
        return data

    def create(self, validated_data):
        sold_card = validated_data['card']
        consumed_hours = validated_data['number_of_consumed_hours']

        # Deduct consumed hours from remaining hours on the card
        sold_card.remaining_hours -= consumed_hours
        sold_card.save(update_fields=['remaining_hours'])
        
        return super().create(validated_data)

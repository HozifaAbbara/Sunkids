from django.db import models
from account.models import Parent
from attendance.models import Attendance
from datetime import timedelta

CARD_TYPE_CHOICES = [
    ('ART', 'Art'),
    ('PLAY', 'Play'),
]

class Card(models.Model):
    color = models.CharField(max_length=15)
    type = models.CharField(max_length=15, choices=CARD_TYPE_CHOICES)
    validity_days = models.IntegerField()
    validity_hours = models.IntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.color} {self.type} Card'

class SoldCards(models.Model):
    parent = models.ForeignKey(Parent, related_name='cards', on_delete=models.PROTECT)
    card = models.ForeignKey(Card, on_delete=models.PROTECT)
    sold_date = models.DateField(auto_now_add=True)
    expiry_date = models.DateField()
    remaining_hours = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        ordering = ['-sold_date'] 

    def save(self, *args, **kwargs):
        # Set expiry date based on card validity days if not already set
        if not self.expiry_date:
            self.expiry_date = self.sold_date + timedelta(days=self.card.validity_days)
        # Set remaining hours to card's validity hours if not already set
        if not self.remaining_hours:
            self.remaining_hours = self.card.validity_hours
        super().save(*args, **kwargs)

    def __str__(self):
        return f'Sold {self.card} to {self.parent}'



class CardConsumption(models.Model):
    card = models.ForeignKey(SoldCards, related_name='card_consumptions', on_delete=models.PROTECT)
    attendance = models.ForeignKey(Attendance, related_name='card_consumptions', on_delete=models.PROTECT)
    number_of_consumed_hours = models.DecimalField(max_digits=5, decimal_places=2)


    def __str__(self):
        return f'{self.number_of_consumed_hours} hours from {self.card}'

from django.db import models
from account.models import Parent
from attendance.models import Attendance
from datetime import timedelta

CARD_TYPE_CHOICES = [
    ('ART', 'Art'),
    ('PLAY', 'Play'),
]

class Card(models.Model):
    color = models.CharField(max_length=15, verbose_name='اللون')
    type = models.CharField(max_length=15, choices=CARD_TYPE_CHOICES, verbose_name='النوع')
    validity_days = models.IntegerField(verbose_name='عدد الايام')
    validity_hours = models.IntegerField(verbose_name='عدد الساعات')
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='السعر')

    def __str__(self):
        return f'{self.color} {self.type} Card'

class SoldCards(models.Model):
    parent = models.ForeignKey(Parent, related_name='cards', on_delete=models.PROTECT, verbose_name='الأب')
    card = models.ForeignKey(Card, on_delete=models.PROTECT, verbose_name='البطاقة')
    sold_date = models.DateField(auto_now_add=True, verbose_name='تاريخ الشراء')
    expiry_date = models.DateField(verbose_name='تاريخ الانتهاء')
    remaining_hours = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='الساعات المتبقية')

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
    card = models.ForeignKey(SoldCards, related_name='card_consumptions', on_delete=models.PROTECT, verbose_name='البطاقة')
    attendance = models.ForeignKey(Attendance, related_name='card_consumptions', on_delete=models.PROTECT, verbose_name='الحضور')
    number_of_consumed_hours = models.DecimalField(max_digits=5, decimal_places=2, verbose_name='عدد الساعات المخصومة')


    def __str__(self):
        return f'{self.number_of_consumed_hours} hours from {self.card}'

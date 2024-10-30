from django.db import models
from attendance.models import Attendance



class MarketItem(models.Model):
    name = models.CharField(max_length=150)

    quantity = models.IntegerField()
    price = models.IntegerField()

    def __str__ (self):
        return f'{self.name}'



class SoldItems(models.Model):
    attendance = models.ForeignKey(Attendance, related_name='purchased_items', on_delete=models.PROTECT)
    item = models.ForeignKey(MarketItem, related_name='sold', on_delete=models.PROTECT)
    quantity_sold = models.IntegerField()
    selling_price = models.IntegerField()
    notes = models.CharField(max_length=150, null=True, blank=True)


    def __str__(self):
        return f'{self.item} -> {self.attendance}'
        
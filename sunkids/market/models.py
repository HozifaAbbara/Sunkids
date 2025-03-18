from django.db import models
from attendance.models import Attendance



class MarketItem(models.Model):
    name = models.CharField(max_length=150, verbose_name='اسم المادة')

    quantity = models.IntegerField(verbose_name='الكمية')
    price = models.IntegerField(verbose_name='السعر')

    def __str__ (self):
        return f'{self.name}'



class SoldItems(models.Model):
    attendance = models.ForeignKey(Attendance, related_name='purchased_items', on_delete=models.PROTECT, verbose_name='الحضور')
    item = models.ForeignKey(MarketItem, related_name='sold', on_delete=models.PROTECT, verbose_name='المادة')
    quantity_sold = models.IntegerField(verbose_name='الكمية')
    selling_price = models.IntegerField(verbose_name='السعر الافردي')
    notes = models.CharField(max_length=150, null=True, blank=True, verbose_name='ملاحظات')


    def __str__(self):
        return f'{self.item} -> {self.attendance}'
        
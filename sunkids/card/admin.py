from django.contrib import admin
from .models import *


admin.site.register(Card)
admin.site.register(SoldCards)
admin.site.register(CardConsumption)
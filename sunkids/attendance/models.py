from django.db import models
from child.models import Child, Relationship
from account.models import Employee
# from card.models import CardConsumption
from decimal import Decimal
from django.db.models import Sum
from django.core.exceptions import ObjectDoesNotExist
from django.apps import apps



ADDITIONAL_ART_PRICE = 300

class HourPricing(models.Model):
    class Rank(models.TextChoices):
        FIRST_PLAY = 'First Play'
        SECOND_PLAY = 'Second Play'
        THIRD_PLAY = 'Third Play'
        FIRST_ART = 'First Art'
        SECOND_ART = 'Second Art'
        THIRD_ART = 'Third Art'

    rank = models.CharField(max_length=20, choices=Rank.choices, unique=True, verbose_name='ترتيب الساعة')
    price = models.IntegerField(verbose_name='السعر')




class Attendance(models.Model):
    child = models.ForeignKey(Child, related_name='attendances', on_delete=models.PROTECT, verbose_name='الطفل')
    date = models.DateField(auto_now_add=True, verbose_name="التاريخ")
    
    entry_time = models.DateTimeField(verbose_name='وقت الدخول')
    bringer = models.ForeignKey(Relationship, related_name='children_bringed', on_delete=models.PROTECT, verbose_name='محضر الطفل')
    employee_in = models.ForeignKey(Employee, related_name='children_entered', on_delete=models.PROTECT, verbose_name='الموظف المستلم')

    exit_time = models.DateTimeField(null = True, blank = True, verbose_name='وقت الخروج')
    taker = models.ForeignKey(Relationship, related_name='children_taken', on_delete=models.PROTECT, null = True, blank = True, verbose_name='آخذ الطفل')
    employee_out = models.ForeignKey(Employee, related_name='children_exited', on_delete=models.PROTECT, null = True, blank = True, verbose_name='المسلم')

    total_hours_stayed = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, verbose_name='اجمالي الساعات')
    number_of_art_hours = models.DecimalField(max_digits=2, decimal_places=1, null=True, blank=True, verbose_name='ساعات الفنون')

    hours_deducted_from_card = models.DecimalField(max_digits=2, decimal_places=1, default=0, verbose_name='عدد الساعات المخصومة من البطاقة')

    total_purchased_items = models.IntegerField(default=0, verbose_name='مجموع المشتريات')
    total_hours_due = models.IntegerField(null=True, blank=True, verbose_name='مجموع الساعات')

    total_amount_to_receive = models.IntegerField(null=True, blank=True, verbose_name='الاجمالي')    


    def save(self, *args, **kwargs):
        # Calculate total purchased items amount
        self.total_purchased_items = self.purchased_items.aggregate(total=Sum('selling_price'))['total'] or Decimal('0.00')

        if self.exit_time:
            # Calculate total hours stayed
            time_diff = self.exit_time - self.entry_time
            self.total_hours_stayed = Decimal(time_diff.total_seconds() / 3600)
            self.total_hours_stayed += Decimal(1) if ((time_diff.total_seconds() % 3600) / 60 > 15) else Decimal(0)

            # Fetch latest card if available
            latest_card = self.child.parent.cards.first()

            card_hours_to_deduct = Decimal(0)
            cash_hours_to_charge = Decimal(0)
            additional_art_fee = Decimal(0)
            card_hours_to_deduct = Decimal(0)
            art_hours_to_deduct = Decimal(0)


            if latest_card:
                if latest_card.card.type == 'ART':
                    # Deduct all hours (play and art) from the art card
                    card_hours_to_deduct = min(self.total_hours_stayed, latest_card.remaining_hours)
                    latest_card.remaining_hours -= card_hours_to_deduct
                    latest_card.save()

                elif latest_card.card.type == 'PLAY':
                    if self.number_of_art_hours:
                        # Deduct all hours, but add extra charge for art hours
                        play_hours_to_deduct = min(self.total_hours_stayed - self.number_of_art_hours, latest_card.remaining_hours)
                        art_hours_to_deduct = min(self.number_of_art_hours, latest_card.remaining_hours - play_hours_to_deduct)

                        card_hours_to_deduct = play_hours_to_deduct + art_hours_to_deduct
                        latest_card.remaining_hours -= card_hours_to_deduct
                        latest_card.save()

                        additional_art_fee = art_hours_to_deduct * ADDITIONAL_ART_PRICE


            # Calculate cash charges based on HourPricing if no card is present
            cash_hours_to_charge = self.calculate_cash_hours(self.total_hours_stayed - self.number_of_art_hours - play_hours_to_deduct, 
                                                             self.number_of_art_hours - art_hours_to_deduct)

            self.hours_deducted_from_card = card_hours_to_deduct
            self.total_amount_to_receive = cash_hours_to_charge + additional_art_fee + self.total_purchased_items
            
            CardConsumption = apps.get_model('card', 'CardConsumption')
            # Create card consumption entry
            if card_hours_to_deduct > 0:
                CardConsumption.objects.create(card=latest_card, attendance=self, number_of_consumed_hours=card_hours_to_deduct)

        super().save(*args, **kwargs)


    def calculate_cash_hours(self, number_of_art_hours, number_of_play_hours):
        total_cost = Decimal('0.00')

        # Define ranks for play and art hours
        play_ranks = ['FIRST_PLAY', 'SECOND_PLAY', 'THIRD_PLAY']
        art_ranks = ['FIRST_ART', 'SECOND_ART', 'THIRD_ART']

        # Get pricing for play hours
        play_prices = []
        for rank in play_ranks:
            try:
                play_prices.append(HourPricing.objects.get(rank=rank).price)
            except ObjectDoesNotExist:
                play_prices.append(0)  # Default to 0 if the rank isn't found

        # Get pricing for art hours
        art_prices = []
        for rank in art_ranks:
            try:
                art_prices.append(HourPricing.objects.get(rank=rank).price)
            except ObjectDoesNotExist:
                art_prices.append(0)  # Default to 0 if the rank isn't found

        # Calculate play hours cost
        for i in range(number_of_play_hours):
            if i < 3:
                total_cost += Decimal(play_prices[i])
            else:
                total_cost += Decimal(play_prices[2])  # Use the third-hour price for additional hours

        # Calculate art hours cost
        for i in range(number_of_art_hours):
            if i < 3:
                total_cost += Decimal(art_prices[i])
            else:
                total_cost += Decimal(art_prices[2])  # Use the third-hour price for additional hours

        return total_cost


    def __str__(self):
        return f'{self.child} -> {self.date}'
    


    # def save(self, *args, **kwargs):
    #     if self.exit_time:
    #         time_diff = self.exit_time - self.entry_time
    #         self.total_hours_stayed = time_diff.total_seconds() / 3600

    #         # CHECK HALF AN HOUR LOGIC WITH ABO ABDO #@!!#@#@#@#!@#!@#@!@#!#!@#@!!@#@!##!@#@!#@!#!@@!#@#!#!#!#@!@#!#!@!@#!@#@!#@#!
    #         self.total_hours_stayed += 1 if ((time_diff.total_seconds % 3600) / 60 > 15) else 0

    #         latest_card = self.child.parent.cards.first()
    #         card = None

    #         if latest_card and latest_card.expiry_date >= self.date and latest_card.remaining_hours > 0:
    #             card = latest_card

    #         if card:
    #             # Deduct hours based on available card hours
    #             self.hours_deducted_from_card = min(self.total_hours_stayed, card.remaining_hours)
    #             card.remaining_hours -= self.hours_deducted_from_card
    #             card.save()

    #             # Create a CardConsumption entry
    #             CardConsumption.objects.create(
    #                 card=card,
    #                 attendance=self,
    #                 number_of_consumed_hours=self.hours_deducted_from_card
    #             )

    #         # Calculate total purchased items amount
    #         self.total_purchased_items = self.purchased_items.aggregate(total=Sum('selling_price'))['total'] or Decimal('0.00')

    #         # check the type of hours and type of card then make the neccessary calculations
            

    #     super().save(*args, **kwargs)


    


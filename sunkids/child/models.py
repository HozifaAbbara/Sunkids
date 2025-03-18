from django.db import models
from account.models import Parent, Account


GENDER_CHOICES = {
        'MALE': 'Male',
        'FEMALE': 'Female'
    }


class Child(models.Model):

    parent = models.ForeignKey(Parent, related_name='children', on_delete=models.PROTECT, verbose_name="الأب أو الأم")
    first_name = models.CharField(max_length=100, verbose_name='الاسم الاول')
    last_name = models.CharField(max_length=100, verbose_name='الاسم الاخير')

    date_of_birth = models.DateField(verbose_name='تاريخ الميلاد')

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, verbose_name='الجنس')
    address = models.CharField(max_length=255, verbose_name='العنوان')
    school = models.CharField(max_length=255, blank=True, null=True, verbose_name='المدرسة')

    notes = models.CharField(max_length=255, blank=True, null=True, verbose_name='ملاحظات')

    def __str__(self):
        return f'{self.first_name} {self.last_name}'


class Relationship(models.Model):

    RELATIONSHIP_CHOICES = {
        'FATHER': 'Father',
        'MOTHER': 'Mother',
        'GRAND_FATHER': 'Grand Father',
        'GRAND_MOTHER': 'Grand Mother',
        'COUSINE': 'Cousine',
        'AUNT': 'Aunt',
        'UNCLE': 'Uncle',
    }

    relative = models.ForeignKey(Account, related_name='relatives', on_delete=models.PROTECT, verbose_name='القريب')
    child = models.ForeignKey(Child, related_name='relatives', on_delete=models.PROTECT, verbose_name='الطفل')
    relationship = models.CharField(max_length=50, choices=RELATIONSHIP_CHOICES, verbose_name='صلة القرابة بالنسبة للطفل')

    def __str__(self):
        return f'{self.relative} -> {self.relationship} -> {self.child}'
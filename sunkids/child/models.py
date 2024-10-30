from django.db import models
from account.models import Parent, Account


GENDER_CHOICES = {
        'MALE': 'Male',
        'FEMALE': 'Female'
    }


class Child(models.Model):

    parent = models.ForeignKey(Parent, related_name='children', on_delete=models.PROTECT)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)

    date_of_birth = models.DateField()

    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    address = models.CharField(max_length=255)
    school = models.CharField(max_length=255)

    notes = models.CharField(max_length=255)

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

    relative = models.ForeignKey(Account, related_name='relatives', on_delete=models.PROTECT)
    child = models.ForeignKey(Child, related_name='relatives', on_delete=models.PROTECT)
    relationship = models.CharField(max_length=50, choices=RELATIONSHIP_CHOICES)

    def __str__(self):
        return f'{self.relative} -> {self.relationship} -> {self.child}'
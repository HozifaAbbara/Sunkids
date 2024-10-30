from django.db import models
from django.contrib.auth.models import AbstractUser
from phonenumber_field.modelfields import PhoneNumberField

class Account(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'Admin'
        EMPLOYEE = 'Employee'
        PARENT = 'Parent'

    class Gender(models.TextChoices):
        MALE = 'Male'
        FEMALE = 'Female'

        
    USERNAME_FIELD = 'username'


    phone_number = PhoneNumberField(unique=True)
    role = models.CharField(max_length=15, choices=Role.choices, default=Role.ADMIN)
    gender = models.CharField(max_length=15, choices=Gender.choices)

    def __str__ (self):
        return f'{self.first_name} {self.last_name}'

class Employee(models.Model):
    account = models.OneToOneField(Account, on_delete=models.PROTECT, related_name='employee_profile')

    join_date = models.DateField()

    resignation_date = models.DateField(null=True, blank=True)

    emergency_contact_name = models.CharField(max_length=150)
    emergency_contact_phone = PhoneNumberField()

    def __str__(self):
        return f'Employee: {self.account}'


class Parent(models.Model):
    account = models.OneToOneField(Account, on_delete=models.PROTECT, related_name='parent_profile')
    nationality = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    work_phone = models.CharField(max_length=15, blank=True)

    def __str__(self):
        return f'Parent: {self.account}'
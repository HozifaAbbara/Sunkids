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


    phone_number = PhoneNumberField(unique=True, verbose_name='رقم الهاتف')
    role = models.CharField(max_length=15, choices=Role.choices, default=Role.ADMIN, verbose_name='الدور')
    gender = models.CharField(max_length=15, choices=Gender.choices, verbose_name='الجنس')

    def __str__ (self):
        return f'{self.first_name} {self.last_name}'

class Employee(models.Model):
    account = models.OneToOneField(Account, on_delete=models.PROTECT, related_name='employee_profile', verbose_name='الحساب')

    join_date = models.DateField(verbose_name='تاريخ الانضمام')

    resignation_date = models.DateField(null=True, blank=True, verbose_name='تاريخ الاستقالة')

    emergency_contact_name = models.CharField(max_length=150, verbose_name='جهة اتصال الطوارئ')
    emergency_contact_phone = PhoneNumberField(verbose_name='رقم اتصال الطوارئ')

    def __str__(self):
        return f'Employee: {self.account.__str__}'


class Parent(models.Model):
    account = models.OneToOneField(Account, on_delete=models.PROTECT, related_name='parent_profile', verbose_name='الحساب')
    nationality = models.CharField(max_length=50, verbose_name='الجنسية')
    address = models.CharField(max_length=255, verbose_name='العنوان')
    work_phone = models.CharField(max_length=15, blank=True, verbose_name='هاتف العمل')

    def __str__(self):
        return f'Parent: {self.account.__str__()}'
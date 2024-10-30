from rest_framework import serializers
from .models import Account, Employee, Parent
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Call the superclass to get the token
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        token['role'] = user.role  # Make sure the 'role' is defined in your Account model

        return token


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'password', 'first_name', 'last_name', 'phone_number', 'gender', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        first_name = validated_data.pop('first_name')
        last_name = validated_data.pop('last_name')
        username = f'{first_name}_{last_name}'
        account = Account(username=username, **validated_data)
        if password:
            account.set_password(password)
        account.save()
        return account

class EmployeeSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Employee
        fields = ['account', 'join_date', 'resignation_date', 'emergency_contact_name', 'emergency_contact_phone']

    def create(self, validated_data):
        account_data = validated_data.pop('account')
        account_data['role'] = Account.Role.EMPLOYEE  # Set role internally, not exposed to API
        account = AccountSerializer().create(account_data)
        employee = Employee.objects.create(account=account, **validated_data)
        return employee

class ParentSerializer(serializers.ModelSerializer):
    account = AccountSerializer()

    class Meta:
        model = Parent
        fields = ['account', 'address', 'work_phone']

    def create(self, validated_data):
        account_data = validated_data.pop('account')
        account_data['role'] = Account.Role.PARENT  # Set role internally, not exposed to API
        account = AccountSerializer().create(account_data)
        parent = Parent.objects.create(account=account, **validated_data)
        return parent

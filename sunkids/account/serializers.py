from rest_framework import serializers
from .models import Account, Employee, Parent
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        # Call the superclass to get the token
        token = super().get_token(user)

        # Add custom claims
        token['user_name'] = user.username
        token['role'] = user.role  # Make sure the 'role' is defined in your Account model

        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add extra user details to response data
        data["user_name"] = self.user.username
        data["role"] = self.user.role

        return data


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ['id', 'password', 'first_name', 'last_name', 'phone_number', 'gender', 'is_staff']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
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
    account = AccountSerializer()  # Keep as an object for POST requests

    # Fields from `Account` (flattening for GET request)
    id = serializers.IntegerField(source="account.id", read_only=True)
    username = serializers.CharField(source="account.username", read_only=True)
    first_name = serializers.CharField(source="account.first_name", read_only=True)
    last_name = serializers.CharField(source="account.last_name", read_only=True)
    phone_number = serializers.CharField(source="account.phone_number", read_only=True)
    gender = serializers.CharField(source="account.gender", read_only=True)
    is_staff = serializers.BooleanField(source="account.is_staff", read_only=True)

    class Meta:
        model = Parent
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "phone_number",
            "gender",
            "is_staff",
            "nationality",
            "address",
            "work_phone",
            "account",  # Keep it for POST request
        ]

    def create(self, validated_data):
        """Handle POST request: Send account as an object"""
        account_data = validated_data.pop("account")  # Extract account data
        account_data["role"] = Account.Role.PARENT  # Set role internally
        account = AccountSerializer().create(account_data)
        parent = Parent.objects.create(account=account, **validated_data)
        return parent
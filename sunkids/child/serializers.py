from rest_framework.serializers import ModelSerializer
from .models import *



class ChildSerializer(ModelSerializer):
    class Meta:
        model = Child
        fields = '__all__'


class RelationshipSerializer(ModelSerializer):
    class Meta:
        model = Relationship
        fields = '__all__'
from dataclasses import fields
from system.models import User, DecisionTreePool # import user class from models.py
from rest_framework import serializers

'''Serializer for User models'''
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        #fields = ('id', 'email', 'name', 'income')

class DTPSerializer(serializers.ModelSerializer):
    class Meta:
        model = DecisionTreePool
        fields = '__all__'
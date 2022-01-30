
from rest_framework import serializers
from .models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool
import json


class ReadbleRule(serializers.CharField):
    def to_representation(self, value):
        return Rule(value).Partial(
            ['variable', 'name', 'datatype', 'operator', 'value'])
class VariableLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = VariableLibrary
        # fields = '__all__'
        fields = ['id', 'name']


class VariablePoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = VariablePool
        fields = ['id', 'name', 'datatype']
        # fields = '__all__'


class ScoreCardLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoreCardLibrary
        fields = '__all__'


class ScoreCardPoolSerializer(serializers.ModelSerializer):
    rule = ReadbleRule()

    class Meta:
        model = ScoreCardPool
        fields = ['id', 'rule', 'weight', 'score']


class DecisionTreeLibrarySerializer(serializers.ModelSerializer):  
    class Meta:
        model = DecisionTreeLibrary
        fields = '__all__'


class DecisionTreePoolSerializer(serializers.ModelSerializer):
    rule = ReadbleRule()
    class Meta:
        model = DecisionTreePool
        fields = ['id', 'rule', 'log', 'prev_id']

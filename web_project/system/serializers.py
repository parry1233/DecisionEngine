
from rest_framework import serializers
from .models import Rule, RuleSetLibrary, RuleSetPool, ScoreCardLibrary, ScoreCardPool, VariableLibrary, VariablePool, DecisionTreeLibrary, DecisionTreePool, Action
import json
from . import static


class ReadableRule(serializers.CharField):
    def to_representation(self, value):
        rule = Rule(value).Partial(
            ['variable', 'name', 'datatype', 'operator', 'value'])
        return rule


class ReadableAction(serializers.CharField):
    def to_representation(self, value):
        return Action(value).Partial()


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
    rule = ReadableRule()

    class Meta:
        model = ScoreCardPool
        fields = ['id', 'rule', 'weight', 'score', 'description']


class DecisionTreeLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = DecisionTreeLibrary
        fields = '__all__'


class DecisionTreePoolSerializer(serializers.ModelSerializer):
    rule = ReadableRule()

    class Meta:
        model = DecisionTreePool
        fields = ['id', 'rule', 'log', 'prev_id']


class RuleSetLibrarySerializer(serializers.ModelSerializer):
    class Meta:
        model = RuleSetLibrary
        fields = '__all__'


class RuleSetPoolSerializer(serializers.ModelSerializer):
    rule = ReadableRule()
    action = ReadableAction()
    naction = ReadableAction()

    class Meta:
        model = RuleSetPool
        fields = ['id', 'rule', 'action', 'naction']

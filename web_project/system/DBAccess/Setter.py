from system.models import Rule, URule, ScoreCardLibrary, ScoreCardPool, VariablePool, DecisionTreeLibrary, DecisionTreePool
from django.http import JsonResponse


def SC_SaveRule(fkey, rule, weight, score):
    scoreboard = ScoreCardPool()
    scoreboard.fkey = fkey
    scoreboard.rule = rule
    scoreboard.weight = weight
    scoreboard.score = score
    scoreboard.save()

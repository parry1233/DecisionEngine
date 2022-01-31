from email.policy import default
from django.contrib import admin
from django import forms
from . import static
from django.contrib.admin.helpers import ActionForm
from .models import VariableLibrary, VariablePool, ScoreCardLibrary, ScoreCardPool, DecisionTreeLibrary, DecisionTreePool, RuleSetLibrary,RuleSetPool
import copy

# Register your models here.
admin.site.register(VariableLibrary)
admin.site.register(VariablePool)
admin.site.register(ScoreCardLibrary)
admin.site.register(ScoreCardPool)
admin.site.register(DecisionTreeLibrary)
admin.site.register(RuleSetLibrary)
admin.site.register(RuleSetPool)


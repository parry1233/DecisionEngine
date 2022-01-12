from django.contrib import admin
from django import forms
from . import static
from django.contrib.admin.helpers import ActionForm
from .models import VariableLibrary, VariablePool, ScoreCardLibrary, ScoreCardPool, DecisionTreeLibrary, DecisionTreePool
from .models import System

# Register your models here.
admin.site.register(VariableLibrary)
admin.site.register(VariablePool)
admin.site.register(ScoreCardLibrary)
admin.site.register(ScoreCardPool)
admin.site.register(DecisionTreeLibrary)
admin.site.register(DecisionTreePool)

# @admin.register(ScoreCardPool)
# class ScoreCardPoolAdmin(admin.ModelAdmin):
#     class XForm(ActionForm):
#         variable = forms.ModelChoiceField(queryset=VariablePool.objects.all())
#         operator = forms.ChoiceField(choices=static.OPERATOR)
#         value = forms.CharField(
#             max_length=20, help_text='Value')
#     action_form = XForm
#     actions = [AddRules]

class SystemAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'status')

admin.site.register(System, SystemAdmin)
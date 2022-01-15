from email.policy import default
from django.contrib import admin
from django import forms
from . import static
from django.contrib.admin.helpers import ActionForm
from .models import VariableLibrary, VariablePool, ScoreCardLibrary, ScoreCardPool, DecisionTreeLibrary, DecisionTreePool
import copy

# Register your models here.
admin.site.register(VariableLibrary)
admin.site.register(VariablePool)
admin.site.register(ScoreCardLibrary)
admin.site.register(DecisionTreeLibrary)


@admin.register(DecisionTreePool)
class DecisionTreePoolAdmin(admin.ModelAdmin):
    @admin.action(description='duplicate')
    def duplicate(modeladmin, request, query):
        for course in query:
            course_copy = copy.copy(course)  # django copy object
            course_copy.id = None   # set 'id' to None to create new object
            course_copy.save()

    @admin.action(description='update prev')
    def update_prev(modeladmin, request, query):
        query.update(prev=request.POST['prev'])

    class XForm(ActionForm):
        prev = forms.ModelChoiceField(
            queryset=DecisionTreePool.objects.all(), required=False)
    action_form = XForm
    save_as = True
    actions = ['duplicate', 'update_prev']


@admin.register(ScoreCardPool)
class ScoreCardPoolAdmin(admin.ModelAdmin):
    @admin.action(description='duplicate')
    def duplicate(modeladmin, request, query):
        for course in query:
            course_copy = copy.copy(course)  # django copy object
            course_copy.id = None   # set 'id' to None to create new object
            course_copy.save()
    actions = ['duplicate']

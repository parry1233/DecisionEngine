from django.urls import path

from . import views
from system.DBAccess import Setter

urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="ScoreCardView"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/",
         views.DecisionTreeView, name="DecisionTreeView"),
    path("VariableOperation/", views.VariableOperation, name="VariableOperation"),
    path("ScoreCardOperation/", views.ScoreCardOperation,
         name="ScoreCardOperation"),
    path("DBAccess/", views.DBAccess, name="DBAccess"),
]

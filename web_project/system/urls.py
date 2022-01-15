from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="ScoreCardView"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/",
         views.DecisionTreeView, name="DecisionTreeView"),
]

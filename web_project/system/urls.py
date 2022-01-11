from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="scorecard_view"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/", views.DecisionTreeView, name='DecisionTreeView'),
    # path('<id>', views.ScoreCardView, name='scorecard_view'),
]

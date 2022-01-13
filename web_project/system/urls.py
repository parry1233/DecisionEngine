from django.urls import path
from . import views


urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="scorecard_view"),
    path("ScoreCard/test/<id>/", views.ScoreCardView2, name="ScoreCardView2"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/", views.DecisionTreeView, name='DecisionTreeView'),
    path("DecisionTree/test/<id>/", views.DecisionTreeView2, name="DecisionTreeView2"),
    # path('<id>', views.ScoreCardView, name='scorecard_view'),
]

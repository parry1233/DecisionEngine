from django.urls import path, include

from . import views
from system.DBAccess import Setter

from rest_framework import routers
USERrouter = routers.DefaultRouter()
USERrouter.register(r'users',views.UserView,'user')
#DTProuter = routers.DefaultRouter()
#DTProuter.register(r'dtps',views.DTPView,'dtp')

urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="ScoreCardView"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/",
         views.DecisionTreeView, name="DecisionTreeView"),
    path("ScoreBoardOperation/", views.ScoreBoardOperation, name="ajax_example"),
    path("DBAccess/", views.DBAccess, name="DBAccess"),
    path('Account/',include(USERrouter.urls)),
    path('Decision/',views.DTPool.as_view()),
    path('SC/',views.ScoreCard.ScoreCardList),
    path('SC/<id>/',views.ScoreCard.ScoreCardView),
    path('DT/',views.DecisionTree.DecisionTreeList),
    path('DT/<id>/',views.DecisionTree.DecisionTreeView),
]

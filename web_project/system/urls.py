from django.urls import path, include

from . import views
from system.DBAccess import Setter
from rest_framework.routers import DefaultRouter
from django.conf.urls import include

router = DefaultRouter()
router.register(r'VariableLibrary', views.VariableLibViewSet)
router.register(r'VariablePool', views.VariablePoolViewSet)
router.register(r'ScoreCardLibrary', views.ScoreCardLibViewSet)
router.register(r'ScoreCardPool', views.ScoreCardPoolViewSet)
router.register(r'DecisionTreeLibrary', views.DecisionTreeLibViewSet)
router.register(r'DecisionTreePool', views.DecisionTreePoolViewSet)
router.register(r'RuleSetLibrary', views.RuleSetLibViewSet)
router.register(r'RuleSetPool', views.RuleSetPoolViewSet)

from rest_framework import routers
USERrouter = routers.DefaultRouter()
#USERrouter.register(r'users',views.UserView,'user')
#DTProuter = routers.DefaultRouter()
#DTProuter.register(r'dtps',views.DTPView,'dtp')

urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="ScoreCardView"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/",
         views.DecisionTreeView, name="DecisionTreeView"),
    path("staticdt/<category>/", views.StaticData, name="StaticData"),
    path("api/", include(router.urls)),
    path("RuleSetEngine/",
         views.RuleSetEngine, name=""),
    path("ScoreCardEngine/",
         views.ScoreCardEngine, name=""),
    path("DecisionTreeEngine/",
         views.DecisionTreeEngine, name=""),
    path("DecisionTreeJsmind/",
         views.DecisionTreeViewJSMindStructure, name=""),
]

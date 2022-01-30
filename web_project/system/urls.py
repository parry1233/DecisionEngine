from django.urls import path

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

urlpatterns = [
    path("", views.index, name="home"),
    path("ScoreCard/", views.ScoreCardList, name="ScoreCardList"),
    path("ScoreCard/<id>/", views.ScoreCardView, name="ScoreCardView"),
    path("DecisionTree/", views.DecisionTreeList, name='DecisionTreeList'),
    path("DecisionTree/<id>/",
         views.DecisionTreeView, name="DecisionTreeView"),
    path("staticdt/<category>/", views.StaticData, name="StaticData"),
    path("api/", include(router.urls)),
]

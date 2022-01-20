"""web_project URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from django.views.generic import RedirectView
from system import views
from rest_framework import routers

#DTProuter = routers.DefaultRouter()
#DTProuter.register(r'DTPs',views.DecisionTreeView,'DTP')
#UserRouter = routers.DefaultRouter()
#UserRouter.register(r'users',views.UserView,'user')

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', RedirectView.as_view(url='/ScoreCard/')),
    path("", include('system.urls'), name="home"),
    # path("ScoreCard/", include('system.urls'), name="ScoreCard"),
    # path("DecisionTree/", include('system.urls'), name="DecisionTree"),
    #path('users/', views.UserView.as_view()),
]

"""core URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
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
from django.urls import path, include
from main import views as mviews
from editor import views as eviews
from files import views as fviews
from posts import views as pviews

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('users/', include('django.contrib.auth.urls')),
    path('', mviews.index, name='index'),
    path('home/', mviews.home, name='home'),
    path('upnav/', mviews.refreshNav, name='nav'),
    path('uptagednav/', mviews.refreshtagedNav, name='tagednav'),
    path('upsearchnav/<path:cont>', mviews.refreshsearchNav, name='searcgnav'),
    path('upfile/', fviews.uploadPage, name='uploadpage'),
    path('download/<path:fp>', fviews.downFiles, name='download'),
    path('upload/', fviews.upload, name='upload'),
    path('files/<path:fp>/', fviews.viewFiles, name='viewfiles'),
    path('removefile/<path:fp>/', fviews.removeFile, name='removefile'),
    path('updatefile/<path:fp>/', fviews.updateFile, name='updatefile'),
    path('setpost/', pviews.setPost, name='setpost'),
    path('updatepost/<path:fp>/', pviews.updatePost, name='updatepost'),
    path('removepost/<path:fp>/', pviews.removePost, name='removepost'),
    path('validpost/', pviews.validPost, name='validpost'),
    path('savecache/', pviews.saveCache, name='savecache'),
    path('posts/', include('posts.urls')),
    path('preview/<path:route>', mviews.preview, name='preview'),
    path('preview_table/<path:route>', mviews.preview_table, name='preview_table'),
    path('edit/', include('editor.urls')),
]

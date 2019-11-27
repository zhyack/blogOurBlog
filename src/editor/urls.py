from django.urls import path
from . import views

app_name = 'editor'
urlpatterns = [
    path('<path:fp>/', views.mainpage, name='editor'),
]

from django.urls import path
from . import views

app_name = 'posts'
urlpatterns = [
    path('<path:fp>/', views.viewPosts),
]

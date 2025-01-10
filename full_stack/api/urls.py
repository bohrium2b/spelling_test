from django.urls import path
from . import views

urlpatterns = [
    path('next/', views.next, name='next'),
    path('sounds/<str:sound>/', views.sound, name='sound'),
    path('word/<str:word>/', views.word, name='word'),
    # Add more URL patterns here based on your views
]
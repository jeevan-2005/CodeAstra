from django.urls import path
from .views import *

urlpatterns = [
    path('problems/', ProblemListApiView.as_view(), name='problem-list'),
    path('tags/', TagListApiView.as_view(), name='tag-list'),

    path('problems/<int:pk>/', ProblemDetailApiView.as_view(), name='problem-detail'),
    path('tags/<int:pk>/', TagDetailApiView.as_view(), name='tag-detail'),
]
from django.urls import path
from .views import *

urlpatterns = [
    path('execute/run/', RunCustomTestCaseView.as_view(), name='code-execution'),
    path('execute/submit/', SubmitCodeView.as_view(), name='code-judge'),
    path('save-code/', SaveCodeView.as_view(), name="save-code"),
]

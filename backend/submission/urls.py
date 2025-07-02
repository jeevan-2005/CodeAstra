from django.urls import path
from .views import *

urlpatterns = [
    path('execute/run/', RunCustomTestCaseView.as_view(), name='code-execution'),
    path('execute/submit/', SubmitCodeView.as_view(), name='code-judge'),
    path('save-code/', SaveCodeView.as_view(), name="save-code"),
    path('ai-review/', AiCodeReview.as_view(), name="ai-review"),
    path('submissions/<int:user_id>', getUserSubmissions.as_view(), name="get-user-submissions"),
    path('submissions/<int:user_id>/<str:problem_name>', getUserSubmissionByProblemId.as_view(), name="get-user-submissions-by-problem-id"),
]
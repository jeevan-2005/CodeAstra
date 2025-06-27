from django.db import models

# Create your models here.
class SubmissionModel(models.Model):

    LANGUAGE_CHOICES = [
        ('py', 'Python'),
        ('java', 'Java'),
        ('cpp', 'C++'),
        ('c', 'C'),
    ]

    VERDICT_CHOICES = [
        ('Accepted', 'Accepted'),
        ('Wrong Answer', 'Wrong Answer'),
        ('Runtime Error', 'Runtime Error'),
        ('Compilation Error', 'Compilation Error'),
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded'),
    ]

    language = models.CharField(max_length=4, choices=LANGUAGE_CHOICES)
    code = models.TextField()
    user_id = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='user_submissions')
    problem_id = models.ForeignKey('problems.Problem', on_delete=models.CASCADE, related_name='problem_submissions')
    timestamp = models.DateTimeField(auto_now_add=True)
    verdict = models.CharField(max_length=100, blank=True, null=True, choices=VERDICT_CHOICES)

    def __str__(self):
        return f"Submission made by {self.user_id.username} for the problem - {self.problem_id.problem_name}"
    

class CodeSaveModel(models.Model):
    code = models.TextField(blank=True, null=True)
    language = models.CharField(max_length=4, choices=SubmissionModel.LANGUAGE_CHOICES)
    user_id = models.ForeignKey('accounts.CustomUser', on_delete=models.CASCADE, related_name='user_code_saves')
    problem_id = models.ForeignKey('problems.Problem', on_delete=models.CASCADE, related_name='problem_code_saves')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Code saved by {self.user_id.username} for the problem - {self.problem_id.problem_name} - language - {self.language}"
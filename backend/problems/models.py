from django.db import models


# Create your models here.
class Tag(models.Model):
    tag = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.tag

class Problem(models.Model):

    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'),
        ('Medium',  'Medium'),
        ('Hard', 'Hard'),
    ]

    problem_name = models.CharField(max_length=100)
    problem_statement = models.TextField()
    constraints = models.TextField()
    code_template = models.TextField(blank=True, null=True)
    input_format = models.TextField(blank=True, null=True)
    output_format = models.TextField(blank=True, null=True)
    difficulty = models.CharField(max_length=6, choices=DIFFICULTY_CHOICES)
    tags = models.ManyToManyField(Tag)

    def __str__(self):
        return self.problem_name
    

class TestExample(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_examples')
    input_data = models.TextField()
    output_data = models.TextField()

    def __str__(self):
        return f"Example {self.id} for {self.problem.problem_name}"

class TestCase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='test_cases_files')
    input_data_file = models.CharField(max_length=255)
    output_data_file = models.CharField(max_length=255)

    def __str__(self):
        return f"Test case files for {self.problem.problem_name}"
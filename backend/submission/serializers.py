from rest_framework import serializers
from .models import SubmissionModel

class SubmissionSerializer(serializers.ModelSerializer):
    
    problem_name = serializers.SlugRelatedField(
        source='problem_id',
        slug_field='problem_name',
        read_only=True
    )
    
    class Meta:
        model = SubmissionModel
        fields = ['id', 'problem_name', 'language', 'code', 'timestamp', 'verdict', 'problem_id', 'time_taken', 'memory_taken']
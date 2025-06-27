from rest_framework import serializers

from .models import *

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class TestExampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestExample
        fields = '__all__'

class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = '__all__'

class ProblemDetialSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    test_examples = TestExampleSerializer(many=True, read_only=True)
    
    class Meta:
        model = Problem
        fields = '__all__'

class ProblemSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Problem
        fields = [ 'id' ,'problem_name', 'difficulty', 'tags']


import django_filters
from .models import Problem, Tag

class ProblemFilter(django_filters.FilterSet):

    difficulty = django_filters.CharFilter(field_name='difficulty', lookup_expr='iexact')
    
    tags = django_filters.ModelMultipleChoiceFilter(
        queryset=Tag.objects.all(),
        field_name='tags__tag',
        to_field_name='tag',
        lookup_expr='iexact',
        conjoined=False          # Use OR logic: problems matching TagA OR TagB
    )

    class Meta:
        model = Problem
        fields = ['difficulty', 'tags']
from .models import *
from rest_framework import generics
from .serializers import *
from .filters import ProblemFilter
# Create your views here.

class ProblemListApiView(generics.ListCreateAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    # filterset_fields = ['difficulty', 'tags__tag']
    filterset_class = ProblemFilter

class ProblemDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemDetialSerializer
    lookup_field = 'pk'

class TagListApiView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class TagDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'pk'

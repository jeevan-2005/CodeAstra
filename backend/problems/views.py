from .models import *
from rest_framework import generics
from .serializers import *
from .filters import ProblemFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
# Create your views here.

class ProblemListApiView(generics.ListCreateAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    # filterset_fields = ['difficulty', 'tags__tag']
    filterset_class = ProblemFilter

    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)


class ProblemDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemDetialSerializer
    lookup_field = 'pk'

    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

class TagListApiView(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

class TagDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    lookup_field = 'pk'

    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)


class TestCaseListApiView(generics.ListCreateAPIView):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer

    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)

class TestCaseDetailApiView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    lookup_field = 'pk'

    authentication_classes = [JWTAuthentication]
    permission_classes = (IsAuthenticated,)
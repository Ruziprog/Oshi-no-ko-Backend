from rest_framework import viewsets
from .models import Person
from .serializers import  PersonSerializer

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        talent_type = self.request.query_params.get('type', None)
        if talent_type:
            queryset = queryset.filter(talent_type=talent_type)
        return queryset
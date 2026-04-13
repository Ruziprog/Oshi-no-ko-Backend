from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Person
from .serializers import PersonSerializer


def talent_list(request):
    return render(request, 'straw_prod/talent_list.html')

@api_view(['GET', 'POST'])
def talent_api(request):
    if request.method == 'GET':
        talents = Person.objects.all()

        talent_type = request.GET.get('type')
        if talent_type:
            talents = talents.filter(talent_type=talent_type)

        serializer = PersonSerializer(talents, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
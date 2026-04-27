from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .models import Person
from .serializers import PersonSerializer
from rest_framework import viewsets


def talent_list(request):
    return render(request, 'straw_prod/talent_list.html')

@api_view(['GET', 'POST'])
def talent_api(request):
    if request.method == 'GET':
        talents = Person.objects.all()

        talent_type = request.GET.get('type')
        if talent_type:
            talents = talents.filter(talent_type=talent_type)

        page = request.GET.get('page', 1)
        page_size = request.GET.get('page_size', 10)
        
        paginator = Paginator(talents, page_size)
        
        try:
            paginated_talents = paginator.page(page)
        except PageNotAnInteger:
            paginated_talents = paginator.page(1)
        except EmptyPage:
            paginated_talents = paginator.page(paginator.num_pages)

        serializer = PersonSerializer(talents, many=True)
        return Response({
            'count': paginator.count,
            'total_pages': paginator.num_pages,
            'current_page': paginated_talents.number,
            'next': paginated_talents.has_next(),
            'previous': paginated_talents.has_previous(),
            'results': serializer.data
        })
    
    elif request.method == 'POST':
        serializer = PersonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        talent_type = self.request.query_params.get('type', None)
        if talent_type:
            queryset = queryset.filter(talent_type=talent_type)
        return queryset
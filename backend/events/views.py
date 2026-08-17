from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.db.models import Q

from .models import Event
from .serializers import EventSerializer, UserSerializer, UserRegistrationSerializer
from .permissions import IsOwner


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        refresh = RefreshToken.for_user(user)
        user_serializer = UserSerializer(user)
        
        return Response({
            'user': user_serializer.data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class EventViewSet(viewsets.ModelViewSet):
    serializer_class = EventSerializer
    permission_classes = (permissions.IsAuthenticated, IsOwner)

    def get_queryset(self):
        # User isolation: return events belonging ONLY to authenticated user
        queryset = Event.objects.filter(owner=self.request.user)
        
        # Search filter
        search_query = self.request.query_params.get('search', None)
        if search_query:
            queryset = queryset.filter(
                Q(title__icontains=search_query) | Q(description__icontains=search_query)
            )
            
        # Category filter
        category = self.request.query_params.get('category', None)
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)
            
        # Ordering support (default: target_date ascending)
        ordering = self.request.query_params.get('ordering', 'target_date')
        if ordering in ['target_date', '-target_date', 'title', '-title', 'created_at', '-created_at']:
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('target_date')
            
        return queryset

    def perform_create(self, serializer):
        # Automatically assign logged-in user as owner
        serializer.save(owner=self.request.user)

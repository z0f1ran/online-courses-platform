from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Category, Course, Lesson, Enrollment, UserProfile
from .serializers import CategorySerializer, CourseSerializer, LessonSerializer, EnrollmentSerializer, UserSerializer, UserProfileSerializer

# Создаем пользовательское разрешение для проверки статуса преподавателя
class IsInstructor(permissions.BasePermission):
    """
    Пользовательское разрешение для проверки, является ли пользователь преподавателем.
    """
    def has_permission(self, request, view):
        # Проверяем статус is_instructor в профиле
        return request.user.is_authenticated and hasattr(request.user, 'profile') and request.user.profile.is_instructor

# Create your views here.

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    def get_permissions(self):
        """
        Различные разрешения в зависимости от действия:
        - Создавать курсы могут только преподаватели
        - Редактировать/удалять могут только преподаватели-авторы курса
        - Просматривать могут все
        """
        if self.action in ['create']:
            permission_classes = [permissions.IsAuthenticated, IsInstructor]
        elif self.action in ['update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsInstructor]  # Дополнительно проверяем авторство в perform_update
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    def perform_update(self, serializer):
        # Проверяем, является ли пользователь автором курса
        course = self.get_object()
        if course.instructor != self.request.user:
            self.permission_denied(
                self.request,
                message="У вас нет разрешения на редактирование этого курса"
            )
        serializer.save()
    
    def perform_destroy(self, instance):
        # Проверяем, является ли пользователь автором курса
        if instance.instructor != self.request.user:
            self.permission_denied(
                self.request,
                message="У вас нет разрешения на удаление этого курса"
            )
        instance.delete()
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def enroll(self, request, pk=None):
        course = self.get_object()
        user = request.user
        
        # Check if user is already enrolled
        if Enrollment.objects.filter(user=user, course=course).exists():
            return Response({"detail": "User already enrolled in this course."}, 
                            status=status.HTTP_400_BAD_REQUEST)
        
        # Create enrollment
        enrollment = Enrollment.objects.create(user=user, course=course)
        serializer = EnrollmentSerializer(enrollment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated, IsInstructor])
    def my_courses(self, request):
        """
        Возвращает список курсов, созданных текущим преподавателем
        """
        courses = Course.objects.filter(instructor=request.user)
        serializer = self.get_serializer(courses, many=True)
        return Response(serializer.data)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer
    
    def get_permissions(self):
        """
        Различные разрешения в зависимости от действия:
        - Создавать/редактировать/удалять уроки могут только преподаватели-авторы курса
        - Просматривать могут все
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [permissions.IsAuthenticated, IsInstructor]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]
    
    def perform_create(self, serializer):
        # Проверяем, является ли пользователь автором курса
        course_id = self.request.data.get('course')
        try:
            course = Course.objects.get(id=course_id)
            if course.instructor != self.request.user:
                self.permission_denied(
                    self.request,
                    message="У вас нет разрешения на добавление уроков к этому курсу"
                )
            serializer.save()
        except Course.DoesNotExist:
            self.permission_denied(
                self.request,
                message="Указанный курс не существует"
            )
    
    def get_queryset(self):
        queryset = super().get_queryset()
        course_id = self.request.query_params.get('course_id', None)
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        return queryset

class EnrollmentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Enrollment.objects.filter(user=self.request.user)

class UserProfileViewSet(viewsets.ModelViewSet):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Пользователь может видеть только свой профиль
        return UserProfile.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def become_instructor(self, request):
        """
        Позволяет пользователю стать преподавателем
        """
        profile = request.user.profile
        profile.is_instructor = True
        profile.save()
        
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=request.data['password'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', '')
        )
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

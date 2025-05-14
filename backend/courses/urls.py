from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, CourseViewSet, LessonViewSet, EnrollmentViewSet, register_user, UserProfileViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'lessons', LessonViewSet)
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')
router.register(r'profile', UserProfileViewSet, basename='profile')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
] 
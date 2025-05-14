from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, Course, Lesson, Enrollment, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ('is_instructor',)

class UserSerializer(serializers.ModelSerializer):
    is_instructor = serializers.BooleanField(source='profile.is_instructor', read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'is_instructor')

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    instructor = UserSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    lessons_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = '__all__'
        extra_fields = ['instructor', 'category_name', 'lessons_count']
    
    def get_lessons_count(self, obj):
        return obj.lessons.count()
    
    def create(self, validated_data):
        validated_data['instructor'] = self.context['request'].user
        return super().create(validated_data)

class EnrollmentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    course = CourseSerializer(read_only=True)
    
    class Meta:
        model = Enrollment
        fields = '__all__' 
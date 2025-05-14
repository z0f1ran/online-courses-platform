import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'online_courses_project.settings')
django.setup()

from courses.models import Category

# Создаем категории
categories = [
    {'name': 'Программирование', 'description': 'Курсы по программированию на разных языках'},
    {'name': 'Дизайн', 'description': 'Курсы по графическому и веб-дизайну'},
    {'name': 'Маркетинг', 'description': 'Курсы по цифровому маркетингу'},
    {'name': 'Бизнес', 'description': 'Курсы по предпринимательству и бизнесу'},
    {'name': 'Иностранные языки', 'description': 'Курсы по изучению иностранных языков'}
]

print('Создание тестовых категорий...')

for category_data in categories:
    # Проверяем существование категории
    if not Category.objects.filter(name=category_data['name']).exists():
        Category.objects.create(**category_data)
        print(f"Создана категория: {category_data['name']}")
    else:
        print(f"Категория '{category_data['name']}' уже существует")

print('Все категории успешно созданы.')
print('Существующие категории:')
for category in Category.objects.all():
    print(f" - {category.name} (ID: {category.id})") 
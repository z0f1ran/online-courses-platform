# Руководство программиста
## Платформа онлайн-курсов

## Содержание

1. [Введение](#введение)
2. [Архитектура приложения](#архитектура-приложения)
3. [Требования к окружению](#требования-к-окружению)
4. [Установка и настройка](#установка-и-настройка)
   1. [Клонирование репозитория](#клонирование-репозитория)
   2. [Настройка бэкенда](#настройка-бэкенда)
   3. [Настройка фронтенда](#настройка-фронтенда)
5. [Структура проекта](#структура-проекта)
   1. [Бэкенд (Django)](#бэкенд-django)
   2. [Фронтенд (React)](#фронтенд-react)
6. [API документация](#api-документация)
7. [Разработка и расширение](#разработка-и-расширение)
   1. [Добавление новых моделей](#добавление-новых-моделей)
   2. [Расширение API](#расширение-api)
   3. [Создание новых компонентов](#создание-новых-компонентов)
8. [Развертывание](#развертывание)
   1. [Локальное развертывание](#локальное-развертывание)
   2. [Продакшн-развертывание](#продакшн-развертывание)
9. [Устранение неполадок](#устранение-неполадок)

## Введение

Данное руководство предназначено для разработчиков, которые будут поддерживать, модифицировать или расширять функциональность платформы онлайн-курсов. Документ содержит информацию об архитектуре приложения, процессе установки и настройки, а также рекомендации по дальнейшей разработке.

Платформа реализована как веб-приложение, построенное на основе следующих технологий:
- Бэкенд: Python, Django, Django REST Framework
- Фронтенд: JavaScript, React
- База данных: SQLite (для разработки), PostgreSQL (рекомендуется для продакшна)

## Архитектура приложения

Приложение построено на основе клиент-серверной архитектуры:

1. **Бэкенд** (сервер):
   - Django-приложение, предоставляющее REST API
   - Использует Django ORM для взаимодействия с базой данных
   - Обеспечивает аутентификацию и авторизацию пользователей
   - Реализует бизнес-логику приложения

2. **Фронтенд** (клиент):
   - Single Page Application (SPA) на React
   - Взаимодействует с бэкендом через API
   - Обеспечивает пользовательский интерфейс

3. **Взаимодействие клиента и сервера**:
   - Обмен данными в формате JSON
   - Аутентификация через токены
   - REST-архитектура API

## Требования к окружению

Для разработки и запуска приложения требуется следующее программное обеспечение:

1. **Для бэкенда**:
   - Python 3.11 или выше
   - pip (менеджер пакетов Python)
   - Виртуальное окружение Python (virtualenv или venv)

2. **Для фронтенда**:
   - Node.js 18 или выше
   - npm (менеджер пакетов JavaScript)

3. **Для разработки**:
   - Git
   - IDE или текстовый редактор (рекомендуется VS Code, PyCharm)
   - Postman или аналогичный инструмент для тестирования API

## Установка и настройка

### Клонирование репозитория

```bash
git clone <url-репозитория>
cd online_courses
```

### Настройка бэкенда

1. Создание и активация виртуального окружения:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

2. Установка зависимостей:

```bash
cd backend
pip install -r requirements.txt
```

3. Применение миграций базы данных:

```bash
python manage.py migrate
```

4. Создание суперпользователя (администратора):

```bash
python manage.py createsuperuser
```

5. Запуск сервера разработки:

```bash
python manage.py runserver
```

Бэкенд будет доступен по адресу: http://localhost:8000/

### Настройка фронтенда

1. Установка зависимостей:

```bash
cd frontend
npm install
```

2. Запуск сервера разработки:

```bash
npm start
```

Фронтенд будет доступен по адресу: http://localhost:3000/

## Структура проекта

### Бэкенд (Django)

```
backend/
├── online_courses_project/   # Основной проект Django
│   ├── __init__.py
│   ├── settings.py          # Настройки проекта
│   ├── urls.py              # Маршрутизация URL
│   ├── wsgi.py              # Интерфейс WSGI для развертывания
│   └── asgi.py              # Интерфейс ASGI для развертывания
├── courses/                  # Приложение для курсов
│   ├── migrations/          # Миграции базы данных
│   ├── __init__.py
│   ├── admin.py             # Настройки админ-панели
│   ├── apps.py              # Конфигурация приложения
│   ├── models.py            # Модели данных
│   ├── serializers.py       # Сериализаторы для API
│   ├── urls.py              # Маршруты API
│   └── views.py             # Обработчики запросов
├── media/                    # Загруженные пользователями файлы
├── manage.py                 # Скрипт управления Django
└── requirements.txt          # Зависимости Python
```

### Фронтенд (React)

```
frontend/
├── public/                   # Статические файлы
│   ├── index.html           # Шаблон HTML
│   └── favicon.ico          # Иконка сайта
├── src/                      # Исходный код
│   ├── api/                 # Модули для работы с API
│   │   └── api.js           # Функции для вызова API
│   ├── components/          # Повторно используемые компоненты
│   │   ├── Header.js        # Верхняя навигация
│   │   ├── Footer.js        # Подвал сайта
│   │   └── CourseCard.js    # Карточка курса
│   ├── context/             # React контексты
│   │   └── AuthContext.js   # Контекст для аутентификации
│   ├── pages/               # Компоненты страниц
│   │   ├── Home.js          # Главная страница
│   │   ├── Courses.js       # Страница курсов
│   │   ├── CourseDetail.js  # Страница курса
│   │   ├── Login.js         # Страница входа
│   │   ├── Register.js      # Страница регистрации
│   │   └── Profile.js       # Страница профиля
│   ├── App.js               # Корневой компонент
│   ├── App.css              # Глобальные стили
│   └── index.js             # Точка входа
├── package.json              # Зависимости и скрипты
└── package-lock.json         # Локи зависимостей
```

## API документация

Бэкенд предоставляет следующие API-эндпоинты:

### Аутентификация

- `POST /api-token-auth/` - Получение токена аутентификации
  - Тело запроса: `{ "username": "string", "password": "string" }`
  - Ответ: `{ "token": "string" }`

- `POST /api/register/` - Регистрация нового пользователя
  - Тело запроса: `{ "username": "string", "email": "string", "password": "string", "first_name": "string", "last_name": "string" }`
  - Ответ: Данные созданного пользователя

### Категории

- `GET /api/categories/` - Получение списка категорий
  - Ответ: Список объектов категорий

- `GET /api/categories/{id}/` - Получение информации о категории
  - Ответ: Объект категории

### Курсы

- `GET /api/courses/` - Получение списка курсов
  - Параметры запроса:
    - `category` - ID категории для фильтрации
    - `search` - Строка поиска по названию или описанию
  - Ответ: Список объектов курсов

- `GET /api/courses/{id}/` - Получение информации о курсе
  - Ответ: Объект курса

- `POST /api/courses/{id}/enroll/` - Запись на курс
  - Требуется аутентификация
  - Ответ: Объект записи на курс

### Уроки

- `GET /api/lessons/` - Получение списка уроков
  - Параметры запроса:
    - `course_id` - ID курса для фильтрации
  - Ответ: Список объектов уроков

- `GET /api/lessons/{id}/` - Получение информации об уроке
  - Ответ: Объект урока

### Записи на курсы

- `GET /api/enrollments/` - Получение списка записей пользователя на курсы
  - Требуется аутентификация
  - Ответ: Список объектов записей на курсы

## Разработка и расширение

### Добавление новых моделей

Для добавления новой модели данных:

1. Создайте класс модели в `courses/models.py`:

```python
class NewModel(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
```

2. Создайте сериализатор в `courses/serializers.py`:

```python
class NewModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewModel
        fields = '__all__'
```

3. Создайте viewset в `courses/views.py`:

```python
class NewModelViewSet(viewsets.ModelViewSet):
    queryset = NewModel.objects.all()
    serializer_class = NewModelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
```

4. Зарегистрируйте viewset в `courses/urls.py`:

```python
router.register('new-models', views.NewModelViewSet)
```

5. Создайте и примените миграции:

```bash
python manage.py makemigrations
python manage.py migrate
```

### Расширение API

Для добавления новых эндпоинтов или методов:

1. Добавьте пользовательское действие в существующий viewset:

```python
class CourseViewSet(viewsets.ModelViewSet):
    # ... существующий код ...
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def custom_action(self, request, pk=None):
        course = self.get_object()
        # Ваша логика
        return Response({'status': 'success'})
```

2. Или создайте отдельное API-представление:

```python
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def custom_api_view(request):
    # Ваша логика
    return Response({'status': 'success'})
```

3. Зарегистрируйте новое представление в `courses/urls.py`:

```python
urlpatterns = [
    # ... существующие пути ...
    path('custom-endpoint/', views.custom_api_view, name='custom-endpoint'),
]
```

### Создание новых компонентов

Для создания нового компонента React:

1. Создайте файл компонента в соответствующей директории:

```jsx
// src/components/NewComponent.js
import React from 'react';
import './NewComponent.css';

const NewComponent = ({ prop1, prop2 }) => {
  return (
    <div className="new-component">
      <h2>{prop1}</h2>
      <p>{prop2}</p>
    </div>
  );
};

export default NewComponent;
```

2. Создайте файл стилей:

```css
/* src/components/NewComponent.css */
.new-component {
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

3. Импортируйте и используйте компонент:

```jsx
import NewComponent from '../components/NewComponent';

const SomePage = () => {
  return (
    <div>
      <NewComponent prop1="Title" prop2="Description" />
    </div>
  );
};
```

## Развертывание

### Локальное развертывание

Для локального развертывания:

1. Следуйте инструкциям из раздела [Установка и настройка](#установка-и-настройка)
2. Запустите бэкенд и фронтенд в отдельных терминалах
3. Приложение будет доступно по адресу http://localhost:3000/

### Продакшн-развертывание

Для продакшн-развертывания рекомендуется:

1. Настроить Django для работы с PostgreSQL:

```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_db_name',
        'USER': 'your_db_user',
        'PASSWORD': 'your_db_password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```

2. Сборка фронтенда:

```bash
cd frontend
npm run build
```

3. Настройка статических файлов в Django:

```python
# settings.py
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'frontend/build/static'),
]

# Настройка местоположения индексного файла React
TEMPLATES = [
    {
        # ... другие настройки ...
        'DIRS': [
            os.path.join(BASE_DIR, 'frontend/build'),
        ],
        # ... другие настройки ...
    },
]
```

4. Добавление URL-маршрута для React:

```python
# urls.py
from django.views.generic import TemplateView

urlpatterns = [
    # ... другие пути ...
    path('', TemplateView.as_view(template_name='index.html')),
]
```

5. Настройка веб-сервера (Nginx, Apache) и WSGI-сервера (Gunicorn, uWSGI)

## Устранение неполадок

### Проблемы с бэкендом

1. **Миграции не применяются**:
   - Проверьте наличие конфликтов в файлах миграций
   - Попробуйте удалить файлы миграций (кроме `__init__.py`) и создать их заново

2. **Ошибки доступа к базе данных**:
   - Проверьте настройки подключения к базе данных
   - Убедитесь, что пользователь имеет необходимые права

3. **Ошибки CORS**:
   - Проверьте настройки CORS в `settings.py`
   - Убедитесь, что домен фронтенда добавлен в список разрешенных источников

### Проблемы с фронтендом

1. **Ошибки API-запросов**:
   - Проверьте консоль браузера на наличие ошибок
   - Убедитесь, что URL API указан правильно
   - Проверьте, что токен аутентификации корректно передается

2. **Проблемы с маршрутизацией**:
   - Проверьте настройки React Router
   - Убедитесь, что все компоненты страниц экспортируются корректно

3. **Проблемы с рендерингом**:
   - Проверьте консоль на наличие ошибок React
   - Используйте React Developer Tools для отладки компонентов 
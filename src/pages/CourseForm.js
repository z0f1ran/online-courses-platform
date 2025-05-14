import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { getCategories, getCourseDetail, createCourse, updateCourse } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './CourseForm.css';

const CourseForm = ({ mode = 'create' }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isInstructor } = useContext(AuthContext);
  
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: 0,
    image: null
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Загрузка категорий
        const categoriesResponse = await getCategories();
        console.log('API response for categories:', categoriesResponse);
        
        // Проверяем структуру ответа API
        if (categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
          console.log('Categories array:', categoriesResponse.data);
          setCategories(categoriesResponse.data);
        } else {
          console.error('Ошибка: categories.data не является массивом', categoriesResponse.data);
          // Попробуем использовать сами данные ответа, если это массив
          if (Array.isArray(categoriesResponse)) {
            setCategories(categoriesResponse);
          } else {
            // Создаем тестовые категории для отладки
            const mockCategories = [
              {id: 1, name: 'Программирование'},
              {id: 2, name: 'Дизайн'},
              {id: 3, name: 'Маркетинг'},
              {id: 4, name: 'Бизнес'},
              {id: 5, name: 'Иностранные языки'}
            ];
            setCategories(mockCategories);
            console.log('Используем тестовые категории:', mockCategories);
          }
        }
        
        // Если режим редактирования, загрузить данные курса
        if (mode === 'edit' && id) {
          const courseResponse = await getCourseDetail(id);
          const course = courseResponse.data;
          
          setFormData({
            title: course.title,
            description: course.description,
            category: course.category,
            price: course.price,
            image: null // Не можем загрузить файл, только отобразить превью
          });
          
          if (course.image) {
            setImagePreview(course.image);
          }
        }
        
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchData();
  }, [id, mode]);
  
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'image' && files.length > 0) {
      setFormData({
        ...formData,
        image: files[0]
      });
      
      // Отображение превью изображения
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(files[0]);
    } else if (name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Создание объекта FormData для отправки файлов
      const courseFormData = new FormData();
      courseFormData.append('title', formData.title);
      courseFormData.append('description', formData.description);
      courseFormData.append('category', formData.category);
      courseFormData.append('price', formData.price);
      
      if (formData.image) {
        courseFormData.append('image', formData.image);
      }
      
      let response;
      if (mode === 'edit') {
        response = await updateCourse(id, courseFormData);
      } else {
        response = await createCourse(courseFormData);
      }
      
      // Перенаправление на страницу управления курсами
      navigate('/instructor/courses');
    } catch (err) {
      setError('Ошибка при сохранении курса');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Перенаправление, если пользователь не авторизован или не является преподавателем
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isInstructor()) {
    return <Navigate to="/profile" />;
  }
  
  return (
    <div className="course-form-page">
      <div className="container">
        <h1 className="form-title">
          {mode === 'edit' ? 'Редактирование курса' : 'Создание нового курса'}
        </h1>
        
        {loading ? (
          <div className="loading">Загрузка данных...</div>
        ) : (
          <form className="course-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="title">Название курса</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="category">Категория</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Выберите категорию</option>
                {Array.isArray(categories) && categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="description">Описание курса</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                required
              ></textarea>
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Цена (руб.)</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Изображение курса</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => navigate('/instructor/courses')}
                disabled={submitting}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="submit-btn"
                disabled={submitting}
              >
                {submitting ? 'Сохранение...' : (mode === 'edit' ? 'Сохранить изменения' : 'Создать курс')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CourseForm; 
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Создаем экземпляр axios с базовым URL
const api = axios.create({
  baseURL: API_URL,
});

// Перехватчик для добавления токена к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API функции для работы с категориями
export const getCategories = () => {
  console.log('Calling getCategories API');
  return api.get('/categories/')
    .then(response => {
      console.log('Categories API response:', response);
      if (Array.isArray(response.data)) {
        return { data: response.data };
      } else {
        console.warn('API response is not an array, using as is:', response);
        return response;
      }
    })
    .catch(error => {
      console.error('Error fetching categories:', error);
      // Вернем тестовые данные как запасной вариант
      const mockCategories = [
        {id: 1, name: 'Программирование'},
        {id: 2, name: 'Дизайн'},
        {id: 3, name: 'Маркетинг'},
        {id: 4, name: 'Бизнес'},
        {id: 5, name: 'Иностранные языки'}
      ];
      return { data: mockCategories };
    });
};

// API функции для работы с курсами
export const getCourses = (params) => api.get('/courses/', { params });
export const getCourseDetail = (id) => api.get(`/courses/${id}/`);
export const enrollCourse = (id) => api.post(`/courses/${id}/enroll/`);
export const createCourse = (courseData) => api.post('/courses/', courseData);
export const updateCourse = (id, courseData) => api.put(`/courses/${id}/`, courseData);
export const deleteCourse = (id) => api.delete(`/courses/${id}/`);
export const getInstructorCourses = () => api.get('/courses/my_courses/');

// API функции для работы с уроками
export const getLessons = (courseId) => api.get('/lessons/', { params: { course_id: courseId } });
export const createLesson = (lessonData) => api.post('/lessons/', lessonData);
export const updateLesson = (id, lessonData) => api.put(`/lessons/${id}/`, lessonData);
export const deleteLesson = (id) => api.delete(`/lessons/${id}/`);

// API функции для аутентификации
export const login = (username, password) => 
  axios.post('http://localhost:8000/api-token-auth/', { username, password });

export const register = (userData) => 
  axios.post('http://localhost:8000/api/register/', userData);

// API функции для работы с профилем
export const getProfile = () => api.get('/enrollments/');
export const getUserProfile = () => api.get('/profile/');
export const becomeInstructor = () => api.post('/profile/become_instructor/');

export default api; 
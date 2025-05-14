import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetail, getLessons, enrollCourse } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState(null);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState(null);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        // Получаем данные о курсе
        const courseResponse = await getCourseDetail(id);
        setCourse(courseResponse.data);
        
        // Получаем уроки курса
        const lessonsResponse = await getLessons(id);
        setLessons(lessonsResponse.data.results);
        
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных курса');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchCourseData();
  }, [id]);
  
  const handleEnroll = async () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    
    setEnrolling(true);
    setEnrollmentError(null);
    
    try {
      await enrollCourse(id);
      setEnrollmentSuccess(true);
      setEnrolling(false);
    } catch (err) {
      setEnrollmentError(
        err.response?.data?.detail || 'Ошибка при записи на курс'
      );
      setEnrolling(false);
    }
  };
  
  if (loading) {
    return <div className="loading container">Загрузка курса...</div>;
  }
  
  if (error) {
    return <div className="error container">{error}</div>;
  }
  
  if (!course) {
    return <div className="not-found container">Курс не найден</div>;
  }
  
  return (
    <div className="course-detail-page">
      <div className="container">
        {/* Шапка курса */}
        <div className="course-header">
          <div className="course-header-content">
            <h1 className="course-title">{course.title}</h1>
            <p className="course-category">{course.category_name}</p>
            <p className="course-instructor">
              Преподаватель: {course.instructor.first_name} {course.instructor.last_name}
            </p>
            
            <div className="course-stats">
              <span className="course-price">
                {course.price > 0 ? `${course.price} ₽` : 'Бесплатно'}
              </span>
              <span className="course-lessons-count">
                {course.lessons_count} уроков
              </span>
            </div>
            
            <div className="course-actions">
              <button 
                className="enroll-button" 
                onClick={handleEnroll}
                disabled={enrolling || enrollmentSuccess}
              >
                {enrolling ? 'Загрузка...' : enrollmentSuccess ? 'Вы записаны' : 'Записаться на курс'}
              </button>
            </div>
            
            {enrollmentError && (
              <div className="alert alert-error">{enrollmentError}</div>
            )}
            
            {enrollmentSuccess && (
              <div className="alert alert-success">
                Вы успешно записались на курс!
              </div>
            )}
          </div>
          
          <div className="course-image">
            {course.image ? (
              <img src={course.image} alt={course.title} />
            ) : (
              <div className="placeholder-image">
                <span>{course.title.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Описание курса */}
        <div className="course-description-section">
          <h2>О курсе</h2>
          <p className="course-description">{course.description}</p>
        </div>
        
        {/* Список уроков */}
        <div className="course-lessons-section">
          <h2>Содержание курса</h2>
          
          {lessons.length > 0 ? (
            <div className="lessons-list">
              {lessons.map((lesson, index) => (
                <div className="lesson-item" key={lesson.id}>
                  <div className="lesson-number">{index + 1}</div>
                  <div className="lesson-content">
                    <h3>{lesson.title}</h3>
                    <p className="lesson-description">
                      {lesson.content.length > 100
                        ? `${lesson.content.substring(0, 100)}...`
                        : lesson.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-lessons">В этом курсе пока нет уроков</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail; 
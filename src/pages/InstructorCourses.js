import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getInstructorCourses, deleteCourse } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './InstructorCourses.css';

const InstructorCourses = () => {
  const { isAuthenticated, isInstructor } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchCourses = async () => {
      if (!isAuthenticated() || !isInstructor()) return;
      
      try {
        setLoading(true);
        const response = await getInstructorCourses();
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке курсов');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchCourses();
  }, [isAuthenticated, isInstructor]);
  
  const handleDeleteCourse = async (courseId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот курс?')) {
      try {
        await deleteCourse(courseId);
        setCourses(courses.filter(course => course.id !== courseId));
      } catch (err) {
        setError('Ошибка при удалении курса');
        console.error(err);
      }
    }
  };
  
  // Если пользователь не авторизован или не является преподавателем
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  if (!isInstructor()) {
    return <Navigate to="/profile" />;
  }
  
  return (
    <div className="instructor-courses-page">
      <div className="container">
        <div className="instructor-header">
          <h1 className="instructor-title">Управление курсами</h1>
          <Link to="/instructor/create-course" className="create-course-btn">
            Создать новый курс
          </Link>
        </div>
        
        <div className="instructor-content">
          {loading ? (
            <div className="loading">Загрузка курсов...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              {courses.length > 0 ? (
                <div className="instructor-courses-list">
                  {courses.map((course) => (
                    <div className="instructor-course-item" key={course.id}>
                      <div className="course-image">
                        {course.image ? (
                          <img src={course.image} alt={course.title} />
                        ) : (
                          <div className="placeholder-image">
                            <span>{course.title.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="course-content">
                        <h3>{course.title}</h3>
                        <p className="course-category">{course.category_name}</p>
                        <p className="course-lessons">Уроков: {course.lessons_count}</p>
                        <div className="course-actions">
                          <Link to={`/instructor/edit-course/${course.id}`} className="edit-course-btn">
                            Редактировать
                          </Link>
                          <Link to={`/instructor/lessons/${course.id}`} className="manage-lessons-btn">
                            Уроки
                          </Link>
                          <button 
                            className="delete-course-btn"
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-courses">
                  <p>У вас пока нет созданных курсов</p>
                  <Link to="/instructor/create-course" className="create-course-btn-large">
                    Создать первый курс
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorCourses; 
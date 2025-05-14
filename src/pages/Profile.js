import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getProfile, becomeInstructor } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, isAuthenticated, isInstructor, updateUserData } = useContext(AuthContext);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [becomingInstructor, setBecomingInstructor] = useState(false);
  
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!isAuthenticated()) return;
      
      try {
        setLoading(true);
        const response = await getProfile();
        setEnrollments(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных профиля');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchEnrollments();
  }, [isAuthenticated]);
  
  const handleBecomeInstructor = async () => {
    try {
      setBecomingInstructor(true);
      const response = await becomeInstructor();
      
      // Обновляем данные пользователя в контексте
      updateUserData({ is_instructor: true });
      
      setBecomingInstructor(false);
    } catch (err) {
      setError('Ошибка при смене статуса на преподавателя');
      setBecomingInstructor(false);
      console.error(err);
    }
  };
  
  // Если пользователь не авторизован, перенаправляем на страницу входа
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1 className="profile-title">Мой профиль</h1>
          <div className="profile-info">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
              </div>
            </div>
            <div className="profile-details">
              <h2 className="profile-name">
                {user.first_name && user.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user.username}
              </h2>
              <p className="profile-username">@{user.username}</p>
              {user.email && <p className="profile-email">{user.email}</p>}
              
              {!isInstructor() && (
                <button 
                  className="become-instructor-btn"
                  onClick={handleBecomeInstructor}
                  disabled={becomingInstructor}
                >
                  {becomingInstructor ? 'Обработка...' : 'Стать преподавателем'}
                </button>
              )}
              
              {isInstructor() && (
                <div className="instructor-badge">
                  <span>Преподаватель</span>
                  <Link to="/instructor/courses" className="manage-courses-btn">
                    Управление курсами
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="profile-content">
          <div className="profile-section">
            <h2 className="section-title">Мои курсы</h2>
            
            {loading ? (
              <div className="loading">Загрузка курсов...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <>
                {enrollments.length > 0 ? (
                  <div className="enrollments-list">
                    {enrollments.map((enrollment) => (
                      <div className="enrollment-item" key={enrollment.id}>
                        <div className="enrollment-image">
                          {enrollment.course.image ? (
                            <img src={enrollment.course.image} alt={enrollment.course.title} />
                          ) : (
                            <div className="placeholder-image">
                              <span>{enrollment.course.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="enrollment-content">
                          <h3>{enrollment.course.title}</h3>
                          <p className="enrollment-category">{enrollment.course.category_name}</p>
                          <p className="enrollment-date">
                            Дата записи: {new Date(enrollment.enrolled_at).toLocaleDateString()}
                          </p>
                          <Link to={`/courses/${enrollment.course.id}`} className="view-course-btn">
                            Перейти к курсу
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-enrollments">
                    <p>Вы еще не записаны ни на один курс</p>
                    <Link to="/courses" className="browse-courses-btn">
                      Просмотреть доступные курсы
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 
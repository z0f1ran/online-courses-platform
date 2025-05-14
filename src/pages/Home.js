import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses, getCategories } from '../api/api';
import './Home.css';

const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Получаем все курсы (в реальном приложении нужно добавить фильтрацию для избранных)
        const coursesRes = await getCourses();
        setFeaturedCourses(coursesRes.data.results.slice(0, 4)); // Получаем только первые 4 курса
        
        // Получаем категории
        const categoriesRes = await getCategories();
        setCategories(categoriesRes.data.results);
        
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке данных');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className="home-page">
      {/* Hero секция */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Ваше образование — наш приоритет</h1>
            <p>Учитесь в удобное время, получайте востребованные навыки и знания от лучших преподавателей</p>
            <Link to="/courses" className="hero-button">Начать обучение</Link>
          </div>
        </div>
      </section>
      
      {/* Секция избранных курсов */}
      <section className="featured-courses">
        <div className="container">
          <h2 className="section-title">Популярные курсы</h2>
          
          {loading ? (
            <div className="loading">Загрузка курсов...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              {featuredCourses.length > 0 ? (
                <div className="courses-grid">
                  {featuredCourses.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="no-courses">Пока нет доступных курсов</div>
              )}
              
              <div className="view-all">
                <Link to="/courses" className="view-all-link">Посмотреть все курсы</Link>
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Секция категорий */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Категории курсов</h2>
          
          {loading ? (
            <div className="loading">Загрузка категорий...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <>
              {categories.length > 0 ? (
                <div className="categories-grid">
                  {categories.map(category => (
                    <Link 
                      to={`/courses?category=${category.id}`} 
                      className="category-card" 
                      key={category.id}
                    >
                      <h3>{category.name}</h3>
                      <p>{category.description || `Курсы в категории "${category.name}"`}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="no-categories">Пока нет доступных категорий</div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Секция о преимуществах */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Почему стоит учиться с нами</h2>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">📚</div>
              <h3>Качественные материалы</h3>
              <p>Все курсы разработаны профессионалами с многолетним опытом работы</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">⏱️</div>
              <h3>Учитесь в своем темпе</h3>
              <p>Доступ к материалам 24/7, возможность обучаться в удобное время</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">💬</div>
              <h3>Поддержка преподавателей</h3>
              <p>Задавайте вопросы и получайте консультации от экспертов</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h3>Сертификаты</h3>
              <p>Получайте сертификаты о завершении курсов для вашего портфолио</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 
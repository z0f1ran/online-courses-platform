import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import { getCourses, getCategories } from '../api/api';
import './Courses.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  
  useEffect(() => {
    // Получаем параметр category из URL, если он есть
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
    
    // Загружаем категории
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.data.results);
      } catch (err) {
        console.error('Ошибка при загрузке категорий', err);
      }
    };
    
    fetchCategories();
  }, [location.search]);
  
  useEffect(() => {
    // Загружаем курсы с учетом фильтров
    const fetchCourses = async () => {
      setLoading(true);
      
      try {
        const params = {};
        
        if (selectedCategory) {
          params.category = selectedCategory;
        }
        
        if (searchTerm) {
          params.search = searchTerm;
        }
        
        const response = await getCourses(params);
        setCourses(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Ошибка при загрузке курсов. Пожалуйста, попробуйте позже.');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchCourses();
  }, [selectedCategory, searchTerm]);
  
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Поиск уже происходит в useEffect при изменении searchTerm
  };
  
  return (
    <div className="courses-page">
      <div className="container">
        <h1 className="page-title">Все Курсы</h1>
        
        <div className="courses-filters">
          <form className="search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Поиск курсов..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button type="submit" className="search-button">Поиск</button>
          </form>
          
          <div className="category-filter">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {loading ? (
          <div className="loading">Загрузка курсов...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <>
            {courses.length > 0 ? (
              <div className="courses-grid">
                {courses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="no-courses">
                Курсы не найдены. Попробуйте изменить параметры поиска.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Courses; 
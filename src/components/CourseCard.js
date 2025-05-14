import React from 'react';
import { Link } from 'react-router-dom';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
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
        <p className="course-description">
          {course.description.length > 100
            ? `${course.description.substring(0, 100)}...`
            : course.description}
        </p>
        <div className="course-details">
          <span className="course-price">{course.price > 0 ? `${course.price} ₽` : 'Бесплатно'}</span>
          <span className="course-lessons">{course.lessons_count} уроков</span>
        </div>
        <Link to={`/courses/${course.id}`} className="view-course-btn">
          Подробнее
        </Link>
      </div>
    </div>
  );
};

export default CourseCard; 
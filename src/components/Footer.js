import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Онлайн Курсы</h3>
            <p>Платформа для получения качественного образования онлайн</p>
          </div>
          <div className="footer-links">
            <h4>Быстрые ссылки</h4>
            <ul>
              <li><a href="/">Главная</a></li>
              <li><a href="/courses">Все курсы</a></li>
              <li><a href="/login">Вход</a></li>
              <li><a href="/register">Регистрация</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Контакты</h4>
            <p>Email: info@onlinecourses.ru</p>
            <p>Телефон: +7 (999) 123-45-67</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {currentYear} Онлайн Курсы. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 
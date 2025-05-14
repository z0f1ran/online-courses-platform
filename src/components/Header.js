import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, isAuthenticated, isInstructor, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>Онлайн Курсы</h1>
          </Link>
          <nav className="navigation">
            <ul>
              <li>
                <Link to="/">Главная</Link>
              </li>
              <li>
                <Link to="/courses">Курсы</Link>
              </li>
              {isAuthenticated() ? (
                <>
                  <li>
                    <Link to="/profile">Профиль</Link>
                  </li>
                  {isInstructor() && (
                    <li>
                      <Link to="/instructor/courses">Мои курсы</Link>
                    </li>
                  )}
                  <li>
                    <button onClick={handleLogout} className="logout-button">
                      Выйти
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Войти</Link>
                  </li>
                  <li>
                    <Link to="/register">Регистрация</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 
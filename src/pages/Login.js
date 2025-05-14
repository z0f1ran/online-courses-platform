import React, { useState, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  
  const { login, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Получаем URL для перенаправления после успешного входа
  const from = location.state?.from || '/';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Базовая валидация формы
    if (!username.trim() || !password.trim()) {
      setFormError('Пожалуйста, заполните все поля');
      return;
    }
    
    setFormError('');
    
    // Отправка данных для входа
    const success = await login(username, password);
    
    if (success) {
      navigate(from);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Вход в аккаунт</h1>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {(formError || error) && (
              <div className="alert alert-error">
                {formError || error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Пароль
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-button"
              disabled={loading}
            >
              {loading ? 'Выполняется вход...' : 'Войти'}
            </button>
          </form>
          
          <div className="auth-links">
            <p>
              Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 
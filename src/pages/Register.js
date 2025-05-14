import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/api';
import { AuthContext } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: ''
  });
  
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const validateForm = () => {
    if (!formData.username.trim() || 
        !formData.email.trim() || 
        !formData.password.trim() ||
        !formData.password2.trim()) {
      setFormError('Пожалуйста, заполните все обязательные поля');
      return false;
    }
    
    if (formData.password !== formData.password2) {
      setFormError('Пароли не совпадают');
      return false;
    }
    
    if (formData.password.length < 8) {
      setFormError('Пароль должен содержать не менее 8 символов');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setFormError('');
    setLoading(true);
    
    try {
      // Отправка данных для регистрации
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name
      };
      
      await register(userData);
      
      // В случае успешной регистрации
      setSuccess(true);
      
      // Автоматический вход после регистрации
      const loginSuccess = await login(formData.username, formData.password);
      
      if (loginSuccess) {
        navigate('/');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 
                         err.response?.data?.username?.[0] ||
                         err.response?.data?.email?.[0] ||
                         'Ошибка при регистрации';
      
      setFormError(errorMessage);
      setLoading(false);
    }
  };
  
  return (
    <div className="auth-page">
      <div className="container">
        <div className="auth-form-container">
          <h1 className="auth-title">Регистрация</h1>
          
          {success ? (
            <div className="success-message">
              <div className="alert alert-success">
                Регистрация успешно завершена! Выполняется вход...
              </div>
            </div>
          ) : (
            <form className="auth-form" onSubmit={handleSubmit}>
              {formError && (
                <div className="alert alert-error">
                  {formError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Имя пользователя *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-input"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name" className="form-label">
                    Имя
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    className="form-input"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="last_name" className="form-label">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    className="form-input"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Пароль *
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-input"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password2" className="form-label">
                  Подтверждение пароля *
                </label>
                <input
                  type="password"
                  id="password2"
                  name="password2"
                  className="form-input"
                  value={formData.password2}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Регистрация...' : 'Зарегистрироваться'}
              </button>
            </form>
          )}
          
          <div className="auth-links">
            <p>
              Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 
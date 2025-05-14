import React, { createContext, useState, useEffect } from 'react';
import { login as loginApi, getUserProfile } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          // Получаем данные профиля пользователя
          const profileResponse = await getUserProfile();
          if (profileResponse.data.length > 0) {
            const userData = JSON.parse(localStorage.getItem('user')) || {};
            userData.is_instructor = profileResponse.data[0].is_instructor;
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (err) {
          console.error("Error fetching profile:", err);
        }
      }
    };
    
    if (token) {
      // Загружаем данные пользователя из localStorage
      const userData = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
      setUser(userData);
      
      // Дополнительно запрашиваем данные профиля для получения is_instructor
      fetchUserData();
    }
  }, [token]);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginApi(username, password);
      const { token } = response.data;
      setToken(token);
      
      // Сохраняем токен в localStorage
      localStorage.setItem('token', token);
      
      // Получаем данные пользователя из ответа
      const userData = { username }; // Базовые данные
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка при входе в систему');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => !!token;
  
  const isInstructor = () => !!user?.is_instructor;
  
  const updateUserData = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      error, 
      login, 
      logout, 
      isAuthenticated, 
      isInstructor,
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
}; 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import { AuthProvider } from './context/AuthContext';
import InstructorCourses from './pages/InstructorCourses';
import CourseForm from './pages/CourseForm';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/instructor/courses" element={<InstructorCourses />} />
              <Route path="/instructor/create-course" element={<CourseForm mode="create" />} />
              <Route path="/instructor/edit-course/:id" element={<CourseForm mode="edit" />} />
            </Routes>
          </main>
          <Footer />
    </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

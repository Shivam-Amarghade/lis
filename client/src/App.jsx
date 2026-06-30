// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DeshboradPage';


const App = () => {
  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />


        {/* 404 */}
        <Route
          path="*"
          element={
            <div style={{ textAlign: 'center', padding: '80px 20px' }}>
              <h2 style={{ fontSize: '3rem' }}>404</h2>
              <p style={{ color: '#6b7280' }}>Page not found.</p>
              <a href="/" style={{ color: '#4f46e5' }}>Go Home</a>
            </div>
          }
        />
      </Routes>
    </Layout>

  );
};

export default App;

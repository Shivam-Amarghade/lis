// src/pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero__badge">⚡ Production Ready Auth</div>
        <h1 className="hero__title">
          {isAuthenticated
            ? `Welcome back, ${user?.name || 'User'}! 👋`
            : 'Secure Authentication System'}
        </h1>
        <p className="hero__subtitle">
          {isAuthenticated
            ? 'You are logged in. Manage your account from the navbar above.'
            : 'Built with React, Redux, Thunk & Axios. JWT-based authentication with full login, logout, forgot & change password flows.'}
        </p>

        {!isAuthenticated && (
          <div className="hero__actions">
            <Link to="/login">
              <Button label="Get Started →" variant="primary" />
            </Link>
            <Link to="/forgot-password">
              <Button label="Forgot Password?" variant="outline" />
            </Link>
          </div>
        )}
      </section>

      <section className="features">
        {[
          { icon: '🔐', title: 'JWT Auth', desc: 'Secure token-based authentication with auto-refresh.' },
          { icon: '♻️', title: 'Reusable UI', desc: 'Button, Input, Navbar, Footer — all composable components.' },
          { icon: '⚡', title: 'Redux + Thunk', desc: 'Vanilla Redux with Thunk for async API handling.' },
          { icon: '🛡️', title: 'Route Protection', desc: 'Protected routes redirect unauthenticated users.' },
          { icon: '✅', title: 'Validation', desc: 'Client-side form validation with clear error messages.' },
          { icon: '📱', title: 'Responsive', desc: 'Mobile-first design that works on all screen sizes.' },
        ].map((feat) => (
          <div key={feat.title} className="feature-card">
            <span className="feature-icon">{feat.icon}</span>
            <h3 className="feature-title">{feat.title}</h3>
            <p className="feature-desc">{feat.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;

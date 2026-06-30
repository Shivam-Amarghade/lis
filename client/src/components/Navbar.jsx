// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/actions/authActions';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        {/* Logo */}
        <Link to="/" className="navbar__logo">
          <span className="navbar__logo-icon">⚡</span>
          <span className="navbar__logo-text">AuthApp</span>
        </Link>

        {/* Desktop Links */}
        <div className="navbar__links">
          <Link to="/" className="navbar__link">Home</Link>
          {isAuthenticated && (
            <Link to="/change-password" className="navbar__link">
              Change Password
            </Link>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="navbar__actions">
          {isAuthenticated ? (
            <div className="navbar__user">
              <span className="navbar__username">
                👤 {user?.name || user?.email || 'User'}
              </span>
              <Button
                label="Logout"
                variant="danger"
                onClick={handleLogout}
                loading={loading}
              />
            </div>
          ) : (
            <div className="navbar__auth-buttons">
              <Link to="/login">
                <Button label="Login" variant="outline" />
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Menu (Mobile) */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
            {menuOpen ? '✕' : '☰'}
          </span>
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="navbar__mobile-menu">
          <Link to="/" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
            🏠 Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/change-password" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
                🔑 Change Password
              </Link>
              <button
                className="navbar__mobile-link navbar__mobile-logout"
                onClick={() => { handleLogout(); setMenuOpen(false); }}
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="navbar__mobile-link" onClick={() => setMenuOpen(false)}>
              🔐 Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__brand">
          <span className="footer__logo">⚡ AuthApp</span>
          <p className="footer__tagline">Secure. Simple. Reliable.</p>
        </div>

        <div className="footer__links">
          <div className="footer__link-group">
            <h4 className="footer__group-title">Account</h4>
            <Link to="/login" className="footer__link">Login</Link>
            <Link to="/forgot-password" className="footer__link">Forgot Password</Link>
            <Link to="/change-password" className="footer__link">Change Password</Link>
          </div>

          <div className="footer__link-group">
            <h4 className="footer__group-title">Support</h4>
            <a href="mailto:support@authapp.com" className="footer__link">Contact Us</a>
            <a href="#" className="footer__link">Privacy Policy</a>
            <a href="#" className="footer__link">Terms of Service</a>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {year} AuthApp. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

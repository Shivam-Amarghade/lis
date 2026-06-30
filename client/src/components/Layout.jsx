// src/components/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

// Pages where Navbar and Footer should be hidden
const AUTH_ROUTES = ['/login', '/forgot-password'];

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAuthPage = AUTH_ROUTES.includes(pathname);

  return (
    <div className="layout">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? '' : 'layout__main'}>
        {children}
      </main>
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default Layout;

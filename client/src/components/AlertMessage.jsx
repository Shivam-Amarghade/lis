// src/components/AlertMessage.jsx
import React from 'react';
import './AlertMessage.css';


const AlertMessage = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div className={`alert alert--${type}`} role="alert">
      <span className="alert__icon">{icons[type]}</span>
      <span className="alert__text">{message}</span>
      {onClose && (
        <button className="alert__close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      )}
    </div>
  );
};

export default AlertMessage;

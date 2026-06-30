// src/components/Button.jsx
import React from 'react';
import './Button.css';

/**
 * Reusable Button Component
 * Props:
 *  - label       : string  — button text
 *  - onClick     : func    — click handler
 *  - type        : string  — 'button' | 'submit' | 'reset'
 *  - variant     : string  — 'primary' | 'secondary' | 'danger' | 'outline'
 *  - loading     : bool    — show spinner
 *  - disabled    : bool    — disable button
 *  - fullWidth   : bool    — take full width
 *  - icon        : node    — optional icon (left side)
 */
const Button = ({
  label = 'Submit',
  onClick,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn--${variant} ${fullWidth ? 'btn--full' : ''} ${loading ? 'btn--loading' : ''}`}
    >
      {loading ? (
        <span className="btn__spinner" />
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          <span>{label}</span>
        </>
      )}
    </button>
  );
};

export default Button;

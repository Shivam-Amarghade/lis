// src/components/Input.jsx
import React, { useState } from 'react';
import './Input.css';

/**
 * Reusable Input Component
 * Props:
 *  - label       : string  — field label
 *  - name        : string  — input name
 *  - type        : string  — text | email | password | tel etc.
 *  - value       : string  — controlled value
 *  - onChange    : func    — change handler
 *  - placeholder : string
 *  - error       : string  — error message
 *  - required    : bool
 *  - disabled    : bool
 *  - icon        : node    — left side icon
 */
const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = '',
  required = false,
  disabled = false,
  icon = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
          {required && <span className="input-required"> *</span>}
        </label>
      )}
      <div className="input-wrapper">
        {icon && <span className="input-icon input-icon--left">{icon}</span>}
        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`input-field ${icon ? 'input-field--icon' : ''} ${isPassword ? 'input-field--password' : ''}`}
          autoComplete={isPassword ? 'current-password' : 'off'}
        />
        {isPassword && (
          <button
            type="button"
            className="input-toggle-password"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label="Toggle password visibility"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};

export default Input;

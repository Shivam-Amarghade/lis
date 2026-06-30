// src/pages/ChangePasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changePassword, clearAuthMessage } from '../redux/actions/authActions';
import Input from '../components/Input';
import Button from '../components/Button';
import AlertMessage from '../components/AlertMessage';
import './AuthPage.css';

const ChangePasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState({});

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearAuthMessage());
  }, [dispatch]);

  // Auto-redirect after success
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => navigate('/'), 2500);
      return () => clearTimeout(timer);
    }
  }, [successMessage, navigate]);

  const validate = () => {
    const errors = {};
    if (!formData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!formData.newPassword) errors.newPassword = 'New password is required';
    else if (formData.newPassword.length < 8) errors.newPassword = 'Minimum 8 characters required';
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.newPassword))
      errors.newPassword = 'Include at least one uppercase letter and one number';
    if (!formData.confirmPassword) errors.confirmPassword = 'Please confirm your new password';
    else if (formData.newPassword !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    dispatch(changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    }));
  };

  // Password strength indicator
  const getStrength = (pwd) => {
    if (!pwd) return null;
    if (pwd.length < 6) return { label: 'Weak', level: 1, color: '#ef4444' };
    if (pwd.length < 8 || !/[A-Z]/.test(pwd)) return { label: 'Fair', level: 2, color: '#f59e0b' };
    if (/(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(pwd))
      return { label: 'Strong', level: 4, color: '#22c55e' };
    return { label: 'Good', level: 3, color: '#3b82f6' };
  };

  const strength = getStrength(formData.newPassword);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🛡️</div>
          <h1 className="auth-title">Change Password</h1>
          <p className="auth-subtitle">Keep your account secure with a strong password.</p>
        </div>

        <AlertMessage
          message={error}
          type="error"
          onClose={() => dispatch(clearAuthMessage())}
        />
        <AlertMessage
          message={successMessage}
          type="success"
          onClose={() => dispatch(clearAuthMessage())}
        />

        {!successMessage && (
          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder="Enter current password"
              error={formErrors.currentPassword}
              required
              icon="🔒"
            />

            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              error={formErrors.newPassword}
              required
              icon="🔑"
            />

            {/* Password strength bar */}
            {strength && (
              <div className="password-strength">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className="strength-bar"
                      style={{
                        background: strength.level >= level ? strength.color : '#e5e7eb',
                      }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}

            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your new password"
              error={formErrors.confirmPassword}
              required
              icon="✔️"
            />

            <div className="auth-password-tips">
              <p>Password must contain:</p>
              <ul>
                <li className={formData.newPassword.length >= 8 ? 'tip--met' : ''}>
                  ✓ At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.newPassword) ? 'tip--met' : ''}>
                  ✓ One uppercase letter
                </li>
                <li className={/[0-9]/.test(formData.newPassword) ? 'tip--met' : ''}>
                  ✓ One number
                </li>
              </ul>
            </div>

            <Button
              label="Update Password"
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordPage;

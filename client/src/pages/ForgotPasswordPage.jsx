// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  forgotPassword,
  verifyOTPAction,
  resetPasswordAction,
  clearAuthMessage,
} from '../redux/actions/authActions';
import './AuthPage.css';

// Flow: Step 1 → Enter empId  |  Step 2 → Verify OTP  |  Step 3 → Reset Password  |  Step 4 → Done

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [empId, setEmpId] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    dispatch(clearAuthMessage());
  }, [dispatch]);

  // Move to next step on success
  useEffect(() => {
    if (successMessage) {
      if (step === 1) setStep(2);
      else if (step === 2) setStep(3);
      else if (step === 3) setStep(4);
    }
  }, [successMessage]);

  const clearErrors = () => {
    setFieldErrors({});
    dispatch(clearAuthMessage());
  };

  // ── Step 1: Send OTP to empId ────────────────────────────────────────────
  const handleForgotPassword = (e) => {
    e.preventDefault();
    clearErrors();
    if (!empId.trim()) { setFieldErrors({ empId: 'Employee ID is required.' }); return; }
    dispatch(forgotPassword(empId));
  };

  // ── Step 2: Verify OTP ───────────────────────────────────────────────────
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    clearErrors();
    if (!otpToken.trim()) { setFieldErrors({ otpToken: 'OTP is required.' }); return; }
    dispatch(verifyOTPAction({ empId, otpToken }));
  };

  // ── Step 3: Reset Password ───────────────────────────────────────────────
  const handleResetPassword = (e) => {
    e.preventDefault();
    clearErrors();
    const errors = {};
    if (!newPassword) errors.newPassword = 'New password is required.';
    else if (newPassword.length < 8) errors.newPassword = 'Minimum 8 characters required.';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    dispatch(resetPasswordAction({ empId, newPassword, otpToken, confirmPassword }));
  };

  // ── Shared input style ───────────────────────────────────────────────────
  const inputStyle = (hasError) => ({
    width: '100%', height: '48px', padding: '0 14px',
    borderRadius: '8px', border: `1.5px solid ${hasError ? '#ef4444' : '#e5e7eb'}`,
    fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box',
    color: '#111827', background: '#fff', transition: 'border-color 0.2s',
  });

  const btnStyle = (disabled) => ({
    width: '100%', height: '48px', borderRadius: '10px', border: 'none',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#fff', fontSize: '1rem', fontWeight: 600,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1, transition: 'opacity 0.2s',
    marginTop: '8px',
  });

  // ── Step indicator ───────────────────────────────────────────────────────
  const StepDot = ({ n }) => (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: step >= n ? '#4f46e5' : '#e5e7eb',
      color: step >= n ? '#fff' : '#9ca3af',
      fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
    }}>{n}</div>
  );

  const StepLine = ({ active }) => (
    <div style={{
      flex: 1, height: '2px', borderRadius: '2px',
      background: active ? '#4f46e5' : '#e5e7eb',
    }} />
  );

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: 460 }}>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon">🔑</div>
          <h1 className="auth-title">Forgot Password</h1>
          <p className="auth-subtitle">
            {step === 1 && "Enter your Employee ID to receive a reset OTP."}
            {step === 2 && "Enter the OTP sent to your registered contact."}
            {step === 3 && "Set your new password below."}
            {step === 4 && "Password reset successfully!"}
          </p>
        </div>

        {/* Step indicator */}
        {step < 4 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' }}>
            <StepDot n={1} />
            <StepLine active={step >= 2} />
            <StepDot n={2} />
            <StepLine active={step >= 3} />
            <StepDot n={3} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '12px 16px', marginBottom: '16px', borderRadius: '8px',
            background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
            fontSize: '0.875rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span>{error}</span>
            <button onClick={() => dispatch(clearAuthMessage())} style={{
              background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700,
            }}>✕</button>
          </div>
        )}

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <form onSubmit={handleForgotPassword} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="empId" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Employee ID
              </label>
              <input
                id="empId" type="text" placeholder="e.g. EMP-0001"
                value={empId} onChange={(e) => { setEmpId(e.target.value); setFieldErrors({}); }}
                style={inputStyle(fieldErrors.empId)} autoComplete="username"
              />
              {fieldErrors.empId && <small style={{ color: '#ef4444', fontSize: '0.78rem' }}>{fieldErrors.empId}</small>}
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <form onSubmit={handleVerifyOTP} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '10px 14px', borderRadius: '8px', background: '#f0fdf4',
              border: '1px solid #bbf7d0', color: '#16a34a', fontSize: '0.85rem',
            }}>
              ✅ OTP sent for Employee ID: <strong>{empId}</strong>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="otpToken" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Enter OTP
              </label>
              <input
                id="otpToken" type="text" placeholder="Enter 6-digit OTP"
                value={otpToken} maxLength={6}
                onChange={(e) => { setOtpToken(e.target.value); setFieldErrors({}); }}
                style={inputStyle(fieldErrors.otpToken)}
              />
              {fieldErrors.otpToken && <small style={{ color: '#ef4444', fontSize: '0.78rem' }}>{fieldErrors.otpToken}</small>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => { clearErrors(); setStep(1); }} style={{
                flex: 1, height: '48px', borderRadius: '10px',
                border: '1.5px solid #e5e7eb', background: '#fff',
                color: '#374151', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
              }}>
                ← Back
              </button>
              <button type="submit" disabled={loading} style={{ ...btnStyle(loading), flex: 2, marginTop: 0 }}>
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="newPassword" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="newPassword" type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 characters" value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setFieldErrors({}); }}
                  style={{ ...inputStyle(fieldErrors.newPassword), paddingRight: '44px' }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '1rem',
                }}>
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {fieldErrors.newPassword && <small style={{ color: '#ef4444', fontSize: '0.78rem' }}>{fieldErrors.newPassword}</small>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="confirmPassword" style={{ fontSize: '0.875rem', fontWeight: 600, color: '#374151' }}>
                Confirm Password
              </label>
              <input
                id="confirmPassword" type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter new password" value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors({}); }}
                style={inputStyle(fieldErrors.confirmPassword)}
              />
              {fieldErrors.confirmPassword && <small style={{ color: '#ef4444', fontSize: '0.78rem' }}>{fieldErrors.confirmPassword}</small>}
            </div>

            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}

        {/* ── STEP 4: Success ── */}
        {step === 4 && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '16px', animation: 'bounce 0.6s ease' }}>✅</div>
            <p style={{ color: '#6b7280', marginBottom: '24px', lineHeight: 1.6 }}>
              Your password has been reset successfully.<br />You can now log in with your new password.
            </p>
            <Link to="/login" style={{
              display: 'block', width: '100%', height: '48px', lineHeight: '48px',
              borderRadius: '10px', textAlign: 'center', textDecoration: 'none',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', fontWeight: 600, fontSize: '0.95rem',
            }}>
              Back to Login
            </Link>
          </div>
        )}

        {step < 4 && (
          <p className="auth-footer-text">
            Remember your password?{' '}
            <Link to="/login" className="auth-link">Back to Login</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

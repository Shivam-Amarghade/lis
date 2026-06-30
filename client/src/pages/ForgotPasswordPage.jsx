// src/pages/ForgotPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  forgotPassword,
  verifyOTPAction,
  resetPasswordAction,
  clearAuthMessage,
} from '../redux/actions/authActions';

// ── Icons ────────────────────────────────────────────────────────────────────
const ArrowLeftIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m12 19-7-7 7-7" /><path d="M19 12H5" />
  </svg>
);
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, successMessage } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [empId, setEmpId] = useState('');
  const [otpToken, setOtpToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [strengthScore, setStrengthScore] = useState(0);
  const [strengthCriteria, setStrengthCriteria] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false
  });

  useEffect(() => {
    const criteria = {
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[^A-Za-z0-9]/.test(newPassword)
    };
    setStrengthCriteria(criteria);
    const score = Object.values(criteria).filter(Boolean).length;
    setStrengthScore(score);
  }, [newPassword]);


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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    clearErrors();
    if (!empId.trim()) { setFieldErrors({ empId: 'Employee ID is required.' }); return; }
    dispatch(forgotPassword(empId));
  };

  const handleVerifyOTP = (e) => {
    e.preventDefault();
    clearErrors();
    if (!otpToken.trim()) { setFieldErrors({ otpToken: 'OTP is required.' }); return; }
    dispatch(verifyOTPAction({ empId, otpToken }));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    clearErrors();
    const errors = {};
    if (!newPassword) errors.newPassword = 'New password is required.';
    else if (strengthScore < 5) errors.newPassword = 'Please ensure your password meets all strength requirements.';
    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.';
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.';
    if (Object.keys(errors).length > 0) { setFieldErrors(errors); return; }
    dispatch(resetPasswordAction({ empId, newPassword, otpToken, confirmPassword }));
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* ── LEFT PANEL ──────────────────────────────────────────────────────── */}
      <div className="relative hidden lg:flex flex-col justify-between bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 p-12 text-white overflow-hidden">
        <div className="relative z-20 w-full flex justify-start -mt-4">
          <div className="flex items-center gap-6">
            <img src="/logo4.png" alt="iEvolve Logo" className="h-52 w-52 object-contain" />
            <div className="flex flex-col items-start justify-center gap-1">
              <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                iEvolve
              </h1>
              <h2 className="text-2xl font-semibold tracking-tight text-white/90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                Learning Management System
              </h2>
            </div>
          </div>
        </div>

        <div className="relative z-20 max-w-lg my-auto">
          <h2 className="text-4xl font-bold mb-4">Reset Your Password</h2>
          <p className="text-white/80 text-lg">
            Enter your employee credentials to receive a secure password reset code sent directly to your registered contact.
          </p>
        </div>

        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px]">

          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <img src="/logo4.png" alt="iEvolve Logo" className="h-10 object-contain" />
            <div className="flex flex-col items-start justify-center">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-tight">iEvolve</h1>
              <h2 className="text-xs font-semibold tracking-tight text-gray-500 leading-tight">Learning Management System</h2>
            </div>
          </div>

          {step < 4 && (
            <div className="mb-8">
              <button
                type="button"
                className="flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-4 transition-colors bg-transparent border-none cursor-pointer p-0"
                onClick={() => {
                  if (step > 1) {
                    clearErrors();
                    setStep(step - 1);
                  } else {
                    navigate('/login');
                  }
                }}
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                {step > 1 ? "Back" : "Back to log in"}
              </button>

              {step === 1 && (
                <>
                  <h1 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Forgot password?</h1>
                  <p className="text-gray-500 text-sm">
                    Please enter your Employee ID below to receive a password reset code.
                  </p>
                </>
              )}
            </div>
          )}

          {error && (
            <div className="p-3 mb-6 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => dispatch(clearAuthMessage())} className="bg-transparent border-none text-red-600 cursor-pointer font-bold px-1">✕</button>
            </div>
          )}
          {successMessage && step !== 4 && (
            <div className="p-3 mb-6 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
              <span>{successMessage}</span>
              <button onClick={() => dispatch(clearAuthMessage())} className="bg-transparent border-none text-green-700 cursor-pointer font-bold px-1">✕</button>
            </div>
          )}

          {/* STEP 1: Request OTP */}
          {step === 1 && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="empId" className="text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  id="empId" type="text" placeholder="e.g. EMP-0001"
                  value={empId} onChange={(e) => { setEmpId(e.target.value); setFieldErrors({}); }}
                  className={`h-12 px-4 rounded-lg border ${fieldErrors.empId ? 'border-red-500' : 'border-gray-300'} outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 w-full box-border`}
                />
                {fieldErrors.empId && <small className="text-red-500 text-xs">{fieldErrors.empId}</small>}
              </div>
              <button type="submit" disabled={loading} className="w-full h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 border-none cursor-pointer text-base">
                {loading ? "Sending Code..." : "Receive Reset Code"}
              </button>
            </form>
          )}

          {/* STEP 2: Enter OTP */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Enter OTP</h3>
                <p className="text-gray-500 text-sm mt-2">
                  We've sent a secure reset code to your registered contact for Employee ID <strong className="text-gray-900">{empId}</strong>.
                </p>
              </div>
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="otpToken" className="text-sm font-medium text-gray-700">One-Time Password (OTP)</label>
                  <input
                    id="otpToken" type="text" placeholder="Enter 6-digit OTP" maxLength={6}
                    value={otpToken} onChange={(e) => { setOtpToken(e.target.value.replace(/\D/g, '')); setFieldErrors({}); }}
                    className={`h-12 px-4 rounded-lg border ${fieldErrors.otpToken ? 'border-red-500' : 'border-gray-300'} outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 w-full box-border text-center tracking-[0.5em] text-lg font-bold`}
                  />
                  {fieldErrors.otpToken && <small className="text-red-500 text-xs">{fieldErrors.otpToken}</small>}
                </div>

                <button type="submit" disabled={loading} className="w-full h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 border-none cursor-pointer text-base">
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>
              <div className="text-center mt-4">
                <button type="button" onClick={() => { clearErrors(); setStep(1); }} className="text-sm font-medium text-gray-500 hover:text-indigo-600 bg-transparent border-none cursor-pointer transition-colors">
                  Change Employee ID
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Create New Password</h3>
                <p className="text-gray-500 text-sm mt-2">
                  Please enter your new password below.
                </p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative">
                    <input
                      id="newPassword" type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters" value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setFieldErrors({}); }}
                      className={`h-12 px-4 pr-12 rounded-lg border ${fieldErrors.newPassword ? 'border-red-500' : 'border-gray-300'} outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 w-full box-border`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-gray-500 hover:text-gray-700 cursor-pointer p-1 flex items-center justify-center">
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {fieldErrors.newPassword && <small className="text-red-500 text-xs">{fieldErrors.newPassword}</small>}

                  {/* Password Strength Meter */}
                  {newPassword && (
                    <div className="mt-3 space-y-2">
                      {/* Strength bars */}
                      <div className="flex gap-1 h-1.5 w-full">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            style={{
                              flex: 1, height: '100%', borderRadius: '9999px',
                              transition: 'background-color 0.3s',
                              backgroundColor:
                                strengthScore >= level
                                  ? strengthScore <= 2 ? '#ef4444'
                                  : strengthScore <= 4 ? '#eab308'
                                  : '#22c55e'
                                : '#e5e7eb',
                            }}
                          />
                        ))}
                      </div>
                      {/* Strength label */}
                      <p className="text-xs font-medium flex justify-between">
                        <span className="text-gray-500">Password Strength:</span>
                        <span style={{ color: strengthScore <= 2 ? '#ef4444' : strengthScore <= 4 ? '#eab308' : '#22c55e', fontWeight: 600 }}>
                          {strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Fair' : 'Strong'}
                        </span>
                      </p>
                      {/* Criteria checklist */}
                      <ul className="space-y-1">
                        {[
                          { key: 'length',    met: strengthCriteria.length,                                       label: 'At least 8 characters' },
                          { key: 'case',      met: strengthCriteria.uppercase && strengthCriteria.lowercase,       label: 'Uppercase & lowercase letters' },
                          { key: 'number',    met: strengthCriteria.number,                                        label: 'At least one number' },
                          { key: 'special',   met: strengthCriteria.special,                                       label: 'At least one special character (!@#$...)' },
                        ].map(({ key, met, label }) => (
                          <li key={key} className="flex items-center gap-2 text-xs" style={{ color: met ? '#16a34a' : '#9ca3af' }}>
                            <span style={{ fontSize: '0.75rem' }}>{met ? '✓' : '○'}</span>
                            {label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    id="confirmPassword" type={showPassword ? 'text' : 'password'}
                    placeholder="Re-enter new password" value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors({}); }}
                    className={`h-12 px-4 rounded-lg border ${fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-gray-900 w-full box-border`}
                  />
                  {fieldErrors.confirmPassword && <small className="text-red-500 text-xs">{fieldErrors.confirmPassword}</small>}
                </div>

                <button type="submit" disabled={loading} className="w-full h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2 border-none cursor-pointer text-base">
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Success!</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Your password has been reset successfully.<br />You can now log in with your new password.
              </p>
              <Link to="/login" className="inline-flex items-center justify-center w-full h-12 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors no-underline">
                Back to Login
              </Link>
            </div>
          )}

          <div className="mt-12 text-center text-xs text-gray-400">
            &copy; {new Date().getFullYear()} MPOnline Limited. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

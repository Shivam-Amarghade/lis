// src/api/authAPI.js
import API from './axiosConfig';

// ─── GET CAPTCHA ─────────────────────────────────────────────────────────────
// GET /api/auth/captcha
// Returns captcha image + captchaToken to use in login/OTP-login payload
export const getCaptcha = async () => {
  const response = await API.get('/auth/captcha');
  return response;
};

// ─── LOGIN ───────────────────────────────────────────────────────────────────
// POST /api/auth/login
// Body: { empId, password, captchaToken, captchaValue }
// Response: { jwtToken, refreshToken, user }
export const loginAPI = async ({ empId, password, captchaToken, captchaValue }) => {
  const response = await API.post('/auth/login', {
    empId,
    password,
    captchaToken,
    captchaValue,
  });
  return response.data;
};

// ─── LOGOUT ──────────────────────────────────────────────────────────────────
// POST /api/auth/logout
// No body — JWT token sent via Authorization header (handled by axiosConfig)
export const logoutAPI = async () => {
  const response = await API.post('/auth/logout');
  return response.data;
};

// ─── REFRESH TOKEN ───────────────────────────────────────────────────────────
// POST /api/auth/refresh-token
// Body: { jwtToken, refreshToken }
export const refreshTokenAPI = async ({ jwtToken, refreshToken }) => {
  const response = await API.post('/auth/refresh-token', { jwtToken, refreshToken });
  return response.data;
};

// ─── FORGOT PASSWORD ─────────────────────────────────────────────────────────
// POST /api/auth/forgot-password
// Body: { empId }
export const forgotPasswordAPI = async (empId) => {
  const response = await API.post('/auth/forgot-password', { empId });
  return response.data;
};

// ─── VERIFY OTP ──────────────────────────────────────────────────────────────
// POST /api/auth/verify-otp
// Body: { empId, otpToken }
export const verifyOtpAPI = async ({ empId, otpToken }) => {
  const response = await API.post('/auth/verify-otp', { empId, otpToken });
  return response.data;
};

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
// POST /api/auth/reset-password
// Body: { empId, newPassword, otpToken, confirmPassword }
export const resetPasswordAPI = async ({ empId, newPassword, otpToken, confirmPassword }) => {
  const response = await API.post('/auth/reset-password', {
    empId,
    newPassword,
    otpToken,
    confirmPassword,
  });
  return response.data;
};

// ─── SEND LOGIN OTP ──────────────────────────────────────────────────────────
// POST /api/auth/send-login-otp
// Body: { empId }
export const sendOtpAPI = async (empId) => {
  const response = await API.post('/auth/send-login-otp', { empId });
  return response.data;
};

// ─── LOGIN WITH OTP ──────────────────────────────────────────────────────────
// POST /api/auth/login-with-otp
// Body: { empId, otpToken, captchaToken, captchaValue }
// Response: { jwtToken, refreshToken, user }
export const loginWithOtpAPI = async ({ empId, otpToken, captchaToken, captchaValue }) => {
  const response = await API.post('/auth/login-with-otp', {
    empId,
    otpToken,
    captchaToken,
    captchaValue,
  });
  return response.data;
};

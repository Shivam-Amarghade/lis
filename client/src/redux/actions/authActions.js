// src/redux/actions/authActions.js
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  LOGIN_WITH_OTP_REQUEST, LOGIN_WITH_OTP_SUCCESS, LOGIN_WITH_OTP_FAILURE,
  FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE,
  RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE,
  CLEAR_AUTH_MESSAGE,
} from './actionTypes';

import {
  loginAPI,
  logoutAPI,
  sendOtpAPI,
  loginWithOtpAPI,
  forgotPasswordAPI,
  verifyOtpAPI,
  resetPasswordAPI,
  refreshTokenAPI,
} from '../../api/authAPI';

// ─── LOGIN THUNK ─────────────────────────────────────────────────────────────
// credentials: { empId, password, captchaToken, captchaValue }
// Real API response: { jwtToken, refreshToken, user }
export const loginUser = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const data = await loginAPI(credentials);
    localStorage.setItem('jwtToken', data.jwtToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    dispatch({ type: LOGIN_SUCCESS, payload: data.user });
  } catch (error) {
    const message = error.response?.data?.message || 'Login failed. Please try again.';
    dispatch({ type: LOGIN_FAILURE, payload: message });
  }
};

// ─── LOGOUT THUNK ────────────────────────────────────────────────────────────
export const logoutUser = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    await logoutAPI();
  } catch (error) {
    // Even if API fails, clear local session
  } finally {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('refreshToken');
    dispatch({ type: LOGOUT_SUCCESS });
  }
};

// ─── SEND LOGIN OTP ──────────────────────────────────────────────────────────
// empId: string
export const sendOTPAction = (empId) => async (dispatch) => {
  dispatch({ type: SEND_OTP_REQUEST });
  try {
    const data = await sendOtpAPI(empId);
    dispatch({ type: SEND_OTP_SUCCESS, payload: data.message });
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to send OTP. Please try again.';
    dispatch({ type: SEND_OTP_FAILURE, payload: message });
  }
};

// ─── LOGIN WITH OTP THUNK ────────────────────────────────────────────────────
// credentials: { empId, otpToken, captchaToken, captchaValue }
// Real API response: { jwtToken, refreshToken, user }
export const loginWithOtpUser = (credentials) => async (dispatch) => {
  dispatch({ type: LOGIN_WITH_OTP_REQUEST });
  try {
    const data = await loginWithOtpAPI(credentials);
    localStorage.setItem('jwtToken', data.jwtToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    dispatch({ type: LOGIN_WITH_OTP_SUCCESS, payload: data.user });
  } catch (error) {
    const message = error.response?.data?.message || 'OTP login failed. Please try again.';
    dispatch({ type: LOGIN_WITH_OTP_FAILURE, payload: message });
  }
};

// ─── FORGOT PASSWORD THUNK ───────────────────────────────────────────────────
// empId: string
export const forgotPassword = (empId) => async (dispatch) => {
  dispatch({ type: FORGOT_PASSWORD_REQUEST });
  try {
    const data = await forgotPasswordAPI(empId);
    dispatch({ type: FORGOT_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    dispatch({ type: FORGOT_PASSWORD_FAILURE, payload: message });
  }
};

// ─── VERIFY OTP THUNK ────────────────────────────────────────────────────────
// { empId, otpToken }
export const verifyOTPAction = ({ empId, otpToken }) => async (dispatch) => {
  dispatch({ type: VERIFY_OTP_REQUEST });
  try {
    const data = await verifyOtpAPI({ empId, otpToken });
    dispatch({ type: VERIFY_OTP_SUCCESS, payload: data.message });
  } catch (error) {
    const message = error.response?.data?.message || 'OTP verification failed.';
    dispatch({ type: VERIFY_OTP_FAILURE, payload: message });
  }
};

// ─── RESET PASSWORD THUNK ────────────────────────────────────────────────────
// { empId, newPassword, otpToken, confirmPassword }
export const resetPasswordAction = (resetData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const data = await resetPasswordAPI(resetData);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message });
  } catch (error) {
    const message = error.response?.data?.message || 'Password reset failed.';
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: message });
  }
};

// ─── CLEAR MESSAGES ──────────────────────────────────────────────────────────
export const clearAuthMessage = () => ({ type: CLEAR_AUTH_MESSAGE });

// ─── CHANGE PASSWORD (alias → reset-password endpoint) ───────────────────────
// ChangePasswordPage.jsx uses this — maps to RESET_PASSWORD flow
// Body: { empId, newPassword, otpToken, confirmPassword }
export const changePassword = (passwordData) => async (dispatch) => {
  dispatch({ type: RESET_PASSWORD_REQUEST });
  try {
    const data = await resetPasswordAPI(passwordData);
    dispatch({ type: RESET_PASSWORD_SUCCESS, payload: data.message || 'Password changed successfully.' });
  } catch (error) {
    const message = error.response?.data?.message || 'Password change failed.';
    dispatch({ type: RESET_PASSWORD_FAILURE, payload: message });
  }
};

// src/redux/actions/actionTypes.js

// ── LOGIN ──────────────────────────────────────────────────────────────────
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';

// ── LOGOUT ─────────────────────────────────────────────────────────────────
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILURE = 'LOGOUT_FAILURE';

// ── SEND LOGIN OTP ─────────────────────────────────────────────────────────
export const SEND_OTP_REQUEST = 'SEND_OTP_REQUEST';
export const SEND_OTP_SUCCESS = 'SEND_OTP_SUCCESS';
export const SEND_OTP_FAILURE = 'SEND_OTP_FAILURE';

// ── LOGIN WITH OTP ─────────────────────────────────────────────────────────
export const LOGIN_WITH_OTP_REQUEST = 'LOGIN_WITH_OTP_REQUEST';
export const LOGIN_WITH_OTP_SUCCESS = 'LOGIN_WITH_OTP_SUCCESS';
export const LOGIN_WITH_OTP_FAILURE = 'LOGIN_WITH_OTP_FAILURE';

// ── FORGOT PASSWORD ────────────────────────────────────────────────────────
export const FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST';
export const FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS';
export const FORGOT_PASSWORD_FAILURE = 'FORGOT_PASSWORD_FAILURE';

// ── VERIFY OTP (forgot password flow) ─────────────────────────────────────
export const VERIFY_OTP_REQUEST = 'VERIFY_OTP_REQUEST';
export const VERIFY_OTP_SUCCESS = 'VERIFY_OTP_SUCCESS';
export const VERIFY_OTP_FAILURE = 'VERIFY_OTP_FAILURE';

// ── RESET PASSWORD ─────────────────────────────────────────────────────────
export const RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS = 'RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_FAILURE = 'RESET_PASSWORD_FAILURE';

// ── MISC ───────────────────────────────────────────────────────────────────
export const CLEAR_AUTH_MESSAGE = 'CLEAR_AUTH_MESSAGE';

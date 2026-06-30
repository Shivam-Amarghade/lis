// src/redux/reducers/authReducer.js
import {
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT_REQUEST, LOGOUT_SUCCESS, LOGOUT_FAILURE,
  SEND_OTP_REQUEST, SEND_OTP_SUCCESS, SEND_OTP_FAILURE,
  LOGIN_WITH_OTP_REQUEST, LOGIN_WITH_OTP_SUCCESS, LOGIN_WITH_OTP_FAILURE,
  FORGOT_PASSWORD_REQUEST, FORGOT_PASSWORD_SUCCESS, FORGOT_PASSWORD_FAILURE,
  VERIFY_OTP_REQUEST, VERIFY_OTP_SUCCESS, VERIFY_OTP_FAILURE,
  RESET_PASSWORD_REQUEST, RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAILURE,
  CLEAR_AUTH_MESSAGE,
} from '../actions/actionTypes';

const initialState = {
  user: null,
  jwtToken: localStorage.getItem('jwtToken') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: !!localStorage.getItem('jwtToken'),
  loading: false,
  error: null,
  successMessage: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {

    // ── LOGIN ──────────────────────────────────────────────────────────────
    case LOGIN_REQUEST:
    case LOGIN_WITH_OTP_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };

    case LOGIN_SUCCESS:
    case LOGIN_WITH_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };

    case LOGIN_FAILURE:
    case LOGIN_WITH_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── LOGOUT ─────────────────────────────────────────────────────────────
    case LOGOUT_REQUEST:
      return { ...state, loading: true };

    case LOGOUT_SUCCESS:
      return {
        ...initialState,
        jwtToken: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
      };

    case LOGOUT_FAILURE:
      return { ...state, loading: false };

    // ── SEND OTP ───────────────────────────────────────────────────────────
    case SEND_OTP_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };

    case SEND_OTP_SUCCESS:
      return { ...state, loading: false, successMessage: action.payload };

    case SEND_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── FORGOT PASSWORD ────────────────────────────────────────────────────
    case FORGOT_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };

    case FORGOT_PASSWORD_SUCCESS:
      return { ...state, loading: false, successMessage: action.payload };

    case FORGOT_PASSWORD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── VERIFY OTP ─────────────────────────────────────────────────────────
    case VERIFY_OTP_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };

    case VERIFY_OTP_SUCCESS:
      return { ...state, loading: false, successMessage: action.payload };

    case VERIFY_OTP_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── RESET PASSWORD ─────────────────────────────────────────────────────
    case RESET_PASSWORD_REQUEST:
      return { ...state, loading: true, error: null, successMessage: null };

    case RESET_PASSWORD_SUCCESS:
      return { ...state, loading: false, successMessage: action.payload };

    case RESET_PASSWORD_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ── CLEAR MESSAGES ─────────────────────────────────────────────────────
    case CLEAR_AUTH_MESSAGE:
      return { ...state, error: null, successMessage: null };

    default:
      return state;
  }
};

export default authReducer;

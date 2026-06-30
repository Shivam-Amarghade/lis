// src/pages/LoginPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  clearAuthMessage,
  loginUser,
  loginWithOtpUser,
  sendOTPAction,
} from "../redux/actions/authActions";

import { getCaptcha } from "../api/authAPI";

// ── Tiny cn() helper (no @/lib/utils needed) ─────────────────────────────────
const cn = (...classes) => classes.filter(Boolean).join(" ");

// ── Eye icons (no lucide-react needed) ───────────────────────────────────────
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
    <line x1="2" x2="22" y1="2" y2="22" />
  </svg>
);

// ── Animated Pupil (dot inside eyeball) ─────────────────────────────────────
const Pupil = ({ size = 12, maxDistance = 5, pupilColor = "black", forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const pupilRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!pupilRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const pupil = pupilRef.current.getBoundingClientRect();
    const pupilCenterX = pupil.left + pupil.width / 2;
    const pupilCenterY = pupil.top + pupil.height / 2;
    const deltaX = mouseX - pupilCenterX;
    const deltaY = mouseY - pupilCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pupilPosition = calculatePupilPosition();
  return (
    <div ref={pupilRef} style={{
      width: `${size}px`, height: `${size}px`, borderRadius: "50%",
      backgroundColor: pupilColor,
      transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
      transition: "transform 0.1s ease-out",
    }} />
  );
};

// ── Animated Eyeball ─────────────────────────────────────────────────────────
const EyeBall = ({ size = 48, pupilSize = 16, maxDistance = 10, eyeColor = "white",
  pupilColor = "black", isBlinking = false, forceLookX, forceLookY }) => {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const eyeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const calculatePupilPosition = () => {
    if (!eyeRef.current) return { x: 0, y: 0 };
    if (forceLookX !== undefined && forceLookY !== undefined) return { x: forceLookX, y: forceLookY };
    const eye = eyeRef.current.getBoundingClientRect();
    const eyeCenterX = eye.left + eye.width / 2;
    const eyeCenterY = eye.top + eye.height / 2;
    const deltaX = mouseX - eyeCenterX;
    const deltaY = mouseY - eyeCenterY;
    const distance = Math.min(Math.sqrt(deltaX ** 2 + deltaY ** 2), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  };

  const pupilPosition = calculatePupilPosition();
  return (
    <div ref={eyeRef} style={{
      width: `${size}px`, height: isBlinking ? "2px" : `${size}px`,
      borderRadius: "50%", backgroundColor: eyeColor,
      display: "flex", alignItems: "center", justifyContent: "center",
      overflow: "hidden", transition: "all 0.15s",
    }}>
      {!isBlinking && (
        <div style={{
          width: `${pupilSize}px`, height: `${pupilSize}px`, borderRadius: "50%",
          backgroundColor: pupilColor,
          transform: `translate(${pupilPosition.x}px, ${pupilPosition.y}px)`,
          transition: "transform 0.1s ease-out",
        }} />
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LoginPage
// ─────────────────────────────────────────────────────────────────────────────
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, successMessage, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // ── Login mode: "password" | "otp" ───────────────────────────────────────
  const [loginType, setLoginType] = useState("password");
  const [otpTimer, setOtpTimer] = useState(0);
  const [isOtpSentRequested, setIsOtpSentRequested] = useState(false);

  // ── Form fields (matching real API) ──────────────────────────────────────
  const [formData, setFormData] = useState({ empId: "", password: "", otpToken: "" });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // ── Captcha state ─────────────────────────────────────────────────────────
  const [captcha, setCaptcha] = useState(null);        // { image, captchaToken }
  const [captchaValue, setCaptchaValue] = useState(""); // typed by user
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [captchaError, setCaptchaError] = useState(null);

  // ── Animation state ───────────────────────────────────────────────────────
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [isPurpleBlinking, setIsPurpleBlinking] = useState(false);
  const [isBlackBlinking, setIsBlackBlinking] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLookingAtEachOther, setIsLookingAtEachOther] = useState(false);
  const [isPurplePeeking, setIsPurplePeeking] = useState(false);

  const purpleRef = useRef(null);
  const blackRef = useRef(null);
  const yellowRef = useRef(null);
  const orangeRef = useRef(null);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => { dispatch(clearAuthMessage()); }, [dispatch]);

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);

  useEffect(() => { loadCaptcha(); }, []);

  useEffect(() => {
    if (otpTimer > 0) {
      const timerId = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [otpTimer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOtpSentRequested && !loading) {
      if (successMessage) {
        setOtpTimer(120);
      }
      setIsOtpSentRequested(false);
    }
  }, [loading, successMessage, isOtpSentRequested]);

  useEffect(() => {
    const handleMouseMove = (e) => { setMouseX(e.clientX); setMouseY(e.clientY); };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Purple blink
  useEffect(() => {
    const scheduleBlink = () => setTimeout(() => {
      setIsPurpleBlinking(true);
      setTimeout(() => { setIsPurpleBlinking(false); scheduleBlink(); }, 150);
    }, Math.random() * 4000 + 3000);
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Black blink
  useEffect(() => {
    const scheduleBlink = () => setTimeout(() => {
      setIsBlackBlinking(true);
      setTimeout(() => { setIsBlackBlinking(false); scheduleBlink(); }, 150);
    }, Math.random() * 4000 + 3000);
    const t = scheduleBlink();
    return () => clearTimeout(t);
  }, []);

  // Look at each other when typing
  useEffect(() => {
    if (isTyping) {
      setIsLookingAtEachOther(true);
      const t = setTimeout(() => setIsLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    } else {
      setIsLookingAtEachOther(false);
    }
  }, [isTyping]);

  // Peek when password visible
  useEffect(() => {
    if (formData.password.length > 0 && showPassword) {
      const t = setTimeout(() => {
        setIsPurplePeeking(true);
        setTimeout(() => setIsPurplePeeking(false), 800);
      }, Math.random() * 3000 + 2000);
      return () => clearTimeout(t);
    } else {
      setIsPurplePeeking(false);
    }
  }, [formData.password, showPassword]);

  // ── Captcha ───────────────────────────────────────────────────────────────
  const loadCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      setCaptchaError(null);
      const { data } = await getCaptcha();
      setCaptcha(data);
      setCaptchaValue("");
    } catch (err) {
      const msg = err.code === 'ECONNABORTED' || err.message?.includes('timeout')
        ? 'Server timeout — backend unreachable. Please check the server.'
        : err.response?.data?.message || 'Could not load captcha. Retry?';
      setCaptchaError(msg);
      console.error("Failed to load captcha:", err);
    } finally {
      setCaptchaLoading(false);
    }
  };

  // ── Animation helpers ─────────────────────────────────────────────────────
  const calculatePosition = (ref) => {
    if (!ref.current) return { faceX: 0, faceY: 0, bodySkew: 0 };
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 3;
    const deltaX = mouseX - centerX;
    const deltaY = mouseY - centerY;
    const faceX = Math.max(-15, Math.min(15, deltaX / 20));
    const faceY = Math.max(-10, Math.min(10, deltaY / 30));
    const bodySkew = Math.max(-6, Math.min(6, -deltaX / 120));
    return { faceX, faceY, bodySkew };
  };

  const purplePos = calculatePosition(purpleRef);
  const blackPos = calculatePosition(blackRef);
  const yellowPos = calculatePosition(yellowRef);
  const orangePos = calculatePosition(orangeRef);

  const isHidingEyes = loginType === "password" && formData.password.length > 0 && !showPassword;
  const passwordVisible = formData.password.length > 0 && showPassword;

  // ── Form handlers ─────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSendOTP = () => {
    if (!formData.empId.trim()) {
      setFormErrors((prev) => ({ ...prev, empId: "Employee ID is required to send OTP." }));
      return;
    }
    setIsOtpSentRequested(true);
    dispatch(sendOTPAction(formData.empId));
  };

  const validate = () => {
    const errors = {};
    if (!formData.empId.trim()) errors.empId = "Employee ID is required.";
    if (loginType === "password" && !formData.password) errors.password = "Password is required.";
    if (loginType === "otp" && !formData.otpToken.trim()) errors.otpToken = "OTP is required.";
    if (!captchaValue.trim()) errors.captchaValue = "Please enter the captcha.";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearAuthMessage());
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }

    const captchaToken = captcha?.token || captcha?.captchaToken;

    if (loginType === "password") {
      dispatch(loginUser({ empId: formData.empId, password: formData.password, captchaToken, captchaValue }));
    } else {
      dispatch(loginWithOtpUser({ empId: formData.empId, otpToken: formData.otpToken, captchaToken, captchaValue }));
    }
    loadCaptcha();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>

      {/* ── LEFT PANEL: Animated characters ─────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900" style={{
        position: "relative", display: "flex", flexDirection: "column",
        justifyContent: "space-between",
        padding: "48px", color: "#fff", overflow: "hidden",
      }}>
        {/* Logo */}
        <div style={{ position: "relative", zIndex: 20 }}>
          <div className="relative z-20 w-full flex justify-start -mt-4">
            <div className="flex items-center gap-6">
              <img src="public/logo4.png" alt="iEvolve Logo" className="h-52 w-52 object-contain" />
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
        </div>

        {/* Characters */}
        <div style={{ position: "relative", zIndex: 20, display: "flex", alignItems: "flex-end", justifyContent: "center", height: "460px" }}>
          <div style={{ position: "relative", width: "550px", height: "400px" }}>

            {/* Purple tall character */}
            <div ref={purpleRef} style={{
              position: "absolute", bottom: 0, left: "70px",
              width: "180px",
              height: (isTyping || isHidingEyes) ? "440px" : "400px",
              backgroundColor: "#6536f1ff",
              borderRadius: "10px 10px 0 0", zIndex: 1,
              transition: "all 0.7s ease-in-out",
              transform: passwordVisible
                ? "skewX(0deg)"
                : (isTyping || isHidingEyes)
                  ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                  : `skewX(${purplePos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}>
              <div style={{
                position: "absolute", display: "flex", gap: "32px",
                left: passwordVisible ? "20px" : isLookingAtEachOther ? "55px" : `${45 + purplePos.faceX}px`,
                top: passwordVisible ? "35px" : isLookingAtEachOther ? "65px" : `${40 + purplePos.faceY}px`,
                transition: "all 0.7s ease-in-out",
              }}>
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
                <EyeBall size={18} pupilSize={7} maxDistance={5} eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isPurpleBlinking}
                  forceLookX={passwordVisible ? (isPurplePeeking ? 4 : -4) : isLookingAtEachOther ? 3 : undefined}
                  forceLookY={passwordVisible ? (isPurplePeeking ? 5 : -4) : isLookingAtEachOther ? 4 : undefined} />
              </div>
            </div>

            {/* Dark/black character */}
            <div ref={blackRef} style={{
              position: "absolute", bottom: 0, left: "240px",
              width: "120px", height: "310px",
              backgroundColor: "#040404ff", borderRadius: "8px 8px 0 0", zIndex: 2,
              transition: "all 0.7s ease-in-out",
              transform: passwordVisible
                ? "skewX(0deg)"
                : isLookingAtEachOther
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : (isTyping || isHidingEyes)
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                    : `skewX(${blackPos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}>
              <div style={{
                position: "absolute", display: "flex", gap: "24px",
                left: passwordVisible ? "10px" : isLookingAtEachOther ? "32px" : `${26 + blackPos.faceX}px`,
                top: passwordVisible ? "28px" : isLookingAtEachOther ? "12px" : `${32 + blackPos.faceY}px`,
                transition: "all 0.7s ease-in-out",
              }}>
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
                <EyeBall size={16} pupilSize={6} maxDistance={4} eyeColor="white" pupilColor="#2D2D2D"
                  isBlinking={isBlackBlinking}
                  forceLookX={passwordVisible ? -4 : isLookingAtEachOther ? 0 : undefined}
                  forceLookY={passwordVisible ? -4 : isLookingAtEachOther ? -4 : undefined} />
              </div>
            </div>

            {/* Orange rounded character */}
            <div ref={orangeRef} style={{
              position: "absolute", bottom: 0, left: "0px",
              width: "240px", height: "200px",
              backgroundColor: "#e56023ff", borderRadius: "120px 120px 0 0", zIndex: 3,
              transition: "all 0.7s ease-in-out",
              transform: passwordVisible ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}>
              <div style={{
                position: "absolute", display: "flex", gap: "32px",
                left: passwordVisible ? "50px" : `${82 + (orangePos.faceX || 0)}px`,
                top: passwordVisible ? "85px" : `${90 + (orangePos.faceY || 0)}px`,
                transition: "all 0.2s ease-out",
              }}>
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
              </div>
            </div>

            {/* Yellow rounded character */}
            <div ref={yellowRef} style={{
              position: "absolute", bottom: 0, left: "310px",
              width: "140px", height: "230px",
              backgroundColor: "#ecd10bff", borderRadius: "70px 70px 0 0", zIndex: 4,
              transition: "all 0.7s ease-in-out",
              transform: passwordVisible ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
              transformOrigin: "bottom center",
            }}>
              <div style={{
                position: "absolute", display: "flex", gap: "24px",
                left: passwordVisible ? "20px" : `${52 + (yellowPos.faceX || 0)}px`,
                top: passwordVisible ? "35px" : `${40 + (yellowPos.faceY || 0)}px`,
                transition: "all 0.2s ease-out",
              }}>
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
                <Pupil size={12} maxDistance={5} pupilColor="#2D2D2D"
                  forceLookX={passwordVisible ? -5 : undefined}
                  forceLookY={passwordVisible ? -4 : undefined} />
              </div>
              {/* Mouth */}
              <div style={{
                position: "absolute", width: "80px", height: "4px",
                backgroundColor: "#2D2D2D", borderRadius: "4px",
                left: passwordVisible ? "10px" : `${40 + (yellowPos.faceX || 0)}px`,
                top: passwordVisible ? "88px" : `${88 + (yellowPos.faceY || 0)}px`,
                transition: "all 0.2s ease-out",
              }} />
            </div>
          </div>
        </div>



        {/* Background blobs */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "absolute", top: "25%", right: "25%", width: "256px", height: "256px", background: "rgba(255,255,255,0.06)", borderRadius: "50%", filter: "blur(48px)" }} />
        <div style={{ position: "absolute", bottom: "25%", left: "25%", width: "384px", height: "384px", background: "rgba(255,255,255,0.04)", borderRadius: "50%", filter: "blur(48px)" }} />
      </div>

      {/* ── RIGHT PANEL: Login form ──────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>

          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ fontSize: "1.875rem", fontWeight: 700, marginBottom: "8px", color: "#111827" }}>Welcome back!</h1>
            <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>Sign in to your IEvolve LMS account</p>
          </div>

          {/* Error alert */}
          {error && (
            <div style={{
              padding: "12px 16px", marginBottom: "16px", borderRadius: "8px",
              background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
              fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>{error}</span>
              <button onClick={() => dispatch(clearAuthMessage())} style={{
                background: "transparent", border: "none", color: "inherit",
                cursor: "pointer", fontWeight: 700, padding: "0 4px",
              }}>✕</button>
            </div>
          )}

          {/* Success alert */}
          {successMessage && (
            <div style={{
              padding: "12px 16px", marginBottom: "16px", borderRadius: "8px",
              background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a",
              fontSize: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span>{successMessage}</span>
              <button onClick={() => dispatch(clearAuthMessage())} style={{
                background: "transparent", border: "none", color: "inherit",
                cursor: "pointer", fontWeight: 700, padding: "0 4px",
              }}>✕</button>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* Login type toggle */}
            <div style={{
              display: "flex", gap: "4px", padding: "4px",
              background: "#f1f5f9", borderRadius: "12px",
            }}>
              {[{ key: "password", label: "Password Login" }, { key: "otp", label: "OTP Login" }].map(({ key, label }) => (
                <button key={key} type="button" onClick={() => setLoginType(key)} style={{
                  flex: 1, padding: "10px", fontSize: "0.875rem", fontWeight: 500,
                  borderRadius: "8px", border: "none", cursor: "pointer",
                  transition: "all 0.2s",
                  background: loginType === key ? "#fff" : "transparent",
                  color: loginType === key ? "#111827" : "#6b7280",
                  boxShadow: loginType === key ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                }}>
                  {label}
                </button>
              ))}
            </div>

            {/* Employee ID */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label htmlFor="empId" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                Username
              </label>
              <input
                id="empId"
                name="empId"
                type="text"
                placeholder="e.g. EMP-0001"
                value={formData.empId}
                autoComplete="username"
                onChange={handleChange}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(false)}
                style={{
                  height: "48px", padding: "0 14px", borderRadius: "8px",
                  border: formErrors.empId ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                  fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s",
                  color: "#111827", background: "#fff", width: "100%", boxSizing: "border-box",
                }}
              />
              {formErrors.empId && <small style={{ color: "#ef4444", fontSize: "0.78rem" }}>{formErrors.empId}</small>}
            </div>

            {/* Password field */}
            {loginType === "password" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="password" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    style={{
                      height: "48px", padding: "0 44px 0 14px", borderRadius: "8px",
                      border: formErrors.password ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "0.95rem", outline: "none", transition: "border-color 0.2s",
                      color: "#111827", background: "#fff", width: "100%", boxSizing: "border-box",
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    background: "transparent", border: "none", cursor: "pointer",
                    color: "#6b7280", display: "flex", alignItems: "center",
                  }}>
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
                {formErrors.password && <small style={{ color: "#ef4444", fontSize: "0.78rem" }}>{formErrors.password}</small>}
                <div style={{ textAlign: "right" }}>
                  <Link to="/forgot-password" style={{ fontSize: "0.85rem", color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}>
                    Forgot password?
                  </Link>
                </div>
              </div>
            )}

            {/* OTP field */}
            {loginType === "otp" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="otpToken" style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151" }}>
                  OTP
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    id="otpToken"
                    name="otpToken"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otpToken}
                    onChange={handleChange}
                    maxLength={6}
                    style={{
                      flex: 1, height: "48px", padding: "0 14px", borderRadius: "8px",
                      border: formErrors.otpToken ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                      fontSize: "0.95rem", outline: "none",
                      color: "#111827", background: "#fff", boxSizing: "border-box",
                    }}
                  />
                  <button type="button" onClick={handleSendOTP} disabled={loading || otpTimer > 0} style={{
                    padding: "0 18px", height: "48px", borderRadius: "8px",
                    background: (loading || otpTimer > 0) ? "#9ca3af" : "#4f46e5", color: "#fff", border: "none", cursor: (loading || otpTimer > 0) ? "not-allowed" : "pointer",
                    fontWeight: 600, fontSize: "0.875rem", whiteSpace: "nowrap",
                    opacity: loading ? 0.7 : 1,
                    transition: "all 0.2s"
                  }}>
                    {loading ? "Sending…" : otpTimer > 0 ? formatTime(otpTimer) : "Send OTP"}
                  </button>
                </div>
                {formErrors.otpToken && <small style={{ color: "#ef4444", fontSize: "0.78rem" }}>{formErrors.otpToken}</small>}
              </div>
            )}

            {/* Captcha */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Security Check label */}
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#111827", letterSpacing: "0.03em", textTransform: "uppercase" }}>
                  Security Check
                </span>
              </div>
{captchaLoading ? (
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: "60px", borderRadius: "8px",
                  border: "1.5px dashed #e5e7eb", background: "#f9fafb", color: "#9ca3af", fontSize: "0.875rem",
                }}>
                  <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: "8px" }}>⏳</span>
                  Loading captcha…
                </div>
              ) : captchaError ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <img
                    src="data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='80' viewBox='0 0 300 80'%3E%3Crect width='300' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' font-weight='bold' fill='%239ca3af' letter-spacing='2'%3ECAPTCHA OFFLINE%3C/text%3E%3C/svg%3E"
                    alt="Default Captcha"
                    style={{ borderRadius: "8px", border: "1.5px solid #e5e7eb", width: "100%", height: "80px", objectFit: "cover" }}
                  />
                  <div style={{
                    padding: "8px 12px", borderRadius: "8px",
                    background: "#fff7ed", border: "1.5px solid #fed7aa",
                    color: "#c2410c", fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "space-between"
                  }}>
                    <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>⚠️ {captchaError}</span>
                    <button type="button" onClick={loadCaptcha} style={{
                      padding: "6px 12px", borderRadius: "6px", border: "1.5px solid #fed7aa",
                      background: "#fff", color: "#c2410c", cursor: "pointer",
                      fontSize: "0.75rem", fontWeight: 600, flexShrink: 0, marginLeft: "8px"
                    }}>
                      🔄 Retry
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {captcha?.image ? (
                    <img src={captcha.image} alt="Captcha"
                      style={{ borderRadius: "8px", border: "1.5px solid #e5e7eb", maxWidth: "100%", height: "auto" }} />
                  ) : captcha?.captchaText ? (
                    <div style={{
                      height: "60px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"200\" height=\"60\"><rect width=\"100%\" height=\"100%\" fill=\"%23e5e7eb\"/><path d=\"M0 0 L200 60 M200 0 L0 60 M100 0 L100 60\" stroke=\"%239ca3af\" stroke-width=\"1\" opacity=\"0.5\"/></svg>')",
                      borderRadius: "8px",
                      border: "1.5px solid #e5e7eb",
                      fontSize: "2rem",
                      fontWeight: "bold",
                      letterSpacing: "8px",
                      fontFamily: "monospace",
                      color: "#374151",
                      userSelect: "none",
                      textDecoration: "line-through",
                      textDecorationThickness: "2px",
                      textDecorationColor: "rgba(0,0,0,0.3)"
                    }}>
                      {captcha.captchaText}
                    </div>
                  ) : null}
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      id="captchaValue"
                      type="text"
                      placeholder="Enter captcha text"
                      value={captchaValue}
                      onChange={(e) => setCaptchaValue(e.target.value)}
                      autoComplete="off"
                      style={{
                        flex: 1, height: "44px", padding: "0 14px", borderRadius: "8px",
                        border: formErrors.captchaValue ? "1.5px solid #ef4444" : "1.5px solid #e5e7eb",
                        fontSize: "0.9rem", outline: "none",
                        color: "#111827", background: "#fff", boxSizing: "border-box",
                      }}
                    />
                    <button type="button" onClick={loadCaptcha} title="Refresh captcha" style={{
                      padding: "0 14px", height: "44px", borderRadius: "8px",
                      border: "1.5px solid #e5e7eb", background: "#f9fafb",
                      cursor: "pointer", fontSize: "0.875rem", color: "#374151",
                      transition: "all 0.2s",
                    }}>
                      Refresh
                    </button>
                  </div>
                  {formErrors.captchaValue && <small style={{ color: "#ef4444", fontSize: "0.78rem" }}>{formErrors.captchaValue}</small>}
                </>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || captchaLoading} style={{
              width: "100%", height: "48px", borderRadius: "10px", border: "none",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              color: "#fff", fontSize: "1rem", fontWeight: 600, cursor: "pointer",
              opacity: (loading || captchaLoading) ? 0.6 : 1,
              transition: "opacity 0.2s, transform 0.1s",
            }}>
              {loading ? "Signing in…" : "Log in"}
            </button>
          </form>

          <div style={{ textAlign: "center", fontSize: "0.75rem", color: "#9ca3af", marginTop: "32px" }}>
            &copy; {new Date().getFullYear()} MPOnline Limited
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
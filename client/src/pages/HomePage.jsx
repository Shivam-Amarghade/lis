// src/pages/HomePage.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const features = [
    { icon: '🔐', title: 'JWT Authentication', desc: 'Secure token-based auth with automatic refresh and session management.' },
    { icon: '♻️', title: 'Reusable Components', desc: 'Modular UI components — Navbar, Footer, Inputs — all fully composable.' },
    { icon: '⚡', title: 'Redux + Thunk', desc: 'Predictable state management with async API handling via Redux Thunk.' },
    { icon: '🛡️', title: 'Route Protection', desc: 'Protected routes automatically redirect unauthenticated users to login.' },
    { icon: '✅', title: 'Form Validation', desc: 'Client-side validation with instant, clear error feedback on all forms.' },
    { icon: '📱', title: 'Fully Responsive', desc: 'Mobile-first design that looks great on all screen sizes and devices.' },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA' },
    { value: '256-bit', label: 'Encryption' },
    { value: '<50ms', label: 'Auth Latency' },
    { value: 'ISO 27001', label: 'Compliant' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white overflow-hidden">
        {/* Background grid pattern */}
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        {/* Glow blobs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-24 lg:py-32 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            IEvolve LMS — Enterprise Learning Platform
          </div>

          {isAuthenticated ? (
            <>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Welcome back,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r ">
                  {user?.name || 'User'}! 👋
                </span>
              </h1>
              <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto mb-10">
                You are securely logged in. Access your learning dashboard, track progress, and manage your account from the navigation above.
              </p>

            </>
          ) : (
            <>
              <h1 className="text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
                Learn. Grow.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-indigo-300">
                  Evolve.
                </span>
              </h1>
              <p className="text-white/70 text-lg lg:text-xl max-w-2xl mx-auto mb-10">
                A secure, enterprise-grade Learning Management System built for MPOnline. JWT-powered authentication, role-based access, and a seamless experience.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">

              </div>
            </>

          )}

          {/* Logo + branding strip */}
          <div className="mt-16 flex items-center justify-center gap-4 opacity-70">
            <img src="/logo4.png" alt="iEvolve Logo" className="h-12 w-12 object-contain" />
            <div className="text-left">
              <p className="text-white font-bold text-lg leading-tight">iEvolve</p>
              <p className="text-white/60 text-xs">Learning Management System</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <section className="bg-indigo-950 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-white">{value}</p>
              <p className="text-indigo-300 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="inline-block text-indigo-600 text-sm font-semibold uppercase tracking-widest mb-3">Platform Features</span>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Enterprise-grade security and developer-friendly architecture, built to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => (
              <div key={feat.title} className="group bg-white rounded-2xl p-7 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feat.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      {!isAuthenticated && (
        <section className="relative bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
              Sign in to access your personalized learning dashboard and begin your journey with iEvolve LMS.
            </p>
            <Link to="/login" className="inline-flex items-center gap-2 bg-black text-white font-bold px-10 py-4 rounded-xl hover:bg-white hover:text-black transition-all no-underline shadow-xl text-base">
              Sign In Now →
            </Link>
          </div>
        </section>
      )}

      {/* ── FOOTER NOTE ───────────────────────────────────────────────────── */}
      <div className="bg-gray-900 text-center py-5 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} MPOnline Limited. All rights reserved.
      </div>
    </div>
  );
};

export default HomePage;

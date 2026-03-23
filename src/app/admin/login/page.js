'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleLogin() {
    if (!username || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) router.push('/admin/dashboard');
      else { setError(data.error || 'Invalid credentials.'); setLoading(false); }
    } catch { setError('Network error. Try again.'); setLoading(false); }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        @keyframes slideInLeft {
          from { opacity:0; transform:translateX(-32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity:0; transform:translateX(32px); }
          to   { opacity:1; transform:translateX(0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes shimmer {
          0%   { transform:translateX(-100%) skewX(-15deg); }
          100% { transform:translateX(300%) skewX(-15deg); }
        }
        @keyframes spin {
          to { transform:rotate(360deg); }
        }
        @keyframes errorIn {
          from { opacity:0; transform:translateY(-6px); }
          to   { opacity:1; transform:translateY(0); }
        }

        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

        .al-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f5f9;
          font-family: 'Inter', sans-serif;
          padding: 20px;
        }

        .al-container {
          display: flex;
          width: 820px;
          height: 480px;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 56px rgba(0,0,0,0.10), 0 4px 14px rgba(0,0,0,0.06);
        }

        /* ── LEFT: Login Form ── */
        .al-left {
          width: 360px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 24px 36px;
          animation: slideInLeft 0.75s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* Logo — no bottom gap */
        .al-logo-wrap {
          margin-bottom: 8px;
        }
        .al-logo-wrap img {
          width: 200px;
          height: 170px;
          object-fit: contain;
          display: block;
        }

        /* Login heading — smaller */
        .al-heading {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: -0.2px;
          margin-bottom: 3px;
          animation: fadeUp 0.6s 0.2s both;
          opacity: 0;
        }

        /* Subtitle — tight gap below */
        .al-sub {
          font-size: 12px;
          color: #94a3b8;
          margin-bottom: 14px;
          line-height: 1.5;
          animation: fadeUp 0.6s 0.28s both;
          opacity: 0;
        }

        .al-error {
          background: #fff1f2;
          border: 1px solid #fecdd3;
          color: #e11d48;
          padding: 8px 12px;
          border-radius: 8px;
          font-size: 12px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 6px;
          animation: errorIn 0.3s ease both;
        }

        .al-field {
          margin-bottom: 10px;
          animation: fadeUp 0.6s both;
          opacity: 0;
        }
        .al-field:nth-of-type(1) { animation-delay: 0.35s; }
        .al-field:nth-of-type(2) { animation-delay: 0.42s; }

        .al-label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #475569;
          margin-bottom: 5px;
        }

        .al-input-wrap { position: relative; }

        .al-input {
          width: 100%;
          padding: 10px 38px 10px 13px;
          border: 1.5px solid #e2e8f0;
          border-radius: 9px;
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          caret-color: #F77F00;
        }
        .al-input::placeholder { color: #cbd5e1; }
        .al-input:focus {
          border-color: #F77F00;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(247,127,0,0.11);
        }

        .al-eye {
          position: absolute; right: 11px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          font-size: 14px; color: #94a3b8;
          transition: color 0.2s; padding: 2px;
        }
        .al-eye:hover { color: #F77F00; }

        .al-btn-wrap {
          margin-top: 6px;
          animation: fadeUp 0.6s 0.5s both;
          opacity: 0;
        }
        .al-btn {
          width: 100%;
          padding: 11px;
          border: none;
          border-radius: 9px;
          background: #F77F00;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
          box-shadow: 0 4px 14px rgba(247,127,0,0.30);
          letter-spacing: 0.02em;
        }
        .al-btn:hover:not(:disabled) {
          background: #e07200;
          transform: translateY(-1px);
          box-shadow: 0 8px 22px rgba(247,127,0,0.36);
        }
        .al-btn:active:not(:disabled) { transform: translateY(0); }
        .al-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .al-shim {
          position: absolute; top: 0; height: 100%; width: 35%;
          background: rgba(255,255,255,0.25);
          animation: shimmer 2.4s ease-in-out infinite;
        }
        .al-btn-inner {
          position: relative; z-index: 1;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .al-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .al-forgot {
          display: block;
          text-align: center;
          margin-top: 10px;
          font-size: 12px;
          color: #F77F00;
          text-decoration: none;
          font-weight: 500;
          animation: fadeUp 0.6s 0.56s both;
          opacity: 0;
        }
        .al-forgot:hover { text-decoration: underline; }

        /* ── RIGHT: Image Panel ── */
        .al-right {
          flex: 1;
          position: relative;
          overflow: hidden;
          background: #e8f0fe;
          animation: slideInRight 0.75s cubic-bezier(0.22,1,0.36,1) 0.1s both;
          opacity: 0;
        }

        .al-right img.al-bg-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center top;
          display: block;
        }

        .al-right-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(15,23,42,0.05) 0%,
            rgba(15,23,42,0.02) 40%,
            rgba(15,23,42,0.55) 100%
          );
        }

        .al-right-caption {
          position: absolute;
          bottom: 24px; left: 0; right: 0;
          text-align: center;
          padding: 0 24px;
        }
        .al-right-caption h3 {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
          animation: fadeUp 0.7s 0.6s both;
          opacity: 0;
        }
        .al-right-caption p {
          font-size: 12px;
          color: rgba(255,255,255,0.8);
          text-shadow: 0 1px 4px rgba(0,0,0,0.4);
          animation: fadeUp 0.7s 0.7s both;
          opacity: 0;
        }

        @media (max-width: 860px) {
          .al-container { width: 95vw; height: auto; flex-direction: column; }
          .al-left { width: 100%; padding: 28px 24px; }
          .al-right { min-height: 240px; }
        }
      `}</style>

      <div className="al-root">
        <div className="al-container">

          {/* ── LEFT: Login Form ── */}
          <div className="al-left">
            <div className="al-logo-wrap">
              <img src="/logo.png" alt="Logo" />
            </div>

            <div className="al-heading">Login</div>
            <div className="al-sub">Welcome back! Please login to your account.</div>

            {error && (
              <div className="al-error"><span>⚠</span>{error}</div>
            )}

            <div className="al-field">
              <label className="al-label">Username</label>
              <div className="al-input-wrap">
                <input
                  className="al-input"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="al-field">
              <label className="al-label">Password</label>
              <div className="al-input-wrap">
                <input
                  className="al-input"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                <button className="al-eye" type="button" onClick={() => setShowPw(v => !v)}>
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
            </div>

            <div className="al-btn-wrap">
              <button className="al-btn" onClick={handleLogin} disabled={loading} type="button">
                {!loading && <div className="al-shim" />}
                <div className="al-btn-inner">
                  {loading ? <><div className="al-spinner" />Signing in…</> : 'Sign In'}
                </div>
              </button>
            </div>

            <a className="al-forgot" href="#">Forgot your password?</a>
          </div>

          {/* ── RIGHT: Image ── */}
          <div className="al-right">
            <img
              className="al-bg-img"
              src="https://img.freepik.com/free-vector/male-programmer-working-computer-office-wall-with-hanging-reminder-stickers-developer-creating-new-software-interface-coding-programming-system-administrator-designer-character_575670-1159.jpg?semt=ais_hybrid&w=740&q=80"
              alt="Programmer illustration"
            />
            <div className="al-right-overlay" />
            <div className="al-right-caption">
              <h3>Powerful Admin Control</h3>
              <p>Real-time insights at your fingertips</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
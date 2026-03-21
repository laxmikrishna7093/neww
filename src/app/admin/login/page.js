'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ✅ IMPORTANT
  body: JSON.stringify({ username, password }),
});

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f172a',
    }}>
      <div style={{
        background: '#1e293b',
        padding: '40px',
        borderRadius: '16px',
        width: '360px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
      }}>
        <h2 style={{ color: '#38bdf8', textAlign: 'center', fontSize: '24px', margin: '0 0 8px 0' }}>
          ⚡ Admin Login
        </h2>
        <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '28px', fontSize: '14px' }}>
          Enter your credentials to continue
        </p>

        {error && (
          <div style={{
            background: '#fee2e2', color: '#dc2626',
            padding: '10px 14px', borderRadius: '8px',
            marginBottom: '16px', fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          USERNAME
        </label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          style={{
            width: '100%', padding: '12px', marginBottom: '16px',
            background: '#0f172a', border: '1px solid #334155',
            borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box',
          }}
        />

        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          PASSWORD
        </label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
          style={{
            width: '100%', padding: '12px', marginBottom: '24px',
            background: '#0f172a', border: '1px solid #334155',
            borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box',
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: '100%', padding: '14px',
            background: loading ? '#334155' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            border: 'none', borderRadius: '8px',
            color: '#fff', fontSize: '16px', fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login →'}
        </button>

        {/* ✅ Removed hardcoded credentials from UI */}
        <p style={{ color: '#475569', textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
          Contact admin if you forgot your credentials
        </p>
      </div>
    </div>
  );
}
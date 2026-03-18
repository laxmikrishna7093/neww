'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const router = useRouter();
  const [form, setForm]     = useState({ username: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple hardcoded login - no database needed
    if (form.username === 'admin' && form.password === 'admin123') {
      localStorage.setItem('admin_logged_in', 'true');
      router.push('/admin/dashboard');
    } else {
      setError('Invalid username or password');
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
        <h2 style={{
          color: '#38bdf8',
          textAlign: 'center',
          fontSize: '24px',
          margin: '0 0 8px 0',
        }}>
          ⚡ Admin Login
        </h2>
        <p style={{
          color: '#64748b',
          textAlign: 'center',
          marginBottom: '28px',
          fontSize: '14px',
        }}>
          Enter your credentials to continue
        </p>

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#dc2626',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          USERNAME
        </label>
        <input
          type="text"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
          placeholder="admin"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '16px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />

        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
          PASSWORD
        </label>
        <input
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '24px',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '14px',
            boxSizing: 'border-box',
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: loading ? '#334155' : 'linear-gradient(135deg, #0ea5e9, #6366f1)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Logging in...' : 'Login →'}
        </button>

        <p style={{ color: '#64748b', textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
          Username: <strong style={{ color: '#38bdf8' }}>admin</strong> &nbsp;|&nbsp;
          Password: <strong style={{ color: '#38bdf8' }}>admin123</strong>
        </p>
      </div>
    </div>
  );
}
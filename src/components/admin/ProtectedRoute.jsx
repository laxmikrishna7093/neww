'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    // Check localStorage instead of API
    const loggedIn = localStorage.getItem('admin_logged_in');
    if (loggedIn === 'true') {
      setOk(true);
    } else {
      router.push('/admin/login');
    }
  }, []);

  if (!ok) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#0f172a',
      color: '#38bdf8',
      fontSize: '18px',
    }}>
      ⏳ Loading...
    </div>
  );

  return children;
}
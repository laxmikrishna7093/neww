'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/me', {
          credentials: 'include', // ✅ important
        });

        if (res.ok) {
          setOk(true);
        } else {
          router.push('/admin/login');
        }
      } catch {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, []);

  if (!ok) return <div>Loading...</div>;

  return children;
}
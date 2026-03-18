// src/app/admin/dashboard/layout.js
'use client';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', background: '#F1E6C9', minHeight: '100vh' }}>
        {/* Sidebar stays fixed on the left */}
        <Sidebar />
        
        {/* Right side content changes based on the page you click */}
        <main style={{ marginLeft: '240px', padding: '32px', flex: 1, color: '#f1f5f9' }}>
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
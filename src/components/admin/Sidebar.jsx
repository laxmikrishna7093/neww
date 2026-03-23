'use client';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { label: 'Dashboard',        icon: '🏠', path: '/admin/dashboard' },
  { label: 'Services',         icon: '⚙️', path: '/admin/dashboard/services' },
  { label: 'Contacts',         icon: '📋', path: '/admin/dashboard/contacts' },
  { label: 'Employees',        icon: '👤', path: '/admin/dashboard/employees' },
  { label: 'ID Cards',         icon: '🪪', path: '/admin/dashboard/idcards' },
  { label: ' salary slip', icon: '💰', path: '/admin/dashboard/salary' },
];

export default function Sidebar() {
  const router   = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <aside style={{
      width: collapsed ? '60px' : '240px',
      minHeight: '100vh',
      background: '#215E61', /* 👈 CHANGED TO TEAL */
      color: '#fcfbfb',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s',
      position: 'fixed',
      left: 0, top: 0,
      zIndex: 100,
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)' /* Added soft shadow */
    }}>
      {/* Header */}
      <div style={{ padding: '20px 16px', borderBottom: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {!collapsed && <span style={{ fontWeight: 800, fontSize: '18px', color: '#ffffff' }}>⚡ AdminPanel</span>}
        <button onClick={() => setCollapsed(!collapsed)}
          style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '18px' }}>
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Menu */}
      <nav style={{ flex: 1, padding: '12px 0' }}>
        {menuItems.map(item => {
          const active = pathname === item.path;
          return (
            <button key={item.path} onClick={() => router.push(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '12px', padding: '12px 20px',
                background: active ? 'rgba(0,0,0,0.1)' : 'none', /* Soft dark highlight for active */
                border: 'none', 
                color: active ? '#ffffff' : 'rgba(255,255,255,0.8)', /* Crisp white text */
                cursor: 'pointer', fontSize: '14px', fontWeight: active ? 700 : 500,
                borderLeft: active ? '4px solid #ffffff' : '4px solid transparent',
                transition: 'all 0.2s',
              }}>
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <button onClick={handleLogout}
        style={{
          margin: '16px', padding: '12px', background: '#f96f20',
          border: 'none', borderRadius: '8px', color: '#454343',
          cursor: 'pointer', fontWeight: 600, display: 'flex',
          alignItems: 'center', gap: '8px', justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
        <span>🚪</span>{!collapsed && 'Logout'}
      </button>
    </aside>
  );
}
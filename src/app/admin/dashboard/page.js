'use client';
import { useEffect, useState } from 'react';

function StatCard({ label, value, icon, color }) {
  return (
    // Changed card to White so it looks beautiful on the Pink background!
    <div style={{ background:'#ffffff', borderRadius:'12px', padding:'24px', borderLeft:`4px solid ${color}`, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize:'32px', marginBottom:'8px' }}>{icon}</div>
      <div style={{ fontSize:'28px', fontWeight:700, color:'#1e293b' }}>{value}</div>
      <div style={{ fontSize:'14px', color:'#64748b' }}>{label}</div>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState({ employees: 0, contacts: 0, idcards: 0, salaries: 0 });

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/employees').then(r => r.json()).catch(() => []),
      fetch('/api/admin/idcards').then(r => r.json()).catch(() => []),
      fetch('/api/admin/salary').then(r => r.json()).catch(() => []),
    ]).then(([emps, cards, sals]) => {
      setStats({ 
        employees: emps.length || 0, 
        idcards: cards.length || 0, 
        salaries: sals.length || 0 
      });
    });
  }, []);

  return (
    <>
      <h1 style={{ fontSize:'28px', fontWeight:700, marginBottom:'8px', color: '#000' }}>Dashboard Overview</h1>
      <p style={{ color:'#475569', marginBottom:'32px' }}>Welcome back, Admin 👋</p>
      
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'20px' }}>
        <StatCard label="Total Employees" value={stats.employees} icon="👤" color="#0ea5e9" />
        <StatCard label="ID Cards Issued"  value={stats.idcards}   icon="🪪" color="#6366f1" />
        <StatCard label="Salary Records"   value={stats.salaries}  icon="💰" color="#10b981" />
        <StatCard label="Services Active"  value="4"               icon="⚙️" color="#f59e0b" />
      </div>
    </>
  );
}
'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

const inputStyle = {
  width:'100%', padding:'10px 12px', background:'#0f172a',
  border:'1px solid #334155', borderRadius:'8px', color:'#f1f5f9',
  fontSize:'14px', boxSizing:'border-box', marginBottom:'12px',
};
const labelStyle = { color:'#94a3b8', fontSize:'12px', fontWeight:600, marginBottom:'4px', display:'block' };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', phone:'', department:'', position:'', salary:'' });
  const [panFile, setPanFile]     = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchEmployees(); }, []);

  async function fetchEmployees() {
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
    setEmployees(data);
  }

  async function uploadFile(file, type) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    const res = await fetch('/api/upload', { method:'POST', body: fd });
    const d = await res.json();
    return d.path;
  }

  async function handleSave() {
    setLoading(true); setMsg('');
    let panPath = '', aadhaarPath = '';
    if (panFile)     panPath     = await uploadFile(panFile, 'pan');
    if (aadhaarFile) aadhaarPath = await uploadFile(aadhaarFile, 'aadhaar');

    const body = { ...form, salary: Number(form.salary), panCard: panPath, aadhaar: aadhaarPath };
    const res = await fetch('/api/admin/employees', {
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body),
    });
    if (res.ok) { setMsg('✅ Employee saved!'); fetchEmployees(); setForm({ name:'', email:'', phone:'', department:'', position:'', salary:'' }); }
    else        { setMsg('❌ Error saving employee'); }
    setLoading(false);
  }

  async function handleDelete(id) {
    await fetch('/api/admin/employees', { method:'DELETE', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id }) });
    fetchEmployees();
  }

  return (
    <ProtectedRoute>
      <div style={{ display:'flex', background:'#0f172a', minHeight:'100vh' }}>
        <Sidebar />
        <main style={{ marginLeft:'240px', padding:'32px', flex:1, color:'#f1f5f9' }}>
          <h1 style={{ fontSize:'24px', fontWeight:700, marginBottom:'24px' }}>👤 Employee Details</h1>

          {/* Form */}
          <div style={{ background:'#1e293b', borderRadius:'12px', padding:'24px', marginBottom:'32px' }}>
            <h2 style={{ marginBottom:'20px', color:'#38bdf8' }}>Add New Employee</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 20px' }}>
              {[['name','Full Name'],['email','Email'],['phone','Phone'],['department','Department'],['position','Position'],['salary','Salary']].map(([key, label]) => (
                <div key={key}>
                  <label style={labelStyle}>{label.toUpperCase()}</label>
                  <input value={form[key]} onChange={e => setForm({...form, [key]:e.target.value})}
                    placeholder={label} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>PAN CARD (PDF/Image)</label>
                <input type="file" accept=".pdf,image/*" onChange={e => setPanFile(e.target.files[0])}
                  style={{...inputStyle, padding:'8px'}} />
              </div>
              <div>
                <label style={labelStyle}>AADHAAR CARD (PDF/Image)</label>
                <input type="file" accept=".pdf,image/*" onChange={e => setAadhaarFile(e.target.files[0])}
                  style={{...inputStyle, padding:'8px'}} />
              </div>
            </div>
            {msg && <div style={{ color: msg.startsWith('✅') ? '#10b981' : '#ef4444', marginBottom:'12px' }}>{msg}</div>}
            <button onClick={handleSave} disabled={loading}
              style={{ padding:'12px 28px', background:'#0ea5e9', border:'none', borderRadius:'8px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'15px' }}>
              {loading ? 'Saving...' : '💾 Save Employee'}
            </button>
          </div>

          {/* Table */}
          <div style={{ background:'#1e293b', borderRadius:'12px', overflow:'auto' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ background:'#0f172a', fontSize:'12px', color:'#64748b', textTransform:'uppercase' }}>
                  {['Name','Email','Dept','Position','Salary','PAN','Aadhaar','Action'].map(h => (
                    <th key={h} style={{ padding:'14px 16px', textAlign:'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map(e => (
                  <tr key={e._id} style={{ borderTop:'1px solid #334155', fontSize:'14px' }}>
                    <td style={{ padding:'14px 16px' }}>{e.name}</td>
                    <td style={{ padding:'14px 16px', color:'#64748b' }}>{e.email}</td>
                    <td style={{ padding:'14px 16px' }}>{e.department}</td>
                    <td style={{ padding:'14px 16px' }}>{e.position}</td>
                    <td style={{ padding:'14px 16px', color:'#10b981' }}>₹{e.salary?.toLocaleString()}</td>
                    <td style={{ padding:'14px 16px' }}>{e.panCard ? <a href={e.panCard} target="_blank" style={{ color:'#38bdf8' }}>View</a> : '—'}</td>
                    <td style={{ padding:'14px 16px' }}>{e.aadhaar  ? <a href={e.aadhaar}  target="_blank" style={{ color:'#38bdf8' }}>View</a> : '—'}</td>
                    <td style={{ padding:'14px 16px' }}>
                      <button onClick={() => handleDelete(e._id)}
                        style={{ background:'#ef4444', border:'none', borderRadius:'6px', color:'#fff', padding:'6px 12px', cursor:'pointer', fontSize:'12px' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
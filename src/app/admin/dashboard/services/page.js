'use client';
import { useEffect, useState } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

const ACCENT_OPTIONS = [
  { label: 'Forest Green', value: '#1B4332' },
  { label: 'Deep Red',     value: '#7B1D2E' },
  { label: 'Teal',         value: '#004C45' },
  { label: 'Brown',        value: '#5C3317' },
  { label: 'Navy Blue',    value: '#1E3A5F' },
  { label: 'Purple',       value: '#4C1D95' },
  { label: 'Dark Orange',  value: '#92400E' },
];

const S = {
  page:  { display:'flex', background:'#f8fafc', minHeight:'100vh' },
  main:  { 
    flex: 1, 
    padding: '40px 32px', 
    color: '#1e293b', 
    fontFamily: 'sans-serif', 
    background: '#f8fafc',
    overflowX: 'hidden'
    // Note: marginLeft: '240px' removed. Flexbox naturally puts this next to the sidebar.
  },
  // 🌟 NEW: This container centers everything perfectly on large screens
  container: { 
    maxWidth: '1150px', 
    margin: '0 auto', 
    width: '100%' 
  },
  card:  { 
    background:'#ffffff', 
    borderRadius:'16px', 
    border:'1px solid #e2e8f0', 
    boxShadow:'0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)' // Softer modern shadow
  },
  input: { width:'100%', padding:'10px 12px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', color:'#1e293b', fontSize:'14px', boxSizing:'border-box', outline:'none' },
  label: { color:'#64748b', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', display:'block', marginBottom:'5px' },
  btn:   (bg) => ({ padding:'10px 20px', background:bg, border:'none', borderRadius:'8px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'13px', display:'flex', alignItems:'center', gap:'6px', transition:'all 0.2s' }),
};

function Toast({ msg, type }) {
  if (!msg) return null;
  return (
    <div style={{
      position:'fixed', bottom:'28px', right:'28px', zIndex:9999,
      background: type === 'success' ? '#10b981' : '#ef4444',
      color:'#fff', padding:'14px 22px', borderRadius:'12px',
      fontWeight:600, fontSize:'14px', boxShadow:'0 8px 32px rgba(0,0,0,0.2)',
      display:'flex', alignItems:'center', gap:'8px',
      animation: 'slideInUp 0.3s ease-out'
    }}>
      {type === 'success' ? '✅' : '❌'} {msg}
    </div>
  );
}

// ── Delete Confirm Modal ──────────────────────────────────
function DeleteModal({ service, onConfirm, onCancel }) {
  if (!service) return null;
  return (
    <div style={{
      position:'fixed', inset:0, zIndex:3000,
      background:'rgba(0,0,0,0.7)',
      backdropFilter:'blur(4px)',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{
        background:'#ffffff', borderRadius:'20px',
        padding:'40px', width:'420px',
        border:'1px solid #e2e8f0',
        textAlign:'center',
        boxShadow:'0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize:'56px', marginBottom:'16px' }}>🗑️</div>
        <h3 style={{ color:'#1e293b', fontSize:'22px', marginBottom:'10px', fontWeight:800 }}>
          Delete Service?
        </h3>
        <p style={{ color:'#64748b', fontSize:'14px', lineHeight:1.7, marginBottom:'28px' }}>
          Are you sure you want to delete{' '}
          <strong style={{ color:'#1e293b' }}>"{service.title}"</strong>?
          <br />
          <strong style={{ color:'#ef4444' }}>This will remove it from your public website immediately.</strong>
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center' }}>
          <button
            onClick={onCancel}
            style={{
              padding:'12px 28px', background:'#f1f5f9',
              border:'1px solid #e2e8f0', borderRadius:'8px',
              color:'#64748b', fontWeight:700, cursor:'pointer', fontSize:'14px',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding:'12px 28px', background:'#ef4444',
              border:'none', borderRadius:'8px',
              color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'14px',
            }}
          >
            🗑️ Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Service Modal ─────────────────────────────────────────
function ServiceModal({ service, isNew, onSave, onClose }) {
  const [form, setForm]             = useState({ ...service });
  const [newFeature, setNewFeature] = useState('');
  const [preview, setPreview]       = useState(service.photo || '');
  const [uploading, setUploading]   = useState(false);
  const [saving, setSaving]         = useState(false);

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }

  function addFeature() {
    if (!newFeature.trim()) return;
    setForm(f => ({ ...f, features: [...(f.features || []), newFeature.trim()] }));
    setNewFeature('');
  }

  function removeFeature(i) {
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  }

  function editFeature(i, val) {
    setForm(f => {
      const features = [...f.features];
      features[i] = val;
      return { ...f, features };
    });
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = ev => {
        setPreview(ev.target.result);
        set('photo', ev.target.result);
      };
      reader.readAsDataURL(file);

      const fd = new FormData();
      fd.append('file', file);
      fd.append('type', 'services');

      const res = await fetch('/api/upload', { method:'POST', body: fd });
      if (!res.ok) {
        const text = await res.text();
        console.error('Upload failed:', text);
        setUploading(false);
        return;
      }
      const data = await res.json();
      if (data.path) {
        set('photo', data.path);
        setPreview(data.path);
      }
    } catch (err) {
      console.error('Upload error:', err.message);
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!form.title || !form.tag) {
      alert('Please fill Title and Tag fields!');
      return;
    }
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:2000,
      background:'rgba(0,0,0,0.6)', backdropFilter:'blur(8px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'16px',
      overflowY:'auto',
    }}>
      <div style={{
        background:'#ffffff', borderRadius:'24px',
        width:'100%', maxWidth:'740px',
        border:'1px solid #e2e8f0',
        boxShadow:'0 32px 80px rgba(0,0,0,0.15)',
        maxHeight:'92vh', overflowY:'auto',
      }}>
        {/* Header */}
        <div style={{
          padding:'22px 30px', borderBottom:'1px solid #e2e8f0',
          display:'flex', alignItems:'center', justifyContent:'space-between',
          position:'sticky', top:0, background:'#ffffff', zIndex:10,
        }}>
          <div>
            <h2 style={{ color:'#1e293b', fontSize:'20px', margin:0, fontWeight:800 }}>
              {isNew ? '➕ Add New Service' : '✏️ Edit Service'}
            </h2>
            <p style={{ color:'#64748b', fontSize:'12px', margin:'4px 0 0' }}>
              {isNew ? '🚀 Will go live on website after saving' : `Editing: ${form.title}`}
            </p>
          </div>
          <button onClick={onClose}
            style={{ background:'#f1f5f9', border:'none', borderRadius:'10px', color:'#64748b', width:'38px', height:'38px', cursor:'pointer', fontSize:'20px', display:'flex', alignItems:'center', justifyContent:'center' }}>
            ×
          </button>
        </div>

        <div style={{ padding:'30px' }}>
          {/* Live Preview */}
          <div style={{
            background: form.accent || '#1B4332',
            borderRadius:'14px', padding:'18px 22px',
            display:'flex', alignItems:'center', gap:'16px',
            marginBottom:'26px', position:'relative', overflow:'hidden',
          }}>
            {preview && <img src={preview} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.15 }} />}
            <div style={{ position:'relative', zIndex:1, flex:1 }}>
              <span style={{ background:'rgba(255,255,255,0.25)', color:'#fff', fontSize:'11px', fontWeight:700, padding:'3px 12px', borderRadius:'20px' }}>
                {form.tag || 'TAG'}
              </span>
              <p style={{ color:'#ffffff', fontWeight:800, fontSize:'20px', margin:'8px 0 2px' }}>{form.title || 'Service Title'}</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'13px', margin:0 }}>{form.tagline || 'Tagline here'}</p>
            </div>
            <div style={{ position:'relative', zIndex:1, textAlign:'right' }}>
              <p style={{ color:'#FF9700', fontWeight:800, fontSize:'24px', margin:0 }}>{form.stat || '0+'}</p>
              <p style={{ color:'rgba(255,255,255,0.7)', fontSize:'12px', margin:0 }}>{form.statLabel || 'Label'}</p>
            </div>
            <span style={{ position:'absolute', top:'10px', right:'14px', color:'rgba(255,255,255,0.4)', fontSize:'11px' }}>👁 Live Preview</span>
          </div>

          {/* Image Upload */}
          <div style={{ marginBottom:'22px' }}>
            <label style={S.label}>Service Image</label>
            <div style={{
              position:'relative', borderRadius:'12px', overflow:'hidden', height:'160px',
              background:'#f1f5f9', border:'2px dashed #cbd5e1',
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'8px',
              cursor:'pointer',
            }}>
              {preview && <img src={preview} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.7 }} />}
              <div style={{ position:'relative', zIndex:1, textAlign:'center', pointerEvents:'none' }}>
                {uploading
                  ? <p style={{ color:'#0ea5e9', fontWeight:600 }}>⏳ Uploading...</p>
                  : <>
                      <span style={{ fontSize:'30px', display:'block', marginBottom:'6px' }}>📷</span>
                      <p style={{ color:'#64748b', fontSize:'13px', margin:0 }}>{preview ? 'Click to change image' : 'Click to upload image'}</p>
                    </>
                }
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload}
                style={{ position:'absolute', inset:0, opacity:0, cursor:'pointer', width:'100%', height:'100%' }} />
            </div>
            <div style={{ marginTop:'10px' }}>
              <label style={S.label}>Or paste image URL</label>
              <input
                value={form.photo?.startsWith('data:') ? '' : (form.photo || '')}
                onChange={e => { set('photo', e.target.value); setPreview(e.target.value); }}
                placeholder="https://images.unsplash.com/..."
                style={S.input}
              />
            </div>
          </div>

          {/* Fields */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'14px' }}>
            <div>
              <label style={S.label}>Service Title *</label>
              <input value={form.title || ''} onChange={e => set('title', e.target.value)} placeholder="e.g. Security Services" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Tag / Category *</label>
              <input value={form.tag || ''} onChange={e => set('tag', e.target.value)} placeholder="e.g. Security" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Tagline</label>
              <input value={form.tagline || ''} onChange={e => set('tagline', e.target.value)} placeholder="e.g. Guarding What Matters Most" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Card Color</label>
              <div style={{ display:'flex', gap:'8px', alignItems:'center' }}>
                <input type="color" value={form.accent || '#1B4332'}
                  onChange={e => set('accent', e.target.value)}
                  style={{ width:'44px', height:'38px', border:'1px solid #e2e8f0', borderRadius:'6px', cursor:'pointer', padding:'2px' }} />
                <select value={form.accent || '#1B4332'} onChange={e => set('accent', e.target.value)}
                  style={{ ...S.input, flex:1 }}>
                  {ACCENT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label style={S.label}>Stat (e.g. 500+)</label>
              <input value={form.stat || ''} onChange={e => set('stat', e.target.value)} placeholder="500+" style={S.input} />
            </div>
            <div>
              <label style={S.label}>Stat Label</label>
              <input value={form.statLabel || ''} onChange={e => set('statLabel', e.target.value)} placeholder="Sites Secured" style={S.input} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom:'22px' }}>
            <label style={S.label}>Description</label>
            <textarea value={form.desc || ''} onChange={e => set('desc', e.target.value)}
              rows={3} placeholder="Describe this service..."
              style={{ ...S.input, resize:'vertical', lineHeight:1.6 }} />
          </div>

          {/* Features */}
          <div style={{ marginBottom:'26px' }}>
            <label style={S.label}>Features ({(form.features || []).length})</label>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'12px' }}>
              {(form.features || []).map((f, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                  <span style={{ color:'#FF9700', fontSize:'14px', flexShrink:0 }}>●</span>
                  <input value={f} onChange={e => editFeature(i, e.target.value)}
                    style={{ ...S.input, flex:1, padding:'8px 10px', fontSize:'13px' }} />
                  <button onClick={() => removeFeature(i)}
                    style={{ background:'#ef4444', border:'none', borderRadius:'6px', color:'#fff', width:'28px', height:'28px', cursor:'pointer', fontSize:'14px', flexShrink:0 }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:'8px' }}>
              <input value={newFeature} onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addFeature()}
                placeholder="Type feature and press Enter..."
                style={{ ...S.input, flex:1 }} />
              <button onClick={addFeature} style={S.btn('#0ea5e9')}>+ Add</button>
            </div>
          </div>

          {/* Save Buttons */}
          <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', paddingTop:'18px', borderTop:'1px solid #e2e8f0' }}>
            <button onClick={onClose} style={S.btn('#94a3b8')}>Cancel</button>
            <button onClick={handleSave} disabled={saving}
              style={S.btn(saving ? '#94a3b8' : isNew ? 'linear-gradient(135deg,#10b981,#0ea5e9)' : 'linear-gradient(135deg,#0ea5e9,#6366f1)')}>
              {saving ? '⏳ Saving...' : isNew ? '🚀 Publish to Website' : '💾 Save & Go Live'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Service Row ───────────────────────────────────────────
function ServiceRow({ svc, index, onEdit, onDelete }) {
  return (
    <div style={{
      ...S.card,
      display:'flex', alignItems:'center', gap:'20px', padding:'18px 24px',
      transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = '#94a3b8';
        e.currentTarget.style.transform   = 'translateY(-2px)';
        e.currentTarget.style.boxShadow   = '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform   = 'none';
        e.currentTarget.style.boxShadow   = S.card.boxShadow;
      }}
    >
      {/* Number */}
      <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', color:'#475569', fontWeight:800, fontSize:'14px', flexShrink:0, border:'1px solid #e2e8f0' }}>
        {String(index + 1).padStart(2, '0')}
      </div>

      {/* Image */}
      <div style={{ width:'84px', height:'60px', borderRadius:'10px', overflow:'hidden', flexShrink:0, background:'#f1f5f9', border:'1px solid #e2e8f0' }}>
        <img src={svc.photo} alt={svc.title}
          style={{ width:'100%', height:'100%', objectFit:'cover' }}
          onError={e => { e.target.style.display = 'none'; }} />
      </div>

      {/* Color dot */}
      <div style={{ width:'16px', height:'16px', borderRadius:'50%', background:svc.accent, flexShrink:0, boxShadow:`0 0 10px ${svc.accent}80` }} />

      {/* Info */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'6px', flexWrap:'wrap' }}>
          <span style={{ background:svc.accent, color:'#fff', fontSize:'11px', fontWeight:700, padding:'3px 12px', borderRadius:'20px' }}>{svc.tag}</span>
          <span style={{ background:'#dcfce7', color:'#16a34a', fontSize:'11px', padding:'3px 12px', borderRadius:'20px', fontWeight:600 }}>● Live</span>
        </div>
        <p style={{ color:'#1e293b', fontWeight:800, fontSize:'16px', margin:'0 0 4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{svc.title}</p>
        <p style={{ color:'#64748b', fontSize:'13px', margin:0 }}>{svc.tagline}</p>
      </div>

      {/* Stats */}
      <div style={{ textAlign:'center', minWidth:'80px' }}>
        <p style={{ color:'#f97316', fontWeight:800, fontSize:'18px', margin:0 }}>{svc.stat}</p>
        <p style={{ color:'#94a3b8', fontSize:'11px', margin:0 }}>{svc.statLabel}</p>
      </div>

      {/* Features count */}
      <div style={{ textAlign:'center', minWidth:'80px' }}>
        <p style={{ color:'#0ea5e9', fontWeight:800, fontSize:'18px', margin:0 }}>{svc.features?.length || 0}</p>
        <p style={{ color:'#94a3b8', fontSize:'11px', margin:0 }}>Features</p>
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:'10px', flexShrink:0, marginLeft: '10px' }}>
        <button
          onClick={() => onEdit(svc)}
          style={{
            padding:'10px 18px', background:'#0ea5e9',
            border:'none', borderRadius:'8px', color:'#fff',
            fontWeight:700, cursor:'pointer', fontSize:'13px',
            display:'flex', alignItems:'center', gap:'6px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#0284c7'}
          onMouseLeave={e => e.currentTarget.style.background = '#0ea5e9'}
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(svc)}
          style={{
            padding:'10px 18px', background:'#ef4444',
            border:'none', borderRadius:'8px', color:'#fff',
            fontWeight:700, cursor:'pointer', fontSize:'13px',
            display:'flex', alignItems:'center', gap:'6px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.background = '#dc2626'}
          onMouseLeave={e => e.currentTarget.style.background = '#ef4444'}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────
export default function AdminServicesPage() {
  const [services, setServices]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [editSvc, setEditSvc]     = useState(null);
  const [deleteSvc, setDeleteSvc] = useState(null);
  const [showAdd, setShowAdd]     = useState(false);
  const [toast, setToast]         = useState({ msg:'', type:'' });

  useEffect(() => { loadServices(); }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/services');
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      setServices([]);
    }
    setLoading(false);
  }

  function showToast(msg, type = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg:'', type:'' }), 3500);
  }

  async function handleSaveEdit(updated) {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        await loadServices();
        setEditSvc(null);
        showToast(`"${updated.title}" updated! Live ✨`);
      } else {
        showToast('Failed to update', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  }

  async function handleAdd(newSvc) {
    try {
      const res = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSvc),
      });
      if (res.ok) {
        await loadServices();
        setShowAdd(false);
        showToast(`"${newSvc.title}" published! 🚀`);
      } else {
        showToast('Failed to add', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  }

  async function handleDelete() {
    if (!deleteSvc) return;
    try {
      const res = await fetch('/api/admin/services', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: deleteSvc._id }),
      });

      if (res.ok) {
        setDeleteSvc(null);
        await loadServices();
        showToast(`"${deleteSvc.title}" deleted!`, 'error');
      } else {
        showToast('Failed to delete service', 'error');
      }
    } catch (err) {
      showToast('Network error while deleting', 'error');
    }
  }

  const EMPTY = {
    title:'', tagline:'', tag:'',
    accent:'#1B4332', accentLight:'#6EE7B7',
    photo:'', stat:'', statLabel:'', desc:'', features:[],
  };

  return (
    <ProtectedRoute>
      <div style={S.page}>
        <Sidebar />
        <main style={S.main}>
          
          {/* 🌟 THIS WRAPPER CENTERS EVERYTHING PERFECTLY 🌟 */}
          <div style={S.container}>

            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'36px', flexWrap:'wrap', gap:'16px' }}>
              <div>
                <h1 style={{ fontSize:'32px', fontWeight:900, margin:'0 0 6px', color:'#1e293b', letterSpacing: '-0.5px' }}>
                  ⚙️ Services Manager
                </h1>
                <p style={{ color:'#64748b', fontSize:'15px', margin:0 }}>
                  Edit services → changes go <strong style={{ color:'#10b981' }}>live on your public website instantly</strong>
                </p>
              </div>
              <button
                onClick={() => setShowAdd(true)}
                style={{
                  padding:'14px 28px',
                  background:'linear-gradient(135deg,#10b981,#0ea5e9)',
                  border:'none', borderRadius:'12px', color:'#fff',
                  fontWeight:800, cursor:'pointer', fontSize:'15px',
                  display:'flex', alignItems:'center', gap:'8px',
                  boxShadow:'0 4px 20px rgba(14,165,233,0.3)',
                  transition: 'transform 0.2s, box-shadow 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 25px rgba(14,165,233,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(14,165,233,0.3)'; }}
              >
                ➕ Add New Service
              </button>
            </div>

            {/* Stats */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'20px', marginBottom:'32px' }}>
              {[
                { label:'Total Services',  value: services.length, icon:'⚙️', color:'#0ea5e9' },
                { label:'Live on Website', value: services.length, icon:'🟢', color:'#10b981' },
                { label:'Total Features',  value: services.reduce((a,s) => a+(s.features?.length||0), 0), icon:'✅', color:'#6366f1' },
              ].map((st, i) => (
                <div key={i} style={{ ...S.card, padding:'24px 28px', borderLeft:`4px solid ${st.color}` }}>
                  <span style={{ fontSize:'28px' }}>{st.icon}</span>
                  <p style={{ color:'#1e293b', fontWeight:900, fontSize:'36px', margin:'10px 0 2px' }}>{st.value}</p>
                  <p style={{ color:'#64748b', fontSize:'14px', margin:0, fontWeight: 500 }}>{st.label}</p>
                </div>
              ))}
            </div>

            {/* Live Banner */}
            <div style={{
              background:'#f0fdf4', border:'1px solid #bbf7d0',
              borderRadius:'16px', padding:'16px 24px', marginBottom:'32px',
              display:'flex', alignItems:'center', gap:'16px',
            }}>
              <span style={{ fontSize:'24px' }}>🌐</span>
              <div style={{ flex:1 }}>
                <p style={{ color:'#16a34a', fontWeight:800, fontSize:'14px', margin:'0 0 4px' }}>Changes show live on your public website</p>
                <p style={{ color:'#64748b', fontSize:'13px', margin:0 }}>
                  Customers see updates at <code style={{ color:'#0ea5e9', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>/services</code> immediately
                </p>
              </div>
              <a href="/services" target="_blank"
                style={{ ...S.btn('#10b981'), textDecoration:'none', padding:'10px 20px', fontSize:'13px' }}>
                👁 View Live →
              </a>
            </div>

            {/* Services List */}
            {loading ? (
              <div style={{ ...S.card, padding:'80px', textAlign:'center' }}>
                <p style={{ fontSize:'40px', marginBottom:'16px' }}>⏳</p>
                <p style={{ color:'#64748b', fontSize:'16px', fontWeight: 500 }}>Loading services...</p>
              </div>
            ) : services.length === 0 ? (
              <div style={{ ...S.card, padding:'80px', textAlign:'center' }}>
                <p style={{ fontSize:'56px', marginBottom:'20px' }}>📭</p>
                <p style={{ color:'#1e293b', fontSize:'20px', fontWeight:800, marginBottom:'10px' }}>No services yet</p>
                <p style={{ color:'#64748b', fontSize:'15px', marginBottom:'28px' }}>Click "Add New Service" to get started</p>
                <button onClick={() => setShowAdd(true)}
                  style={{ ...S.btn('linear-gradient(135deg,#10b981,#0ea5e9)'), margin:'0 auto', padding:'14px 28px', fontSize: '15px' }}>
                  ➕ Add First Service
                </button>
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                {services.map((svc, i) => (
                  <ServiceRow
                    key={svc._id || svc.sid || i}
                    svc={svc}
                    index={i}
                    onEdit={svc => setEditSvc(svc)}
                    onDelete={svc => setDeleteSvc(svc)}
                  />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Modals */}
      {showAdd && (
        <ServiceModal
          service={EMPTY}
          isNew={true}
          onSave={handleAdd}
          onClose={() => setShowAdd(false)}
        />
      )}
      {editSvc && (
        <ServiceModal
          service={editSvc}
          isNew={false}
          onSave={handleSaveEdit}
          onClose={() => setEditSvc(null)}
        />
      )}
      {deleteSvc && (
        <DeleteModal
          service={deleteSvc}
          onConfirm={handleDelete}
          onCancel={() => setDeleteSvc(null)}
        />
      )}

      <Toast msg={toast.msg} type={toast.type} />
    </ProtectedRoute>
  );
}
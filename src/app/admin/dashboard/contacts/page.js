  'use client';
  import { useEffect, useState } from 'react';

  const STATUS_COLORS = {
    new:       { bg:'#eff6ff', color:'#2563eb', label:'🔵 New' },
    contacted: { bg:'#fef9c3', color:'#ca8a04', label:'🟡 Contacted' },
    hired:     { bg:'#dcfce7', color:'#16a34a', label:'🟢 Hired' },
    rejected:  { bg:'#fee2e2', color:'#dc2626', label:'🔴 Rejected' },
  };

  const S = {
    // Removed page and main styles since layout.js handles that now!
    card:  { background:'#ffffff', borderRadius:'16px', border:'1px solid #e2e8f0', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' },
    input: { padding:'10px 14px', background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'8px', color:'#1e293b', fontSize:'14px', outline:'none' },
    btn:   (bg) => ({ padding:'8px 16px', background:bg, border:'none', borderRadius:'8px', color:'#fff', fontWeight:700, cursor:'pointer', fontSize:'12px', display:'flex', alignItems:'center', gap:'5px' }),
  };

  function DetailModal({ contact, onClose, onStatusChange }) {
    if (!contact) return null;
    const st = STATUS_COLORS[contact.status] || STATUS_COLORS.new;

    return (
      <div style={{ position:'fixed', inset:0, zIndex:2000, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' }}>
        <div style={{ background:'#fff', borderRadius:'20px', width:'100%', maxWidth:'560px', border:'1px solid #e2e8f0', boxShadow:'0 20px 60px rgba(0,0,0,0.15)', maxHeight:'90vh', overflowY:'auto' }}>

          {/* Header */}
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between', background:'#f8fafc', borderRadius:'20px 20px 0 0' }}>
            <div>
              <h2 style={{ color:'#1e293b', fontSize:'18px', margin:0, fontWeight:800 }}>👤 {contact.name}</h2>
              <p style={{ color:'#64748b', fontSize:'12px', margin:'4px 0 0' }}>
                Applied {new Date(contact.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}
              </p>
            </div>
            <button onClick={onClose}
              style={{ background:'#e2e8f0', border:'none', borderRadius:'8px', color:'#64748b', width:'34px', height:'34px', cursor:'pointer', fontSize:'18px' }}>
              ×
            </button>
          </div>

          <div style={{ padding:'24px' }}>
            {/* Status Badge */}
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
              <span style={{ background: st.bg, color: st.color, padding:'4px 14px', borderRadius:'20px', fontSize:'12px', fontWeight:700 }}>
                {st.label}
              </span>
              <span style={{ color:'#64748b', fontSize:'12px' }}>Change status:</span>
              <select
                value={contact.status}
                onChange={e => onStatusChange(contact._id, e.target.value)}
                style={{ ...S.input, fontSize:'12px', padding:'6px 10px' }}
              >
                <option value="new">🔵 New</option>
                <option value="contacted">🟡 Contacted</option>
                <option value="hired">🟢 Hired</option>
                <option value="rejected">🔴 Rejected</option>
              </select>
            </div>

            {/* Details */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'14px', marginBottom:'20px' }}>
              {[
                { label:'📞 Phone',      value: contact.phone },
                { label:'✉️ Email',      value: contact.email },
                { label:'💼 Job Type',   value: contact.jobType },
                { label:'⭐ Experience', value: contact.experience || 'Not specified' },
                { label:'📍 Location',   value: contact.location },
                { label:'📄 Resume',     value: contact.resumeName || 'Not uploaded' },
              ].map((item, i) => (
                <div key={i} style={{ background:'#f8fafc', borderRadius:'10px', padding:'12px 14px', border:'1px solid #e2e8f0' }}>
                  <p style={{ color:'#64748b', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 4px' }}>{item.label}</p>
                  <p style={{ color:'#1e293b', fontSize:'13px', fontWeight:600, margin:0 }}>{item.value}</p>
                </div>
              ))}
            </div>

            {/* Message */}
            {contact.message && (
              <div style={{ background:'#f8fafc', borderRadius:'10px', padding:'14px', border:'1px solid #e2e8f0', marginBottom:'20px' }}>
                <p style={{ color:'#64748b', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:'0 0 8px' }}>💬 Message</p>
                <p style={{ color:'#1e293b', fontSize:'13px', lineHeight:1.7, margin:0 }}>{contact.message}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
              <a href={`tel:${contact.phone}`}
                style={{ ...S.btn('#10b981'), textDecoration:'none', padding:'10px 18px' }}>
                📞 Call Now
              </a>
              <a href={`mailto:${contact.email}`}
                style={{ ...S.btn('#0ea5e9'), textDecoration:'none', padding:'10px 18px' }}>
                ✉️ Send Email
              </a>
              <a href={`https://wa.me/91${contact.phone.replace(/\D/g,'')}`} target="_blank"
                style={{ ...S.btn('#25D366'), textDecoration:'none', padding:'10px 18px' }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  export default function AdminContactsPage() {
    const [contacts, setContacts]   = useState([]);
    const [loading, setLoading]     = useState(true);
    const [selected, setSelected]   = useState(null);
    const [filter, setFilter]       = useState('all');
    const [search, setSearch]       = useState('');
    const [toast, setToast]         = useState('');

    useEffect(() => { loadContacts(); }, []);

    async function loadContacts() {
      setLoading(true);
      try {
        const res  = await fetch('/api/admin/contacts');
        const data = await res.json();
        setContacts(Array.isArray(data) ? data : []);
      } catch { setContacts([]); }
      setLoading(false);
    }

    function showToast(msg) {
      setToast(msg);
      setTimeout(() => setToast(''), 3000);
    }

    async function handleStatusChange(id, status) {
      try {
        await fetch('/api/admin/contacts', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id, status }),
        });
        await loadContacts();
        if (selected) setSelected(prev => ({ ...prev, status }));
        showToast('Status updated!');
      } catch { showToast('Error updating'); }
    }

    async function handleDelete(id) {
      if (!confirm('Delete this contact?')) return;
      try {
        await fetch('/api/admin/contacts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ _id: id }),
        });
        await loadContacts();
        setSelected(null);
        showToast('Deleted!');
      } catch { showToast('Error deleting'); }
    }

    const filtered = contacts.filter(c => {
      const matchFilter = filter === 'all' || c.status === filter;
      const matchSearch = !search ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.phone.includes(search) ||
        c.jobType.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });

    const counts = {
      all:       contacts.length,
      new:       contacts.filter(c => c.status === 'new').length,
      contacted: contacts.filter(c => c.status === 'contacted').length,
      hired:     contacts.filter(c => c.status === 'hired').length,
      rejected:  contacts.filter(c => c.status === 'rejected').length,
    };

    return (
      <div style={{ padding: '1.5rem', fontFamily: "'Segoe UI', sans-serif" }}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'28px', flexWrap:'wrap', gap:'16px' }}>
          <div>
            <h1 style={{ fontSize:'26px', fontWeight:800, margin:'0 0 4px', color:'#1e293b' }}>
              📋 Contact Applications
            </h1>
            <p style={{ color:'#64748b', fontSize:'14px', margin:0 }}>
              All job applications submitted from your website
            </p>
          </div>
          <button onClick={loadContacts}
            style={{ ...S.btn('#6366f1'), padding:'10px 18px', fontSize:'13px' }}>
            🔄 Refresh
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))', gap:'14px', marginBottom:'24px' }}>
          {[
            { key:'all',       label:'Total',     icon:'📋', color:'#6366f1' },
            { key:'new',       label:'New',       icon:'🔵', color:'#2563eb' },
            { key:'contacted', label:'Contacted', icon:'🟡', color:'#ca8a04' },
            { key:'hired',     label:'Hired',     icon:'🟢', color:'#16a34a' },
            { key:'rejected',  label:'Rejected',  icon:'🔴', color:'#dc2626' },
          ].map(st => (
            <div key={st.key}
              onClick={() => setFilter(st.key)}
              style={{
                ...S.card, padding:'16px 18px', cursor:'pointer',
                borderLeft:`3px solid ${st.color}`,
                background: filter === st.key ? st.color : '#fff',
                transition:'all 0.2s',
              }}>
              <span style={{ fontSize:'20px' }}>{st.icon}</span>
              <p style={{ color: filter === st.key ? '#fff' : '#1e293b', fontWeight:800, fontSize:'24px', margin:'6px 0 2px' }}>{counts[st.key]}</p>
              <p style={{ color: filter === st.key ? 'rgba(255,255,255,0.8)' : '#64748b', fontSize:'12px', margin:0 }}>{st.label}</p>
            </div>
          ))}
        </div>

        {/* Search & Filter */}
        <div style={{ display:'flex', gap:'12px', marginBottom:'20px', flexWrap:'wrap' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name, phone, email, job type..."
            style={{ ...S.input, flex:1, minWidth:'250px' }}
          />
          <select value={filter} onChange={e => setFilter(e.target.value)}
            style={{ ...S.input }}>
            <option value="all">All Status</option>
            <option value="new">🔵 New</option>
            <option value="contacted">🟡 Contacted</option>
            <option value="hired">🟢 Hired</option>
            <option value="rejected">🔴 Rejected</option>
          </select>
        </div>

        {/* Contacts Table */}
        {loading ? (
          <div style={{ ...S.card, padding:'60px', textAlign:'center' }}>
            <p style={{ fontSize:'32px', marginBottom:'12px' }}>⏳</p>
            <p style={{ color:'#64748b' }}>Loading applications...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ ...S.card, padding:'60px', textAlign:'center' }}>
            <p style={{ fontSize:'48px', marginBottom:'12px' }}>📭</p>
            <p style={{ color:'#1e293b', fontSize:'16px', fontWeight:700, marginBottom:'6px' }}>
              {contacts.length === 0 ? 'No applications yet' : 'No results found'}
            </p>
            <p style={{ color:'#64748b', fontSize:'13px' }}>
              {contacts.length === 0 ? 'Applications from your contact form will appear here' : 'Try a different search or filter'}
            </p>
          </div>
        ) : (
          <div style={{ ...S.card, overflow:'hidden', overflowX: 'auto' }}>
            <div style={{ minWidth: '800px' }}>
              {/* Table Header */}
              <div style={{ display:'grid', gridTemplateColumns:'2fr 1.2fr 1.5fr 1.2fr 1fr 1fr', gap:'0', padding:'12px 20px', background:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
                {['Applicant','Phone','Job Type','Location','Status','Actions'].map(h => (
                  <p key={h} style={{ color:'#64748b', fontSize:'11px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', margin:0 }}>{h}</p>
                ))}
              </div>

              {/* Table Rows */}
              {filtered.map((c, i) => {
                const st = STATUS_COLORS[c.status] || STATUS_COLORS.new;
                return (
                  <div key={c._id}
                    style={{
                      display:'grid', gridTemplateColumns:'2fr 1.2fr 1.5fr 1.2fr 1fr 1fr',
                      gap:'0', padding:'14px 20px',
                      borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none',
                      transition:'background 0.15s',
                      alignItems:'center',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    {/* Applicant */}
                    <div>
                      <p style={{ color:'#1e293b', fontWeight:700, fontSize:'14px', margin:'0 0 2px' }}>{c.name}</p>
                      <p style={{ color:'#64748b', fontSize:'12px', margin:0 }}>{c.email}</p>
                      <p style={{ color:'#94a3b8', fontSize:'11px', margin:'2px 0 0' }}>
                        {new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}
                      </p>
                    </div>

                    {/* Phone */}
                    <a href={`tel:${c.phone}`} style={{ color:'#0ea5e9', fontSize:'13px', fontWeight:600, textDecoration:'none' }}>
                      {c.phone}
                    </a>

                    {/* Job Type */}
                    <div>
                      <span style={{ background:'#f1f5f9', color:'#475569', fontSize:'11px', fontWeight:700, padding:'3px 10px', borderRadius:'20px' }}>
                        {c.jobType}
                      </span>
                    </div>

                    {/* Location */}
                    <p style={{ color:'#475569', fontSize:'13px', margin:0 }}>📍 {c.location}</p>

                    {/* Status */}
                    <select
                      value={c.status}
                      onChange={e => handleStatusChange(c._id, e.target.value)}
                      style={{
                        background: st.bg, color: st.color,
                        border:`1px solid ${st.color}33`,
                        borderRadius:'20px', padding:'4px 10px',
                        fontSize:'11px', fontWeight:700, cursor:'pointer', outline:'none',
                      }}
                    >
                      <option value="new">🔵 New</option>
                      <option value="contacted">🟡 Contacted</option>
                      <option value="hired">🟢 Hired</option>
                      <option value="rejected">🔴 Rejected</option>
                    </select>

                    {/* Actions */}
                    <div style={{ display:'flex', gap:'6px' }}>
                      <button onClick={() => setSelected(c)}
                        style={{ ...S.btn('#6366f1'), padding:'6px 12px', fontSize:'11px' }}>
                        👁 View
                      </button>
                      <button onClick={() => handleDelete(c._id)}
                        style={{ ...S.btn('#ef4444'), padding:'6px 10px' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <DetailModal
            contact={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Toast */}
        {toast && (
          <div style={{
            position:'fixed', bottom:'28px', right:'28px', zIndex:9999,
            background:'#10b981', color:'#fff', padding:'12px 20px',
            borderRadius:'10px', fontWeight:600, fontSize:'14px',
            boxShadow:'0 8px 24px rgba(0,0,0,0.15)',
          }}>
            ✅ {toast}
          </div>
        )}
      </div>
    );
  }
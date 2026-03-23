'use client';
// src/components/ServiceCard.jsx
import { useState } from 'react';

export default function ServiceCard({ svc, index, adminMode = false, onEdit, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => { if (!adminMode) window.location.href = '/contact'; }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: 1,
        cursor: adminMode ? 'default' : 'pointer',
        position: 'relative',
      }}
    >
      <div style={{
        borderRadius: '14px', overflow: 'hidden',
        border: '1px solid #E8830A30',
        background: '#FFF3E8',
        boxShadow: hovered ? '0 20px 48px rgba(232,131,10,0.2), 0 0 0 1px #E8830A40' : '0 4px 20px rgba(232,131,10,0.1)',
        transform: hovered ? 'translateY(-5px)' : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}>

        {/* Image */}
        <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: '#F5D5A8' }}>
          {svc.photo && (
            <img src={svc.photo} alt={svc.title} loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.5s ease' }}
            />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(255,243,232,0.8) 0%, rgba(255,243,232,0.05) 50%, transparent 100%)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: svc.accent || '#E8830A' }} />

          {/* Tag badge */}
          {svc.tag && (
            <div style={{ position: 'absolute', top: '0.8rem', left: '0.8rem', background: 'rgba(255,243,232,0.92)', backdropFilter: 'blur(8px)', color: svc.accent || '#E8830A', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: '0.62rem', letterSpacing: '0.14em', padding: '0.22rem 0.65rem', borderRadius: '50px', border: `1px solid ${svc.accent || '#E8830A'}50` }}>
              {svc.tag}
            </div>
          )}

          {/* Admin Edit/Delete overlay on hover */}
          {adminMode && hovered && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', zIndex: 10 }}>
              <button
                onClick={e => { e.stopPropagation(); onEdit(svc); }}
                style={{ padding: '10px 22px', background: '#0ea5e9', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={e => { e.stopPropagation(); onDelete(svc); }}
                style={{ padding: '10px 22px', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                🗑️ Delete
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: '1.1rem 1.2rem 1.2rem', background: '#FFF3E8' }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem', fontWeight: 700, color: '#2a1500', lineHeight: 1.2, marginBottom: '0.4rem' }}>
            {svc.title}
          </h3>
          {svc.tagline && (
            <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.73rem', color: 'rgba(60,30,0,0.65)', fontStyle: 'italic', marginBottom: '0.3rem' }}>
              {svc.tagline}
            </p>
          )}
          <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: '0.73rem', color: 'rgba(60,30,0,0.55)', lineHeight: 1.65, margin: 0 }}>
            {svc.desc}
          </p>

          {svc.stat && (
            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginTop: '0.6rem' }}>
              <span style={{ color: svc.accent || '#E8830A', fontWeight: 800, fontSize: '1.1rem' }}>{svc.stat}</span>
              <span style={{ color: 'rgba(60,30,0,0.45)', fontSize: '0.72rem' }}>{svc.statLabel}</span>
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.9rem', marginTop: '0.9rem', borderTop: '1px solid #E8830A25' }}>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '0.65rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E8830A', fontWeight: 700 }}>
              {adminMode ? 'Hover to Edit / Delete' : 'Enquire Now'}
            </span>
            <span style={{ color: '#E8830A', fontSize: '1rem' }}>{adminMode ? '✦' : '→'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
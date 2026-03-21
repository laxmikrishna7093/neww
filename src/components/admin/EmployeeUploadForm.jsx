'use client'
// src/components/admin/EmployeeUploadForm.jsx
// ─────────────────────────────────────────────────────────────
// Example showing how to use signed Cloudinary uploads
// for: Passport Photo, PAN Card, Aadhaar Card
// ─────────────────────────────────────────────────────────────

import { useState, useRef } from 'react'
import { uploadToCloudinary, validateFile } from '@/lib/uploadToCloudinary'

// ── Single file upload box component ─────────────────────────
function UploadBox({ label, accept, fileType, empCode, onUploaded, required }) {
  const [file,       setFile]       = useState(null)
  const [preview,    setPreview]    = useState('')
  const [uploading,  setUploading]  = useState(false)
  const [uploaded,   setUploaded]   = useState(false)
  const [error,      setError]      = useState('')
  const [url,        setUrl]        = useState('')
  const inputRef = useRef()

  async function handleFileChange(e) {
    const selected = e.target.files?.[0]
    if (!selected) return

    // Reset state
    setError(''); setUploaded(false); setUrl('')

    // Validate
    const validType = fileType === 'PHOTO' ? 'image' : 'document'
    const err = validateFile(selected, validType)
    if (err) { setError(err); e.target.value = ''; return }

    setFile(selected)

    // Show preview for images
    if (selected.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = ev => setPreview(ev.target.result)
      reader.readAsDataURL(selected)
    } else {
      setPreview('pdf')
    }

    // Upload to Cloudinary
    setUploading(true)
    try {
      const secureUrl = await uploadToCloudinary(selected, empCode, fileType)
      setUrl(secureUrl)
      setUploaded(true)
      onUploaded(secureUrl) // pass URL up to parent
    } catch (err) {
      setError('Upload failed: ' + err.message)
      setPreview('')
      setFile(null)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>
        {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>

      {/* Drop zone */}
      <div
        onClick={() => !uploading && inputRef.current?.click()}
        style={{
          border: `2px dashed ${error ? '#fca5a5' : uploaded ? '#86efac' : '#93c5fd'}`,
          borderRadius: '10px',
          background: error ? '#fef2f2' : uploaded ? '#f0fdf4' : '#eff6ff',
          padding: '16px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          minHeight: '90px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
      >
        {/* States */}
        {uploading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2563eb', fontSize: '13px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              style={{ animation: 'spin 0.8s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Uploading to Cloudinary...
          </div>
        )}

        {!uploading && uploaded && preview !== 'pdf' && preview && (
          <img src={preview} alt="preview"
            style={{ maxHeight: '80px', maxWidth: '100%', borderRadius: '6px', objectFit: 'cover' }}/>
        )}

        {!uploading && uploaded && preview === 'pdf' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#16a34a', fontSize: '13px' }}>
            <span style={{ fontSize: '28px' }}>📄</span>
            <span>PDF uploaded ✓</span>
          </div>
        )}

        {!uploading && !uploaded && (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>
              Click to upload · {fileType === 'PHOTO' ? 'JPG, PNG' : 'PDF, JPG, PNG'} · Max 5MB
            </span>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {/* Status messages */}
      {error && (
        <p style={{ margin: 0, fontSize: '12px', color: '#dc2626' }}>⚠️ {error}</p>
      )}
      {uploaded && url && (
        <p style={{ margin: 0, fontSize: '12px', color: '#16a34a' }}>
          ✅ Uploaded —{' '}
          <a href={url} target="_blank" rel="noopener noreferrer"
            style={{ color: '#2563eb' }}>View file</a>
        </p>
      )}
      {file && uploading && (
        <p style={{ margin: 0, fontSize: '11px', color: '#6b7280' }}>
          {file.name} · {(file.size / 1024).toFixed(1)} KB
        </p>
      )}
    </div>
  )
}

// ── Main form ─────────────────────────────────────────────────
export default function EmployeeUploadForm({ empCode = 'EMP001', onSave }) {
  const [photoUrl,   setPhotoUrl]   = useState('')
  const [panUrl,     setPanUrl]     = useState('')
  const [aadhaarUrl, setAadhaarUrl] = useState('')
  const [saving,     setSaving]     = useState(false)
  const [message,    setMessage]    = useState('')

  async function handleSubmit() {
    if (!photoUrl) { setMessage('❌ Passport photo is required.'); return }

    setSaving(true)
    setMessage('')

    try {
      // Save URLs to your database via API
      const res = await fetch('/api/employees', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          empCode,
          photoUrl,
          panCard:  panUrl,
          aadhaar:  aadhaarUrl,
        }),
      })

      if (!res.ok) throw new Error('Failed to save employee')

      setMessage('✅ Documents saved successfully!')
      onSave?.({ photoUrl, panUrl, aadhaarUrl })

    } catch (err) {
      setMessage('❌ ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      overflow: 'hidden',
      maxWidth: '700px',
    }}>
      {/* Header */}
      <div style={{ background: '#1e3a5f', padding: '14px 24px' }}>
        <h2 style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700 }}>
          Upload Documents — {empCode}
        </h2>
      </div>

      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Passport Photo */}
        <UploadBox
          label="Passport Size Photo"
          accept="image/jpeg,image/png,image/webp"
          fileType="PHOTO"
          empCode={empCode}
          onUploaded={url => setPhotoUrl(url)}
          required
        />

        {/* PAN Card */}
        <UploadBox
          label="PAN Card"
          accept=".pdf,image/jpeg,image/png"
          fileType="PAN"
          empCode={empCode}
          onUploaded={url => setPanUrl(url)}
        />

        {/* Aadhaar Card */}
        <UploadBox
          label="Aadhaar Card"
          accept=".pdf,image/jpeg,image/png"
          fileType="AADHAAR"
          empCode={empCode}
          onUploaded={url => setAadhaarUrl(url)}
        />

        {/* Uploaded URLs preview */}
        {(photoUrl || panUrl || aadhaarUrl) && (
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '12px 16px',
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
          }}>
            {photoUrl   && <span style={{ fontSize: '12px', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px' }}>✅ Photo ready</span>}
            {panUrl     && <span style={{ fontSize: '12px', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px' }}>✅ PAN ready</span>}
            {aadhaarUrl && <span style={{ fontSize: '12px', color: '#16a34a', background: '#dcfce7', padding: '4px 10px', borderRadius: '20px' }}>✅ Aadhaar ready</span>}
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            padding: '11px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 500,
            background: message.startsWith('✅') ? '#f0fdf4' : '#fef2f2',
            color:      message.startsWith('✅') ? '#16a34a' : '#dc2626',
            border: `1px solid ${message.startsWith('✅') ? '#bbf7d0' : '#fecaca'}`,
          }}>
            {message}
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSubmit}
          disabled={saving || !photoUrl}
          style={{
            padding: '11px 28px',
            background: saving || !photoUrl ? '#93c5fd' : '#2563eb',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: 700,
            fontSize: '14px',
            cursor: saving || !photoUrl ? 'not-allowed' : 'pointer',
            alignSelf: 'flex-end',
          }}
        >
          {saving ? 'Saving...' : '💾 Save Documents'}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg) }
          to   { transform: rotate(360deg) }
        }
      `}</style>
    </div>
  )
}
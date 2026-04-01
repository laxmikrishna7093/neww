'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

const QRCode = dynamic(() => import('react-qr-code').then(mod => mod.default), { 
  ssr: false,
  loading: () => <div style={{ width: 60, height: 60, background: '#fff' }} />
});

const DEPARTMENTS  = ['CMR', 'MAX', 'Style Union', 'Nachi Consultant', 'Trands'];
const POSITIONS    = ['Housekeeping', 'staff', 'Security', 'Customer Support', 'Customer Associate', 'Driver', 'Mover'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const VIEWS = { LIST: 'list', ADD: 'add', IDCARD: 'idcard' };
const EMPTY_FORM = {
  empCode: '', firstName: '', lastName: '', email: '', phone: '',
  department: '', position: '', salary: '', reportingManager: '',
  gender: '', bloodGroup: '', employmentType: 'Full Time', doj: '',
  spouseOrGuardian: '',
  aadhaarNumber: '', emergencyContact: '', emergencyPhone: '',
  nomineeName: '', nomineeRelation: '', uanNumber: '',
  bankName: '', accountNumber: '', ifscCode: '',
  addressLine1: '', addressLine2: '', city: '', state: '', pincode: '',
};

async function uploadToCloudinary(file, empCode, fileType) {
  const folder = `employees/${empCode}`;
  const public_id = `${fileType}_${empCode}`;
  const sigRes = await fetch('/api/cloudinary-signature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, public_id }),
  });
  if (!sigRes.ok) {
    const e = await sigRes.json();
    throw new Error(e.error || 'Signature failed');
  }
  const { signature, timestamp, api_key, cloud_name } = await sigRes.json();
  const fd = new FormData();
  fd.append('file', file);
  fd.append('api_key', api_key);
  fd.append('timestamp', String(timestamp));
  fd.append('signature', signature);
  fd.append('folder', folder);
  fd.append('public_id', public_id);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

function validateFile(file) {
  if (!file) return null;
  if (file.size > 200 * 1024) return 'File exceeds 200 KB limit.';
  if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type))
    return 'Only JPG, PNG, WEBP, PDF allowed.';
  return null;
}

const C = {
  headerBg: '#1e3a5f',
  accent: '#2563eb',
  border: '#e2e8f0',
  inputBg: '#f8fafc',
  text: '#000000',
  muted: '#374151',
  label: '#000000',
  success: '#16a34a',
  successBg: '#f0fdf4',
  successBor: '#bbf7d0',
  error: '#dc2626',
  errorBg: '#fef2f2',
  errorBor: '#fecaca',
  panelHdr: '#5a7a9a',
  tableBorder: '#e5e7eb',
};

const inputSt = {
  width: '100%',
  padding: '9px 12px',
  border: `1px solid ${C.border}`,
  borderRadius: '6px',
  background: C.inputBg,
  fontSize: '13px',
  color: '#000000',
  boxSizing: 'border-box',
  outline: 'none',
  marginTop: '4px'
};

const selectSt = {
  ...inputSt,
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
  paddingRight: '30px'
};

const labelSt = { fontSize: '12px', fontWeight: 600, color: '#000000', display: 'block' };

const btnPrimary = (dis) => ({
  padding: '9px 24px',
  background: dis ? '#93c5fd' : C.accent,
  border: 'none',
  borderRadius: '6px',
  color: '#fff',
  fontWeight: 700,
  fontSize: '13px',
  cursor: dis ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
});

const btnSecondary = {
  padding: '9px 20px',
  background: '#f3f4f6',
  border: `1px solid ${C.border}`,
  borderRadius: '6px',
  color: '#000000',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const sectionTitle = {
  margin: '0 0 14px',
  fontSize: '12px',
  fontWeight: 700,
  color: '#000000',
  textTransform: 'uppercase',
  letterSpacing: '.07em',
  borderBottom: '2px solid #e9f0fb',
  paddingBottom: '6px'
};

function F({ label, children }) {
  return (
    <div>
      <label style={labelSt}>{label}</label>
      {children}
    </div>
  );
}

function UploadBox({ label, file, setFile, preview, uploading, error, accept = '.pdf,.jpg,.jpeg,.png,.webp' }) {
  const ref = useRef();
  return (
    <div>
      <label style={labelSt}>{label}</label>
      <div
        onClick={() => !uploading && ref.current?.click()}
        style={{
          marginTop: '4px',
          border: `2px dashed ${error ? C.errorBor : uploading ? C.accent : '#93c5fd'}`,
          borderRadius: '8px',
          background: error ? C.errorBg : uploading ? '#f0f7ff' : '#eef4ff',
          padding: '12px',
          cursor: uploading ? 'not-allowed' : 'pointer',
          textAlign: 'center',
          minHeight: '76px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.2s'
        }}
      >
        {uploading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: C.accent, fontSize: '13px' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            Uploading…
          </div>
        ) : preview ? (
          preview === 'pdf' || file?.type === 'application/pdf' ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: C.success }}>
              <span style={{ fontSize: '22px' }}>📄</span>
              <b>PDF ready ✓</b>
            </div>
          ) : (
            <img src={preview} alt="preview" style={{ maxHeight: '70px', maxWidth: '100%', borderRadius: '4px', objectFit: 'cover' }} />
          )
        ) : (
          <>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <span style={{ fontSize: '11px', color: '#000000' }}>Click · JPG/PNG/PDF · max 200kb</span>
          </>
        )}
        <input
          ref={ref}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
            e.target.value = '';
          }}
        />
      </div>
      {error && <p style={{ margin: '3px 0 0', fontSize: '11px', color: C.error }}>⚠️ {error}</p>}
      {file && !error && !uploading && <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#000000' }}>{file.name} · {(file.size / 1024).toFixed(1)} KB</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ID CARD FRONT
// ═══════════════════════════════════════════════════════════════
function IDCardFront({ emp, cardRef }) {
  const employeeName = emp ? `${emp.firstName || ''} ${emp.lastName || ''}`.trim() : '';
  const displayName = employeeName || 'EMPLOYEE NAME';
  const displayPosition = emp?.position || 'Designation';
  const displayDept = emp?.department || '';
  const displayCode = emp?.empCode || '—';
  const displayPhone = emp?.phone || '';

  return (
    <div
      ref={cardRef}
      style={{
        width: '260px',
        height: '410px',
        background: '#1a1a1a',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
      }}
    >
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px 16px',
        width: '100%'
      }}>
        <div style={{ marginBottom: '12px', textAlign: 'center' }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{
              width: '130px',
              height: '70px',
              objectFit: 'contain',
              display: 'block',
              margin: '0 auto'
            }}
            onError={e => { e.target.style.display = 'none'; }}
          />
        </div>

        <div style={{
          width: '130px',
          height: '145px',
          background: '#ffffff',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '3px solid #ffffff'
        }}>
          {emp?.photoUrl ? (
            <img
              src={emp.photoUrl}
              alt={displayName}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center top',
                display: 'block'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div style={{
        width: '100%',
        background: '#2563eb',
        padding: '12px 16px',
        textAlign: 'center'
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: '15px',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          color: '#FFFFFF',
          lineHeight: 1.3
        }}>
          {displayName}
        </div>
        <div style={{ 
          fontSize: '12px', 
          color: '#FFFFFF', 
          marginTop: '4px',
          opacity: 0.9
        }}>
          {displayPosition}{displayDept ? ` • ${displayDept}` : ''}
        </div>
      </div>

      <div style={{
        width: '100%',
        background: '#000000',
        padding: '10px 16px',
        textAlign: 'center'
      }}>
        <div style={{ 
          fontSize: '14px', 
          letterSpacing: '2px', 
          color: '#FFFFFF', 
          fontWeight: 700 
        }}>
          ID: {displayCode}
        </div>
        {displayPhone && (
          <div style={{ 
            fontSize: '11px', 
            color: '#CCCCCC', 
            marginTop: '3px' 
          }}>
            📞 {displayPhone}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ID CARD BACK - GOOGLE MAPS DIRECTIONS QR
// ═══════════════════════════════════════════════════════════════
function IDCardBack({ emp, cardRef }) {
  // ✅ GOOGLE MAPS DIRECTIONS URL
  const address = "14/23, 1st Floor, Madhav Aspire, No.39, Muralinagar, Visakhapatnam, Andhra Pradesh 530007";
  const encodedAddress = encodeURIComponent(address);
  const googleMapsDirections = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <div
      ref={cardRef}
      style={{
        width: '260px',
        height: '410px',
        background: '#1a1a1a',
        borderRadius: '14px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'hidden',
        flexShrink: 0,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        padding: '16px 18px 14px'
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '10px', width: '100%' }}>
        <img
          src="/logo.png"
          alt="Logo"
          style={{
            width: '100px',
            height: '55px',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto'
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      </div>

      <div style={{ width: '100%', marginBottom: '6px' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
          Instructions
        </p>
      </div>

      <ol style={{ paddingLeft: '18px', margin: '0 0 10px', width: '100%' }}>
        <li style={{ fontSize: '10px', color: '#E0E0E0', lineHeight: 1.5, marginBottom: '4px' }}>
          This Card must be carried at all times while on duty
        </li>
        <li style={{ fontSize: '10px', color: '#E0E0E0', lineHeight: 1.5, marginBottom: '4px' }}>
          This Card is non-transferrable and must be produced on demand
        </li>
        <li style={{ fontSize: '10px', color: '#E0E0E0', lineHeight: 1.5, marginBottom: '4px' }}>
          If lost or damaged, report immediately to HR department
        </li>
      </ol>

      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '10px'
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '10px', color: '#AAAAAA', fontStyle: 'italic' }}>
            Scan for directions:
          </p>
        </div>

        <div style={{
          width: '80px',
          height: '80px',
          background: '#FFFFFF',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          borderRadius: '4px'
        }}>
          <QRCode
            value={googleMapsDirections}
            size={64}
            level="H"
            bgColor="#FFFFFF"
            fgColor="#000000"
          />
        </div>
      </div>

      <div style={{ width: '100%', borderTop: '1px solid #444444', marginBottom: '10px' }} />

      <div style={{ width: '100%', textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '10px', fontWeight: 600, color: '#FFFFFF', lineHeight: 1.6 }}>
          NACHI CONSULTANT
        </p>
        <p style={{ margin: '4px 0 0', fontSize: '9px', color: '#CCCCCC', lineHeight: 1.5 }}>
          14/23, 1st Floor, Madhav Aspire, No.39,<br />
          Muralinagar, Visakhapatnam,<br />
          Andhra Pradesh - 530007
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════
export default function EmployeesPage() {
  const router = useRouter();
  const [view, setView] = useState(VIEWS.LIST);
  const [employees, setEmployees] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rowsToShow, setRowsToShow] = useState(50);
  const [search, setSearch] = useState({
    empCode: '', firstName: '', lastName: '', reportingManager: '', status: '', employmentType: ''
  });
  const [editingEmp, setEditingEmp] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [photoFile, setPhotoFile] = useState(null);
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [panPreview, setPanPreview] = useState('');
  const [aadhaarPrev, setAadhaarPrev] = useState('');
  const [photoUploading, setPhotoUploading] = useState(false);
  const [panUploading, setPanUploading] = useState(false);
  const [aadhaarUpl, setAadhaarUpl] = useState(false);
  const [photoErr, setPhotoErr] = useState('');
  const [panErr, setPanErr] = useState('');
  const [aadhaarErr, setAadhaarErr] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [panUrl, setPanUrl] = useState('');
  const [aadhaarUrl, setAadhaarUrl] = useState('');
  const [formMsg, setFormMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/employees');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setEmployees(data);
      setFiltered(data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (!photoFile) return;
    const err = validateFile(photoFile);
    if (err) {
      setPhotoErr(err);
      setPhotoFile(null);
      return;
    }
    setPhotoErr('');
    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photoFile);

    (async () => {
      setPhotoUploading(true);
      try {
        const code = (form.empCode && form.empCode !== 'AUTO') ? form.empCode : 'new';
        const url = await uploadToCloudinary(photoFile, code, 'PHOTO');
        setPhotoUrl(url);
      } catch (e) {
        setPhotoErr('Upload failed: ' + e.message);
        setPhotoPreview('');
      } finally {
        setPhotoUploading(false);
      }
    })();
  }, [photoFile, form.empCode]);

  useEffect(() => {
    if (!panFile) return;
    const err = validateFile(panFile);
    if (err) {
      setPanErr(err);
      setPanFile(null);
      return;
    }
    setPanErr('');
    if (panFile.type !== 'application/pdf') {
      const r = new FileReader();
      r.onload = e => setPanPreview(e.target.result);
      r.readAsDataURL(panFile);
    } else {
      setPanPreview('pdf');
    }

    (async () => {
      setPanUploading(true);
      try {
        const code = (form.empCode && form.empCode !== 'AUTO') ? form.empCode : 'new';
        const url = await uploadToCloudinary(panFile, code, 'PAN');
        setPanUrl(url);
      } catch (e) {
        setPanErr('Upload failed: ' + e.message);
      } finally {
        setPanUploading(false);
      }
    })();
  }, [panFile, form.empCode]);

  useEffect(() => {
    if (!aadhaarFile) return;
    const err = validateFile(aadhaarFile);
    if (err) {
      setAadhaarErr(err);
      setAadhaarFile(null);
      return;
    }
    setAadhaarErr('');
    if (aadhaarFile.type !== 'application/pdf') {
      const r = new FileReader();
      r.onload = e => setAadhaarPrev(e.target.result);
      r.readAsDataURL(aadhaarFile);
    } else {
      setAadhaarPrev('pdf');
    }

    (async () => {
      setAadhaarUpl(true);
      try {
        const code = (form.empCode && form.empCode !== 'AUTO') ? form.empCode : 'new';
        const url = await uploadToCloudinary(aadhaarFile, code, 'AADHAAR');
        setAadhaarUrl(url);
      } catch (e) {
        setAadhaarErr('Upload failed: ' + e.message);
      } finally {
        setAadhaarUpl(false);
      }
    })();
  }, [aadhaarFile, form.empCode]);

  async function openAdd() {
    setEditingEmp(null);
    resetFileStates();
    setFormMsg('');
    try {
      const res = await fetch('/api/admin/employees/next-code');
      const data = await res.json();
      setForm({ ...EMPTY_FORM, empCode: data.nextCode || 'AUTO' });
    } catch {
      setForm({ ...EMPTY_FORM, empCode: 'AUTO' });
    }
    setView(VIEWS.ADD);
  }

  function openEdit(emp) {
    setEditingEmp(emp);
    setForm({
      empCode: emp.empCode || '',
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      email: emp.email || '',
      phone: emp.phone || '',
      department: emp.department || '',
      position: emp.position || '',
      salary: emp.salary || '',
      reportingManager: emp.reportingManager || '',
      gender: emp.gender || '',
      bloodGroup: emp.bloodGroup || '',
      employmentType: emp.employmentType || 'Full Time',
      doj: emp.doj ? emp.doj.substring(0, 10) : '',
      spouseOrGuardian: emp.spouseOrGuardian || '',
      aadhaarNumber: emp.aadhaarNumber || '',
      emergencyContact: emp.emergencyContact || '',
      emergencyPhone: emp.emergencyPhone || '',
      nomineeName: emp.nomineeName || '',
      nomineeRelation: emp.nomineeRelation || '',
      uanNumber: emp.uanNumber || '',
      bankName: emp.bankName || '',
      accountNumber: emp.accountNumber || '',
      ifscCode: emp.ifscCode || '',
      addressLine1: emp.addressLine1 || '',
      addressLine2: emp.addressLine2 || '',
      city: emp.city || '',
      state: emp.state || '',
      pincode: emp.pincode || '',
    });
    setPhotoUrl(emp.photoUrl || '');
    setPhotoPreview(emp.photoUrl || '');
    setPanUrl(emp.panCard || '');
    setPanPreview(emp.panCard ? (emp.panCard.includes('.pdf') ? 'pdf' : emp.panCard) : '');
    setAadhaarUrl(emp.aadhaar || '');
    setAadhaarPrev(emp.aadhaar ? (emp.aadhaar.includes('.pdf') ? 'pdf' : emp.aadhaar) : '');
    setPhotoFile(null);
    setPanFile(null);
    setAadhaarFile(null);
    setPhotoErr('');
    setPanErr('');
    setAadhaarErr('');
    setFormMsg('');
    setView(VIEWS.ADD);
  }

  function resetFileStates() {
    setPhotoFile(null);
    setPanFile(null);
    setAadhaarFile(null);
    setPhotoPreview('');
    setPanPreview('');
    setAadhaarPrev('');
    setPhotoUrl('');
    setPanUrl('');
    setAadhaarUrl('');
    setPhotoErr('');
    setPanErr('');
    setAadhaarErr('');
  }

  async function handleSave() {
    if (!form.firstName.trim()) {
      setFormMsg('❌ First Name is required.');
      return;
    }
    if (!editingEmp && !photoUrl && !photoFile) {
      setFormMsg('❌ Employee Photo is required.');
      return;
    }
    if (photoUploading || panUploading || aadhaarUpl) {
      setFormMsg('⏳ Please wait, upload in progress…');
      return;
    }

    if (editingEmp) {
      const ok = confirm(`Update employee ${form.firstName} ${form.lastName}?`);
      if (!ok) return;
    }

    setSaving(true);
    setFormMsg('');

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        department: form.department,
        position: form.position,
        salary: Number(form.salary) || 0,
        reportingManager: form.reportingManager,
        gender: form.gender,
        bloodGroup: form.bloodGroup,
        employmentType: form.employmentType,
        doj: form.doj,
        spouseOrGuardian: form.spouseOrGuardian,
        aadhaarNumber: form.aadhaarNumber,
        emergencyContact: form.emergencyContact,
        emergencyPhone: form.emergencyPhone,
        nomineeName: form.nomineeName,
        nomineeRelation: form.nomineeRelation,
        uanNumber: form.uanNumber,
        bankName: form.bankName,
        accountNumber: form.accountNumber,
        ifscCode: form.ifscCode,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      };

      if (photoUrl) payload.photoUrl = photoUrl;
      if (panUrl) payload.panCard = panUrl;
      if (aadhaarUrl) payload.aadhaar = aadhaarUrl;

      if (editingEmp) {
        payload.id = editingEmp._id;
        const res = await fetch('/api/admin/employees', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Update failed');
        setFormMsg('✅ Employee updated!');
      } else {
        payload.empCode = form.empCode;
        payload.status = 'Existing';
        payload.letterStatus = 'Pending';
        const res = await fetch('/api/admin/employees', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Save failed');
        setFormMsg('✅ Employee saved!');
      }

      await fetchEmployees();
      setTimeout(() => {
        setView(VIEWS.LIST);
        setFormMsg('');
        setEditingEmp(null);
      }, 1200);
    } catch (err) {
      setFormMsg('❌ ' + err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this employee?')) return;
    try {
      const res = await fetch('/api/admin/employees', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error);
      }
      await fetchEmployees();
    } catch (err) {
      alert('Delete failed: ' + err.message);
    }
  }

  function handleSearchChange(key, value) {
    const u = { ...search, [key]: value };
    setSearch(u);
    applyFilters(u, employees);
  }

  function applyFilters(s, list) {
    let r = [...list];
    if (s.empCode) r = r.filter(e => e.empCode?.toLowerCase().includes(s.empCode.toLowerCase()));
    if (s.firstName) r = r.filter(e => e.firstName?.toLowerCase().includes(s.firstName.toLowerCase()));
    if (s.lastName) r = r.filter(e => e.lastName?.toLowerCase().includes(s.lastName.toLowerCase()));
    if (s.reportingManager) r = r.filter(e => e.reportingManager?.toLowerCase().includes(s.reportingManager.toLowerCase()));
    if (s.status) r = r.filter(e => e.status === s.status);
    if (s.employmentType) r = r.filter(e => e.employmentType === s.employmentType);
    setFiltered(r);
  }

  function resetFilters() {
    setSearch({ empCode: '', firstName: '', lastName: '', reportingManager: '', status: '', employmentType: '' });
    setFiltered(employees);
  }

  // ✅ SINGLE DOWNLOAD - BOTH CARDS COMBINED
  async function downloadIDCard() {
    if (!frontRef.current || !backRef.current) return;
    
    try {
      const h2c = (await import('html2canvas')).default;
      
      const frontCanvas = await h2c(frontRef.current, {
        scale: 4,
        backgroundColor: '#1a1a1a',
        useCORS: true,
        allowTaint: true
      });
      
      const backCanvas = await h2c(backRef.current, {
        scale: 4,
        backgroundColor: '#1a1a1a',
        useCORS: true,
        allowTaint: true
      });
      
      const gap = 60;
      const combinedCanvas = document.createElement('canvas');
      combinedCanvas.width = frontCanvas.width + backCanvas.width + gap;
      combinedCanvas.height = Math.max(frontCanvas.height, backCanvas.height);
      
      const ctx = combinedCanvas.getContext('2d');
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, combinedCanvas.width, combinedCanvas.height);
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, frontCanvas.width + gap, 0);
      
      const a = document.createElement('a');
      a.download = `IDCard_${selectedEmp?.empCode || 'card'}.png`;
      a.href = combinedCanvas.toDataURL('image/png', 1.0);
      a.click();
      
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  }

  function printCard() {
    if (!frontRef.current || !backRef.current) return;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Print ID Card</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { display: flex; gap: 30px; justify-content: center; align-items: center; min-height: 100vh; padding: 20px; background: #fff; }
          @media print { @page { size: A4 landscape; margin: 1cm; } }
        </style>
      </head>
      <body>
        ${frontRef.current.outerHTML}
        ${backRef.current.outerHTML}
        <script>setTimeout(() => window.print(), 500);<\/script>
      </body>
      </html>
    `);
    win.document.close();
  }

  const active = employees.filter(e => e.status === 'Existing' || e.status === 'Active').length;
  const inactive = employees.filter(e => e.status === 'Inactive').length;
  const fnf = employees.filter(e => e.status === 'FnF Initiated').length;
  const pending = employees.filter(e => e.status === 'Pending').length;
  const displayed = filtered.slice(0, rowsToShow);
  const anyUploading = photoUploading || panUploading || aadhaarUpl;

  const statusColor = (s) => {
    if (s === 'Inactive') return '#ef4444';
    if (s === 'FnF Locked') return '#f59e0b';
    if (s === 'Pending') return '#3b82f6';
    return '#16a34a';
  };

  return (
    <ProtectedRoute>
      <div className="main-container">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
        <div className={`sidebar-wrapper ${sidebarOpen ? 'open' : ''}`}><Sidebar /></div>
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        <div className="content-area">
          <div className="page-padding">

            {/* LIST VIEW */}
            {view === VIEWS.LIST && (
              <>
                <div className="panel">
                  <div className="panel-header">Search</div>
                  <div className="panel-body">
                    <div className="search-grid">
                      <input placeholder="Emp Code" value={search.empCode} onChange={e => handleSearchChange('empCode', e.target.value)} className="search-input" />
                      <input placeholder="First Name" value={search.firstName} onChange={e => handleSearchChange('firstName', e.target.value)} className="search-input" />
                      <input placeholder="Last Name" value={search.lastName} onChange={e => handleSearchChange('lastName', e.target.value)} className="search-input" />
                      <input placeholder="Manager" value={search.reportingManager} onChange={e => handleSearchChange('reportingManager', e.target.value)} className="search-input" />
                      <select value={search.status} onChange={e => handleSearchChange('status', e.target.value)} className="search-input">
                        <option value="">Status</option>
                        <option>Existing</option>
                        <option>Inactive</option>
                        <option>FnF Locked</option>
                        <option>Pending</option>
                      </select>
                      <select value={search.employmentType} onChange={e => handleSearchChange('employmentType', e.target.value)} className="search-input">
                        <option value="">Emp Type</option>
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                      </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                      <button onClick={resetFilters} className="btn-reset">Reset</button>
                    </div>
                  </div>
                </div>

                <div className="panel">
                  <div className="panel-header list-header">
                    <span>Employees ({filtered.length})</span>
                    <div className="header-buttons">
                      <button onClick={() => router.push('/admin/dashboard')} className="btn-header">← Back</button>
                      <button onClick={fetchEmployees} className="btn-header">🔄</button>
                      <button onClick={() => { setSelectedEmp(employees[0] || null); setFlipped(false); setView(VIEWS.IDCARD); }} className="btn-header">🪪</button>
                      <button onClick={openAdd} className="btn-header btn-add">+ Add</button>
                    </div>
                  </div>

                  <div className="stats-row">
                    <div className="rows-selector">
                      Show
                      <select value={rowsToShow} onChange={e => setRowsToShow(Number(e.target.value))}>
                        <option>10</option><option>25</option><option>50</option><option>100</option>
                      </select>
                    </div>
                    <div className="stats-info">
                      <span>Active: {active}</span>
                      <span>Inactive: {inactive}</span>
                      <span>FnF: {fnf}</span>
                      <span>Pending: {pending}</span>
                    </div>
                  </div>

                  {loading ? (
                    <div className="loading-state"><div style={{ fontSize: '32px' }}>⏳</div><p>Loading…</p></div>
                  ) : (
                    <div className="table-wrapper">
                      <table className="emp-table">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Name</th>
                            <th className="hide-mobile">Dept</th>
                            <th className="hide-mobile">Position</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayed.length === 0 ? (
                            <tr>
                              <td colSpan={6} className="empty-state">
                                No employees. <button onClick={openAdd} className="link-btn">Add one</button>
                              </td>
                            </tr>
                          ) : (
                            displayed.map((emp, i) => (
                              <tr key={emp._id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                                <td>{emp.empCode || '—'}</td>
                                <td>{emp.firstName} {emp.lastName}</td>
                                <td className="hide-mobile">{emp.department || '—'}</td>
                                <td className="hide-mobile">{emp.position || '—'}</td>
                                <td><span style={{ color: statusColor(emp.status), fontWeight: 600 }}>{emp.status || '—'}</span></td>
                                <td>
                                  <div className="action-buttons">
                                    <button onClick={() => openEdit(emp)} className="btn-edit">✏️</button>
                                    <button onClick={() => { setSelectedEmp(emp); setFlipped(false); setView(VIEWS.IDCARD); }} className="btn-idcard">🪪</button>
                                    <button onClick={() => handleDelete(emp._id)} className="btn-delete">🗑️</button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* ADD/EDIT VIEW */}
            {view === VIEWS.ADD && (
              <div>
                <div className="form-header">
                  <button onClick={() => { setView(VIEWS.LIST); setEditingEmp(null); }} className="btn-back">← Back</button>
                  <div>
                    <h1 className="form-title">{editingEmp ? `Edit: ${editingEmp.firstName}` : 'Add Employee'}</h1>
                    <p className="form-subtitle">Code: <b style={{ color: C.accent }}>{form.empCode}</b></p>
                  </div>
                </div>

                <div className="form-panel">
                  <div className="form-panel-header">Employee Details</div>
                  <div className="form-panel-body">

                    <h3 style={sectionTitle}>👤 Personal Details</h3>
                    <div className="form-grid">
                      <div>
                        <label style={labelSt}>Employee Code</label>
                        <input value={form.empCode} readOnly style={{ ...inputSt, background: '#e9f0fb', fontWeight: 700 }} />
                      </div>
                      <F label="First Name *"><input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} style={inputSt} /></F>
                      <F label="Last Name"><input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} style={inputSt} /></F>
                      <F label="Email"><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputSt} /></F>
                      <F label="Phone"><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={inputSt} /></F>
                      <F label="Gender">
                        <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={selectSt}>
                          <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                        </select>
                      </F>
                      <F label="Blood Group">
                        <select value={form.bloodGroup} onChange={e => setForm({ ...form, bloodGroup: e.target.value })} style={selectSt}>
                          <option value="">Select</option>
                          {BLOOD_GROUPS.map(bg => <option key={bg}>{bg}</option>)}
                        </select>
                      </F>
                      <F label="Spouse/Guardian"><input value={form.spouseOrGuardian} onChange={e => setForm({ ...form, spouseOrGuardian: e.target.value })} style={inputSt} /></F>
                      <F label="Aadhaar Number"><input value={form.aadhaarNumber} onChange={e => setForm({ ...form, aadhaarNumber: e.target.value })} maxLength={14} style={inputSt} /></F>
                      <F label="UAN (PF)"><input value={form.uanNumber} onChange={e => setForm({ ...form, uanNumber: e.target.value })} style={inputSt} /></F>
                      <F label="Emergency Contact"><input value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} style={inputSt} /></F>
                      <F label="Emergency Phone"><input value={form.emergencyPhone} onChange={e => setForm({ ...form, emergencyPhone: e.target.value })} style={inputSt} /></F>
                      <F label="Nominee Name"><input value={form.nomineeName} onChange={e => setForm({ ...form, nomineeName: e.target.value })} style={inputSt} /></F>
                      <F label="Nominee Relation">
                        <select value={form.nomineeRelation} onChange={e => setForm({ ...form, nomineeRelation: e.target.value })} style={selectSt}>
                          <option value="">Select</option><option>Spouse</option><option>Father</option><option>Mother</option><option>Son</option><option>Daughter</option><option>Other</option>
                        </select>
                      </F>
                    </div>

                    <div className="section-divider" />

                    <h3 style={sectionTitle}>💼 Job Details</h3>
                    <div className="form-grid">
                      <F label="Department">
                        <select value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} style={selectSt}>
                          <option value="">Select</option>
                          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                        </select>
                      </F>
                      <F label="Position">
                        <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={selectSt}>
                          <option value="">Select</option>
                          {POSITIONS.map(p => <option key={p}>{p}</option>)}
                        </select>
                      </F>
                      <F label="Salary (₹)"><input type="number" value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} style={inputSt} /></F>
                      <F label="Manager"><input value={form.reportingManager} onChange={e => setForm({ ...form, reportingManager: e.target.value })} style={inputSt} /></F>
                      <F label="Emp Type">
                        <select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value })} style={selectSt}>
                          <option>Full Time</option><option>Part Time</option><option>Contract</option>
                        </select>
                      </F>
                      <F label="Date of Joining"><input type="date" value={form.doj} onChange={e => setForm({ ...form, doj: e.target.value })} style={inputSt} /></F>
                    </div>

                    <div className="section-divider" />

                    <h3 style={sectionTitle}>🏦 Bank & Address</h3>
                    <div className="form-grid">
                      <F label="Bank Name"><input value={form.bankName} onChange={e => setForm({ ...form, bankName: e.target.value })} style={inputSt} /></F>
                      <F label="Account No"><input value={form.accountNumber} onChange={e => setForm({ ...form, accountNumber: e.target.value })} style={inputSt} /></F>
                      <F label="IFSC"><input value={form.ifscCode} onChange={e => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })} maxLength={11} style={inputSt} /></F>
                      <F label="Address Line 1"><input value={form.addressLine1} onChange={e => setForm({ ...form, addressLine1: e.target.value })} style={inputSt} /></F>
                      <F label="Address Line 2"><input value={form.addressLine2} onChange={e => setForm({ ...form, addressLine2: e.target.value })} style={inputSt} /></F>
                      <F label="City"><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={inputSt} /></F>
                      <F label="State"><input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} style={inputSt} /></F>
                      <F label="PIN Code"><input value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} maxLength={6} style={inputSt} /></F>
                    </div>

                    <div className="section-divider" />

                    <h3 style={sectionTitle}>📄 Documents</h3>
                    <div className="form-grid">
                      <UploadBox label={`Photo${editingEmp ? '' : ' *'}`} file={photoFile} setFile={setPhotoFile} preview={photoPreview} uploading={photoUploading} error={photoErr} accept="image/*" />
                      <UploadBox label="PAN Card" file={panFile} setFile={setPanFile} preview={panPreview} uploading={panUploading} error={panErr} />
                      <UploadBox label="Aadhaar Card" file={aadhaarFile} setFile={setAadhaarFile} preview={aadhaarPrev} uploading={aadhaarUpl} error={aadhaarErr} />
                    </div>

                    {formMsg && <div className={`form-message ${formMsg.startsWith('✅') ? 'success' : 'error'}`}>{formMsg}</div>}

                    <div className="form-actions">
                      <button onClick={() => { setView(VIEWS.LIST); setEditingEmp(null); }} style={btnSecondary}>← Cancel</button>
                      <button onClick={handleSave} disabled={saving || anyUploading} style={btnPrimary(saving || anyUploading)}>
                        {saving ? 'Saving…' : anyUploading ? 'Uploading…' : '💾 Save'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ID CARD VIEW */}
            {view === VIEWS.IDCARD && (
              <div>
                <div className="form-header">
                  <button onClick={() => setView(VIEWS.LIST)} className="btn-back">← Back</button>
                  <div>
                    <h1 className="form-title">ID Card Generator</h1>
                    <p className="form-subtitle">Click card to flip • QR opens Google Maps directions</p>
                  </div>
                </div>

                <div className="idcard-layout">
                  <div className="panel idcard-selector">
                    <div className="panel-header">Select Employee</div>
                    <div className="panel-body">
                      <select
                        onChange={e => {
                          const emp = employees.find(x => x._id === e.target.value);
                          setSelectedEmp(emp || null);
                          setFlipped(false);
                        }}
                        value={selectedEmp?._id || ''}
                        className="employee-select"
                      >
                        <option value="">— Select Employee —</option>
                        {employees.map(e => (
                          <option key={e._id} value={e._id}>
                            {e.empCode} — {e.firstName} {e.lastName}
                          </option>
                        ))}
                      </select>

                      {selectedEmp && (
                        <div className="selected-emp-info">
                          <p className="emp-name">{selectedEmp.firstName} {selectedEmp.lastName}</p>
                          <p className="emp-code">ID: {selectedEmp.empCode}</p>
                          <p className="emp-position">{selectedEmp.position} • {selectedEmp.department}</p>
                          {selectedEmp.phone && <p className="emp-phone">📞 {selectedEmp.phone}</p>}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="idcard-preview">
                    <p className="flip-hint">{flipped ? '← Back Side' : 'Front Side →'} (Click to flip)</p>

                    <div className="id-flip-scene" onClick={() => setFlipped(f => !f)}>
                      <div className={flipped ? 'id-flip-card flipped' : 'id-flip-card'}>
                        <div className="id-flip-front">
                          <IDCardFront emp={selectedEmp} cardRef={frontRef} />
                        </div>
                        <div className="id-flip-back">
                          <IDCardBack emp={selectedEmp} cardRef={backRef} />
                        </div>
                      </div>
                    </div>

                    {/* ✅ SINGLE DOWNLOAD BUTTON */}
                    <div className="idcard-buttons">
                      <button onClick={downloadIDCard} disabled={!selectedEmp} className="btn-download">
                        ⬇ Download ID Card
                      </button>
                      <button onClick={printCard} disabled={!selectedEmp} className="btn-print">
                        🖨 Print ID Card
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .main-container { display: flex; min-height: 100vh; background: #f3f4f6; font-family: 'Segoe UI', sans-serif; }
        .sidebar-wrapper { flex-shrink: 0; }
        .content-area { flex: 1; min-width: 0; overflow-y: auto; }
        .page-padding { padding: 20px; }
        
        .mobile-menu-btn { display: none; position: fixed; top: 10px; left: 10px; z-index: 1001; background: ${C.headerBg}; color: #fff; border: none; border-radius: 6px; padding: 10px 14px; font-size: 18px; cursor: pointer; }
        .sidebar-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 999; }
        
        .panel { background: #fff; border-radius: 6px; border: 1px solid ${C.border}; margin-bottom: 16px; overflow: hidden; }
        .panel-header { background: ${C.panelHdr}; padding: 10px 16px; color: #fff; font-weight: 600; font-size: 14px; }
        .panel-body { padding: 12px 16px; }
        
        .list-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
        .header-buttons { display: flex; gap: 8px; flex-wrap: wrap; }
        .btn-header { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); border-radius: 4px; color: #fff; padding: 6px 12px; cursor: pointer; font-size: 13px; }
        .btn-add { background: rgba(255,255,255,0.25); font-weight: 700; }
        
        .search-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 8px; }
        .search-input { width: 100%; padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 4px; font-size: 13px; color: #000000; background: #fff; }
        .search-input::placeholder { color: #666666; }
        .btn-reset { background: #4a7fa5; border: none; border-radius: 4px; color: #fff; padding: 7px 14px; cursor: pointer; font-size: 13px; }
        
        .stats-row { padding: 10px 16px; border-bottom: 1px solid ${C.tableBorder}; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; background: #fff; }
        .rows-selector { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #000000; }
        .rows-selector select { border: 1px solid #9ca3af; border-radius: 4px; padding: 3px 8px; color: #000000; }
        .stats-info { display: flex; gap: 8px; font-size: 12px; flex-wrap: wrap; }
        .stats-info span { padding: 2px 6px; background: #f3f4f6; border-radius: 4px; color: #000000; font-weight: 600; }
        
        .table-wrapper { width: 100%; overflow-x: auto; background: #fff; }
        .emp-table { width: 100%; border-collapse: collapse; font-size: 12px; min-width: 500px; background: #fff; }
        .emp-table th { padding: 10px; text-align: left; font-weight: 700; background: #f9fafb; border-bottom: 2px solid ${C.tableBorder}; color: #000000; }
        .emp-table td { padding: 9px 10px; border-bottom: 1px solid ${C.tableBorder}; color: #000000; font-weight: 500; }
        .row-even { background: #ffffff; }
        .row-odd { background: #f9fafb; }
        .emp-table tr:hover { background: #eff6ff !important; }
        
        .empty-state, .loading-state { padding: 40px; text-align: center; color: #000000; background: #fff; }
        .link-btn { color: ${C.accent}; background: none; border: none; cursor: pointer; font-weight: 600; }
        
        .action-buttons { display: flex; gap: 5px; }
        .btn-edit, .btn-idcard, .btn-delete { padding: 4px 8px; border-radius: 4px; cursor: pointer; font-size: 12px; border: 1px solid; }
        .btn-edit { background: #eff6ff; border-color: #bfdbfe; }
        .btn-idcard { background: #f0fdf4; border-color: #bbf7d0; }
        .btn-delete { background: #fef2f2; border-color: #fecaca; }
        
        .form-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
        .btn-back { background: #fff; border: 1px solid ${C.border}; border-radius: 6px; padding: 9px 18px; cursor: pointer; font-size: 13px; font-weight: 700; color: #000000; }
        .form-title { margin: 0; font-size: 18px; font-weight: 700; color: #000000; }
        .form-subtitle { margin: 0; font-size: 12px; color: #333333; }
        
        .form-panel { background: #fff; border-radius: 10px; border: 1px solid ${C.border}; overflow: hidden; }
        .form-panel-header { background: ${C.headerBg}; padding: 13px 24px; color: #fff; font-weight: 600; }
        .form-panel-body { padding: 24px; background: #fff; }
        
        .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 14px; }
        .section-divider { margin: 20px 0; border-top: 1px solid ${C.border}; }
        
        .form-message { margin-top: 16px; padding: 11px 16px; border-radius: 8px; font-size: 13px; }
        .form-message.success { background: ${C.successBg}; color: ${C.success}; border: 1px solid ${C.successBor}; }
        .form-message.error { background: ${C.errorBg}; color: ${C.error}; border: 1px solid ${C.errorBor}; }
        
        .form-actions { margin-top: 24px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid ${C.border}; padding-top: 20px; flex-wrap: wrap; }
        
        .idcard-layout { display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: start; }
        .idcard-preview { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .employee-select { width: 100%; padding: 10px 12px; border: 1px solid ${C.border}; border-radius: 6px; font-size: 14px; color: #000000; background: #fff; }
        
        .selected-emp-info { margin-top: 16px; background: #f8fafc; border-radius: 8px; padding: 14px; border: 1px solid ${C.border}; }
        .emp-name { margin: 0; font-weight: 700; font-size: 15px; color: #000000; }
        .emp-code { margin: 4px 0 0; font-size: 12px; color: ${C.accent}; font-weight: 600; }
        .emp-position { margin: 4px 0 0; font-size: 12px; color: #333333; }
        .emp-phone { margin: 4px 0 0; font-size: 12px; color: #333333; }
        
        .flip-hint { font-size: 11px; color: #333333; text-transform: uppercase; margin: 0; }
        .idcard-buttons { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 260px; }
        .btn-download, .btn-print { width: 100%; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer; }
        .btn-download { background: ${C.headerBg}; color: #fff; border: none; }
        .btn-download:disabled { background: #d1d5db; cursor: not-allowed; }
        .btn-print { background: #fff; color: #000000; border: 1px solid ${C.border}; }
        .btn-print:disabled { color: #d1d5db; cursor: not-allowed; }
        
        .id-flip-scene { width: 260px; height: 410px; perspective: 1000px; cursor: pointer; }
        .id-flip-card { width: 260px; height: 410px; position: relative; transform-style: preserve-3d; transition: transform 0.7s; }
        .id-flip-card.flipped { transform: rotateY(180deg); }
        .id-flip-front, .id-flip-back { position: absolute; inset: 0; backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .id-flip-back { transform: rotateY(180deg); }
        
        @media (max-width: 1024px) { .idcard-layout { grid-template-columns: 1fr; } .idcard-selector { order: 2; } .idcard-preview { order: 1; } }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block; }
          .sidebar-wrapper { position: fixed; left: -280px; top: 0; bottom: 0; z-index: 1000; transition: left 0.3s; }
          .sidebar-wrapper.open { left: 0; }
          .sidebar-overlay { display: block; }
          .page-padding { padding: 15px; padding-top: 60px; }
          .form-grid { grid-template-columns: 1fr; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 480px) { .search-grid { grid-template-columns: 1fr; } .id-flip-scene, .id-flip-card { width: 240px !important; height: 380px !important; } }
      `}</style>
    </ProtectedRoute>
  );
}
'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

const DEPARTMENTS  = ['CMR', 'MAX', 'Style Union', 'Trands'];
const POSITIONS    = ['Housekeeping', 'Security', 'Customer Support', 'Customer Associate', 'Driver', 'Mover'];
const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ✅ IMPORTANT: These keys must match exactly — do NOT change them
const LS_KEY_EMPLOYEES = 'emp_management_employees';
const LS_KEY_LAST_CODE = 'emp_management_last_code';

const VIEWS = { LIST: 'list', ADD: 'add', IDCARD: 'idcard' };
const EMPTY_FORM = {
  empCode: '', firstName: '', lastName: '', email: '', phone: '',
  department: '', position: '', salary: '', reportingManager: '',
  gender: '', bloodGroup: '', employmentType: 'Full Time', doj: '',
};

// ✅ Load from localStorage — data persists across refresh & close
function loadEmployees() {
  try {
    const raw = localStorage.getItem(LS_KEY_EMPLOYEES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

// ✅ Save to localStorage
function saveEmployees(list) {
  try {
    localStorage.setItem(LS_KEY_EMPLOYEES, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save employees:', e);
  }
}

// ✅ FIX: getNextCode only called at SAVE time, not when form opens
function getNextCode() {
  try {
    const raw  = localStorage.getItem(LS_KEY_LAST_CODE);
    const last = parseInt(raw || '5000', 10);
    const next = isNaN(last) ? 5001 : last + 1;
    localStorage.setItem(LS_KEY_LAST_CODE, String(next));
    return String(next);
  } catch { return '5001'; }
}

// ── SIGNED CLOUDINARY UPLOAD ──────────────────────────────────
async function uploadToCloudinary(file, empCode, fileType) {
  const folder    = `employees/${empCode}`;
  const public_id = `${fileType}_${empCode}`;
  const sigRes = await fetch('/api/cloudinary-signature', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ folder, public_id }),
  });
  if (!sigRes.ok) { const e = await sigRes.json(); throw new Error(e.error || 'Signature failed'); }
  const { signature, timestamp, api_key, cloud_name } = await sigRes.json();
  const fd = new FormData();
  fd.append('file', file); fd.append('api_key', api_key);
  fd.append('timestamp', String(timestamp)); fd.append('signature', signature);
  fd.append('folder', folder); fd.append('public_id', public_id);
  const res  = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`, { method: 'POST', body: fd });
  const data = await res.json();
  if (!res.ok || data.error) throw new Error(data.error?.message || 'Upload failed');
  return data.secure_url;
}

function validateFile(file) {
  if (!file) return null;
  if (file.size > 5 * 1024 * 1024) return 'File exceeds 5MB limit.';
  if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type))
    return 'Only JPG, PNG, WEBP, PDF allowed.';
  return null;
}

// ── STYLES ────────────────────────────────────────────────────
const C = {
  headerBg: '#1e3a5f', accent: '#2563eb',
  border: '#e2e8f0', inputBg: '#f8fafc', text: '#111827',
  muted: '#6b7280', label: '#374151', success: '#16a34a',
  successBg: '#f0fdf4', successBor: '#bbf7d0',
  error: '#dc2626', errorBg: '#fef2f2', errorBor: '#fecaca',
  panelHdr: '#5a7a9a', tableBorder: '#e5e7eb',
};
const inputSt     = { width:'100%', padding:'9px 12px', border:`1px solid ${C.border}`, borderRadius:'6px', background:C.inputBg, fontSize:'13px', color:C.text, boxSizing:'border-box', outline:'none', marginTop:'4px' };
const selectSt    = { ...inputSt, cursor:'pointer', appearance:'none', WebkitAppearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center', paddingRight:'30px' };
const labelSt     = { fontSize:'12px', fontWeight:600, color:C.label, display:'block' };
const btnPrimary  = (dis) => ({ padding:'9px 24px', background:dis?'#93c5fd':C.accent, border:'none', borderRadius:'6px', color:'#fff', fontWeight:700, fontSize:'13px', cursor:dis?'not-allowed':'pointer', display:'flex', alignItems:'center', gap:'6px' });
const btnSecondary= { padding:'9px 20px', background:'#f3f4f6', border:`1px solid ${C.border}`, borderRadius:'6px', color:C.label, fontWeight:600, fontSize:'13px', cursor:'pointer', display:'flex', alignItems:'center', gap:'6px' };
const sectionTitle= { margin:'0 0 14px', fontSize:'12px', fontWeight:700, color:C.headerBg, textTransform:'uppercase', letterSpacing:'.07em', borderBottom:'2px solid #e9f0fb', paddingBottom:'6px' };
const grid2       = { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'14px' };

function F({ label, children }) { return <div><label style={labelSt}>{label}</label>{children}</div>; }

// ── UPLOAD BOX ────────────────────────────────────────────────
function UploadBox({ label, file, setFile, preview, uploading, error, accept='.pdf,.jpg,.jpeg,.png,.webp' }) {
  const ref = useRef();
  return (
    <div>
      <label style={labelSt}>{label}</label>
      <div onClick={() => !uploading && ref.current?.click()} style={{ marginTop:'4px', border:`2px dashed ${error?C.errorBor:uploading?C.accent:'#93c5fd'}`, borderRadius:'8px', background:error?C.errorBg:uploading?'#f0f7ff':'#eef4ff', padding:'12px', cursor:uploading?'not-allowed':'pointer', textAlign:'center', minHeight:'76px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px', transition:'all 0.2s' }}>
        {uploading
          ? <div style={{ display:'flex', alignItems:'center', gap:'8px', color:C.accent, fontSize:'13px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 1s linear infinite' }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Uploading to Cloudinary…
            </div>
          : preview
            ? preview==='pdf'||file?.type==='application/pdf'
              ? <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:C.success }}><span style={{ fontSize:'22px' }}>📄</span><b>PDF ready ✓</b></div>
              : <img src={preview} alt="preview" style={{ maxHeight:'70px', maxWidth:'100%', borderRadius:'4px', objectFit:'cover' }}/>
            : <>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span style={{ fontSize:'11px', color:C.muted }}>Click · JPG/PNG/PDF/WEBP · max 5MB</span>
              </>
        }
        <input ref={ref} type="file" accept={accept} style={{ display:'none' }} onChange={e => { const f=e.target.files?.[0]; if(f) setFile(f); e.target.value=''; }}/>
      </div>
      {error && <p style={{ margin:'3px 0 0', fontSize:'11px', color:C.error }}>⚠️ {error}</p>}
      {file && !error && !uploading && <p style={{ margin:'3px 0 0', fontSize:'11px', color:C.muted }}>{file.name} · {(file.size/1024).toFixed(1)} KB</p>}
    </div>
  );
}

// ── ID CARD FRONT ─────────────────────────────────────────────
function IDCardFront({ emp, cardRef }) {
  return (
    <div ref={cardRef} style={{ width:'260px', height:'410px', background:'#111111', borderRadius:'14px', display:'flex', flexDirection:'column', alignItems:'center', fontFamily:"'Segoe UI',sans-serif", overflow:'hidden', flexShrink:0, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
      <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'1.2rem 1rem 1rem', width:'100%', background:'#111111' }}>
        <div style={{ marginBottom:'1rem', textAlign:'center' }}>
          <img src="/logo.png" alt="Logo" style={{ width:'150px', height:'95px', objectFit:'contain', filter:'invert(1)', display:'block', margin:'0 auto' }} onError={e => { e.target.style.display='none'; }}/>
        </div>
        <div style={{ width:'140px', height:'150px', background:'#fff', borderRadius:'6px', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center' }}>
          {emp?.photoUrl
            ? <img src={emp.photoUrl} alt={emp?.firstName||'Employee'} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }}/>
            : <div style={{ width:'100%', height:'100%', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="1.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </div>
          }
        </div>
      </div>
      <div style={{ width:'100%', background:'#2563eb', padding:'0.6rem 1rem', textAlign:'center' }}>
        <div style={{ fontWeight:700, fontSize:'0.88rem', letterSpacing:'0.5px', textTransform:'uppercase', color:'#fff', lineHeight:1.2 }}>
          {emp ? `${emp.firstName} ${emp.lastName}`.trim() : 'EMPLOYEE NAME'}
        </div>
        <div style={{ fontSize:'0.68rem', color:'#bfdbfe', marginTop:'3px' }}>
          {emp?.position||'Designation'}{emp?.department ? ` · ${emp.department}` : ''}
        </div>
      </div>
      <div style={{ width:'100%', background:'#000000', padding:'0.45rem 1rem', textAlign:'center' }}>
        <div style={{ fontSize:'0.75rem', letterSpacing:'2px', color:'#fff', fontWeight:700 }}>ID: {emp?.empCode||'—'}</div>
        {emp?.phone && <div style={{ fontSize:'0.63rem', color:'#9ca3af', marginTop:'2px' }}>{emp.phone}</div>}
      </div>
    </div>
  );
}

// ── ID CARD BACK ──────────────────────────────────────────────
function IDCardBack({ emp, cardRef }) {
  const qrData = emp ? `EMP:${emp.empCode}|${emp.firstName} ${emp.lastName}|${emp.phone||''}` : 'EMPLOYEE';
  const qrUrl  = `https://api.qrserver.com/v1/create-qr-code/?size=60x60&data=${encodeURIComponent(qrData)}&bgcolor=111111&color=ffffff&margin=2`;
  return (
    <div ref={cardRef} style={{ width:'260px', height:'410px', background:'#111111', borderRadius:'14px', display:'flex', flexDirection:'column', alignItems:'center', fontFamily:"'Segoe UI',sans-serif", overflow:'hidden', flexShrink:0, boxShadow:'0 8px 32px rgba(0,0,0,0.4)', padding:'1.1rem 1.2rem 0.9rem' }}>
      <div style={{ textAlign:'center', marginBottom:'0.8rem', width:'100%' }}>
        <img src="/logo.png" alt="Logo" style={{ width:'100px', height:'60px', objectFit:'contain', filter:'invert(1)', display:'block', margin:'0 auto' }} onError={e => { e.target.style.display='none'; }}/>
      </div>
      <div style={{ width:'100%', marginBottom:'0.5rem' }}>
        <p style={{ margin:0, fontSize:'0.78rem', fontWeight:700, color:'#ffffff' }}>Instructions</p>
      </div>
      <ol style={{ paddingLeft:'1.1rem', margin:'0 0 0.6rem', width:'100%' }}>
        {['This Card must be carried at all times, while on duty','This Card is non Transferrable, and must be produced on Demand','If Lost or Damaged, Please report immediately to HR dept'].map((t,i) => (
          <li key={i} style={{ fontSize:'0.64rem', color:'#d1d5db', lineHeight:1.6, marginBottom:'0.3rem' }}>{t}</li>
        ))}
      </ol>
      <div style={{ width:'100%', display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.7rem' }}>
        <div style={{ flex:1 }}><p style={{ margin:0, fontSize:'0.6rem', color:'#9ca3af', fontStyle:'italic' }}>If Found, Please return to:</p></div>
        <img src={qrUrl} alt="QR" width="58" height="58" style={{ borderRadius:'4px', flexShrink:0 }} onError={e => { e.target.style.display='none'; }}/>
      </div>
      <div style={{ width:'100%', borderTop:'1px solid #333', marginBottom:'0.6rem' }}/>
      <div style={{ width:'100%', textAlign:'center' }}>
        <p style={{ margin:0, fontSize:'0.65rem', fontWeight:700, color:'#ffffff', lineHeight:1.7 }}>
          14/23 1st Floor, Madhav Aspire, No.39,<br/>Muralinagar, Andhra Pradesh 530007
        </p>
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function EmployeesPage() {
  const router = useRouter();
  const [view,          setView]          = useState(VIEWS.LIST);
  const [employees,     setEmployees]     = useState([]);
  const [filtered,      setFiltered]      = useState([]);
  const [rowsToShow,    setRowsToShow]    = useState(50);
  const [search,        setSearch]        = useState({ empCode:'', firstName:'', lastName:'', reportingManager:'', doj:'', status:'', employmentType:'', letterStatus:'' });
  const [editingEmp,    setEditingEmp]    = useState(null);
  const [form,          setForm]          = useState(EMPTY_FORM);
  const [photoFile,     setPhotoFile]     = useState(null);
  const [panFile,       setPanFile]       = useState(null);
  const [aadhaarFile,   setAadhaarFile]   = useState(null);
  const [photoPreview,  setPhotoPreview]  = useState('');
  const [panPreview,    setPanPreview]    = useState('');
  const [aadhaarPrev,   setAadhaarPrev]   = useState('');
  const [photoUploading,setPhotoUploading]= useState(false);
  const [panUploading,  setPanUploading]  = useState(false);
  const [aadhaarUpl,    setAadhaarUpl]    = useState(false);
  const [photoErr,      setPhotoErr]      = useState('');
  const [panErr,        setPanErr]        = useState('');
  const [aadhaarErr,    setAadhaarErr]    = useState('');
  const [photoUrl,      setPhotoUrl]      = useState('');
  const [panUrl,        setPanUrl]        = useState('');
  const [aadhaarUrl,    setAadhaarUrl]    = useState('');
  const [formMsg,       setFormMsg]       = useState('');
  const [saving,        setSaving]        = useState(false);
  const [selectedEmp,   setSelectedEmp]   = useState(null);
  const [flipped,       setFlipped]       = useState(false);
  const frontRef = useRef();
  const backRef  = useRef();

  // ✅ Load employees from localStorage on mount — persists on refresh
  useEffect(() => {
    const list = loadEmployees();
    setEmployees(list);
    setFiltered(list);
  }, []);

  // ── Auto upload photo ──
  useEffect(() => {
    if (!photoFile) return;
    const err = validateFile(photoFile);
    if (err) { setPhotoErr(err); setPhotoFile(null); return; }
    setPhotoErr('');
    const reader = new FileReader();
    reader.onload = e => setPhotoPreview(e.target.result);
    reader.readAsDataURL(photoFile);
    (async () => {
      setPhotoUploading(true);
      try {
        // Use empCode or 'new' as folder — will be renamed on save if needed
        const code = (form.empCode && form.empCode !== 'AUTO') ? form.empCode : 'new';
        const url  = await uploadToCloudinary(photoFile, code, 'PHOTO');
        setPhotoUrl(url);
      } catch (e) { setPhotoErr('Upload failed: ' + e.message); setPhotoPreview(''); }
      finally { setPhotoUploading(false); }
    })();
  }, [photoFile]);

  // ── Auto upload PAN ──
  useEffect(() => {
    if (!panFile) return;
    const err = validateFile(panFile);
    if (err) { setPanErr(err); setPanFile(null); return; }
    setPanErr('');
    if (panFile.type !== 'application/pdf') { const r = new FileReader(); r.onload = e => setPanPreview(e.target.result); r.readAsDataURL(panFile); } else setPanPreview('pdf');
    (async () => {
      setPanUploading(true);
      try {
        const code = (form.empCode && form.empCode !== 'AUTO') ? form.empCode : 'new';
        const url  = await uploadToCloudinary(panFile, code, 'PAN');
        setPanUrl(url);
      } catch (e) { setPanErr('Upload failed: ' + e.message); }
      finally { setPanUploading(false); }
    })();
  }, [panFile]);

  // ── Auto upload Aadhaar ──
  useEffect(() => {
    if (!aadhaarFile) return;
    const err = validateFile(aadhaarFile);
    if (err) { setAadhaarErr(err); setAadhaarFile(null); return; }
    setAadhaarErr('');
    if (aadhaarFile.type !== 'application/pdf') { const r = new FileReader(); r.onload = e => setAadhaarPrev(e.target.result); r.readAsDataURL(aadhaarFile); } else setAadhaarPrev('pdf');
    (async () => {
      setAadhaarUpl(true);
      try {
        const code = (form.empCode && form.empCode !== 'AUTO') ? form.empCode : 'new';
        const url  = await uploadToCloudinary(aadhaarFile, code, 'AADHAAR');
        setAadhaarUrl(url);
      } catch (e) { setAadhaarErr('Upload failed: ' + e.message); }
      finally { setAadhaarUpl(false); }
    })();
  }, [aadhaarFile]);

  // ✅ openAdd — does NOT generate empCode (no wasted codes on Back)
  function openAdd() {
    setEditingEmp(null);
    setForm({ ...EMPTY_FORM, empCode: 'AUTO' }); // placeholder only
    resetFileStates();
    setFormMsg('');
    setView(VIEWS.ADD);
  }

  function openEdit(emp) {
    setEditingEmp(emp);
    setForm({
      empCode:          emp.empCode          || '',
      firstName:        emp.firstName        || '',
      lastName:         emp.lastName         || '',
      email:            emp.email            || '',
      phone:            emp.phone            || '',
      department:       emp.department       || '',
      position:         emp.position         || '',
      salary:           emp.salary           || '',
      reportingManager: emp.reportingManager || '',
      gender:           emp.gender           || '',
      bloodGroup:       emp.bloodGroup       || '',
      employmentType:   emp.employmentType   || 'Full Time',
      doj:              emp.doj ? emp.doj.substring(0,10) : '',
    });
    setPhotoUrl(emp.photoUrl || '');
    setPhotoPreview(emp.photoUrl || '');
    setPanUrl(emp.panCard || '');
    setPanPreview(emp.panCard ? (emp.panCard.includes('.pdf') ? 'pdf' : emp.panCard) : '');
    setAadhaarUrl(emp.aadhaar || '');
    setAadhaarPrev(emp.aadhaar ? (emp.aadhaar.includes('.pdf') ? 'pdf' : emp.aadhaar) : '');
    setPhotoFile(null); setPanFile(null); setAadhaarFile(null);
    setPhotoErr(''); setPanErr(''); setAadhaarErr('');
    setFormMsg('');
    setView(VIEWS.ADD);
  }

  function resetFileStates() {
    setPhotoFile(null); setPanFile(null); setAadhaarFile(null);
    setPhotoPreview(''); setPanPreview(''); setAadhaarPrev('');
    setPhotoUrl(''); setPanUrl(''); setAadhaarUrl('');
    setPhotoErr(''); setPanErr(''); setAadhaarErr('');
  }

  async function handleSave() {
    if (!form.firstName.trim()) { setFormMsg('❌ First Name is required.'); return; }
    if (!editingEmp && !photoUrl && !photoFile) { setFormMsg('❌ Employee Photo is required.'); return; }
    if (photoUploading || panUploading || aadhaarUpl) { setFormMsg('⏳ Please wait, upload in progress…'); return; }

    if (editingEmp) {
      const ok = confirm(`Update employee ${form.firstName} ${form.lastName} (${form.empCode})?\n\nEmployee code will NOT change.`);
      if (!ok) return;
    }

    setSaving(true);
    setFormMsg('');

    try {
      const existing = loadEmployees();

      if (editingEmp) {
        // ✅ UPDATE — empCode NEVER changes
        const { empCode: _skip, ...formWithoutCode } = form;
        const updated = existing.map(e =>
          e._id === editingEmp._id
            ? {
                ...e,
                ...formWithoutCode,
                empCode: e.empCode, // always keep original code
                name: `${form.firstName} ${form.lastName}`.trim(),
                salary: Number(form.salary) || 0,
                ...(photoUrl   && { photoUrl }),
                ...(panUrl     && { panCard: panUrl }),
                ...(aadhaarUrl && { aadhaar: aadhaarUrl }),
              }
            : e
        );
        saveEmployees(updated);
        setEmployees(updated);
        setFiltered(updated);
        setFormMsg('✅ Employee updated successfully!');

      } else {
        // ✅ ADD NEW — generate empCode HERE at save time (not on form open)
        const newCode = getNextCode(); // ← only called here, never on Back

        const newEmp = {
          _id:          `local_${Date.now()}`,
          empCode:      newCode,           // ✅ fresh code assigned at save
          firstName:    form.firstName,
          lastName:     form.lastName,
          email:        form.email,
          phone:        form.phone,
          department:   form.department,
          position:     form.position,
          salary:       Number(form.salary) || 0,
          reportingManager: form.reportingManager,
          gender:       form.gender,
          bloodGroup:   form.bloodGroup,
          employmentType: form.employmentType,
          doj:          form.doj,
          name:         `${form.firstName} ${form.lastName}`.trim(),
          status:       'Existing',
          letterStatus: 'Pending',
          photoUrl,
          panCard:      panUrl,
          aadhaar:      aadhaarUrl,
          createdAt:    new Date().toISOString(),
        };

        const updated = [...existing, newEmp];
        saveEmployees(updated);   // ✅ saves to localStorage
        setEmployees(updated);
        setFiltered(updated);
        setFormMsg('✅ Employee saved successfully!');
      }

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

  function handleDelete(id) {
    if (!confirm('Delete this employee?')) return;
    const updated = employees.filter(e => e._id !== id);
    saveEmployees(updated);
    setEmployees(updated);
    applyFilters(search, updated);
  }

  function handleSearchChange(key, value) {
    const u = { ...search, [key]: value };
    setSearch(u);
    applyFilters(u, employees);
  }

  function applyFilters(s, list) {
    let r = [...list];
    if (s.empCode)        r = r.filter(e => e.empCode?.toLowerCase().includes(s.empCode.toLowerCase()));
    if (s.firstName)      r = r.filter(e => e.firstName?.toLowerCase().includes(s.firstName.toLowerCase()));
    if (s.lastName)       r = r.filter(e => e.lastName?.toLowerCase().includes(s.lastName.toLowerCase()));
    if (s.reportingManager) r = r.filter(e => e.reportingManager?.toLowerCase().includes(s.reportingManager.toLowerCase()));
    if (s.status)         r = r.filter(e => e.status === s.status);
    if (s.employmentType) r = r.filter(e => e.employmentType === s.employmentType);
    setFiltered(r);
  }

  function resetFilters() {
    const e = { empCode:'', firstName:'', lastName:'', reportingManager:'', doj:'', status:'', employmentType:'', letterStatus:'' };
    setSearch(e);
    setFiltered(employees);
  }

  async function downloadPNG() {
    if (!frontRef.current) return;
    try {
      const h2c    = (await import('html2canvas')).default;
      const canvas = await h2c(frontRef.current, { scale:3, backgroundColor:null, useCORS:true, allowTaint:true });
      const a      = document.createElement('a');
      a.download   = `IDCard_${selectedEmp?.empCode||'card'}.png`;
      a.href       = canvas.toDataURL('image/png');
      a.click();
    } catch (err) { alert('Download failed: ' + err.message); }
  }

  function printCard() {
    if (!frontRef.current || !backRef.current) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>Print</title><style>*{box-sizing:border-box;margin:0;padding:0;}body{display:flex;gap:20px;justify-content:center;padding:2rem;background:#fff;}@media print{body{padding:0;}@page{size:A4 landscape;margin:1cm;}}</style></head><body><div>${frontRef.current.outerHTML}</div><div>${backRef.current.outerHTML}</div><script>window.onload=()=>setTimeout(()=>window.print(),400);<\/script></body></html>`);
    win.document.close();
  }

  const active      = employees.filter(e => e.status==='Existing'||e.status==='Active').length;
  const inactive    = employees.filter(e => e.status==='Inactive').length;
  const fnf         = employees.filter(e => e.status==='FnF Initiated').length;
  const pending     = employees.filter(e => e.status==='Pending').length;
  const letterPend  = employees.filter(e => e.letterStatus==='Pending').length;
  const displayed   = filtered.slice(0, rowsToShow);
  const anyUploading= photoUploading || panUploading || aadhaarUpl;
  const statusColor = (s) => { if(s==='Inactive') return '#ef4444'; if(s==='FnF Locked') return '#f59e0b'; if(s==='Pending') return '#3b82f6'; return '#16a34a'; };

  return (
    <ProtectedRoute>
      <div style={{ display:'flex', minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif" }}>
        <Sidebar/>
        <div style={{ flex:1, minWidth:0, overflowY:'auto' }}>
          <div style={{ padding:'20px', boxSizing:'border-box' }}>

            {/* ══ LIST ══ */}
            {view === VIEWS.LIST && (
              <>
                {/* Search panel */}
                <div style={{ background:'#fff', borderRadius:'6px', border:`1px solid ${C.border}`, marginBottom:'16px', overflow:'hidden' }}>
                  <div style={{ background:C.panelHdr, padding:'10px 16px' }}>
                    <span style={{ color:'#fff', fontWeight:600, fontSize:'14px' }}>Search</span>
                  </div>
                  <div style={{ padding:'12px 16px' }}>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:'8px', marginBottom:'10px' }}>
                      {[['empCode','Employee Code'],['firstName','First Name'],['lastName','Last Name'],['reportingManager','Rep. Manager'],['doj','Date of Joining']].map(([k,ph]) => (
                        <input key={k} placeholder={ph} value={search[k]} onChange={e => handleSearchChange(k,e.target.value)} style={{ width:'100%', padding:'7px 10px', border:`1px solid #d1d5db`, borderRadius:'4px', fontSize:'13px', color:C.text, background:'#fff', boxSizing:'border-box' }}/>
                      ))}
                      <select value={search.status} onChange={e => handleSearchChange('status',e.target.value)} style={{ width:'100%', padding:'7px 10px', border:`1px solid #d1d5db`, borderRadius:'4px', fontSize:'13px', color:C.text, background:'#fff', cursor:'pointer' }}>
                        <option value="">Select Status</option><option>Existing</option><option>Inactive</option><option>FnF Locked</option><option>Pending</option>
                      </select>
                      <select value={search.employmentType} onChange={e => handleSearchChange('employmentType',e.target.value)} style={{ width:'100%', padding:'7px 10px', border:`1px solid #d1d5db`, borderRadius:'4px', fontSize:'13px', color:C.text, background:'#fff', cursor:'pointer' }}>
                        <option value="">Employment Type</option><option>Full Time</option><option>Part Time</option><option>Contract</option>
                      </select>
                    </div>
                    <div style={{ display:'flex', justifyContent:'flex-end' }}>
                      <button onClick={resetFilters} style={{ background:'#4a7fa5', border:'none', borderRadius:'4px', color:'#fff', padding:'7px 14px', cursor:'pointer', fontSize:'13px' }}>Reset</button>
                    </div>
                  </div>
                </div>

                {/* Employee table */}
                <div style={{ background:'#fff', borderRadius:'6px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                  <div style={{ background:C.panelHdr, padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px' }}>
                    <span style={{ color:'#fff', fontWeight:600, fontSize:'14px' }}>List Of Employees ({filtered.length})</span>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <button onClick={() => router.push('/admin/dashboard')} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'4px', color:'#fff', padding:'6px 14px', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>← Back</button>
                      <button onClick={() => { setSelectedEmp(employees[0]||null); setFlipped(false); setView(VIEWS.IDCARD); }} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)', borderRadius:'4px', color:'#fff', padding:'6px 14px', cursor:'pointer', fontSize:'13px', fontWeight:600 }}>🪪 ID Cards</button>
                      <button onClick={openAdd} style={{ background:'rgba(255,255,255,0.2)', border:'none', borderRadius:'4px', color:'#fff', padding:'6px 14px', cursor:'pointer', fontSize:'13px', fontWeight:700 }}>+ Add Employee</button>
                    </div>
                  </div>

                  <div style={{ padding:'10px 16px', borderBottom:`1px solid ${C.tableBorder}`, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', fontSize:'13px', color:C.muted }}>
                      Show <select value={rowsToShow} onChange={e => setRowsToShow(Number(e.target.value))} style={{ border:`1px solid #9ca3af`, borderRadius:'4px', padding:'3px 8px', fontSize:'13px', color:C.text }}>{[10,25,50,100].map(n=><option key={n}>{n}</option>)}</select> Rows
                    </div>
                    <div style={{ display:'flex', gap:'8px', fontSize:'12px', color:C.text, flexWrap:'wrap' }}>
                      <b>Active: {active}</b><span style={{ color:'#d1d5db' }}>|</span><b>Inactive: {inactive}</b><span style={{ color:'#d1d5db' }}>|</span><b>FnF: {fnf}</b><span style={{ color:'#d1d5db' }}>|</span><b>Pending: {pending}</b><span style={{ color:'#d1d5db' }}>|</span><b>Letter Pending: {letterPend}</b>
                    </div>
                  </div>

                  <div style={{ width:'100%', overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'12px', minWidth:'1100px' }}>
                      <thead>
                        <tr style={{ background:'#f9fafb', borderBottom:`2px solid ${C.tableBorder}` }}>
                          {['Emp Code','First Name','Last Name','Department','Position','Gender','Blood Group','DOJ','Emp Type','Rep. Manager','Status','Actions'].map((h,i) => (
                            <th key={i} style={{ padding:'10px', textAlign:'left', fontWeight:700, color:'#374151', fontSize:'12px', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayed.length === 0
                          ? <tr><td colSpan={12} style={{ padding:'40px', textAlign:'center', color:C.muted }}>
                              No employees found. <button onClick={openAdd} style={{ color:C.accent, background:'none', border:'none', cursor:'pointer', fontWeight:600 }}>Add first employee →</button>
                            </td></tr>
                          : displayed.map((emp,i) => {
                            const rowBg = i%2===0 ? '#fff' : '#fafafa';
                            return (
                              <tr key={emp._id} style={{ borderBottom:`1px solid ${C.tableBorder}`, background:rowBg }} onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'} onMouseLeave={e=>e.currentTarget.style.background=rowBg}>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap', fontWeight:600 }}>{emp.empCode||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', fontWeight:600, whiteSpace:'nowrap' }}>{emp.firstName||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.lastName||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.department||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.position||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.gender||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.bloodGroup||'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.doj?new Date(emp.doj).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.employmentType||'Full Time'}</td>
                                <td style={{ padding:'9px 10px', color:'#111827', whiteSpace:'nowrap' }}>{emp.reportingManager||'—'}</td>
                                <td style={{ padding:'9px 10px', whiteSpace:'nowrap' }}><span style={{ color:statusColor(emp.status), fontWeight:600 }}>{emp.status||'—'}</span></td>
                                <td style={{ padding:'9px 10px', whiteSpace:'nowrap' }}>
                                  <div style={{ display:'flex', gap:'5px' }}>
                                    <button title="Edit" onClick={() => openEdit(emp)} style={{ background:'#eff6ff', border:'1px solid #bfdbfe', cursor:'pointer', color:'#2563eb', padding:'4px 8px', borderRadius:'4px', display:'flex', alignItems:'center', gap:'3px', fontSize:'11px', fontWeight:600 }}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                                      Edit
                                    </button>
                                    <button title="ID Card" onClick={() => { setSelectedEmp(emp); setFlipped(false); setView(VIEWS.IDCARD); }} style={{ background:'#f0fdf4', border:'1px solid #bbf7d0', cursor:'pointer', color:'#16a34a', padding:'4px 8px', borderRadius:'4px', display:'flex', alignItems:'center' }}>🪪</button>
                                    <button title="Delete" onClick={() => handleDelete(emp._id)} style={{ background:'#fef2f2', border:'1px solid #fecaca', cursor:'pointer', color:'#dc2626', padding:'4px 8px', borderRadius:'4px', display:'flex', alignItems:'center' }}>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {/* ══ ADD / EDIT ══ */}
            {view === VIEWS.ADD && (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
                  <button onClick={() => { setView(VIEWS.LIST); setEditingEmp(null); }} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#fff', border:`1px solid ${C.border}`, borderRadius:'6px', padding:'9px 18px', cursor:'pointer', fontSize:'13px', fontWeight:700, color:C.label, boxShadow:'0 1px 3px rgba(0,0,0,0.07)' }}>← Back</button>
                  <div>
                    <h1 style={{ margin:0, fontSize:'18px', fontWeight:700, color:C.headerBg }}>
                      {editingEmp ? `✏️ Edit — ${editingEmp.firstName} ${editingEmp.lastName}` : 'Add New Employee'}
                    </h1>
                    <p style={{ margin:0, fontSize:'12px', color:C.muted }}>
                      {editingEmp
                        ? <>Employee Code: <b style={{ color:C.accent }}>{form.empCode}</b> (will not change)</>
                        : <i style={{ color:C.muted }}>Employee Code will be assigned when you save</i>
                      }
                    </p>
                  </div>
                </div>

                <div style={{ background:'#fff', borderRadius:'10px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                  <div style={{ background:C.headerBg, padding:'13px 24px' }}>
                    <span style={{ color:'#fff', fontWeight:600, fontSize:'14px' }}>{editingEmp ? 'Edit Employee Information' : 'Employee Information'}</span>
                  </div>
                  <div style={{ padding:'24px' }}>

                    <h3 style={sectionTitle}>Basic Information</h3>
                    <div style={grid2}>
                      {/* ✅ Employee Code field */}
                      <div>
                        <label style={labelSt}>Employee Code</label>
                        <input
                          value={form.empCode === 'AUTO' ? 'Will be assigned on save' : form.empCode}
                          readOnly
                          style={{
                            ...inputSt,
                            background: '#e9f0fb',
                            color: form.empCode === 'AUTO' ? C.muted : C.accent,
                            fontWeight: 700,
                            cursor: 'default',
                            fontStyle: form.empCode === 'AUTO' ? 'italic' : 'normal',
                          }}
                        />
                      </div>
                      <div/>
                      <F label="First Name *"><input value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} placeholder="e.g. Ravi" style={inputSt}/></F>
                      <F label="Last Name"><input value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} placeholder="e.g. Kumar" style={inputSt}/></F>
                      <F label="Email"><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="email@example.com" style={inputSt}/></F>
                      <F label="Phone"><input type="tel" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+91 98765 43210" style={inputSt}/></F>
                    </div>

                    <div style={{ margin:'20px 0', borderTop:`1px solid ${C.border}` }}/>
                    <h3 style={sectionTitle}>Job Details</h3>
                    <div style={grid2}>
                      <F label="Department"><select value={form.department} onChange={e=>setForm({...form,department:e.target.value})} style={selectSt}><option value="">Select Department</option>{DEPARTMENTS.map(d=><option key={d}>{d}</option>)}</select></F>
                      <F label="Position"><select value={form.position} onChange={e=>setForm({...form,position:e.target.value})} style={selectSt}><option value="">Select Position</option>{POSITIONS.map(p=><option key={p}>{p}</option>)}</select></F>
                      <F label="Salary (₹)"><input type="number" value={form.salary} onChange={e=>setForm({...form,salary:e.target.value})} placeholder="25000" style={inputSt}/></F>
                      <F label="Reporting Manager"><input value={form.reportingManager} onChange={e=>setForm({...form,reportingManager:e.target.value})} placeholder="Manager name" style={inputSt}/></F>
                      <F label="Employment Type"><select value={form.employmentType} onChange={e=>setForm({...form,employmentType:e.target.value})} style={selectSt}><option>Full Time</option><option>Part Time</option><option>Contract</option></select></F>
                      <F label="Date of Joining"><input type="date" value={form.doj} onChange={e=>setForm({...form,doj:e.target.value})} style={inputSt}/></F>
                    </div>

                    <div style={{ margin:'20px 0', borderTop:`1px solid ${C.border}` }}/>
                    <h3 style={sectionTitle}>Personal Details</h3>
                    <div style={grid2}>
                      <F label="Gender"><select value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})} style={selectSt}><option value="">Select Gender</option><option>Male</option><option>Female</option><option>Other</option></select></F>
                      <F label="Blood Group"><select value={form.bloodGroup} onChange={e=>setForm({...form,bloodGroup:e.target.value})} style={selectSt}><option value="">Select Blood Group</option>{BLOOD_GROUPS.map(bg=><option key={bg}>{bg}</option>)}</select></F>
                    </div>

                    <div style={{ margin:'20px 0', borderTop:`1px solid ${C.border}` }}/>
                    <h3 style={sectionTitle}>Photo & Documents</h3>
                    <div style={{ marginBottom:'14px', padding:'10px 14px', background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:'8px', fontSize:'12px', color:'#1e40af' }}>
                      📤 Files upload to <b>Cloudinary</b> automatically when selected. Wait for ✅ before saving.
                      {editingEmp && ' Existing files preserved — upload only to replace.'}
                    </div>
                    <div style={grid2}>
                      <UploadBox label={`Passport Photo${editingEmp?'':' *'} (JPG/PNG)`} file={photoFile} setFile={setPhotoFile} preview={photoPreview} uploading={photoUploading} error={photoErr} accept="image/*"/>
                      <UploadBox label="PAN Card (PDF/JPG/PNG)" file={panFile} setFile={setPanFile} preview={panPreview} uploading={panUploading} error={panErr}/>
                      <UploadBox label="Aadhaar Card (PDF/JPG/PNG)" file={aadhaarFile} setFile={setAadhaarFile} preview={aadhaarPrev} uploading={aadhaarUpl} error={aadhaarErr}/>
                    </div>

                    {(photoUrl||panUrl||aadhaarUrl) && (
                      <div style={{ display:'flex', gap:'8px', marginTop:'12px', flexWrap:'wrap' }}>
                        {photoUrl   && <span style={{ fontSize:'12px', color:C.success, background:C.successBg, border:`1px solid ${C.successBor}`, borderRadius:'20px', padding:'3px 12px' }}>✅ Photo uploaded</span>}
                        {panUrl     && <span style={{ fontSize:'12px', color:C.success, background:C.successBg, border:`1px solid ${C.successBor}`, borderRadius:'20px', padding:'3px 12px' }}>✅ PAN uploaded</span>}
                        {aadhaarUrl && <span style={{ fontSize:'12px', color:C.success, background:C.successBg, border:`1px solid ${C.successBor}`, borderRadius:'20px', padding:'3px 12px' }}>✅ Aadhaar uploaded</span>}
                      </div>
                    )}

                    {formMsg && (
                      <div style={{ marginTop:'16px', padding:'11px 16px', borderRadius:'8px', fontSize:'13px', fontWeight:500, background:formMsg.startsWith('✅')?C.successBg:formMsg.startsWith('⏳')?'#fffbeb':C.errorBg, color:formMsg.startsWith('✅')?C.success:formMsg.startsWith('⏳')?'#92400e':C.error, border:`1px solid ${formMsg.startsWith('✅')?C.successBor:formMsg.startsWith('⏳')?'#fde68a':C.errorBor}` }}>
                        {formMsg}
                      </div>
                    )}

                    <div style={{ marginTop:'24px', display:'flex', justifyContent:'flex-end', gap:'10px', borderTop:`1px solid ${C.border}`, paddingTop:'20px' }}>
                      <button onClick={() => { setView(VIEWS.LIST); setEditingEmp(null); }} style={btnSecondary}>← Back</button>
                      <button onClick={handleSave} disabled={saving||anyUploading} style={btnPrimary(saving||anyUploading)}>
                        {saving?'Saving…':anyUploading?'⏳ Uploading…':<><span>💾</span>{editingEmp?'Update Employee':'Save Employee'}</>}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ══ ID CARD ══ */}
            {view === VIEWS.IDCARD && (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'20px' }}>
                  <button onClick={() => setView(VIEWS.LIST)} style={{ display:'flex', alignItems:'center', gap:'6px', background:'#fff', border:`1px solid ${C.border}`, borderRadius:'6px', padding:'9px 18px', cursor:'pointer', fontSize:'13px', fontWeight:700, color:C.label }}>← Back</button>
                  <div>
                    <h1 style={{ margin:0, fontSize:'18px', fontWeight:700, color:C.headerBg }}>ID Card Generator</h1>
                    <p style={{ margin:0, fontSize:'12px', color:C.muted }}>Select an employee · Click the card to flip</p>
                  </div>
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'20px', alignItems:'start' }}>
                  <div style={{ background:'#fff', borderRadius:'10px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                    <div style={{ background:C.headerBg, padding:'13px 20px' }}><span style={{ color:'#fff', fontWeight:600, fontSize:'14px' }}>Select Employee</span></div>
                    <div style={{ padding:'16px' }}>
                      <select onChange={e => { const emp=employees.find(x=>x._id===e.target.value); setSelectedEmp(emp||null); setFlipped(false); }} value={selectedEmp?._id||''} style={{ ...selectSt, marginTop:0, fontSize:'14px', padding:'10px 12px' }}>
                        <option value="">— Select Employee —</option>
                        {employees.map(e => <option key={e._id} value={e._id}>{e.empCode} — {e.firstName} {e.lastName}</option>)}
                      </select>
                      {selectedEmp && (
                        <div style={{ marginTop:'16px', background:'#f8fafc', borderRadius:'8px', padding:'14px', border:`1px solid ${C.border}` }}>
                          <div style={{ display:'flex', gap:'14px', alignItems:'center' }}>
                            {selectedEmp.photoUrl
                              ? <img src={selectedEmp.photoUrl} alt={selectedEmp.firstName} style={{ width:'60px', height:'70px', borderRadius:'8px', objectFit:'cover', objectPosition:'top', border:`2px solid ${C.border}` }}/>
                              : <div style={{ width:'60px', height:'70px', borderRadius:'8px', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>👤</div>
                            }
                            <div>
                              <p style={{ margin:0, fontWeight:700, fontSize:'15px', color:C.text }}>{selectedEmp.firstName} {selectedEmp.lastName}</p>
                              <p style={{ margin:'2px 0 0', fontSize:'13px', color:C.muted }}>{selectedEmp.position||'—'} · {selectedEmp.department||'—'}</p>
                              <p style={{ margin:'2px 0 0', fontSize:'12px', color:C.accent, fontWeight:600 }}>ID: {selectedEmp.empCode}</p>
                              {selectedEmp.bloodGroup && <p style={{ margin:'2px 0 0', fontSize:'12px', color:C.muted }}>🩸 {selectedEmp.bloodGroup}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                      {employees.length===0 && <div style={{ textAlign:'center', padding:'30px', color:C.muted }}><div style={{ fontSize:'40px', marginBottom:'8px' }}>👥</div><p>No employees. <button onClick={openAdd} style={{ color:C.accent, background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>Add one</button></p></div>}
                    </div>
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
                    <p style={{ fontSize:'11px', color:C.muted, letterSpacing:'1px', textTransform:'uppercase', alignSelf:'flex-start', margin:0 }}>{flipped?'↻ Back Side':'↻ Front Side'} · Click to flip</p>
                    <div className="id-flip-scene" onClick={() => setFlipped(f=>!f)}>
                      <div className={flipped?'id-flip-card flipped':'id-flip-card'}>
                        <div className="id-flip-front"><IDCardFront emp={selectedEmp} cardRef={frontRef}/></div>
                        <div className="id-flip-back"><IDCardBack emp={selectedEmp} cardRef={backRef}/></div>
                      </div>
                    </div>
                    <button onClick={downloadPNG} disabled={!selectedEmp} style={{ width:'260px', padding:'10px', borderRadius:'8px', border:'none', background:selectedEmp?C.headerBg:'#d1d5db', color:'#fff', fontWeight:600, fontSize:'13px', cursor:selectedEmp?'pointer':'not-allowed' }}>⬇ Download PNG</button>
                    <button onClick={printCard} disabled={!selectedEmp} style={{ width:'260px', padding:'10px', borderRadius:'8px', border:`1px solid ${C.border}`, background:'#fff', color:selectedEmp?C.label:'#d1d5db', fontWeight:600, fontSize:'13px', cursor:selectedEmp?'pointer':'not-allowed' }}>🖨 Print Both Sides</button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        .id-flip-scene { width:260px; height:410px; perspective:1000px; cursor:pointer; flex-shrink:0; }
        .id-flip-card { width:260px; height:410px; position:relative; transform-style:preserve-3d; transition:transform 0.7s ease; transform:rotateY(0deg); }
        .id-flip-card.flipped { transform:rotateY(180deg); }
        .id-flip-front, .id-flip-back { position:absolute; inset:0; width:260px; height:410px; backface-visibility:hidden; -webkit-backface-visibility:hidden; }
        .id-flip-back { transform:rotateY(180deg); }
      `}</style>
    </ProtectedRoute>
  );
}
'use client';
import { useEffect, useState, useRef } from 'react';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

/* ─── Constants ─────────────────────────────────────────── */
const LS_KEY = 'emp_management_employees';
const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];
const CY    = new Date().getFullYear();
const YEARS = [CY - 1, CY, CY + 1];

/* ─── Helpers ────────────────────────────────────────────── */
function loadEmployees() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function n(v) { return parseFloat(v) || 0; }

function inr(v) {
  return n(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function toWords(amount) {
  amount = Math.round(Math.abs(n(amount)));
  if (!amount) return 'Zero Rupees Only';
  const ones = ['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine',
                 'Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen',
                 'Seventeen','Eighteen','Nineteen'];
  const tens = ['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  function r(x) {
    if (!x) return '';
    if (x < 20)  return ones[x] + ' ';
    if (x < 100) return tens[Math.floor(x/10)] + (x%10 ? ' '+ones[x%10] : '') + ' ';
    if (x < 1000)      return ones[Math.floor(x/100)]    + ' Hundred '   + r(x%100);
    if (x < 100000)    return r(Math.floor(x/1000))      + 'Thousand '   + r(x%1000);
    if (x < 10000000)  return r(Math.floor(x/100000))    + 'Lakh '       + r(x%100000);
    return r(Math.floor(x/10000000)) + 'Crore ' + r(x%10000000);
  }
  return r(amount).trim() + ' Rupees Only';
}

/* ─── Styles ─────────────────────────────────────────────── */
const C = {
  navy:'#1e3a5f', blue:'#2563eb', blueLt:'#eff6ff',
  border:'#e2e8f0', bg:'#f8fafc', text:'#111827',
  muted:'#6b7280', dark:'#374151',
  green:'#16a34a', greenBg:'#f0fdf4', greenBr:'#bbf7d0',
  red:'#dc2626',   redBg:'#fef2f2',   redBr:'#fecaca',
  hdr:'#5a7a9a',
};

const iSt = {
  width:'100%', padding:'8px 11px',
  border:`1px solid ${C.border}`, borderRadius:'6px',
  background:'#fff', fontSize:'13px', color:C.text,
  boxSizing:'border-box', outline:'none', marginTop:'4px',
  fontFamily:'inherit',
};
const sSt = {
  ...iSt, cursor:'pointer', appearance:'none', WebkitAppearance:'none',
  backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat:'no-repeat', backgroundPosition:'right 9px center', paddingRight:'26px',
};
const lSt = {
  fontSize:'11px', fontWeight:700, color:C.dark,
  display:'block', textTransform:'uppercase', letterSpacing:'0.4px',
};
const roSt = {
  ...iSt, background:'#f1f5f9', color:C.muted,
  cursor:'not-allowed', fontWeight:600,
};

/* ─── Payslip Print View ─────────────────────────────────── */
function PayslipDoc({ data }) {
  const { emp, month, year, uan, pf, esi } = data;

  const basic    = n(emp.salary);
  const gross    = basic;                          // Gross = Basic only (no allowances)
  const pfAmt    = n(pf);
  const esiAmt   = n(esi);
  const totalDed = pfAmt + esiAmt;
  const net      = gross - totalDed;

  const fullName = [emp.firstName, emp.lastName].filter(Boolean).join(' ') || emp.name || '—';
  const doj = emp.doj
    ? (() => { try { return new Date(emp.doj).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); } catch { return emp.doj; } })()
    : '—';

  const th = { padding:'9px 14px', color:'#fff', fontWeight:700, fontSize:'12px', letterSpacing:'0.5px' };
  const td = { padding:'9px 14px', fontSize:'12px', color:C.text };
  const tdR= { ...td, textAlign:'right', fontWeight:600 };

  return (
    <div style={{
      width:'794px', background:'#fff', padding:'36px 48px 32px',
      boxSizing:'border-box', fontFamily:"'Segoe UI',Arial,sans-serif",
    }}>

      {/* Company Header */}
      <div style={{ textAlign:'center', borderBottom:`3px solid ${C.navy}`, paddingBottom:'14px', marginBottom:'16px' }}>
        <img src="/logo.png" alt="Logo"
          style={{ height:'52px', objectFit:'contain', marginBottom:'6px', display:'block', margin:'0 auto 6px' }}
          onError={e=>{ e.target.style.display='none'; }}
        />
        <div style={{ fontSize:'18px', fontWeight:900, color:C.navy, letterSpacing:'0.5px' }}>
          Nachi Consultant Pvt Ltd
        </div>
        <div style={{ fontSize:'11px', color:C.muted, marginTop:'3px' }}>
          14/23 1st Floor, Madhav Aspire, Muralinagar, Andhra Pradesh – 530007
        </div>
      </div>

      {/* Title */}
      <div style={{
        background:C.navy, color:'#fff', textAlign:'center',
        padding:'8px', borderRadius:'4px', fontSize:'12px',
        fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', marginBottom:'18px',
      }}>
        Salary Slip — {month} {year}
      </div>

      {/* Employee Details */}
      <table style={{ width:'100%', borderCollapse:'collapse', border:`1px solid ${C.border}`, marginBottom:'18px', fontSize:'12px' }}>
        <tbody>
          {[
            ['Employee Name', fullName,          'Employee ID',  emp.empCode || '—'],
            ['Designation',   emp.position||'—', 'Department',   emp.department||'—'],
            ['Date of Joining',doj,              'UAN',          uan || '—'],
            ['Pay Period',    `${month} ${year}`, '',            ''],
          ]
          .map(([l1,v1,l2,v2],i) => (
            <tr key={i} style={{ borderBottom:`1px solid ${C.border}` }}>
              <td style={{ background:C.bg, padding:'7px 11px', fontWeight:700, color:C.dark, width:'20%', borderRight:`1px solid ${C.border}`, whiteSpace:'nowrap', fontSize:'11px' }}>{l1}</td>
              <td style={{ padding:'7px 11px', width:'30%', borderRight:`1px solid ${C.border}`, color:'#111827', fontWeight:600, fontSize:'12px' }}>{v1}</td>
              <td style={{ background:C.bg, padding:'7px 11px', fontWeight:700, color:C.dark, width:'20%', borderRight:`1px solid ${C.border}`, whiteSpace:'nowrap', fontSize:'11px' }}>{l2}</td>
              <td style={{ padding:'7px 11px', width:'30%', color:'#111827', fontWeight:600, fontSize:'12px'}}>{v2}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Salary Table */}
      <table style={{ width:'100%', borderCollapse:'collapse', border:`1px solid ${C.border}`, marginBottom:'16px' }}>
        <thead>
          <tr>
            <th style={{ ...th, background:C.navy, width:'50%', textAlign:'left' }}>Earnings</th>
            <th style={{ ...th, background:C.navy, width:'10%', textAlign:'right' }}>Amount (₹)</th>
            <th style={{ ...th, background:'#374151', width:'30%', textAlign:'left', borderLeft:'3px solid #fff' }}>Deductions</th>
            <th style={{ ...th, background:'#374151', width:'10%', textAlign:'right' }}>Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr style={{ borderBottom:`1px solid ${C.border}` }}>
            <td style={td}>Basic Salary</td>
            <td style={tdR}>{inr(basic)}</td>
            <td style={{ ...td, borderLeft:`2px solid ${C.border}` }}>Provident Fund (PF)</td>
            <td style={{ ...tdR, color:C.red }}>{inr(pfAmt)}</td>
          </tr>
          <tr style={{ borderBottom:`1px solid ${C.border}`, background:C.bg }}>
            <td style={td}></td>
            <td style={tdR}></td>
            <td style={{ ...td, borderLeft:`2px solid ${C.border}` }}>ESI</td>
            <td style={{ ...tdR, color:C.red }}>{inr(esiAmt)}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr style={{ background:C.navy }}>
            <td style={{ padding:'10px 14px', color:'#bfdbfe', fontWeight:700, fontSize:'12px' }}>Gross Salary</td>
            <td style={{ padding:'10px 14px', color:'#fff', fontWeight:900, fontSize:'13px', textAlign:'right' }}>₹ {inr(gross)}</td>
            <td style={{ padding:'10px 14px', color:'#fca5a5', fontWeight:700, fontSize:'12px', borderLeft:'3px solid #3b82f6' }}>Total Deductions</td>
            <td style={{ padding:'10px 14px', color:'#fff', fontWeight:900, fontSize:'13px', textAlign:'right' }}>₹ {inr(totalDed)}</td>
          </tr>
        </tfoot>
      </table>

      {/* Net Salary */}
      <div style={{
        background:C.navy, borderRadius:'6px', padding:'13px 20px',
        display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px',
      }}>
        <div>
          <div style={{ color:'#bfdbfe', fontSize:'10px', letterSpacing:'2px', textTransform:'uppercase', fontWeight:700, marginBottom:'4px' }}>
            Net Salary Payable — {month} {year}
          </div>
          <div style={{ color:'#93c5fd', fontSize:'11px' }}>
            In Words: <i>{toWords(net)}</i>
          </div>
        </div>
        <div style={{ color:'#fff', fontWeight:900, fontSize:'24px' }}>₹ {inr(net)}</div>
      </div>

      {/* Footer */}
      <div style={{
        display:'flex', justifyContent:'space-between', alignItems:'flex-end',
        borderTop:`1px solid ${C.border}`, paddingTop:'14px',
        fontSize:'11px', color:C.muted,
      }}>
        <div>
          <div style={{ fontWeight:700, color:C.dark, marginBottom:'3px' }}>Note:</div>
          <div>This is a computer generated payslip and does not require a physical signature.</div>
          <div>For queries, please contact the HR Department.</div>
        </div>
        <div style={{ textAlign:'center' }}>
          <div style={{ height:'32px' }}/>
          <div style={{ width:'160px', borderTop:`2px solid ${C.dark}`, paddingTop:'5px', fontWeight:700, color:C.dark, fontSize:'12px' }}>
            Authorized Signature
          </div>
          <div style={{ fontSize:'10px', marginTop:'2px' }}>Nachi Consultant Pvt Ltd</div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function PayslipPage() {
  const [employees, setEmployees] = useState([]);
  const [empId,     setEmpId]     = useState('');
  const [emp,       setEmp]       = useState(null);
  const [month,     setMonth]     = useState('');
  const [year,      setYear]      = useState(String(CY));
  const [uan,       setUan]       = useState('');
  const [pf,        setPf]        = useState('');
  const [esi,       setEsi]       = useState('');
  const [generated, setGenerated] = useState(false);
  const [msg,       setMsg]       = useState(null);
  const [busy,      setBusy]      = useState(false);

  const printRef = useRef(null);

  // Load employees from localStorage
  useEffect(() => {
    setEmployees(loadEmployees());
  }, []);

  // Sync emp object when empId changes
  useEffect(() => {
    const found = employees.find(e => e._id === empId) || null;
    setEmp(found);
    setGenerated(false);
  }, [empId, employees]);

  // Live calculations
  const basic    = n(emp?.salary);
  const gross    = basic;
  const pfAmt    = n(pf);
  const esiAmt   = n(esi);
  const totalDed = pfAmt + esiAmt;
  const net      = gross - totalDed;

  function flash(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  }

  function handleGenerate() {
    if (!emp)   { flash('error', 'Please select an employee.'); return; }
    if (!month) { flash('error', 'Please select a month.');     return; }
    setGenerated(true);
    flash('success', 'Payslip generated! Scroll down to view.');
    setTimeout(() => {
      document.getElementById('slip-preview')?.scrollIntoView({ behavior:'smooth', block:'start' });
    }, 150);
  }

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    if (!win) { flash('error', 'Popup blocked — please allow popups and try again.'); return; }
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Payslip</title>
<style>*{box-sizing:border-box;margin:0;padding:0;}body{background:#fff;font-family:'Segoe UI',Arial,sans-serif;}
@media print{@page{size:A4 portrait;margin:8mm;}}</style></head>
<body>${el.innerHTML}<script>window.onload=function(){setTimeout(window.print,500);};<\/script></body></html>`);
    win.document.close();
  }

  async function handleDownloadPDF() {
    const el = printRef.current;
    if (!el || !generated) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);
      const canvas = await html2canvas(el, {
        scale: 2.5, useCORS: true, backgroundColor:'#ffffff',
        logging: false, windowWidth: 900,
      });
      const pdf  = new jsPDF({ orientation:'portrait', unit:'mm', format:'a4' });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height / canvas.width) * pdfW;
      const img  = canvas.toDataURL('image/jpeg', 0.95);
      let yOff = 0, page = 0;
      while (yOff < imgH) {
        if (page > 0) pdf.addPage();
        pdf.addImage(img, 'JPEG', 0, -yOff, pdfW, imgH);
        yOff += pdfH; page++;
      }
      const name = (emp?.firstName || 'Employee').replace(/\s+/g,'_');
      pdf.save(`Payslip_${name}_${month}_${year}.pdf`);
      flash('success', 'PDF downloaded successfully!');
    } catch (err) {
      flash('error', 'PDF failed: ' + err.message);
    } finally {
      setBusy(false);
    }
  }

  const slipData = emp && month ? { emp, month, year, uan, pf, esi } : null;

  return (
    <ProtectedRoute>
      <div style={{ display:'flex', minHeight:'100vh', background:'#f3f4f6', fontFamily:"'Segoe UI',Tahoma,Geneva,Verdana,sans-serif" }}>
        <Sidebar/>
        <div style={{ flex:1, minWidth:0, overflowY:'auto' }}>
          <div style={{ padding:'20px', boxSizing:'border-box', maxWidth:'1200px' }}>

            {/* Page title */}
            <div style={{ marginBottom:'16px' }}>
              <h1 style={{ margin:0, fontSize:'20px', fontWeight:700, color:C.navy }}>Payslip Generator</h1>
              <p style={{ margin:'2px 0 0', fontSize:'12px', color:C.muted }}>Select employee → enter deductions → generate & download</p>
            </div>

            {/* Flash message */}
            {msg && (
              <div style={{
                padding:'10px 16px', borderRadius:'8px', marginBottom:'14px',
                fontSize:'13px', fontWeight:500,
                background: msg.type==='success' ? C.greenBg : C.redBg,
                color:      msg.type==='success' ? C.green   : C.red,
                border:    `1px solid ${msg.type==='success' ? C.greenBr : C.redBr}`,
              }}>
                {msg.type==='success' ? '✅ ' : '❌ '}{msg.text}
              </div>
            )}

            {/* No employees warning */}
            {employees.length === 0 && (
              <div style={{ background:'#fef9c3', border:'1px solid #fde68a', borderRadius:'8px', padding:'11px 16px', marginBottom:'14px', fontSize:'13px', color:'#92400e' }}>
                ⚠️ No employees found. Please add employees from the <b>Employees</b> page first.
              </div>
            )}

            {/* Main 2-col grid */}
            <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:'16px', alignItems:'start' }}>

              {/* ── LEFT: Form Panel ── */}
              <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>

                {/* Step 1: Select Employee */}
                <div style={{ background:'#fff', borderRadius:'8px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                  <div style={{ background:C.hdr, padding:'10px 14px' }}>
                    <span style={{ color:'#fff', fontWeight:700, fontSize:'13px' }}>① Select Employee</span>
                  </div>
                  <div style={{ padding:'14px' }}>
                    <label style={lSt}>Employee</label>
                    <select value={empId} onChange={e=>setEmpId(e.target.value)} style={sSt}>
                      <option value="">— Choose Employee —</option>
                      {employees.map(e=>(
                        <option key={e._id} value={e._id}>
                          {e.empCode} — {e.firstName} {e.lastName}
                        </option>
                      ))}
                    </select>

                    {emp && (
                      <div style={{ marginTop:'12px', background:C.bg, borderRadius:'6px', padding:'10px', border:`1px solid ${C.border}` }}>
                        {/* Photo + name */}
                        <div style={{ display:'flex', gap:'10px', alignItems:'center', marginBottom:'10px' }}>
                          {emp.photoUrl
                            ? <img src={emp.photoUrl} alt="" style={{ width:'44px', height:'50px', borderRadius:'6px', objectFit:'cover', objectPosition:'top', border:`1px solid ${C.border}`, flexShrink:0 }}/>
                            : <div style={{ width:'44px', height:'50px', borderRadius:'6px', background:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px', flexShrink:0 }}>👤</div>
                          }
                          <div>
                            <p style={{ margin:0, fontWeight:700, fontSize:'13px', color:C.text }}>{emp.firstName} {emp.lastName}</p>
                            <p style={{ margin:'2px 0', fontSize:'11px', color:C.muted }}>{emp.position||'—'} · {emp.department||'—'}</p>
                            <p style={{ margin:0, fontSize:'11px', color:C.blue, fontWeight:700 }}>ID: {emp.empCode}</p>
                          </div>
                        </div>

                        {/* Auto-filled read-only fields */}
                        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                          <div>
                            <label style={lSt}>Employee Name</label>
                            <input readOnly value={`${emp.firstName||''} ${emp.lastName||''}`.trim()} style={roSt}/>
                          </div>
                          <div>
                            <label style={lSt}>Employee ID</label>
                            <input readOnly value={emp.empCode||'—'} style={roSt}/>
                          </div>
                          <div>
                            <label style={lSt}>Basic Salary (₹)</label>
                            <input readOnly value={`₹ ${inr(emp.salary)}`} style={{ ...roSt, color:C.navy, fontWeight:700 }}/>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Pay Period */}
                <div style={{ background:'#fff', borderRadius:'8px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                  <div style={{ background:C.hdr, padding:'10px 14px' }}>
                    <span style={{ color:'#fff', fontWeight:700, fontSize:'13px' }}>② Pay Period</span>
                  </div>
                  <div style={{ padding:'14px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                    <div>
                      <label style={lSt}>Month</label>
                      <select value={month} onChange={e=>{ setMonth(e.target.value); setGenerated(false); }} style={sSt}>
                        <option value="">Select Month</option>
                        {MONTHS.map(m=><option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={lSt}>Year</label>
                      <select value={year} onChange={e=>{ setYear(e.target.value); setGenerated(false); }} style={sSt}>
                        {YEARS.map(y=><option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 3: Deductions */}
                <div style={{ background:'#fff', borderRadius:'8px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                  <div style={{ background:C.hdr, padding:'10px 14px' }}>
                    <span style={{ color:'#fff', fontWeight:700, fontSize:'13px' }}>③ Deductions & Details</span>
                  </div>
                  <div style={{ padding:'14px', display:'flex', flexDirection:'column', gap:'10px' }}>
                    <div>
                      <label style={lSt}>UAN Number</label>
                      <input
                        type="text"
                        placeholder="Enter UAN (optional)"
                        value={uan}
                        onChange={e=>{ setUan(e.target.value); setGenerated(false); }}
                        style={iSt}
                      />
                    </div>
                    <div>
                      <label style={lSt}>
                        Provident Fund — PF (₹)
                        {basic > 0 && <span style={{ fontWeight:400, color:C.muted, textTransform:'none', marginLeft:'4px' }}>(12% = ₹{inr(basic*0.12)})</span>}
                      </label>
                      <input
                        type="number" min="0"
                        placeholder={basic > 0 ? String(Math.round(basic*0.12)) : '0'}
                        value={pf}
                        onChange={e=>{ setPf(e.target.value); setGenerated(false); }}
                        style={iSt}
                      />
                    </div>
                    <div>
                      <label style={lSt}>
                        ESI (₹)
                        {basic > 0 && <span style={{ fontWeight:400, color:C.muted, textTransform:'none', marginLeft:'4px' }}>(0.75% = ₹{inr(basic*0.0075)})</span>}
                      </label>
                      <input
                        type="number" min="0"
                        placeholder="0"
                        value={esi}
                        onChange={e=>{ setEsi(e.target.value); setGenerated(false); }}
                        style={iSt}
                      />
                    </div>
                  </div>
                </div>

                {/* Live calculation preview */}
                {emp && (
                  <div style={{ background:'#fff', borderRadius:'8px', border:`1px solid ${C.border}`, overflow:'hidden' }}>
                    <div style={{ background:C.navy, padding:'10px 14px' }}>
                      <span style={{ color:'#fff', fontWeight:700, fontSize:'13px' }}>Live Calculation</span>
                    </div>
                    <div style={{ padding:'14px' }}>
                      {[
                        ['Gross Salary (Basic)',  `₹ ${inr(gross)}`,    C.navy],
                        ['PF Deduction',          `– ₹ ${inr(pfAmt)}`,  C.red],
                        ['ESI Deduction',         `– ₹ ${inr(esiAmt)}`, C.red],
                        ['Total Deductions',      `₹ ${inr(totalDed)}`, C.red],
                      ].map(([l,v,col])=>(
                        <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}`, fontSize:'13px' }}>
                          <span style={{ color:C.dark }}>{l}</span>
                          <span style={{ fontWeight:700, color:col }}>{v}</span>
                        </div>
                      ))}
                      <div style={{ display:'flex', justifyContent:'space-between', padding:'10px 0 0', fontSize:'15px', fontWeight:900 }}>
                        <span style={{ color:C.navy }}>Net Salary</span>
                        <span style={{ color:C.green }}>₹ {inr(net)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  style={{
                    width:'100%', padding:'13px', borderRadius:'8px', border:'none',
                    background: (emp && month) ? C.navy : '#94a3b8',
                    color:'#fff', fontWeight:800, fontSize:'14px',
                    cursor: (emp && month) ? 'pointer' : 'not-allowed',
                    letterSpacing:'0.5px', fontFamily:'inherit',
                    boxShadow: (emp && month) ? '0 4px 14px rgba(30,58,95,0.3)' : 'none',
                    transition:'all 0.2s',
                  }}
                >
                  📄 Generate Payslip
                </button>
              </div>
              {/* END LEFT */}

              {/* ── RIGHT: Preview ── */}
              <div id="slip-preview">
                <div style={{ background:'#fff', borderRadius:'8px', border:`1px solid ${C.border}`, overflow:'hidden' }}>

                  {/* Preview header */}
                  <div style={{ background:C.hdr, padding:'10px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ color:'#fff', fontWeight:700, fontSize:'13px' }}>Payslip Preview</span>
                    {generated && (
                      <div style={{ display:'flex', gap:'8px' }}>
                        <button onClick={handlePrint} style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.35)', borderRadius:'5px', color:'#fff', padding:'5px 14px', cursor:'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit' }}>
                          🖨 Print
                        </button>
                        <button onClick={handleDownloadPDF} disabled={busy} style={{ background: busy ? 'rgba(255,255,255,0.1)' : 'rgba(37,99,235,0.9)', border:'1px solid rgba(255,255,255,0.4)', borderRadius:'5px', color:'#fff', padding:'5px 14px', cursor: busy ? 'not-allowed' : 'pointer', fontSize:'12px', fontWeight:700, fontFamily:'inherit', opacity: busy ? 0.7 : 1 }}>
                          {busy ? '⏳ Saving…' : '⬇ Download PDF'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Preview body */}
                  <div style={{ padding:'16px', background:'#e5e7eb', minHeight:'500px' }}>
                    {!generated ? (
                      <div style={{ textAlign:'center', padding:'100px 20px', color:C.muted }}>
                        <div style={{ fontSize:'52px', marginBottom:'14px' }}>📄</div>
                        <p style={{ fontSize:'15px', fontWeight:700, color:C.dark, margin:'0 0 6px' }}>No Payslip Generated Yet</p>
                        <p style={{ fontSize:'13px', margin:0 }}>Select employee → choose month → click <b>Generate Payslip</b></p>
                      </div>
                    ) : (
                      <div style={{ overflowX:'auto' }}>
                        <div ref={printRef} style={{ display:'inline-block', boxShadow:'0 4px 20px rgba(0,0,0,0.12)', borderRadius:'3px' }}>
                          {slipData && <PayslipDoc data={slipData}/>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* END RIGHT */}

            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
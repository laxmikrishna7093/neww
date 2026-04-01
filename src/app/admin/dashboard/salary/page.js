'use client';
// src/app/admin/dashboard/salary/page.js
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const CY = new Date().getFullYear();
const YEARS = [CY - 1, CY, CY + 1];

function n(v) { return parseFloat(v) || 0; }
function inr(v) { return n(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

/* ─── CLEAN PROFESSIONAL PAYSLIP ───────────────────────────── */
function PayslipDoc({ data }) {
  const { emp, month, year, totalDays, workedDays, pf, esi } = data;
  
  const basic = n(emp.salary);
  const tDays = parseInt(totalDays) || 30;
  const wDays = parseInt(workedDays) || tDays;
  const earnedSalary = Math.round((basic / tDays) * wDays);
  const pfAmt = n(pf);
  const esiAmt = n(esi);
  const net = earnedSalary - pfAmt - esiAmt;
  const fullName = [emp.firstName, emp.lastName].filter(Boolean).join(' ') || '—';
  const doj = emp.doj ? new Date(emp.doj).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  return (
    <div style={{ 
      width: '900px', 
      background: '#fff', 
      padding: '40px', 
      fontFamily: 'Arial, sans-serif',
      color: '#000'
    }}>
      
      {/* ═══ HEADER ═══ */}
      <table style={{ width: '100%', marginBottom: '20px', borderBottom: '2px solid #000', paddingBottom: '15px' }}>
        <tbody>
          <tr>
            <td style={{ width: '30%', verticalAlign: 'middle' }}>
              <img 
                src="/logo.png" 
                alt="Logo"
                style={{ height: '135px', objectFit: 'contain' }}
                onError={e => e.target.style.display = 'none'}
              />
            </td>
            <td style={{ width: '70%', textAlign: 'right', verticalAlign: 'middle' }}>
              <div style={{ fontSize: '20px', fontWeight: 450, marginBottom: '5px' }}>NACHI CONSULTANT PVT LTD</div>
              <div style={{ fontSize: '11px', color: '#333' }}>
                14/23, 1st Floor, Madhav Aspire, Muralinagar, Andhra Pradesh – 530007
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══ TITLE ═══ */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{ fontSize: '14px', fontWeight: 450, textDecoration: 'underline', letterSpacing: '1px' }}>
          SALARY SLIP FOR THE MONTH OF {month?.toUpperCase()} {year}
        </div>
      </div>

      {/* ═══ EMPLOYEE DETAILS TABLE ═══ */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #000' }}>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, width: '18%', background: '#f5f5f5' }}>Employee Name</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', width: '32%' }}>{fullName}</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, width: '18%', background: '#f5f5f5' }}>Employee Code</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', width: '32%' }}>{emp.empCode || '—'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>Designation</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{emp.position || '—'}</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>Department</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{emp.department || '—'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>Date of Joining</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{doj}</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>UAN Number</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{emp.uanNumber || '—'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>Bank Name</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{emp.bankName || '—'}</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>Account Number</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{emp.accountNumber || '—'}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>IFSC Code</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{emp.ifscCode || '—'}</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px', fontWeight: 400, background: '#f5f5f5' }}>Days Worked</td>
            <td style={{ border: '1px solid #000', padding: '8px 12px' }}>{wDays} / {tDays}</td>
          </tr>
        </tbody>
      </table>

      {/* ═══ EARNINGS & DEDUCTIONS TABLE ═══ */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #000' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ border: '1px solid #000', padding: '10px 12px', fontWeight: 400, textAlign: 'left', width: '40%' }}>EARNINGS</th>
            <th style={{ border: '1px solid #000', padding: '10px 12px', fontWeight: 400, textAlign: 'right', width: '15%' }}>AMOUNT (₹)</th>
            <th style={{ border: '1px solid #000', padding: '10px 12px', fontWeight: 400, textAlign: 'left', width: '30%' }}>DEDUCTIONS</th>
            <th style={{ border: '1px solid #000', padding: '10px 12px', fontWeight: 400, textAlign: 'right', width: '15%' }}>AMOUNT (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}>Basic Salary</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px', textAlign: 'right' }}>{inr(earnedSalary)}</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}>Provident Fund (PF)</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px', textAlign: 'right' }}>{inr(pfAmt)}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}></td>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}></td>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}>ESI</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px', textAlign: 'right' }}>{inr(esiAmt)}</td>
          </tr>
          <tr style={{ background: '#f5f5f5', fontWeight: 450 }}>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}>GROSS SALARY</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px', textAlign: 'right' }}>{inr(earnedSalary)}</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px' }}>TOTAL DEDUCTIONS</td>
            <td style={{ border: '1px solid #000', padding: '10px 12px', textAlign: 'right' }}>{inr(pfAmt + esiAmt)}</td>
          </tr>
        </tbody>
      </table>

      {/* ═══ NET SALARY TABLE ═══ */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '50px', border: '2px solid #000' }}>
        <tbody>
          <tr style={{ background: '#f0f0f0' }}>
            <td style={{ border: '2px solid #000', padding: '12px 15px', fontWeight: 450, fontSize: '14px', width: '70%' }}>
              NET SALARY PAYABLE
            </td>
            <td style={{ border: '2px solid #000', padding: '12px 15px', fontWeight: 450, fontSize: '16px', textAlign: 'right', width: '30%' }}>
              ₹ {inr(net)}
            </td>
          </tr>
        </tbody>
      </table>

      {/* ═══ SIGNATURE ═══ */}
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: '60%' }}></td>
            <td style={{ width: '40%', textAlign: 'center' }}>
              <div style={{ marginTop: '20px' }}>
                <div style={{ borderTop: '1px solid #000', width: '180px', margin: '0 auto', paddingTop: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>Authorized Signatory</div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────────── */
export default function PayslipPage() {
  const router = useRouter();
  const [view, setView] = useState('form');
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empId, setEmpId] = useState('');
  const [emp, setEmp] = useState(null);
  const [month, setMonth] = useState('');
  const [year, setYear] = useState(String(CY));
  const [totalDays, setTotalDays] = useState('30');
  const [workedDays, setWorkedDays] = useState('30');
  const [pf, setPf] = useState('');
  const [esi, setEsi] = useState('');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const printRef = useRef(null);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/employees');
      const data = await res.json();
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      flash('error', 'Could not load employees');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  useEffect(() => {
    const found = employees.find(e => e._id === empId) || null;
    setEmp(found);
    setSaved(false);
    setPf('');
    setEsi('');
  }, [empId, employees]);

  const basic = n(emp?.salary);
  const tDays = parseInt(totalDays) || 30;
  const wDays = parseInt(workedDays) || tDays;
  const earnedSalary = Math.round((basic / tDays) * wDays);
  const net = earnedSalary - n(pf) - n(esi);

  function flash(type, text) {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  }

  function handleGenerate() {
    if (!emp) return flash('error', 'Select employee');
    if (!month) return flash('error', 'Select month');
    setView('payslip');
  }

  async function handleSave() {
    if (!emp || !month) return;
    setSaving(true);
    try {
      const res = await fetch('/api/admin/salary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: emp._id, month, year, pf: n(pf), esi: n(esi), totalDays: tDays, workedDays: wDays }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaved(true);
      flash('success', 'Payslip saved');
    } catch (err) {
      flash('error', err.message);
    } finally {
      setSaving(false);
    }
  }

  function handlePrint() {
    const el = printRef.current;
    if (!el) return;
    const win = window.open('', '_blank');
    win.document.write(`<!DOCTYPE html><html><head><title>Payslip</title><style>*{margin:0;padding:0;box-sizing:border-box;}body{font-family:Arial,sans-serif;}@media print{@page{size:A4;margin:12mm;}}</style></head><body>${el.innerHTML}<script>window.onload=()=>setTimeout(window.print,300);<\/script></body></html>`);
    win.document.close();
  }

  async function handleDownloadPDF() {
    const el = printRef.current;
    if (!el) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(el, { scale: 2.5, useCORS: true, backgroundColor: '#fff' });
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height / canvas.width) * w;
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, w, h);
      pdf.save(`Payslip_${emp?.empCode}_${month}_${year}.pdf`);
    } catch (err) {
      flash('error', 'PDF failed');
    } finally {
      setBusy(false);
    }
  }

  function resetForm() {
    setEmpId(''); setEmp(null); setMonth(''); setYear(String(CY));
    setTotalDays('30'); setWorkedDays('30'); setPf(''); setEsi('');
    setSaved(false); setView('form');
  }

  const slipData = emp && month ? { emp, month, year, totalDays, workedDays, pf, esi } : null;
  const inputStyle = { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', outline: 'none' };
  const readOnlyStyle = { ...inputStyle, background: '#f5f5f5', cursor: 'not-allowed' };
  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, color: '#333', marginBottom: '5px' };

  return (
    <ProtectedRoute>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5', fontFamily: 'Arial, sans-serif' }}>
        <Sidebar />
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          
          {msg && (
            <div style={{ padding: '10px 15px', borderRadius: '4px', marginBottom: '15px', fontSize: '13px', background: msg.type === 'success' ? '#d1fae5' : '#fee2e2', color: msg.type === 'success' ? '#065f46' : '#991b1b', maxWidth: '700px' }}>
              {msg.text}
            </div>
          )}

          {/* FORM VIEW */}
          {view === 'form' && (
            <div style={{ maxWidth: '700px' }}>
              <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>Generate Payslip</h1>
                <button onClick={() => router.push('/admin/dashboard/salary/history')} style={{ padding: '8px 16px', background: '#000', border: 'none', borderRadius: '4px', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>
                  Saved Payslips
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '6px', border: '1px solid #ddd', padding: '20px' }}>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={labelStyle}>Employee *</label>
                  {loading ? (
                    <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '4px' }}>Loading...</div>
                  ) : (
                    <select value={empId} onChange={e => setEmpId(e.target.value)} style={inputStyle}>
                      <option value="">-- Select --</option>
                      {employees.map(e => (
                        <option key={e._id} value={e._id}>{e.empCode} - {e.firstName} {e.lastName}</option>
                      ))}
                    </select>
                  )}
                </div>

                {emp && (
                  <div style={{ background: '#fafafa', border: '1px solid #eee', borderRadius: '4px', padding: '15px', marginBottom: '15px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '10px', color: '#666' }}>Name</label>
                        <input value={`${emp.firstName} ${emp.lastName}`} readOnly style={readOnlyStyle} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '10px', color: '#666' }}>Emp Code</label>
                        <input value={emp.empCode || '—'} readOnly style={readOnlyStyle} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '10px', color: '#666' }}>Salary</label>
                        <input value={`₹ ${inr(emp.salary)}`} readOnly style={readOnlyStyle} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '10px', color: '#666' }}>Bank</label>
                        <input value={emp.bankName || '—'} readOnly style={readOnlyStyle} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '10px', color: '#666' }}>A/C No.</label>
                        <input value={emp.accountNumber || '—'} readOnly style={readOnlyStyle} />
                      </div>
                      <div>
                        <label style={{ ...labelStyle, fontSize: '10px', color: '#666' }}>IFSC</label>
                        <input value={emp.ifscCode || '—'} readOnly style={readOnlyStyle} />
                      </div>
                    </div>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={labelStyle}>Month *</label>
                    <select value={month} onChange={e => setMonth(e.target.value)} style={inputStyle}>
                      <option value="">Select</option>
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Year</label>
                    <select value={year} onChange={e => setYear(e.target.value)} style={inputStyle}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={labelStyle}>Total Days</label>
                    <select value={totalDays} onChange={e => setTotalDays(e.target.value)} style={inputStyle}>
                      {['28','29','30','31'].map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Days Worked</label>
                    <input type="number" min="0" max={totalDays} value={workedDays} onChange={e => setWorkedDays(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={labelStyle}>PF (₹)</label>
                    <input type="number" min="0" placeholder="0" value={pf} onChange={e => setPf(e.target.value)} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>ESI (₹)</label>
                    <input type="number" min="0" placeholder="0" value={esi} onChange={e => setEsi(e.target.value)} style={inputStyle} />
                  </div>
                </div>

                {emp && (
                  <div style={{ background: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px', padding: '12px', marginBottom: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                      <span>Gross:</span><span>₹ {inr(earnedSalary)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 700 }}>
                      <span>Net:</span><span style={{ color: '#16a34a' }}>₹ {inr(net)}</span>
                    </div>
                  </div>
                )}

                <button onClick={handleGenerate} disabled={!emp || !month} style={{ width: '100%', padding: '12px', borderRadius: '4px', border: 'none', background: emp && month ? '#000' : '#ccc', color: '#fff', fontSize: '14px', fontWeight: 600, cursor: emp && month ? 'pointer' : 'not-allowed' }}>
                  Generate Payslip
                </button>
              </div>
            </div>
          )}

          {/* PAYSLIP VIEW */}
          {view === 'payslip' && slipData && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                <button onClick={() => setView('form')} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                  ← Back
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handlePrint} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>Print</button>
                  <button onClick={handleDownloadPDF} disabled={busy} style={{ padding: '8px 16px', background: '#000', border: 'none', borderRadius: '4px', color: '#fff', cursor: busy ? 'not-allowed' : 'pointer' }}>{busy ? '...' : 'PDF'}</button>
                  <button onClick={handleSave} disabled={saving || saved} style={{ padding: '8px 16px', background: saved ? '#d1fae5' : '#16a34a', border: 'none', borderRadius: '4px', color: saved ? '#065f46' : '#fff', cursor: saving || saved ? 'not-allowed' : 'pointer' }}>{saving ? '...' : saved ? '✓ Saved' : 'Save'}</button>
                  <button onClick={resetForm} style={{ padding: '8px 16px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>New</button>
                </div>
              </div>

              <div style={{ background: '#e5e5e5', padding: '20px', borderRadius: '6px', overflowX: 'auto' }}>
                <div ref={printRef} style={{ display: 'inline-block', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                  <PayslipDoc data={slipData} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
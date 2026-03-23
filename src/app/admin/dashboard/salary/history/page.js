'use client';
// src/app/admin/dashboard/salary/history/page.js
import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/admin/ProtectedRoute';
import Sidebar from '@/components/admin/Sidebar';

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const CY = new Date().getFullYear();

function inr(v) {
  return (parseFloat(v)||0).toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
}
function fmtDate(d) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'}); }
  catch { return '—'; }
}

const C = {
  navy:'#1e3a5f', blue:'#2563eb', border:'#e2e8f0', bg:'#f8fafc',
  text:'#111827', muted:'#6b7280', dark:'#374151',
  green:'#16a34a', greenBg:'#f0fdf4', greenBr:'#bbf7d0',
  red:'#dc2626', redBg:'#fef2f2', redBr:'#fecaca', hdr:'#5a7a9a',
};

export default function PayslipHistoryPage() {
  const router   = useRouter();
  const printRef = useRef(null);

  const [slips,    setSlips]    = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [msg,      setMsg]      = useState(null);
  const [search,   setSearch]   = useState({ name:'', month:'', year:'' });
  const [deleting, setDeleting] = useState(null);
  const [viewing,  setViewing]  = useState(null);
  const [busy,     setBusy]     = useState(false);

  /* ── Fetch ── */
  const fetchSlips = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/salary');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setSlips(Array.isArray(data) ? data : []);
    } catch (e) { flash('error', e.message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSlips(); }, [fetchSlips]);

  /* ── Filter ── */
  useEffect(() => {
    let r = [...slips];
    if (search.name) {
      const q = search.name.toLowerCase();
      r = r.filter(s => {
        const e = s.employeeId;
        return `${e?.firstName||''} ${e?.lastName||''}`.toLowerCase().includes(q)
            || (s.empCode||'').toLowerCase().includes(q);
      });
    }
    if (search.month) r = r.filter(s => s.month === search.month);
    if (search.year)  r = r.filter(s => String(s.year) === String(search.year));
    setFiltered(r);
  }, [search, slips]);

  function flash(type, text) { setMsg({type,text}); setTimeout(()=>setMsg(null),4000); }

  /* ── Delete ── */
  async function handleDelete(id) {
    if (!confirm('Delete this payslip permanently?')) return;
    setDeleting(id);
    try {
      const res = await fetch('/api/admin/salary',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});
      if (!res.ok) throw new Error('Delete failed');
      flash('success','Payslip deleted.');
      fetchSlips();
    } catch(e) { flash('error',e.message); }
    finally { setDeleting(null); }
  }

  /* ── Print modal payslip ── */
  function handlePrint() {
    const el = printRef.current; if (!el) return;
    const win = window.open('','_blank');
    win.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Payslip</title><style>*{box-sizing:border-box;margin:0;padding:0}body{background:#fff;font-family:'Segoe UI',Arial,sans-serif}@media print{@page{size:A4 portrait;margin:8mm}}</style></head><body>${el.innerHTML}<script>window.onload=()=>setTimeout(window.print,500)<\/script></body></html>`);
    win.document.close();
  }

  /* ── Download PDF ── */
  async function handleDownloadPDF() {
    const el = printRef.current; if (!el||!viewing) return;
    setBusy(true);
    try {
      const [{default:h2c},{jsPDF}] = await Promise.all([import('html2canvas'),import('jspdf')]);
      const canvas = await h2c(el,{scale:2.5,useCORS:true,backgroundColor:'#fff',logging:false,windowWidth:900});
      const pdf = new jsPDF({orientation:'portrait',unit:'mm',format:'a4'});
      const W=pdf.internal.pageSize.getWidth(), H=pdf.internal.pageSize.getHeight();
      const iH=(canvas.height/canvas.width)*W, img=canvas.toDataURL('image/jpeg',0.95);
      let y=0,p=0; while(y<iH){if(p>0)pdf.addPage();pdf.addImage(img,'JPEG',0,-y,W,iH);y+=H;p++;}
      const e=viewing.employeeId||{};
      pdf.save(`Payslip_${e.firstName||'Emp'}_${viewing.month}_${viewing.year}.pdf`);
    } catch(e){flash('error','PDF failed: '+e.message);}
    finally{setBusy(false);}
  }

  /* ── Group & sort ── */
  const grouped = filtered.reduce((acc,s)=>{
    const k=`${s.month} ${s.year}`; if(!acc[k]) acc[k]=[]; acc[k].push(s); return acc;
  },{});
  const sortedGroups = Object.entries(grouped).sort((a,b)=>{
    const[am,ay]=[MONTHS.indexOf(a[0].split(' ')[0]),parseInt(a[0].split(' ')[1])];
    const[bm,by]=[MONTHS.indexOf(b[0].split(' ')[0]),parseInt(b[0].split(' ')[1])];
    return by!==ay?by-ay:bm-am;
  });

  /* ── Inline styles ── */
  const ipt = {width:'100%',padding:'8px 11px',border:`1px solid ${C.border}`,borderRadius:'6px',fontSize:'13px',color:C.text,background:'#fff',boxSizing:'border-box',outline:'none',fontFamily:'inherit'};
  const sel = {...ipt,cursor:'pointer'};
  const lbl = {fontSize:'11px',fontWeight:700,color:C.dark,display:'block',textTransform:'uppercase',letterSpacing:'0.4px',marginBottom:'4px'};

  return (
    <ProtectedRoute>
      <div style={{display:'flex',minHeight:'100vh',background:'#f3f4f6',fontFamily:"'Segoe UI',sans-serif"}}>
        <Sidebar/>
        <div style={{flex:1,minWidth:0,overflowY:'auto'}}>
          <div style={{padding:'20px',boxSizing:'border-box'}}>

            {/* ── Header ── */}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'20px',flexWrap:'wrap',gap:'12px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'14px'}}>
                <button onClick={()=>router.push('/admin/dashboard/salary')}
                  style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:'6px',padding:'9px 18px',cursor:'pointer',fontSize:'13px',fontWeight:700,color:C.dark,fontFamily:'inherit'}}>
                  ← Back
                </button>
                <div>
                  <h1 style={{margin:0,fontSize:'20px',fontWeight:700,color:C.navy}}>Saved Payslips</h1>
                  <p style={{margin:'2px 0 0',fontSize:'12px',color:C.muted}}>
                    {filtered.length} payslip{filtered.length!==1?'s':''} · MongoDB
                  </p>
                </div>
              </div>
              <button onClick={fetchSlips}
                style={{background:C.navy,border:'none',borderRadius:'6px',padding:'9px 18px',cursor:'pointer',fontSize:'13px',fontWeight:600,color:'#fff',fontFamily:'inherit'}}>
                🔄 Refresh
              </button>
            </div>

            {/* ── Flash ── */}
            {msg && (
              <div style={{padding:'10px 16px',borderRadius:'8px',marginBottom:'14px',fontSize:'13px',fontWeight:500,background:msg.type==='success'?C.greenBg:C.redBg,color:msg.type==='success'?C.green:C.red,border:`1px solid ${msg.type==='success'?C.greenBr:C.redBr}`}}>
                {msg.type==='success'?'✅ ':'❌ '}{msg.text}
              </div>
            )}

            {/* ── Filters ── */}
            <div style={{background:'#fff',borderRadius:'8px',border:`1px solid ${C.border}`,marginBottom:'16px',overflow:'hidden'}}>
              <div style={{background:C.hdr,padding:'10px 16px'}}>
                <span style={{color:'#fff',fontWeight:600,fontSize:'14px'}}>Filter Payslips</span>
              </div>
              <div style={{padding:'12px 16px',display:'grid',gridTemplateColumns:'2fr 1fr 1fr auto',gap:'10px',alignItems:'end'}}>
                <div>
                  <label style={lbl}>Employee Name / ID</label>
                  <input placeholder="Search name or code" value={search.name} onChange={e=>setSearch(p=>({...p,name:e.target.value}))} style={ipt}/>
                </div>
                <div>
                  <label style={lbl}>Month</label>
                  <select value={search.month} onChange={e=>setSearch(p=>({...p,month:e.target.value}))} style={sel}>
                    <option value="">All Months</option>
                    {MONTHS.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={lbl}>Year</label>
                  <select value={search.year} onChange={e=>setSearch(p=>({...p,year:e.target.value}))} style={sel}>
                    <option value="">All Years</option>
                    {[CY-1,CY,CY+1].map(y=><option key={y}>{y}</option>)}
                  </select>
                </div>
                <button onClick={()=>setSearch({name:'',month:'',year:''})}
                  style={{padding:'8px 16px',background:'#4a7fa5',border:'none',borderRadius:'6px',color:'#fff',fontSize:'13px',fontWeight:600,cursor:'pointer',fontFamily:'inherit'}}>
                  Reset
                </button>
              </div>
            </div>

            {/* ── Table / Empty ── */}
            {loading ? (
              <div style={{background:'#fff',borderRadius:'8px',border:`1px solid ${C.border}`,padding:'60px',textAlign:'center',color:C.muted}}>
                <div style={{fontSize:'36px',marginBottom:'10px'}}>⏳</div><p>Loading…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{background:'#fff',borderRadius:'8px',border:`1px solid ${C.border}`,padding:'60px',textAlign:'center',color:C.muted}}>
                <div style={{fontSize:'48px',marginBottom:'12px'}}>📄</div>
                <p style={{fontSize:'15px',fontWeight:700,color:C.dark,margin:'0 0 6px'}}>
                  {slips.length===0?'No Saved Payslips Yet':'No Results Found'}
                </p>
                <p style={{fontSize:'13px',margin:'0 0 16px'}}>
                  {slips.length===0?'Generate and save from the Payslip Generator.':'Try different filters.'}
                </p>
                {slips.length===0 && (
                  <button onClick={()=>router.push('/admin/dashboard/salary')}
                    style={{padding:'10px 24px',background:C.navy,border:'none',borderRadius:'6px',color:'#fff',fontWeight:700,fontSize:'13px',cursor:'pointer',fontFamily:'inherit'}}>
                    Go to Payslip Generator
                  </button>
                )}
              </div>
            ) : (
              <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
                {sortedGroups.map(([gKey,gSlips])=>(
                  <div key={gKey} style={{background:'#fff',borderRadius:'8px',border:`1px solid ${C.border}`,overflow:'hidden'}}>

                    {/* Group header */}
                    <div style={{background:C.navy,padding:'10px 18px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                      <span style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>📅 {gKey}</span>
                      <span style={{color:'#bfdbfe',fontSize:'12px',fontWeight:600}}>{gSlips.length} payslip{gSlips.length!==1?'s':''}</span>
                    </div>

                    <div style={{overflowX:'auto'}}>
                      <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px',minWidth:'800px'}}>
                        <thead>
                          <tr style={{background:'#f9fafb',borderBottom:`2px solid ${C.border}`}}>
                            {['Employee','ID','Department','Days','PF','ESI','Net Salary','Saved On','Actions'].map((h,i)=>(
                              <th key={i} style={{padding:'10px 14px',textAlign:h==='Net Salary'?'right':'left',fontWeight:700,color:C.dark,fontSize:'12px',whiteSpace:'nowrap'}}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {gSlips.map((slip,i)=>{
                            const emp   = slip.employeeId||{};
                            const name  = emp.firstName?`${emp.firstName} ${emp.lastName||''}`.trim():'—';
                            const rowBg = i%2===0?'#fff':'#fafafa';
                            return (
                              <tr key={slip._id} style={{borderBottom:`1px solid ${C.border}`,background:rowBg}}
                                onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'}
                                onMouseLeave={e=>e.currentTarget.style.background=rowBg}>

                                {/* Employee */}
                                <td style={{padding:'10px 14px',whiteSpace:'nowrap'}}>
                                  <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                                    {emp.photoUrl
                                      ?<img src={emp.photoUrl} alt="" style={{width:'32px',height:'36px',borderRadius:'4px',objectFit:'cover',objectPosition:'top',flexShrink:0}}/>
                                      :<div style={{width:'32px',height:'36px',borderRadius:'4px',background:'#e2e8f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px',flexShrink:0}}>👤</div>
                                    }
                                    <span style={{fontWeight:600,color:C.text}}>{name}</span>
                                  </div>
                                </td>
                                <td style={{padding:'10px 14px',color:C.blue,fontWeight:700,whiteSpace:'nowrap'}}>{slip.empCode||'—'}</td>
                                <td style={{padding:'10px 14px',color:C.text,whiteSpace:'nowrap'}}>{emp.department||'—'}</td>
                                <td style={{padding:'10px 14px',color:C.text,whiteSpace:'nowrap'}}>{slip.workedDays||30}/{slip.totalDays||30}</td>
                                <td style={{padding:'10px 14px',color:C.red,whiteSpace:'nowrap'}}>₹{inr(slip.pf)}</td>
                                <td style={{padding:'10px 14px',color:C.red,whiteSpace:'nowrap'}}>₹{inr(slip.esi)}</td>

                                {/* Net Salary */}
                                <td style={{padding:'10px 14px',textAlign:'right',whiteSpace:'nowrap'}}>
                                  <span style={{display:'inline-block',background:'#dcfce7',color:'#15803d',border:'1px solid #86efac',borderRadius:'6px',padding:'5px 12px',fontWeight:800,fontSize:'13px'}}>
                                    ₹ {inr(slip.netSalary)}
                                  </span>
                                </td>

                                <td style={{padding:'10px 14px',color:C.muted,whiteSpace:'nowrap',fontSize:'12px'}}>{fmtDate(slip.generatedAt||slip.createdAt)}</td>

                                {/* Actions */}
                                <td style={{padding:'10px 14px',whiteSpace:'nowrap'}}>
                                  <div style={{display:'flex',gap:'6px'}}>
                                    <button onClick={()=>setViewing(slip)}
                                      style={{display:'flex',alignItems:'center',gap:'4px',background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:'5px',color:C.blue,padding:'5px 10px',cursor:'pointer',fontSize:'12px',fontWeight:600,fontFamily:'inherit'}}>
                                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                      View
                                    </button>
                                    <button onClick={()=>handleDelete(slip._id)} disabled={deleting===slip._id}
                                      style={{display:'flex',alignItems:'center',gap:'4px',background:C.redBg,border:`1px solid ${C.redBr}`,borderRadius:'5px',color:C.red,padding:'5px 10px',cursor:deleting===slip._id?'not-allowed':'pointer',fontSize:'12px',fontWeight:600,fontFamily:'inherit',opacity:deleting===slip._id?0.6:1}}>
                                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                                      {deleting===slip._id?'…':'Delete'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ══ VIEW MODAL — simple inline payslip, no duplicate component ══ */}
      {viewing && (()=>{
        const emp=viewing.employeeId||{};
        const name=emp.firstName?`${emp.firstName} ${emp.lastName||''}`.trim():'—';
        const doj=emp.doj?fmtDate(emp.doj):'—';
        const gross=viewing.basicSalary||0, pf=viewing.pf||0, esi=viewing.esi||0;
        const ded=viewing.totalDed||(pf+esi), net=viewing.netSalary||0;
        const th={padding:'9px 14px',color:'#fff',fontWeight:700,fontSize:'12px'};
        const td={padding:'9px 14px',fontSize:'12px',color:C.text};
        return (
          <div onClick={e=>{if(e.target===e.currentTarget)setViewing(null)}}
            style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.65)',zIndex:9999,display:'flex',alignItems:'flex-start',justifyContent:'center',overflowY:'auto',padding:'30px 20px'}}>
            <div style={{background:'#fff',borderRadius:'10px',overflow:'hidden',maxWidth:'880px',width:'100%',boxShadow:'0 24px 64px rgba(0,0,0,0.4)'}}>

              {/* Modal bar */}
              <div style={{background:C.navy,padding:'13px 20px',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                <span style={{color:'#fff',fontWeight:700,fontSize:'14px'}}>
                  📄 {viewing.month} {viewing.year} · {name}
                </span>
                <div style={{display:'flex',gap:'8px'}}>
                  <button onClick={handlePrint} style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:'5px',color:'#fff',padding:'6px 14px',cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'inherit'}}>🖨 Print</button>
                  <button onClick={handleDownloadPDF} disabled={busy} style={{background:busy?'rgba(255,255,255,0.1)':'rgba(37,99,235,0.9)',border:'1px solid rgba(255,255,255,0.4)',borderRadius:'5px',color:'#fff',padding:'6px 14px',cursor:busy?'not-allowed':'pointer',fontSize:'12px',fontWeight:700,fontFamily:'inherit',opacity:busy?0.7:1}}>
                    {busy?'⏳…':'⬇ PDF'}
                  </button>
                  <button onClick={()=>setViewing(null)} style={{background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.3)',borderRadius:'5px',color:'#fff',padding:'5px 13px',cursor:'pointer',fontSize:'18px',lineHeight:1,fontFamily:'inherit'}}>✕</button>
                </div>
              </div>

              {/* Payslip */}
              <div style={{padding:'16px',background:'#e5e7eb',overflowX:'auto'}}>
                <div ref={printRef} style={{display:'inline-block',boxShadow:'0 4px 20px rgba(0,0,0,0.12)',borderRadius:'3px'}}>
                  <div style={{width:'794px',background:'#fff',padding:'40px 52px 36px',boxSizing:'border-box',fontFamily:"'Segoe UI',Arial,sans-serif"}}>

                    {/* Header */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderBottom:`3px solid ${C.navy}`,paddingBottom:'16px',marginBottom:'18px'}}>
                      <img src="/logo.png" alt="Logo" style={{width:'200px',height:'auto',maxHeight:'90px',objectFit:'contain',objectPosition:'left',flexShrink:0}} onError={e=>{e.target.style.display='none';}}/>
                      <div style={{textAlign:'right'}}>
                        <div style={{fontSize:'20px',fontWeight:900,color:C.navy}}>Nachi Consultant Pvt Ltd</div>
                        <div style={{fontSize:'11px',color:C.muted,marginTop:'4px',lineHeight:1.7}}>14/23 1st Floor, Madhav Aspire, Muralinagar,<br/>Andhra Pradesh – 530007</div>
                      </div>
                    </div>

                    {/* Title */}
                    <div style={{background:C.navy,color:'#fff',textAlign:'center',padding:'9px',borderRadius:'4px',fontSize:'13px',fontWeight:700,letterSpacing:'3px',textTransform:'uppercase',marginBottom:'20px'}}>
                      Salary Slip — {viewing.month} {viewing.year}
                    </div>

                    {/* Employee table */}
                    <table style={{width:'100%',borderCollapse:'collapse',border:`1px solid ${C.border}`,marginBottom:'18px',fontSize:'12px'}}>
                      <tbody>
                        {[['Employee Name',name,'Employee ID',viewing.empCode||'—'],['Designation',emp.position||'—','Department',emp.department||'—'],['Date of Joining',doj,'UAN',viewing.uan||'—'],['Pay Period',`${viewing.month} ${viewing.year}`,'Working Days',`${viewing.workedDays||30}/${viewing.totalDays||30}`]].map(([l1,v1,l2,v2],i)=>(
                          <tr key={i} style={{borderBottom:`1px solid ${C.border}`}}>
                            <td style={{background:C.bg,padding:'8px 12px',fontWeight:700,color:C.dark,width:'20%',borderRight:`1px solid ${C.border}`,fontSize:'11px',whiteSpace:'nowrap'}}>{l1}</td>
                            <td style={{padding:'8px 12px',width:'30%',borderRight:`1px solid ${C.border}`,color:'#111827',fontWeight:600,fontSize:'12px'}}>{v1}</td>
                            <td style={{background:C.bg,padding:'8px 12px',fontWeight:700,color:C.dark,width:'20%',borderRight:`1px solid ${C.border}`,fontSize:'11px',whiteSpace:'nowrap'}}>{l2}</td>
                            <td style={{padding:'8px 12px',width:'30%',color:'#111827',fontWeight:600,fontSize:'12px'}}>{v2}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Salary table */}
                    <table style={{width:'100%',borderCollapse:'collapse',border:`1px solid ${C.border}`,marginBottom:'18px'}}>
                      <thead>
                        <tr>
                          <th style={{...th,background:C.navy,width:'50%',textAlign:'left'}}>Earnings</th>
                          <th style={{...th,background:C.navy,width:'10%',textAlign:'right'}}>Amount (₹)</th>
                          <th style={{...th,background:'#374151',width:'30%',textAlign:'left',borderLeft:'3px solid #fff'}}>Deductions</th>
                          <th style={{...th,background:'#374151',width:'10%',textAlign:'right'}}>Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr style={{borderBottom:`1px solid ${C.border}`}}>
                          <td style={td}>Basic Salary</td><td style={{...td,textAlign:'right',fontWeight:600}}>{inr(gross)}</td>
                          <td style={{...td,borderLeft:`2px solid ${C.border}`}}>Provident Fund (PF)</td><td style={{...td,textAlign:'right',fontWeight:600,color:C.red}}>{inr(pf)}</td>
                        </tr>
                        <tr style={{background:C.bg}}>
                          <td style={td}/><td style={{...td,textAlign:'right'}}/>
                          <td style={{...td,borderLeft:`2px solid ${C.border}`}}>ESI</td><td style={{...td,textAlign:'right',fontWeight:600,color:C.red}}>{inr(esi)}</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr style={{background:C.navy}}>
                          <td style={{padding:'11px 14px',color:'#bfdbfe',fontWeight:700,fontSize:'12px'}}>Gross Salary</td>
                          <td style={{padding:'11px 14px',color:'#fff',fontWeight:900,fontSize:'13px',textAlign:'right'}}>₹ {inr(gross)}</td>
                          <td style={{padding:'11px 14px',color:'#fca5a5',fontWeight:700,fontSize:'12px',borderLeft:'3px solid #3b82f6'}}>Total Deductions</td>
                          <td style={{padding:'11px 14px',color:'#fff',fontWeight:900,fontSize:'13px',textAlign:'right'}}>₹ {inr(ded)}</td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* Net */}
                    <div style={{background:C.navy,borderRadius:'6px',padding:'15px 22px',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'22px'}}>
                      <div>
                        <div style={{color:'#bfdbfe',fontSize:'10px',letterSpacing:'2px',textTransform:'uppercase',fontWeight:700,marginBottom:'5px'}}>Net Salary Payable — {viewing.month} {viewing.year}</div>
                      </div>
                      <div style={{color:'#fff',fontWeight:900,fontSize:'26px'}}>₹ {inr(net)}</div>
                    </div>

                    {/* Footer */}
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',borderTop:`1px solid ${C.border}`,paddingTop:'14px',fontSize:'11px',color:C.muted}}>
                      <div>
                        <div style={{fontWeight:700,color:C.dark,marginBottom:'3px'}}>Note:</div>
                        <div>Computer generated payslip. No physical signature required.</div>
                        <div>Queries: contact HR Department.</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div style={{height:'34px'}}/>
                        <div style={{width:'165px',borderTop:`2px solid ${C.dark}`,paddingTop:'5px',fontWeight:700,color:C.dark,fontSize:'12px'}}>Authorized Signature</div>
                        <div style={{fontSize:'10px',marginTop:'2px'}}>Nachi Consultant Pvt Ltd</div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

    </ProtectedRoute>
  );
}
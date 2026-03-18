// src/app/admin/dashboard/salary/page.js
'use client';
import { useState, useRef } from 'react';

// Default empty form so we can reset it easily
const INITIAL_FORM_DATA = {
  companyName: "YOUR COMPANY NAME",
  companyAddress: "123 Business Park, Tech City, 400001",
  month: "March 2024",
  empName: "",
  empId: "",
  designation: "",
  department: "",
  doj: "",
  uan: "",
  bankAcc: "",
  daysPresent: "31",
  basicPay: 0,
  hra: 0,
  conveyance: 0,
  special: 0,
  pf: 0,
  esi: 0,
  profTax: 0,
  tds: 0,
};

export default function SalarySlipPage() {
  const printRef = useRef();

  // 1. STATES
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [savedRecords, setSavedRecords] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false); // Controls if the form is locked

  // 2. CALCULATIONS
  const totalEarnings = Number(formData.basicPay) + Number(formData.hra) + Number(formData.conveyance) + Number(formData.special);
  const totalDeductions = Number(formData.pf) + Number(formData.esi) + Number(formData.profTax) + Number(formData.tds);
  const netPay = totalEarnings - totalDeductions;

  // 3. HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.empName) {
      alert("Please enter an Employee Name before saving.");
      return;
    }
    const newRecord = { ...formData, netPay, id: Date.now() };
    setSavedRecords([...savedRecords, newRecord]);
    setIsReadOnly(true); // Lock the form after saving!
    alert("Payslip Saved Successfully! It is now locked for printing/downloading.");
  };

  const handleCreateNew = () => {
    setFormData(INITIAL_FORM_DATA);
    setIsReadOnly(false); // Unlock the form
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = printRef.current;
      element.classList.add('pdf-mode'); // Hides any leftover borders
      
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      const fileName = formData.empName ? `Payslip_${formData.empName}.pdf` : `Payslip.pdf`;
      pdf.save(fileName);
      
      element.classList.remove('pdf-mode');
    } catch (error) {
      console.error(error);
      alert("Failed to generate PDF. Make sure you ran 'npm install html2canvas jspdf'");
    }
  };

  const loadRecord = (record) => {
    setFormData(record);
    setIsReadOnly(true); // Lock it when viewing a saved record
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* --- STYLES --- */}
      <style dangerouslySetInnerHTML={{__html: `
        .input-field {
          width: 100%; border: 1px dashed #cbd5e1; padding: 4px 8px; border-radius: 4px;
          background: #f8fafc; font-family: inherit; font-size: inherit; color: inherit;
          transition: all 0.2s;
        }
        .input-field:focus { outline: none; border-color: #3BC1A8; background: #fff; }
        
        /* Magic Style: Removes borders when readOnly is true! */
        .input-field:read-only {
          border-color: transparent;
          background: transparent;
          cursor: default;
          padding: 0;
        }

        @media print {
          body * { visibility: hidden; }
          .payslip-container, .payslip-container * { visibility: visible; }
          .payslip-container { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
          .input-field { border: none !important; background: transparent !important; padding: 0 !important; }
          .no-print { display: none !important; }
        }
        .pdf-mode .input-field { border: none !important; background: transparent !important; padding: 0 !important; }
      `}} />

      {/* --- TOP HEADER & BUTTONS --- */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#1e293b', margin: 0 }}>Salary / Payslip Generator</h1>
          <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 0' }}>
            {isReadOnly ? "Viewing Saved Record (Read-Only)" : "Edit fields directly and generate slips"}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          
          {/* Show 'Save' only if editing, Show 'Create New' if Read-Only */}
          {!isReadOnly ? (
            <button onClick={handleSave} style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              💾 Save Data
            </button>
          ) : (
            <button onClick={handleCreateNew} style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              ➕ Create New Payslip
            </button>
          )}

          <button onClick={handlePrint} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            🖨️ Print
          </button>
          <button onClick={handleDownloadPDF} style={{ background: '#3BC1A8', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            ⬇️ Download PDF
          </button>
        </div>
      </div>

      {/* --- PAYSLIP EDITOR CONTAINER --- */}
      <div ref={printRef} className="payslip-container" style={{ background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', maxWidth: '900px', margin: '0 auto', color: '#000' }}>
        
        <div style={{ textAlign: 'center', borderBottom: '2px solid #1e293b', paddingBottom: '20px', marginBottom: '20px' }}>
          <input readOnly={isReadOnly} className="input-field" name="companyName" value={formData.companyName} onChange={handleChange} style={{ fontSize: '26px', fontWeight: 800, color: '#3BC1A8', textTransform: 'uppercase', textAlign: 'center', width: '80%' }} />
          <input readOnly={isReadOnly} className="input-field" name="companyAddress" value={formData.companyAddress} onChange={handleChange} style={{ textAlign: 'center', margin: '4px auto', width: '80%', color: '#475569' }} />
          <div style={{ margin: '12px auto 0', background: '#f1f5f9', display: 'inline-flex', alignItems: 'center', padding: '6px 16px', borderRadius: '4px', gap: '8px' }}>
            <span style={{ fontWeight: 600 }}>Payslip for the month of:</span>
            <input readOnly={isReadOnly} className="input-field" name="month" value={formData.month} onChange={handleChange} style={{ width: '120px', fontWeight: 600 }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px', fontSize: '13px' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><th style={{ padding: '8px 4px', width: '40%' }}>Employee Name:</th><td><input readOnly={isReadOnly} className="input-field" name="empName" value={formData.empName} onChange={handleChange} placeholder="Enter Name" /></td></tr>
              <tr><th style={{ padding: '8px 4px' }}>Employee ID:</th><td><input readOnly={isReadOnly} className="input-field" name="empId" value={formData.empId} onChange={handleChange} placeholder="e.g. SU001" /></td></tr>
              <tr><th style={{ padding: '8px 4px' }}>Designation:</th><td><input readOnly={isReadOnly} className="input-field" name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. Developer" /></td></tr>
              <tr><th style={{ padding: '8px 4px' }}>Department:</th><td><input readOnly={isReadOnly} className="input-field" name="department" value={formData.department} onChange={handleChange} placeholder="e.g. IT" /></td></tr>
            </tbody>
          </table>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <tbody>
              <tr><th style={{ padding: '8px 4px', width: '40%' }}>Date of Joining:</th><td><input readOnly={isReadOnly} className="input-field" name="doj" value={formData.doj} onChange={handleChange} placeholder="DD MMM YYYY" /></td></tr>
              <tr><th style={{ padding: '8px 4px' }}>UAN (EPFO):</th><td><input readOnly={isReadOnly} className="input-field" name="uan" value={formData.uan} onChange={handleChange} placeholder="Enter UAN" /></td></tr>
              <tr><th style={{ padding: '8px 4px' }}>Bank A/C No:</th><td><input readOnly={isReadOnly} className="input-field" name="bankAcc" value={formData.bankAcc} onChange={handleChange} placeholder="Enter Acc No" /></td></tr>
              <tr><th style={{ padding: '8px 4px' }}>Days Present:</th><td><input readOnly={isReadOnly} className="input-field" name="daysPresent" value={formData.daysPresent} onChange={handleChange} /></td></tr>
            </tbody>
          </table>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #cbd5e1' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
              <th style={{ width: '50%', padding: '12px', borderRight: '1px solid #cbd5e1', textAlign: 'left' }}>EARNINGS</th>
              <th style={{ width: '50%', padding: '12px', textAlign: 'left' }}>DEDUCTIONS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ verticalAlign: 'top', borderRight: '1px solid #cbd5e1', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ padding: '12px' }}>Basic Pay</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="basicPay" value={formData.basicPay} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                    <tr><td style={{ padding: '12px' }}>House Rent Allowance</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="hra" value={formData.hra} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                    <tr><td style={{ padding: '12px' }}>Conveyance</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="conveyance" value={formData.conveyance} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                    <tr><td style={{ padding: '12px' }}>Special Allowance</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="special" value={formData.special} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                  </tbody>
                </table>
              </td>
              <td style={{ verticalAlign: 'top', padding: 0 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr><td style={{ padding: '12px' }}>Provident Fund (EPFO)</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="pf" value={formData.pf} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                    <tr><td style={{ padding: '12px' }}>ESI</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="esi" value={formData.esi} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                    <tr><td style={{ padding: '12px' }}>Professional Tax</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="profTax" value={formData.profTax} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                    <tr><td style={{ padding: '12px' }}>TDS / Income Tax</td><td style={{ padding: '12px' }}><input readOnly={isReadOnly} type="number" className="input-field" name="tds" value={formData.tds} onChange={handleChange} style={{textAlign:'right'}} /></td></tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr style={{ borderTop: '1px solid #cbd5e1', fontWeight: 'bold', background: '#f8fafc' }}>
              <td style={{ padding: '12px', borderRight: '1px solid #cbd5e1' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Gross Earnings:</span>
                  <span>₹{totalEarnings.toFixed(2)}</span>
                </div>
              </td>
              <td style={{ padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Deductions:</span>
                  <span>₹{totalDeductions.toFixed(2)}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: '#e0f2fe', padding: '16px', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', color: '#0369a1' }}>NET PAY</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#0284c7' }}>(Gross Earnings - Total Deductions)</p>
          </div>
          <h2 style={{ margin: 0, fontSize: '28px', color: '#0369a1' }}>₹{netPay.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</h2>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '60px', padding: '0 20px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #94a3b8', width: '180px', paddingTop: '8px', fontSize: '14px' }}>Employer Signature</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ borderTop: '1px solid #94a3b8', width: '180px', paddingTop: '8px', fontSize: '14px' }}>Employee Signature</div>
          </div>
        </div>
      </div>

      {/* --- SAVED RECORDS SECTION --- */}
      <div className="no-print" style={{ marginTop: '40px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', color: '#000' }}>
        <h2 style={{ fontSize: '18px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>📋 Saved Salary Records</h2>
        
        {savedRecords.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '14px' }}>No records saved yet. Click "Save Data" to see them here.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px' }}>Employee Name</th>
                <th style={{ padding: '12px' }}>Designation</th>
                <th style={{ padding: '12px' }}>Department</th>
                <th style={{ padding: '12px' }}>Month</th>
                <th style={{ padding: '12px' }}>Net Pay</th>
                <th style={{ padding: '12px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {savedRecords.map((record) => (
                <tr key={record.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '12px', fontWeight: 600 }}>{record.empName}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{record.designation || '-'}</td>
                  <td style={{ padding: '12px', color: '#475569' }}>{record.department || '-'}</td>
                  <td style={{ padding: '12px' }}>{record.month}</td>
                  <td style={{ padding: '12px', color: '#0369a1', fontWeight: 600 }}>₹{record.netPay.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '12px' }}>
                    <button onClick={() => loadRecord(record)} style={{ background: '#3BC1A8', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>
                      👁️ View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
"use client";

import { useState, useRef, useEffect, useCallback } from "react";

// ─── Helper: generate employee ID ────────────────────────────────────────────
function makeEmployeeId(name) {
  const prefix = (name || "SU").replace(/\s+/g, "").substring(0, 5).toUpperCase();
  const suffix = String(Math.floor(Math.random() * 900) + 100);
  return prefix + suffix;
}

// ─── FRONT CARD ───────────────────────────────────────────────────────────────
function IDCardFront({ name, designation, employeeId, mobile, photo, cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{
        width: "260px",
        height: "410px",
        background: "#1a1a2e",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', sans-serif",
        overflow: "hidden",
        border: "1px solid #2d2d4e",
        flexShrink: 0,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      {/* Top section */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.2rem 1rem 0.8rem",
        width: "100%",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
      }}>
        {/* Company Logo */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <img
            src="/logo.png"
  alt="Company Logo"
  crossOrigin="anonymous"
  style={{
    width: "120px",       // bigger
    height: "60px",
    objectFit: "contain",
    borderRadius: "4px",
            }}
          />
        </div>

        {/* Photo frame */}
        <div style={{
          width: "100px",
          height: "100px",
          background: "#fff",
          borderRadius: "6px",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "3px solid #e2e8f0",
        }}>
          {photo ? (
            <img src={photo} alt="Employee" crossOrigin="anonymous"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="#94a3b8" strokeWidth="1.5" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Name strip */}
      <div style={{
        width: "100%",
        background: "#ffffff",
        padding: "0.7rem 1rem",
        textAlign: "center",
        borderTop: "3px solid #3b82f6",
      }}>
        <div style={{
          fontWeight: 700,
          fontSize: "0.95rem",
          letterSpacing: "0.5px",
          textTransform: "uppercase",
          color: "#1e293b",
        }}>
          {name || "EMPLOYEE NAME"}
        </div>
        <div style={{ fontSize: "0.7rem", color: "#64748b", marginTop: "2px", letterSpacing: "0.5px" }}>
          {designation || "Designation"}
        </div>
      </div>

      {/* ID bar */}
      <div style={{
        width: "100%",
        background: "#3b82f6",
        padding: "0.45rem 1rem",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "0.78rem", letterSpacing: "1.5px", color: "#fff", fontWeight: 600 }}>
          ID: {employeeId || "SU000"}
        </div>
        {mobile && (
          <div style={{ fontSize: "0.68rem", color: "#bfdbfe", marginTop: "2px" }}>{mobile}</div>
        )}
      </div>
    </div>
  );
}

// ─── BACK CARD ────────────────────────────────────────────────────────────────
function IDCardBack({ cardRef }) {
  return (
    <div
      ref={cardRef}
      style={{
        width: "260px",
        height: "410px",
        background: "#1a1a2e",
        borderRadius: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "'Segoe UI', sans-serif",
        overflow: "hidden",
        border: "1px solid #2d2d4e",
        flexShrink: 0,
        padding: "1.5rem 1.2rem",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
      }}
    >
      <img src="/logo.png" alt="Logo" crossOrigin="anonymous"
  style={{ width: "110px", height: "50px", objectFit: "contain",
  marginBottom: "0.8rem" }} />
      <div style={{ fontSize: "0.75rem", fontWeight: 700, letterSpacing: "2px", color: "#fff", marginBottom: "1rem", textTransform: "uppercase" }}>
        Instructions
      </div>
      <ol style={{ paddingLeft: "1.2rem", margin: 0, width: "100%" }}>
        {[
          "This Card must be carried at all times, while on duty",
          "This Card is non Transferrable, and must be produced on Demand",
          "If Lost or Damaged, Please report immediately to HR dept",
        ].map((item, i) => (
          <li key={i} style={{ fontSize: "0.68rem", color: "#cbd5e1", lineHeight: 1.6, marginBottom: "0.5rem" }}>{item}</li>
        ))}
      </ol>
      <div style={{ fontSize: "0.64rem", color: "#64748b", fontStyle: "italic", marginTop: "0.6rem", alignSelf: "flex-start" }}>
        If Found, Please return to:
      </div>
      <div style={{
        marginTop: "auto",
        paddingTop: "0.8rem",
        borderTop: "1px solid #2d2d4e",
        width: "100%",
        textAlign: "center",
        fontSize: "0.68rem",
        color: "#94a3b8",
        lineHeight: 1.6,
      }}>
        D-201, Synthofine Estate, Off Aarey Road,<br />
        Goregaon (E), Mumbai 400063
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function IDCardsPage() {
  const [name, setName]               = useState("");
  const [designation, setDesignation] = useState("");
  const [mobile, setMobile]           = useState("");
  const [photo, setPhoto]             = useState(null);
  const [employeeId, setEmployeeId]   = useState("SU000");
  const [flipped, setFlipped]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [cards, setCards]             = useState([]);
  const [flash, setFlash]             = useState(null);
  const [editingId, setEditingId]     = useState(null);

  const frontRef = useRef(null);
  const backRef  = useRef(null);

  const fetchCards = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/idcards");
      const json = await res.json();
      if (json.success) setCards(json.data);
    } catch (err) {
      showFlash("error", "Failed to load: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCards(); }, [fetchCards]);

  useEffect(() => {
    if (name.trim()) setEmployeeId(makeEmployeeId(name));
    else setEmployeeId("SU000");
  }, [name]);

  function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!name.trim()) { showFlash("error", "Employee name is required."); return; }
    setSaving(true);
    try {
      const url    = editingId ? `/api/idcards/${editingId}` : "/api/idcards";
      const method = editingId ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, designation, mobile, photo }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setEmployeeId(json.data.employeeId);
      setEditingId(json.data._id);
      showFlash("success", `Card saved! ID: ${json.data.employeeId}`);
      fetchCards();
    } catch (err) {
      showFlash("error", err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(mongoId) {
    if (!confirm("Delete this ID card?")) return;
    await fetch(`/api/idcards/${mongoId}`, { method: "DELETE" });
    if (editingId === mongoId) clearForm();
    fetchCards();
    showFlash("success", "Deleted.");
  }

  function loadCard(card) {
    setName(card.name);
    setDesignation(card.designation || "");
    setMobile(card.mobile || "");
    setPhoto(card.photo || null);
    setEmployeeId(card.employeeId);
    setEditingId(card._id);
    setFlipped(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearForm() {
    setName(""); setDesignation(""); setMobile("");
    setPhoto(null); setEmployeeId("SU000"); setEditingId(null); setFlipped(false);
  }

  async function downloadFrontPNG() {
    if (!frontRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(frontRef.current, { scale: 3, backgroundColor: null, useCORS: true, logging: false });
      const a = document.createElement("a");
      a.download = `IDCard_${employeeId}.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (err) {
      showFlash("error", "Download failed: " + err.message);
    }
  }

  function printCard() {
    if (!frontRef.current || !backRef.current) return;
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>Print ID Card</title>
      <style>*{box-sizing:border-box;margin:0;padding:0;}body{display:flex;gap:20px;justify-content:center;padding:2rem;background:#fff;}@media print{body{padding:0;}@page{size:A4 landscape;margin:1cm;}}</style>
      </head><body>
      <div>${frontRef.current.outerHTML}</div>
      <div>${backRef.current.outerHTML}</div>
      <script>window.onload=()=>setTimeout(()=>window.print(),400);<\/script>
      </body></html>`);
    win.document.close();
  }

  function showFlash(type, text) {
    setFlash({ type, text });
    setTimeout(() => setFlash(null), 4000);
  }

  return (
   <div style={{ background: "#f8fafc", padding: "1.5rem", fontFamily: "'Segoe UI', sans-serif" }}>
      {/* Page title */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e293b", margin: 0 }}>ID Card Generator</h1>
        <p style={{ color: "#64748b", fontSize: "0.85rem", marginTop: "4px" }}>Create and manage employee identity cards</p>
      </div>

      {/* Flash */}
      {flash && (
        <div style={{
          padding: "0.75rem 1rem",
          borderRadius: "8px",
          marginBottom: "1rem",
          fontSize: "0.85rem",
          background: flash.type === "success" ? "#f0fdf4" : "#fef2f2",
          color:      flash.type === "success" ? "#15803d" : "#dc2626",
          border:     `1px solid ${flash.type === "success" ? "#bbf7d0" : "#fecaca"}`,
        }}>
          {flash.type === "success" ? "✓ " : "✗ "}{flash.text}
        </div>
      )}

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "1.5rem", alignItems: "start" }}>

        {/* ── LEFT: FORM ── */}
        <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem" }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "1.2rem", paddingBottom: "0.75rem", borderBottom: "1px solid #f1f5f9" }}>
            {editingId ? "✎ Editing Card" : "New Employee Card"}
          </h2>

          {/* Name */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Full Name *</label>
            <input style={inputStyle} type="text" placeholder="e.g. Rahul Sharma" value={name} onChange={e => setName(e.target.value)} />
          </div>

          {/* Designation */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Designation / Role</label>
            <input style={inputStyle} type="text" placeholder="e.g. Senior Designer" value={designation} onChange={e => setDesignation(e.target.value)} />
          </div>

          {/* Employee ID */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Employee ID (auto-generated)</label>
            <input style={{ ...inputStyle, background: "#f8fafc", color: "#94a3b8", cursor: "default" }} value={employeeId} readOnly />
          </div>

          {/* Mobile */}
          <div style={{ marginBottom: "1rem" }}>
            <label style={labelStyle}>Mobile Number (optional)</label>
            <input style={inputStyle} type="tel" placeholder="e.g. +91 98765 43210" value={mobile} onChange={e => setMobile(e.target.value)} />
          </div>

          {/* Photo */}
          <div style={{ marginBottom: "1.2rem" }}>
            <label style={labelStyle}>Employee Photo</label>
            <label style={{
              display: "block", border: "2px dashed #cbd5e1", borderRadius: "8px",
              padding: "1rem", cursor: "pointer", textAlign: "center", background: "#f8fafc",
            }}>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              {photo ? (
                <div>
                  <img src={photo} alt="preview" style={{ width: "72px", height: "72px", borderRadius: "8px", objectFit: "cover", border: "2px solid #e2e8f0", display: "block", margin: "0 auto 6px" }} />
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Click to change photo</p>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: "1.8rem", marginBottom: "4px" }}>📷</div>
                  <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Click to upload photo</p>
                  <p style={{ fontSize: "0.72rem", color: "#cbd5e1", marginTop: "2px" }}>JPG, PNG, WEBP</p>
                </div>
              )}
            </label>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleSave} disabled={saving}
              style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, fontSize: "0.9rem", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Saving…" : editingId ? "💾 Update Card" : "💾 Save Card"}
            </button>
            <button onClick={clearForm}
              style={{ padding: "0.7rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: 500, fontSize: "0.9rem", cursor: "pointer" }}>
              ✕
            </button>
          </div>
        </div>

        {/* ── RIGHT: PREVIEW ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <p style={{ fontSize: "0.78rem", color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase", alignSelf: "flex-start" }}>Card Preview</p>

          {/* Flip card */}
          <div style={{ perspective: "800px" }}>
            <div onClick={() => setFlipped(f => !f)} style={{
              width: "260px", height: "410px", position: "relative",
              transformStyle: "preserve-3d",
              transition: "transform 0.6s ease",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
              cursor: "pointer",
            }}>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
                <IDCardFront name={name} designation={designation} employeeId={employeeId} mobile={mobile} photo={photo} cardRef={frontRef} />
              </div>
              <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                <IDCardBack cardRef={backRef} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: "0.72rem", color: "#cbd5e1" }}>↻ Click card to flip</p>

          <button onClick={downloadFrontPNG}
            style={{ width: "260px", padding: "0.65rem", borderRadius: "8px", border: "none", background: "#1e293b", color: "#fff", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
            ⬇ Download PNG
          </button>
          <button onClick={printCard}
            style={{ width: "260px", padding: "0.65rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "#fff", color: "#475569", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>
            🖨 Print Both Sides
          </button>
        </div>
      </div>

      {/* ── SAVED CARDS ── */}
      <div style={{ background: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "1.5rem", marginTop: "1.5rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <h2 style={{ fontSize: "0.9rem", fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "1px" }}>
            Saved Cards {cards.length > 0 && <span style={{ background: "#eff6ff", color: "#3b82f6", borderRadius: "20px", padding: "1px 8px", fontSize: "0.75rem" }}>{cards.length}</span>}
          </h2>
          <button onClick={fetchCards} style={{ padding: "0.35rem 0.8rem", borderRadius: "6px", border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", fontSize: "0.8rem", cursor: "pointer" }}>
            ↻ Refresh
          </button>
        </div>

        {loading && <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Loading…</p>}

        {!loading && cards.length === 0 && (
          <div style={{ textAlign: "center", padding: "2rem 0", color: "#94a3b8" }}>
            <div style={{ fontSize: "2rem", marginBottom: "8px" }}>🪪</div>
            <p style={{ fontSize: "0.85rem" }}>No cards saved yet.</p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "10px" }}>
          {cards.map(card => (
            <div key={card._id} style={{
              display: "flex", alignItems: "center", gap: "12px",
              background: editingId === card._id ? "#eff6ff" : "#f8fafc",
              border: `1px solid ${editingId === card._id ? "#bfdbfe" : "#e2e8f0"}`,
              borderRadius: "8px", padding: "0.75rem",
            }}>
              {card.photo
                ? <img src={card.photo} alt={card.name} style={{ width: "48px", height: "48px", borderRadius: "6px", objectFit: "cover", border: "1px solid #e2e8f0", flexShrink: 0 }} />
                : <div style={{ width: "48px", height: "48px", borderRadius: "6px", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.3rem" }}>👤</div>
              }
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#1e293b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{card.name}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748b", margin: "2px 0 0" }}>{card.designation || "—"}</p>
                <p style={{ fontSize: "0.72rem", color: "#94a3b8", margin: "1px 0 0", fontFamily: "monospace" }}>{card.employeeId}</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "5px", flexShrink: 0 }}>
                <button onClick={() => loadCard(card)}
                  style={{ padding: "0.28rem 0.65rem", borderRadius: "5px", border: "1px solid #e2e8f0", background: "#fff", color: "#3b82f6", fontSize: "0.75rem", cursor: "pointer", fontWeight: 500 }}>
                  Edit
                </button>
                <button onClick={() => handleDelete(card._id)}
                  style={{ padding: "0.28rem 0.65rem", borderRadius: "5px", border: "1px solid #fecaca", background: "#fff", color: "#ef4444", fontSize: "0.75rem", cursor: "pointer", fontWeight: 500 }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#475569",
  textTransform: "uppercase",
  letterSpacing: "0.8px",
  marginBottom: "5px",
};

const inputStyle = {
  width: "100%",
  background: "#fff",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  padding: "0.6rem 0.8rem",
  color: "#1e293b",
  fontFamily: "'Segoe UI', sans-serif",
  fontSize: "0.9rem",
  outline: "none",
};
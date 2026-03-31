'use client';
import { useEffect, useRef, useState } from "react";

const PILLARS = [
  {
    icon: "✦",
    label: "Background Verified",
    desc: "Every staff member is police-verified before deployment.",
    tag: "Trust",
    gradient: "linear-gradient(135deg, #1A5C4E 0%, #0D2E26 100%)",
    accentLine: "#2ECC8F",
  },
  {
    icon: "⚡",
    label: "48-Hour Deployment",
    desc: "Trained staff placed within 24–48 hours of request.",
    tag: "Speed",
    gradient: "linear-gradient(135deg, #1B2F4B 0%, #0D1820 100%)",
    accentLine: "#4EA8DE",
  },
  {
    icon: "↻",
    label: "Free Replacement",
    desc: "If standards aren't met, we replace at no extra cost.",
    tag: "Guarantee",
    gradient: "linear-gradient(135deg, #3D1F6B 0%, #1A0D30 100%)",
    accentLine: "#A78BFA",
  },
  {
    icon: "◎",
    label: "24/7 Supervision",
    desc: "Dedicated supervisors available around the clock.",
    tag: "Support",
    gradient: "linear-gradient(135deg, #6B2D00 0%, #2E1200 100%)",
    accentLine: "#FB923C",
  },
];

/* ─── useInView HOOK ─────────────────────────────────────── */
function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── HERO SECTION ───────────────────────────────────────── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), 80); return () => clearTimeout(t); }, []);

  return (
    <section style={{
      position: "relative", minHeight: "100vh", display: "flex",
      alignItems: "center", overflow: "hidden", background: "#080C0A",
    }}>
      <div style={{ position: "absolute", inset: "-2%" }}>
        {/* ✅ LOCAL HERO IMAGE — servicehero.png must be in /public folder */}
        <img
          src="/servicehero.png"
          alt=""
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            opacity: mounted ? 0.22 : 0,
            transition: "opacity 1.4s ease",
          }}
        />
      </div>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,12,10,0.98) 0%, rgba(8,12,10,0.75) 45%, rgba(8,12,10,0.4) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.025) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "3px",
        background: "linear-gradient(to bottom, transparent, #E8830A 30%, #E8830A 70%, transparent)",
        opacity: mounted ? 1 : 0, transition: "opacity 1s ease 0.5s",
      }} />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto", padding: "8rem 2.5rem 5rem", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem",
              opacity: mounted ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
            }}>
              <span style={{ display: "block", width: "28px", height: "2px", background: "#E8830A" }} />
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.68rem",
                letterSpacing: "0.28em", textTransform: "uppercase", color: "#E8830A", fontWeight: 700,
              }}>Professional Staffing Solutions</span>
            </div>

            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, color: "#fff",
              fontSize: "clamp(3rem, 7vw, 6.5rem)", lineHeight: 0.92, letterSpacing: "-0.03em",
              marginBottom: "1.5rem",
              opacity: mounted ? 1 : 0, transition: "opacity 0.9s ease 0.3s",
            }}>
              What<br />
              <span style={{ color: "#E8830A", fontStyle: "italic" }}>We Do.</span>
            </h1>

            <div style={{ width: "60px", height: "1px", background: "rgba(255,255,255,0.18)", marginBottom: "1.5rem", opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.5s" }} />

            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: "0.95rem", lineHeight: 1.85,
              color: "rgba(255,255,255,0.42)", maxWidth: "380px",
              opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.55s",
            }}>
              Seven core services. Background-verified, trained professionals — deployed to offices, homes, hotels and beyond.
            </p>

            <div style={{ display: "flex", gap: "0.85rem", marginTop: "2.25rem", opacity: mounted ? 1 : 0, transition: "opacity 0.8s ease 0.7s" }}>
              <button
                onClick={() => window.location.href = '/contact'}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: "0.74rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#111", background: "#E8830A",
                  padding: "0.85rem 2rem", borderRadius: "8px", border: "none", cursor: "pointer",
                }}>
                Hire Staff →
              </button>
              <button
                onClick={() => window.location.href = '/contact'}
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
                  fontSize: "0.74rem", letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#fff", background: "transparent",
                  padding: "0.85rem 2rem", borderRadius: "8px", border: "1.5px solid rgba(255,255,255,0.2)", cursor: "pointer",
                }}>
                Apply for Job
              </button>
            </div>
          </div>

          <div style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.9s ease 0.5s" }}>
            <div style={{ marginBottom: "1rem" }}>
              <span style={{
                fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.63rem",
                letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700,
              }}>— Why Choose Us</span>
            </div>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: "clamp(1.6rem, 3vw, 2.4rem)", color: "#fff",
              lineHeight: 1.1, marginBottom: "1.75rem",
            }}>
              Everything Your Business<br />
              <span style={{ color: "#E8830A", fontStyle: "italic" }}>Needs to Win</span>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {PILLARS.map((p, i) => (
                <div key={i} style={{
                  background: p.gradient,
                  borderRadius: "12px", padding: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.06)",
                  position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: p.accentLine, opacity: 0.8 }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", color: p.accentLine }}>{p.icon}</span>
                    <span style={{
                      fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.55rem",
                      letterSpacing: "0.18em", textTransform: "uppercase",
                      color: p.accentLine, fontWeight: 700,
                      background: "rgba(255,255,255,0.07)", padding: "0.2rem 0.55rem", borderRadius: "50px",
                    }}>{p.tag}</span>
                  </div>
                  <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.35rem" }}>{p.label}</h4>
                  <p style={{ fontFamily: "'Barlow', sans-serif", fontSize: "0.72rem", lineHeight: 1.65, color: "rgba(255,255,255,0.45)" }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── SERVICE CARD ───────────────────────────────────────── */
function ServiceCard({ svc, index }) {
  const [ref, vis] = useInView(0.08);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onClick={() => window.location.href = '/contact'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "none" : "translateY(30px)",
        transition: `opacity 0.5s ease ${index * 0.08}s, transform 0.5s ease ${index * 0.08}s`,
        cursor: "pointer",
      }}
    >
      <div style={{
        borderRadius: "14px", overflow: "hidden",
        border: `1px solid ${svc.accent || '#E8830A'}30`,
        background: "#FFF3E8",
        boxShadow: hovered
          ? `0 20px 48px rgba(232,131,10,0.2), 0 0 0 1px ${svc.accent || '#E8830A'}40`
          : "0 4px 20px rgba(232,131,10,0.1)",
        transform: hovered ? "translateY(-5px)" : "none",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}>
        {/* Image */}
        <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#F5D5A8" }}>
          {svc.photo && (
            <img
              src={svc.photo}
              alt={svc.title}
              loading="lazy"
              style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
                transform: hovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.5s ease",
              }}
            />
          )}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(255,243,232,0.8) 0%, rgba(255,243,232,0.05) 50%, transparent 100%)",
          }} />
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
            background: svc.accent || "#E8830A",
          }} />
          {svc.tag && (
            <div style={{
              position: "absolute", top: "0.8rem", left: "0.8rem",
              background: "rgba(255,243,232,0.92)", backdropFilter: "blur(8px)",
              color: svc.accent || "#E8830A",
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
              fontSize: "0.62rem", letterSpacing: "0.14em",
              padding: "0.22rem 0.65rem", borderRadius: "50px",
              border: `1px solid ${svc.accent || '#E8830A'}50`,
            }}>{svc.tag}</div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "1.1rem 1.2rem 1.2rem", background: "#FFF3E8" }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 700,
            color: "#2a1500", lineHeight: 1.2, marginBottom: "0.4rem",
          }}>{svc.title}</h3>

          {svc.tagline && (
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: "0.73rem",
              color: "rgba(60,30,0,0.65)", fontStyle: "italic", marginBottom: "0.3rem",
            }}>{svc.tagline}</p>
          )}

          <p style={{
            fontFamily: "'Barlow', sans-serif", fontSize: "0.73rem",
            color: "rgba(60,30,0,0.55)", lineHeight: 1.65, margin: 0,
          }}>{svc.desc}</p>

          {svc.stat && (
            <div style={{ display: "flex", gap: "0.8rem", alignItems: "center", marginTop: "0.6rem" }}>
              <span style={{ color: svc.accent || "#E8830A", fontWeight: 800, fontSize: "1.1rem" }}>{svc.stat}</span>
              <span style={{ color: "rgba(60,30,0,0.45)", fontSize: "0.72rem" }}>{svc.statLabel}</span>
            </div>
          )}

          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            paddingTop: "0.9rem", marginTop: "0.9rem",
            borderTop: `1px solid ${svc.accent || '#E8830A'}25`,
          }}>
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.65rem",
              letterSpacing: "0.16em", textTransform: "uppercase",
              color: svc.accent || "#E8830A", fontWeight: 700,
            }}>Enquire Now</span>
            <span style={{ color: svc.accent || "#E8830A", fontSize: "1rem" }}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SKELETON CARD (loading state) ─────────────────────── */
function SkeletonCard() {
  return (
    <div style={{ borderRadius: "14px", overflow: "hidden", border: "1px solid #E8830A20", background: "#FFF3E8" }}>
      <div style={{ height: "200px", background: "linear-gradient(90deg, #F5D5A8 25%, #FDEBD0 50%, #F5D5A8 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
      <div style={{ padding: "1.1rem 1.2rem" }}>
        <div style={{ height: "22px", width: "60%", background: "#F5D5A8", borderRadius: "6px", marginBottom: "10px" }} />
        <div style={{ height: "14px", width: "90%", background: "#F5D5A8", borderRadius: "6px", marginBottom: "6px" }} />
        <div style={{ height: "14px", width: "70%", background: "#F5D5A8", borderRadius: "6px" }} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ 2 NEW STATIC SERVICES — Customer Support Executive & Customer Associate
// These are hardcoded (not from DB). They use real Pexels photos.
// ─────────────────────────────────────────────────────────────────────────────
const EXTRA_SERVICES = [
  {
    _id: "extra-customer-support",
    title: "Customer Support Executive",
    tagline: "Your first line of customer delight",
    desc: "Professionally trained support executives who handle inbound queries, complaints, and escalations with empathy and speed — in-person or remote.",
    tag: "NEW",
    accent: "#E8830A",
    
    statLabel: "Customer Satisfaction Rate",
    // Realistic Pexels photo — smiling call center agent with headset (Yan Krukau)
    photo: "https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    _id: "extra-customer-associate",
    title: "Customer Associate",
    tagline: "Face-to-face excellence, every interaction",
    desc: "Courteous, well-groomed customer associates placed at retail counters, reception desks, and service points to create a lasting impression for your brand.",
    tag: "NEW",
    accent: "#C0700A",
    
    statLabel: "Associates Deployed",
    // Realistic Pexels photo — call center agents with laptops & headsets (Mikhail Nilov)
    photo: "https://images.pexels.com/photos/7682087/pexels-photo-7682087.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

/* ─── SERVICES SECTION ───────────────────────────────────── */
function ServicesSection() {
  const [headerRef, headerVis] = useInView(0.2);
  const [extraRef, extraVis]   = useInView(0.1);

  const [services, setServices] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Services fetch error:', err);
        setError('Could not load services.');
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  return (
    <section style={{ background: "#F5E9D8", padding: "clamp(3.5rem, 7vw, 7rem) clamp(1.25rem, 4vw, 2.5rem)" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        /* ── Responsive grid breakpoints ── */
        @media (max-width: 480px) {
          .svc-grid-3    { grid-template-columns: 1fr !important; }
          .svc-grid-2    { grid-template-columns: 1fr !important; }
          .svc-extra-row { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 481px) and (max-width: 768px) {
          .svc-grid-3    { grid-template-columns: repeat(2, 1fr) !important; }
          .svc-extra-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Section Header */}
        <div ref={headerRef} style={{ marginBottom: "clamp(2rem, 4vw, 3.5rem)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.85rem",
            opacity: headerVis ? 1 : 0, transition: "opacity 0.6s ease",
          }}>
            <span style={{ width: "28px", height: "2px", background: "#E8830A", display: "block" }} />
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.68rem",
              letterSpacing: "0.28em", textTransform: "uppercase", color: "#E8830A", fontWeight: 700,
            }}>What We Offer</span>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "#1a1a1a",
              letterSpacing: "-0.025em", lineHeight: 1.05,
              opacity: headerVis ? 1 : 0, transition: "opacity 0.7s ease 0.1s",
            }}>
              Our Core <span style={{ color: "#E8830A", fontStyle: "italic" }}>Services</span>
            </h2>
            <p style={{
              fontFamily: "'Barlow', sans-serif", fontSize: "0.84rem", lineHeight: 1.8,
              color: "rgba(0,0,0,0.5)", maxWidth: "320px",
              opacity: headerVis ? 1 : 0, transition: "opacity 0.7s ease 0.2s",
            }}>
              Every team member is trained, uniformed and background-verified before deployment.
            </p>
          </div>
        </div>

        {/* ── Loading State ── */}
        {loading && (
          <div>
            <div className="svc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {[1,2,3].map(i => <SkeletonCard key={i} />)}
            </div>
            <div className="svc-grid-2" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginTop: "1rem" }}>
              {[4,5].map(i => <SkeletonCard key={i} />)}
            </div>
          </div>
        )}

        {/* ── Error State ── */}
        {!loading && error && (
          <div style={{
            textAlign: "center", padding: "4rem 2rem",
            background: "#FFF3E8", borderRadius: "14px", border: "1px solid #E8830A30",
          }}>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>⚠️</p>
            <p style={{ fontFamily: "'Barlow', sans-serif", color: "rgba(60,30,0,0.6)", fontSize: "0.9rem" }}>{error}</p>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && services.length === 0 && (
          <div style={{
            textAlign: "center", padding: "4rem 2rem",
            background: "#FFF3E8", borderRadius: "14px", border: "1px solid #E8830A30",
          }}>
            <p style={{ fontSize: "2rem", marginBottom: "1rem" }}>📭</p>
            <p style={{ fontFamily: "'Barlow', sans-serif", color: "rgba(60,30,0,0.6)", fontSize: "0.9rem" }}>
              No services available yet. Check back soon!
            </p>
          </div>
        )}

        {/* ── DB Services Grid ── */}
        {!loading && !error && services.length > 0 && (
          <>
            <div className="svc-grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
              {services.slice(0, 3).map((svc, i) => (
                <ServiceCard key={svc._id} svc={svc} index={i} />
              ))}
            </div>
            {services.length > 3 && (
              <div
                className="svc-grid-2"
                style={{
                  display: "grid",
                  gridTemplateColumns: services.length === 4 ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
                  gap: "1rem", marginTop: "1rem",
                }}>
                {services.slice(3).map((svc, i) => (
                  <ServiceCard key={svc._id} svc={svc} index={i + 3} />
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            ✅ NEW SECTION: Customer Support Executive + Customer Associate
            Hardcoded below the DB grid with a styled divider
        ══════════════════════════════════════════════════════════════════ */}
        <div ref={extraRef} style={{ marginTop: "clamp(2.5rem, 5vw, 4.5rem)" }}>

          {/* Divider with label */}
          <div style={{
            display: "flex", alignItems: "center", gap: "1rem",
            marginBottom: "2rem",
            opacity: extraVis ? 1 : 0, transition: "opacity 0.6s ease",
          }}>
            <span style={{ flex: 1, height: "1px", background: "rgba(232,131,10,0.25)" }} />
            <span style={{
              fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.65rem",
              letterSpacing: "0.26em", textTransform: "uppercase",
              color: "#E8830A", fontWeight: 700,
              background: "#F5E9D8", padding: "0.35rem 1.1rem", borderRadius: "50px",
              border: "1px solid #E8830A40",
              whiteSpace: "nowrap",
            }}>Customer Excellence Services</span>
            <span style={{ flex: 1, height: "1px", background: "rgba(232,131,10,0.25)" }} />
          </div>

          {/* 2-column responsive grid */}
          <div
            className="svc-extra-row"
            style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}
          >
            {EXTRA_SERVICES.map((svc, i) => (
              <ServiceCard key={svc._id} svc={svc} index={i} />
            ))}
          </div>
        </div>
        {/* ══════════════════════════════════════════════════════════════════ */}

      </div>
    </section>
  );
}

/* ─── CTA / HIRING BANNER ────────────────────────────────── */
function CtaBanner() {
  const [ref, vis] = useInView(0.1);
  const [hov, setHov] = useState(false);

  return (
    <section style={{ position: "relative", overflow: "hidden", minHeight: "360px", display: "flex", alignItems: "center" }}>
      <img
        src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1400"
        alt="Team"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(8,12,10,0.97) 0%, rgba(8,12,10,0.75) 55%, rgba(8,12,10,0.25) 100%)" }} />

      <div ref={ref} style={{
        position: "relative", zIndex: 2, maxWidth: "1200px", margin: "0 auto",
        padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 2.5rem)", width: "100%",
        opacity: vis ? 1 : 0, transition: "opacity 0.65s ease",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "1rem" }}>
          <span style={{ width: "24px", height: "2px", background: "#E8830A" }} />
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "0.68rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "#E8830A", fontWeight: 700 }}>Join Our Team</span>
        </div>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 4vw, 3.2rem)",
          fontWeight: 700, color: "#fff", lineHeight: 1.1, marginBottom: "0.85rem",
        }}>
          Looking for <span style={{ color: "#E8830A", fontStyle: "italic" }}>a Job?</span>
        </h2>
        <p style={{
          fontFamily: "'Barlow', sans-serif", fontSize: "0.88rem",
          lineHeight: 1.8, color: "rgba(255,255,255,0.42)", maxWidth: "360px", marginBottom: "2rem",
        }}>
          Skilled in security, cleaning, driving, customer support or customer service? We'll match you with the right employer.
        </p>
        <button
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          onClick={() => window.location.href = '/contact'}
          style={{
            fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800,
            fontSize: "0.78rem", letterSpacing: "0.18em", textTransform: "uppercase",
            color: hov ? "#111" : "#fff", background: hov ? "#E8830A" : "transparent",
            border: "2px solid #E8830A", padding: "0.9rem 2.25rem", borderRadius: "8px",
            cursor: "pointer", transition: "background 0.25s ease, color 0.25s ease",
          }}>
          Apply for a Job Now →
        </button>
      </div>
    </section>
  );
}

/* ─── ROOT PAGE ──────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #080C0A; }
      `}</style>
      <Hero />
      <ServicesSection />
      <CtaBanner />
    </>
  );
}
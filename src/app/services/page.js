'use client';
import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ─── SERVICE DATA (fallback if API fails) ───────────────── */
const FALLBACK_SERVICES = [
  {
    sid: "01",
    title: "Security Services",
    tagline: "Guarding What Matters Most",
    accent: "#1B4332",
    accentLight: "#6EE7B7",
    tag: "Security",
    photo: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=800&q=85&fit=crop&crop=faces,center",
    stat: "500+", statLabel: "Sites Secured",
    desc: "Trained, uniformed security personnel for offices, malls, hospitals & complexes. Background-verified, emergency-response ready.",
    features: ["Day & Night Shifts","Armed & Unarmed Guards","Background Verified","CCTV Monitoring","Emergency Response","24/7 Supervisor"],
  },
  {
    sid: "02",
    title: "Cleaning Services",
    tagline: "Spotless Spaces, Every Time",
    accent: "#7B1D2E",
    accentLight: "#FCA5A5",
    tag: "Cleaning",
    photo: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&q=85&fit=crop&crop=faces,center",
    stat: "10K+", statLabel: "Spaces Cleaned",
    desc: "Professional cleaning teams for offices, hospitals and retail. Deep cleaning, daily hygiene, eco-friendly — all covered.",
    features: ["Daily/Weekly/Monthly","Industrial Cleaning","Deep Sanitization","Eco-Friendly Products","Uniformed Staff","Flexible Scheduling"],
  },
  {
    sid: "03",
    title: "Housekeeping",
    tagline: "Comfort Through Cleanliness",
    accent: "#004C45",
    accentLight: "#6EE7B7",
    tag: "Housekeeping",
    photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85&fit=crop&crop=center",
    stat: "200+", statLabel: "Happy Clients",
    desc: "Hospitality-trained staff for hotels, guesthouses and homes. Consistent, hotel-grade cleanliness every single day.",
    features: ["Hotel-Grade Standards","Room Management","Linen & Laundry","Guest Services","Home Cooking","Child & Elder Care"],
  },
  {
    sid: "04",
    title: "Packers & Movers",
    tagline: "Safe Moves, Stress-Free",
    accent: "#5C3317",
    accentLight: "#FCD34D",
    tag: "Moving",
    photo: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&q=85&fit=crop&crop=center",
    stat: "50K+", statLabel: "Items Moved",
    desc: "Experienced packers for homes, offices and industrial cargo. Fragile items handled with precision and care.",
    features: ["Residential & Commercial","Fragile Specialists","Same-Day Available","Materials Provided","Loading & Unloading","Pan-India Reach"],
  },
  {
    sid: "05",
    title: "Driver Services",
    tagline: "Reliable Wheels, On Demand",
    accent: "#1E3A5F",
    accentLight: "#93C5FD",
    tag: "Driving",
    photo: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=85&fit=crop&crop=center",
    stat: "300+", statLabel: "Expert Drivers",
    desc: "Police-verified, licensed professional drivers for personal vehicles, corporate fleets and long-distance travel.",
    features: ["Personal & Corporate","Police-Verified","Valid License","Long-Distance","Night Duty","Fleet Management"],
  },
];

/* ─── useInView ──────────────────────────────────────────── */
function useInView(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─── HERO ───────────────────────────────────────────────── */
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 60); return () => clearTimeout(t); }, []);
  return (
    <section style={{ position:"relative", minHeight:"100vh", display:"flex", alignItems:"center", overflow:"hidden", background:"#070D0B" }}>
      <img
        src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1800&q=80&fit=crop"
        alt=""
        style={{
          position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover",
          transform: loaded ? "scale(1.0)" : "scale(1.08)",
          transition: "transform 2s cubic-bezier(.22,1,.36,1)",
          opacity: 0.35,
        }}
      />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(7,13,11,0.97) 0%,rgba(7,13,11,0.75) 50%,rgba(7,13,11,0.4) 100%)" }} />
      <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize:"28px 28px", pointerEvents:"none" }} />
      <div style={{ position:"relative", zIndex:2, maxWidth:"1200px", margin:"0 auto", padding:"9rem 2rem 5rem", width:"100%" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"1.5rem",
          opacity: loaded?1:0, transform: loaded?"none":"translateY(16px)",
          transition:"opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s" }}>
          <span style={{ width:"28px", height:"2px", background:"#FF9700", display:"block" }} />
          <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"0.72rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#FF9700", fontWeight:700 }}>Professional Services</span>
        </div>
        <h1 style={{
          fontFamily:"'Playfair Display',serif", fontWeight:900, color:"#fff",
          fontSize:"clamp(3rem,8vw,7rem)", lineHeight:0.95, letterSpacing:"-0.03em",
          opacity: loaded?1:0, transform: loaded?"none":"translateY(30px)",
          transition:"opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s",
        }}>
          What<br /><span style={{ color:"#FF9700", fontStyle:"italic" }}>We Do</span>
        </h1>
        <p style={{
          fontFamily:"'Barlow',sans-serif", fontSize:"clamp(0.9rem,2vw,1.05rem)", lineHeight:1.8,
          color:"rgba(255,255,255,0.5)", maxWidth:"440px", marginTop:"1.5rem",
          opacity: loaded?1:0, transform: loaded?"none":"translateY(24px)",
          transition:"opacity 0.75s ease 0.35s, transform 0.75s ease 0.35s",
        }}>
          Five specialised services. Trained, background-verified professionals — placed exactly where you need them.
        </p>
      </div>
      <style>{`@keyframes scrollLine { 0%{height:0;top:0} 50%{height:100%;top:0} 100%{height:0;top:100%} }`}</style>
    </section>
  );
}

/* ─── SERVICE CARD ───────────────────────────────────────── */
function ServiceCard({ svc, delay = 0, isMobile }) {
  const [ref, vis] = useInView(0.08);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const showBack = isMobile ? expanded : hovered;

  return (
    <div ref={ref} style={{
      opacity: vis?1:0, transform: vis?"translateY(0)":"translateY(40px)",
      transition:`opacity 0.6s cubic-bezier(.22,1,.36,1) ${delay}s, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}s`,
    }}>
      {isMobile ? (
        <div style={{ borderRadius:"16px", overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)", background:"#111a17" }}>
          <div onClick={() => setExpanded(e => !e)}
            style={{ display:"flex", alignItems:"center", gap:"1rem", padding:"1.1rem 1.25rem", cursor:"pointer",
              background: expanded ? svc.accent : "transparent", transition:"background 0.3s ease" }}>
            <div style={{ width:"56px", height:"56px", borderRadius:"10px", overflow:"hidden", flexShrink:0 }}>
              <img src={svc.photo} alt={svc.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"0.6rem", letterSpacing:"0.16em",
                textTransform:"uppercase", color: expanded ? "rgba(255,255,255,0.6)" : "#FF9700", fontWeight:700, marginBottom:"0.2rem" }}>
                {svc.tag} · {svc.sid || svc.id}
              </div>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:900, color:"#fff", lineHeight:1.2, margin:0 }}>{svc.title}</h3>
              <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginTop:"0.25rem" }}>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"1rem", color:"#FF9700" }}>{svc.stat}</span>
                <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", textTransform:"uppercase" }}>{svc.statLabel}</span>
              </div>
            </div>
            <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:"rgba(255,255,255,0.08)",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              transform: expanded ? "rotate(180deg)" : "none", transition:"transform 0.3s ease" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          </div>
          <div style={{ maxHeight: expanded ? "600px" : "0", overflow:"hidden", transition:"max-height 0.45s cubic-bezier(.22,1,.36,1)" }}>
            <div style={{ padding:"1.25rem", background: svc.accent, borderTop:"1px solid rgba(255,255,255,0.1)" }}>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.85rem", lineHeight:1.75, color:"rgba(255,255,255,0.7)", marginBottom:"1.25rem" }}>{svc.desc}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.45rem", marginBottom:"1.25rem" }}>
                {(svc.features||[]).map((f, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.4rem", background:"rgba(255,255,255,0.1)", borderRadius:"7px", padding:"0.45rem 0.65rem" }}>
                    <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#FF9700", flexShrink:0 }} />
                    <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.72rem", fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{f}</span>
                  </div>
                ))}
              </div>
              <Link href="/contact" style={{ textDecoration:"none" }} onClick={e => e.stopPropagation()}>
                <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                  background:"#FF9700", color:"#181818", fontFamily:"'Barlow Condensed',sans-serif",
                  fontWeight:800, fontSize:"0.78rem", letterSpacing:"0.14em", textTransform:"uppercase",
                  padding:"0.85rem 1rem", borderRadius:"8px" }}>
                  Enquire About This Service →
                </span>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ perspective:"1200px", height:"460px", cursor:"pointer" }}
          onClick={() => setHovered(h => !h)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          <div style={{
            position:"relative", width:"100%", height:"100%", transformStyle:"preserve-3d",
            transform: showBack ? "rotateY(180deg)" : "rotateY(0deg)",
            transition:"transform 0.65s cubic-bezier(.22,1,.36,1)",
          }}>
            {/* FRONT */}
            <div style={{ position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden", borderRadius:"16px", overflow:"hidden" }}>
              <img src={svc.photo} alt={svc.title} style={{ width:"100%", height:"100%", objectFit:"cover", display:"block" }} />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.05) 100%)" }} />
              <div style={{ position:"absolute", top:"1.1rem", left:"1.1rem", background: svc.accent, color:"#fff",
                fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"0.7rem", letterSpacing:"0.14em",
                textTransform:"uppercase", padding:"0.35rem 0.85rem", borderRadius:"50px" }}>{svc.tag}</div>
              <div style={{ position:"absolute", bottom:0, left:0, right:0, padding:"1.75rem 1.5rem" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.55rem", fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:"0.75rem" }}>{svc.title}</h3>
                <div style={{ display:"flex", alignItems:"center", gap:"0.75rem" }}>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:"1.6rem", color:"#FF9700" }}>{svc.stat}</span>
                  <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.45)" }}>{svc.statLabel}</span>
                </div>
                <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.7rem", color:"rgba(255,255,255,0.35)", marginTop:"0.75rem" }}>Hover to see details →</p>
              </div>
            </div>
            {/* BACK */}
            <div style={{
              position:"absolute", inset:0, backfaceVisibility:"hidden", WebkitBackfaceVisibility:"hidden",
              transform:"rotateY(180deg)", borderRadius:"16px", overflow:"hidden",
              background: svc.accent, display:"flex", flexDirection:"column", padding:"2rem",
            }}>
              <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", height:"100%" }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.4rem", fontWeight:900, color:"#fff", marginBottom:"0.5rem" }}>{svc.title}</h3>
                <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.82rem", lineHeight:1.7, color:"rgba(255,255,255,0.6)", marginBottom:"1rem" }}>{svc.desc}</p>
                <div style={{ height:"1px", background:"rgba(255,255,255,0.12)", marginBottom:"1rem" }} />
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.45rem", flexGrow:1 }}>
                  {(svc.features||[]).map((f, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:"0.45rem", background:"rgba(255,255,255,0.08)", borderRadius:"7px", padding:"0.45rem 0.7rem" }}>
                      <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:"#FF9700", flexShrink:0 }} />
                      <span style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.75rem", fontWeight:600, color:"rgba(255,255,255,0.85)" }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" style={{ textDecoration:"none", marginTop:"1.25rem" }} onClick={e => e.stopPropagation()}>
                  <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.5rem",
                    background:"#FF9700", color:"#181818", fontFamily:"'Barlow Condensed',sans-serif",
                    fontWeight:800, fontSize:"0.78rem", letterSpacing:"0.15em", textTransform:"uppercase",
                    padding:"0.8rem 1rem", borderRadius:"8px" }}>
                    Enquire About This Service →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── CARDS SECTION ──────────────────────────────────────── */
function CardsSection({ services }) {
  const [titleRef, titleVis] = useInView(0.2);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ background:"#0E1512", padding:"clamp(3rem,6vw,6rem) clamp(1rem,4vw,2rem)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", flexWrap:"wrap", gap:"1rem", marginBottom:"clamp(2rem,4vw,3.5rem)" }}>
          <div ref={titleRef}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.6rem",
              opacity:titleVis?1:0, transform:titleVis?"none":"translateY(14px)", transition:"opacity 0.55s ease, transform 0.55s ease" }}>
              <span style={{ width:"22px", height:"2px", background:"#FF9700" }} />
              <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:"0.7rem", letterSpacing:"0.22em", textTransform:"uppercase", color:"#FF9700", fontWeight:700 }}>All Services</span>
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,3.5vw,3rem)", fontWeight:900,
              color:"#fff", letterSpacing:"-0.02em", lineHeight:1.1,
              opacity:titleVis?1:0, transform:titleVis?"none":"translateY(18px)",
              transition:"opacity 0.65s ease 0.08s, transform 0.65s ease 0.08s" }}>
              Our Five<br /><span style={{ color:"#FF9700", fontStyle:"italic" }}>Core Services</span>
            </h2>
          </div>
        </div>
        {isMobile ? (
          <div style={{ display:"flex", flexDirection:"column", gap:"0.85rem" }}>
            {services.map((svc, i) => <ServiceCard key={svc._id||svc.sid} svc={svc} delay={i * 0.07} isMobile={true} />)}
          </div>
        ) : (
          <>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"1.25rem" }}>
              {services.slice(0,3).map((svc,i) => <ServiceCard key={svc._id||svc.sid} svc={svc} delay={i*0.1} isMobile={false} />)}
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"1.25rem", marginTop:"1.25rem" }}>
              {services.slice(3).map((svc,i) => <ServiceCard key={svc._id||svc.sid} svc={svc} delay={i*0.1+0.2} isMobile={false} />)}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/* ─── WHY US ─────────────────────────────────────────────── */
function WhyUs() {
  const [ref, vis] = useInView(0.1);
  const items = [
    { icon:"🔍", t:"Background Verified", d:"Every staff member is police-verified before deployment." },
    { icon:"⚡", t:"Fast Deployment", d:"Trained staff placed within 24–48 hours of request." },
    { icon:"🔄", t:"Free Replacement", d:"If a staff member doesn't meet standards, we replace free." },
    { icon:"📞", t:"24/7 Support", d:"Our supervisors are available around the clock." },
  ];
  return (
    <section style={{ background:"#F3F4EC", padding:"clamp(3rem,6vw,5.5rem) clamp(1rem,4vw,2rem)" }}>
      <div style={{ maxWidth:"1200px", margin:"0 auto" }}>
        <div ref={ref} style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(200px, 1fr))", gap:"clamp(1.5rem,3vw,2rem)" }}>
          {items.map((it,i) => (
            <div key={i} style={{ opacity: vis?1:0, transform: vis?"none":"translateY(28px)", transition:`opacity 0.6s ease ${i*0.12}s, transform 0.6s ease ${i*0.12}s` }}>
              <div style={{ fontSize:"2rem", marginBottom:"0.85rem" }}>{it.icon}</div>
              <h4 style={{ fontFamily:"'Playfair Display',serif", fontSize:"1.1rem", fontWeight:700, color:"#181818", marginBottom:"0.45rem" }}>{it.t}</h4>
              <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"0.83rem", lineHeight:1.72, color:"#777" }}>{it.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HIRING ─────────────────────────────────────────────── */
function Hiring() {
  const [ref, vis] = useInView(0.1);
  const [hov, setHov] = useState(false);
  return (
    <section style={{ position:"relative", overflow:"hidden", minHeight:"420px", display:"flex", alignItems:"center" }}>
      <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1600&q=80&fit=crop" alt="Team"
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover" }} />
      <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg,rgba(7,13,11,0.95) 0%,rgba(7,13,11,0.7) 55%,rgba(7,13,11,0.2) 100%)" }} />
      <div ref={ref} style={{ position:"relative", zIndex:2, maxWidth:"1200px", margin:"0 auto",
        padding:"clamp(3rem,6vw,5rem) clamp(1rem,4vw,2rem)", width:"100%",
        opacity:vis?1:0, transform:vis?"none":"translateY(28px)", transition:"opacity 0.8s ease, transform 0.8s ease" }}>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(1.8rem,4vw,3.2rem)", fontWeight:900,
          color:"#fff", lineHeight:1.1, letterSpacing:"-0.02em", marginBottom:"0.85rem" }}>
          Looking for <span style={{ color:"#FF9700", fontStyle:"italic" }}>a Job?</span>
        </h2>
        <p style={{ fontFamily:"'Barlow',sans-serif", fontSize:"clamp(0.85rem,2vw,0.93rem)", lineHeight:1.78,
          color:"rgba(255,255,255,0.5)", maxWidth:"400px", marginBottom:"2rem" }}>
          Skilled in security, cleaning, driving or logistics? Upload your resume — we'll match you with the right employer.
        </p>
        <Link href="/contact" style={{ textDecoration:"none" }}>
          <span onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ display:"inline-flex", alignItems:"center", gap:"0.65rem",
              fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800,
              fontSize:"clamp(0.75rem,2vw,0.82rem)", letterSpacing:"0.16em", textTransform:"uppercase",
              color: hov?"#181818":"#fff", background: hov?"#FF9700":"transparent",
              border:"2px solid #FF9700", padding:"0.95rem 2rem", borderRadius:"8px", cursor:"pointer",
              transition:"background 0.28s ease, color 0.28s ease" }}>
            Apply for a Job Now →
          </span>
        </Link>
      </div>
    </section>
  );
}

/* ─── MAIN PAGE ──────────────────────────────────────────── */
export default function ServicesPage() {
  const [services, setServices] = useState(FALLBACK_SERVICES);

  useEffect(() => {
    fetch('/api/admin/services')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {
        // keep fallback if API fails
      });
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700;800&display=swap');
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
      `}</style>
      <Hero />
      <CardsSection services={services} />
      <WhyUs />
      <Hiring />
    </>
  );
}
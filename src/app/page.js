'use client';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/* ── animated counter hook ── */
function useCounter(target, duration = 2200) {
  const [val, setVal] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!go) return;
    let start;
    const raf = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [go, target, duration]);
  return [val, ref];
}

function StatNum({ target, suffix }) {
  const [val, ref] = useCounter(target);
  return <span ref={ref}>{val}{suffix}</span>;
}

/* ── DATA ── */
const stats = [
  { icon: '👷', target: 500,  suffix: '+', label: 'Workers Placed'    },
  { icon: '🏢', target: 60,   suffix: '+', label: 'Companies Served'  },
  { icon: '🌆', target: 10,   suffix: '+', label: 'Cities Covered'    },
  { icon: '📅', target: 5,    suffix: '+', label: 'Years of Service'  },
];

const services = [
  { icon: '🛡️', title: 'Security Services',  desc: 'Trained, background-verified security personnel for residential, commercial, and industrial needs. Available round the clock.' },
  { icon: '🧹', title: 'Cleaning Services',   desc: 'Professional cleaning staff for offices, homes, hospitals, and large commercial spaces. Hygienic and reliable.' },
  { icon: '🏠', title: 'Housekeeping',        desc: 'Skilled housekeeping staff for hotels, corporates, and residential complexes — trained to the highest standards.' },
  { icon: '📦', title: 'Packers & Movers',    desc: 'Reliable packing and moving professionals ensuring safe, timely relocation for households and businesses alike.' },
  { icon: '🚗', title: 'Driver Services',     desc: 'Verified, licensed drivers for personal, corporate, and fleet requirements. Punctual, professional, trustworthy.' },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Cabinet+Grotesk:wght@400;500;700;800&family=Bebas+Neue&display=swap');

        :root {
          --night:   #0D1F1C;
          --forest:  #12312C;
          --teal:    #00685F;
          --teal-lt: #008577;
          --amber:   #FF9700;
          --gold:    #EDD790;
          --cream:   #FEFDF4;
          --warm:    #F7E7CE;
          --ink:     #1C2B28;
          --mist:    rgba(255,255,255,.06);
          --border:  rgba(255,255,255,.09);
        }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }

        /* ── KEYFRAMES ── */
        @keyframes drift    { 0%,100%{transform:translateY(0) rotate(0deg)}   50%{transform:translateY(-20px) rotate(3deg)} }
        @keyframes driftRev { 0%,100%{transform:translateY(0) rotate(0deg)}   50%{transform:translateY(20px) rotate(-3deg)} }
        @keyframes spin     { to{transform:rotate(360deg)} }
        @keyframes spinRev  { to{transform:rotate(-360deg)} }
        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.15);opacity:.7} }
        @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(255,151,0,.2)} 50%{box-shadow:0 0 50px rgba(255,151,0,.5)} }
        @keyframes shimmer  { 0%{background-position:-400% center} 100%{background-position:400% center} }
        @keyframes fadeSlideUp   { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideLeft { from{opacity:0;transform:translateX(-50px)} to{opacity:1;transform:translateX(0)} }
        @keyframes scaleIn  { from{opacity:0;transform:scale(.85)} to{opacity:1;transform:scale(1)} }
        @keyframes borderDraw { from{stroke-dashoffset:400} to{stroke-dashoffset:0} }
        @keyframes barGrow  { from{width:0} to{width:var(--w,100%)} }
        @keyframes countUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

        /* ══════════════════════════════════
           HERO
        ══════════════════════════════════ */
        .hero {
          background: var(--night);
          min-height: 100vh;
          display: flex; flex-direction: column;
          position: relative; overflow: hidden;
        }

        .hero-noise {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:
            radial-gradient(ellipse 70% 60% at 80% 10%, rgba(255,151,0,.08) 0%, transparent 55%),
            radial-gradient(ellipse 50% 70% at 10% 90%, rgba(0,104,95,.12) 0%, transparent 55%),
            radial-gradient(ellipse 30% 30% at 50% 50%, rgba(18,49,44,.8) 0%, transparent 70%);
        }
        .hero-grid {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:
            linear-gradient(rgba(255,255,255,.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.018) 1px, transparent 1px);
          background-size:90px 90px;
        }

        .blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .b1 { width:600px;height:600px; top:-180px;right:-120px; background:rgba(255,151,0,.07); animation:drift 12s ease-in-out infinite; }
        .b2 { width:350px;height:350px; bottom:-80px;left:-80px;  background:rgba(0,104,95,.1);  animation:driftRev 9s ease-in-out infinite; }
        .b3 { width:200px;height:200px; top:45%;left:35%;         background:rgba(237,215,144,.05); animation:drift 15s ease-in-out 3s infinite; }

        .ring { position:absolute; border-radius:50%; border:1px dashed; pointer-events:none; }
        .rg1 { width:500px;height:500px; top:-100px;right:-80px; border-color:rgba(255,151,0,.08); animation:spin 40s linear infinite; }
        .rg2 { width:300px;height:300px; bottom:60px;left:-60px;  border-color:rgba(0,104,95,.1);  animation:spinRev 28s linear infinite; }
        .rg3 { width:140px;height:140px; top:38%;left:42%;        border-color:rgba(255,255,255,.06); animation:spin 20s linear infinite; }

        .hdot { position:absolute; border-radius:50%; pointer-events:none; }
        .hd1 { width:8px;height:8px; background:var(--amber); top:20%;right:26%; animation:pulse 2.5s ease-in-out infinite; }
        .hd2 { width:5px;height:5px; background:var(--teal); bottom:28%;left:22%; animation:pulse 3.5s ease-in-out 1s infinite; }
        .hd3 { width:12px;height:12px; background:rgba(255,151,0,.35); top:62%;right:44%; animation:pulse 2s ease-in-out .5s infinite; }

        .hero-body {
          flex:1; max-width:1260px; margin:0 auto;
          padding:9rem 2.5rem 2rem;
          display:grid; grid-template-columns:1.15fr 1fr;
          align-items:center; gap:4rem;
          position:relative; z-index:2;
        }

        .h-eyebrow {
          display:inline-flex; align-items:center; gap:.6rem;
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800;
          font-size:.72rem; letter-spacing:.24em; text-transform:uppercase;
          color:var(--gold); margin-bottom:1.5rem;
          animation:fadeSlideLeft .6s ease .1s both;
        }
        .h-eyebrow-pulse { width:8px;height:8px; background:var(--amber); border-radius:50%; animation:pulse 2s ease-in-out infinite; flex-shrink:0; }

        .hero-h1 {
          font-family:'Fraunces',serif;
          font-size:clamp(3rem,6vw,6.5rem);
          font-weight:900; color:#fff; line-height:.96;
          margin-bottom:1.5rem; letter-spacing:-.02em;
          animation:fadeSlideLeft .7s ease .2s both;
        }
        .h1-amber  { color:var(--amber); }
        .h1-italic { font-style:italic; font-weight:400; color:rgba(255,255,255,.65); }
        .h1-stroke { -webkit-text-stroke:2px rgba(237,215,144,.45); color:transparent; }

        .hero-p {
          font-family:'Cabinet Grotesk',sans-serif; font-size:1rem;
          line-height:1.85; color:rgba(255,255,255,.5);
          max-width:460px; margin-bottom:2.5rem;
          animation:fadeSlideLeft .7s ease .3s both;
        }
        .hero-p strong { color:rgba(255,255,255,.8); font-weight:700; }

        .hero-btns {
          display:flex; align-items:center; gap:1rem; flex-wrap:wrap;
          animation:fadeSlideLeft .7s ease .4s both;
        }
        .btn-a {
          display:inline-flex; align-items:center; gap:.5rem;
          background:var(--amber); color:var(--ink);
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800;
          font-size:.86rem; letter-spacing:.06em; text-transform:uppercase;
          padding:.95rem 2.2rem; text-decoration:none;
          position:relative; overflow:hidden;
          transition:transform .3s, box-shadow .3s;
        }
        .btn-a::after { content:''; position:absolute; inset:0; background:#E07625; transform:translateX(-101%); transition:transform .3s; z-index:0; }
        .btn-a:hover::after { transform:translateX(0); }
        .btn-a:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(255,151,0,.35); }
        .btn-a > * { position:relative; z-index:1; }

        .btn-b {
          display:inline-flex; align-items:center; gap:.5rem;
          background:transparent; color:rgba(255,255,255,.7);
          font-family:'Cabinet Grotesk',sans-serif; font-weight:700;
          font-size:.86rem; letter-spacing:.06em; text-transform:uppercase;
          padding:.95rem 2.2rem; text-decoration:none;
          border:1.5px solid rgba(255,255,255,.2);
          transition:all .3s;
        }
        .btn-b:hover { border-color:var(--amber); color:var(--amber); }

        .hero-visual {
          position:relative; height:500px;
          animation:scaleIn .9s ease .3s both;
        }

        .hv-core {
          position:absolute; top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:200px;height:200px; border-radius:50%;
          border:2px solid rgba(255,151,0,.3);
          background:radial-gradient(circle, rgba(255,151,0,.1), transparent 70%);
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          animation:glow 4s ease-in-out infinite; z-index:3;
        }
        .hvc-n { font-family:'Bebas Neue',sans-serif; font-size:3.5rem; color:var(--amber); line-height:1; }
        .hvc-l { font-family:'Cabinet Grotesk',sans-serif; font-size:.62rem; font-weight:800; letter-spacing:.2em; text-transform:uppercase; color:rgba(255,255,255,.4); margin-top:.15rem; }

        .orb-ring {
          position:absolute; top:50%;left:50%;
          transform:translate(-50%,-50%);
          border-radius:50%; border:1px solid rgba(255,255,255,.07);
          pointer-events:none;
        }
        .or1 { width:280px;height:280px; border-color:rgba(255,151,0,.1); animation:spin 35s linear infinite; }
        .or2 { width:370px;height:370px; animation:spinRev 50s linear infinite; }
        .or3 { width:460px;height:460px; border-color:rgba(0,104,95,.1); animation:spin 65s linear infinite; }

        .orb-tag {
          position:absolute; padding:.65rem 1.15rem;
          background:rgba(255,255,255,.06); border:1px solid var(--border);
          backdrop-filter:blur(12px);
          font-family:'Cabinet Grotesk',sans-serif; font-weight:700; font-size:.85rem; color:#fff;
          display:flex; align-items:center; gap:.5rem; white-space:nowrap;
          animation:drift ease-in-out infinite;
        }
        .ot1 { top:30px;  left:20px;   animation-duration:5s; }
        .ot2 { top:80px;  right:10px;  animation-duration:7s; animation-delay:-2s; }
        .ot3 { top:220px; right:-10px; animation-duration:4.5s; animation-delay:-1s; }
        .ot4 { bottom:80px; left:10px;  animation-duration:6s; animation-delay:-3s; }
        .ot5 { bottom:30px; right:40px; animation-duration:8s; animation-delay:-1.5s; }
        .ot-e { font-size:1.1rem; }

        /* ══════════════════════════════════
           STATS
        ══════════════════════════════════ */
        .stats { background:var(--forest); border-top:1px solid rgba(255,255,255,.06); position:relative; }
        .stats::after {
          content:''; position:absolute; bottom:0;left:0;right:0; height:2px;
          background:linear-gradient(90deg,var(--amber),var(--teal),var(--amber));
          background-size:200% auto; animation:shimmer 5s linear infinite;
        }
        .stats-row {
          max-width:1260px; margin:0 auto; padding:0 2.5rem;
          display:grid; grid-template-columns:repeat(4,1fr);
        }
        .stat-cell {
          padding:3rem 1.5rem; text-align:center;
          border-right:1px solid rgba(255,255,255,.06);
          position:relative; overflow:hidden;
          transition:background .35s;
        }
        .stat-cell:last-child { border-right:none; }
        .stat-cell:hover { background:var(--mist); }
        .stat-cell::before {
          content:''; position:absolute; inset:0;
          background:radial-gradient(circle at 50% 0%, rgba(255,151,0,.07), transparent 70%);
          opacity:0; transition:opacity .35s;
        }
        .stat-cell:hover::before { opacity:1; }
        .stat-icon { font-size:1.5rem; margin-bottom:.5rem; display:block; opacity:.5; }
        .stat-n {
          font-family:'Bebas Neue',sans-serif;
          font-size:clamp(2.5rem,3.5vw,3.8rem);
          color:var(--amber); line-height:1; display:block; letter-spacing:.02em;
        }
        .stat-l {
          font-family:'Cabinet Grotesk',sans-serif; font-weight:700;
          font-size:.68rem; letter-spacing:.18em; text-transform:uppercase;
          color:rgba(255,255,255,.32); display:block; margin-top:.4rem;
        }

        /* ══════════════════════════════════
           ABOUT
        ══════════════════════════════════ */
        .about { background:var(--warm); padding:7rem 0; position:relative; overflow:hidden; }
        .about::before {
          content:''; position:absolute; top:0;left:0;right:0; height:4px;
          background:linear-gradient(90deg,var(--amber),var(--teal),var(--amber));
          background-size:200% auto; animation:shimmer 4s linear infinite;
        }
        .about-glow { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .ag1 { width:300px;height:300px; top:-80px;right:-60px; background:rgba(255,151,0,.07); }
        .ag2 { width:200px;height:200px; bottom:-50px;left:5%;   background:rgba(0,104,95,.08); }

        .wrap { max-width:1260px; margin:0 auto; padding:0 2.5rem; position:relative; z-index:1; }
        .two-col { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; }

        .tag {
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800;
          font-size:.7rem; letter-spacing:.22em; text-transform:uppercase;
          color:var(--amber); margin-bottom:1rem;
          display:flex; align-items:center; gap:.75rem;
        }
        .tag::before { content:''; width:2rem; height:2px; background:var(--amber); }

        .sec-h {
          font-family:'Fraunces',serif; font-weight:900;
          font-size:clamp(2rem,3.5vw,3.2rem); color:var(--ink); line-height:1.1;
          margin-bottom:1.5rem;
        }
        .sec-h em { font-style:italic; color:var(--teal); }

        .body-txt { font-family:'Cabinet Grotesk',sans-serif; font-size:.96rem; line-height:1.88; color:#5a6a62; }
        .body-txt p { margin-bottom:1rem; }
        .body-txt strong { color:var(--ink); font-weight:700; }

        .av-card {
          background:var(--forest);
          padding:2.75rem;
          clip-path:polygon(0 0,96% 0,100% 4%,100% 100%,4% 100%,0 96%);
          position:relative; overflow:hidden;
        }
        .av-card::before {
          content:''; position:absolute; top:-40px;right:-40px;
          width:200px;height:200px; border-radius:50%;
          background:var(--amber); opacity:.05;
        }
        .avc-big { font-family:'Bebas Neue',sans-serif; font-size:5.5rem; color:var(--amber); line-height:1; display:block; }
        .avc-sub { font-family:'Cabinet Grotesk',sans-serif; font-size:.7rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.35); margin-top:.2rem; display:block; }
        .avc-line { width:100%; height:1px; background:rgba(255,255,255,.07); margin:1.25rem 0; }
        .avc-p { font-family:'Cabinet Grotesk',sans-serif; font-size:.9rem; line-height:1.75; color:rgba(255,255,255,.55); }
        .av-mini { display:grid; grid-template-columns:1fr 1fr; gap:.65rem; margin-top:1.25rem; }
        .avm { background:rgba(255,255,255,.04); padding:1rem; border-left:3px solid var(--amber); }
        .avm-n { font-family:'Bebas Neue',sans-serif; font-size:1.8rem; color:var(--amber); line-height:1; display:block; }
        .avm-l { font-family:'Cabinet Grotesk',sans-serif; font-size:.65rem; font-weight:700; letter-spacing:.13em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-top:.12rem; display:block; }

        /* ══════════════════════════════════
           SERVICES
        ══════════════════════════════════ */
        .svc { background:#00685F; padding:7rem 0; position:relative; overflow:hidden; }
        .svc::before {
          content:''; position:absolute; inset:0;
          background-image:radial-gradient(circle at 1px 1px, rgba(255,255,255,.055) 1px, transparent 0);
          background-size:36px 36px; pointer-events:none;
        }
        .svc-blob { position:absolute; border-radius:50%; filter:blur(110px); pointer-events:none; }
        .svb1 { width:500px;height:500px; top:-120px;left:-100px; background:rgba(255,151,0,.1); }
        .svb2 { width:300px;height:300px; bottom:-60px;right:-40px; background:rgba(13,31,28,.5); }

        .svc-hd { text-align:center; margin-bottom:4.5rem; position:relative; z-index:1; }
        .svc-hd .tag { justify-content:center; color:var(--gold); }
        .svc-hd .tag::before { background:var(--gold); }
        .svc-title {
          font-family:'Fraunces',serif; font-weight:900;
          font-size:clamp(2.2rem,4vw,4rem); color:#fff; line-height:1.05; margin-bottom:1rem;
        }
        .svc-title em { font-style:italic; color:var(--gold); }
        .svc-sub {
          font-family:'Cabinet Grotesk',sans-serif; font-size:.95rem;
          line-height:1.8; color:rgba(255,255,255,.45); max-width:500px; margin:0 auto;
        }

        .svc-grid {
          display:grid; grid-template-columns:repeat(3,1fr);
          gap:1.5px; background:rgba(255,255,255,.06);
          position:relative; z-index:1;
        }
        .svc-card {
          background:#00685F; padding:2.5rem 2rem;
          position:relative; overflow:hidden;
          transition:background .35s ease; cursor:default;
        }
        .svc-card:hover { background:rgba(255,255,255,.06); }
        .svc-card::after {
          content:''; position:absolute; top:0;left:0;right:0; height:2px;
          background:linear-gradient(90deg,var(--gold),var(--amber));
          transform:scaleX(0); transform-origin:left; transition:transform .45s ease;
        }
        .svc-card:hover::after { transform:scaleX(1); }
        .svc-card::before {
          content:''; position:absolute; bottom:0;left:0;right:0; height:60%;
          background:radial-gradient(ellipse at 50% 100%, rgba(255,151,0,.04), transparent 70%);
          opacity:0; transition:opacity .35s;
        }
        .svc-card:hover::before { opacity:1; }

        .sc-icon {
          width:60px;height:60px; border-radius:50%;
          background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.12);
          display:flex; align-items:center; justify-content:center;
          font-size:1.65rem; margin-bottom:1.5rem;
          transition:transform .35s, background .35s;
        }
        .svc-card:hover .sc-icon { transform:scale(1.1) rotate(-6deg); background:rgba(255,151,0,.15); }
        .sc-h { font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:1.05rem; color:#fff; margin-bottom:.6rem; }
        .sc-p { font-family:'Cabinet Grotesk',sans-serif; font-size:.86rem; line-height:1.75; color:rgba(255,255,255,.42); margin-bottom:1.5rem; }
        .sc-lnk {
          display:inline-flex; align-items:center; gap:.4rem;
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800;
          font-size:.78rem; letter-spacing:.08em; text-transform:uppercase;
          color:var(--gold); text-decoration:none; transition:gap .3s;
        }
        .sc-lnk:hover { gap:.8rem; }

        /* ══════════════════════════════════
           HOW IT WORKS
        ══════════════════════════════════ */
        .hiw { background:var(--cream); padding:7rem 0; position:relative; overflow:hidden; }
        .hiw-two { display:grid; grid-template-columns:1fr 1fr; gap:6rem; align-items:center; }

        .step-list { display:flex; flex-direction:column; }
        .step {
          display:flex; gap:1.25rem; align-items:flex-start;
          padding:1.5rem 0; border-bottom:1px solid rgba(0,0,0,.06);
          transition:padding-left .3s ease;
        }
        .step:last-child { border-bottom:none; }
        .step:hover { padding-left:.6rem; }
        .step-n { font-family:'Bebas Neue',sans-serif; font-size:2rem; color:var(--amber); line-height:1; min-width:3.2rem; flex-shrink:0; }
        .step-b h4 { font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:.97rem; color:var(--ink); margin-bottom:.3rem; }
        .step-b p  { font-family:'Cabinet Grotesk',sans-serif; font-size:.88rem; line-height:1.72; color:#6a7a72; }

        .hiw-vis { position:relative; display:flex; align-items:center; justify-content:center; min-height:420px; }
        .hiw-pct { position:relative; z-index:2; text-align:center; }
        .hiw-big { font-family:'Fraunces',serif; font-weight:900; font-size:clamp(6rem,10vw,9rem); color:var(--teal); line-height:1; }
        .hiw-big sup { font-size:.38em; color:var(--amber); vertical-align:super; }
        .hiw-lbl { font-family:'Cabinet Grotesk',sans-serif; font-weight:800; font-size:.75rem; letter-spacing:.2em; text-transform:uppercase; color:#8a9a92; margin-top:.4rem; }
        .hiw-rings { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; }
        .hr { position:absolute; border-radius:50%; border:1px solid rgba(0,104,95,.1); }
        .hrc1 { width:210px;height:210px; animation:spin 18s linear infinite; }
        .hrc2 { width:300px;height:300px; animation:spinRev 28s linear infinite; border-color:rgba(255,151,0,.07); }
        .hrc3 { width:400px;height:400px; animation:spin 42s linear infinite; }

        /* ══════════════════════════════════
           CTA
        ══════════════════════════════════ */
        .cta-sec { background:var(--amber); padding:6rem 0; position:relative; overflow:hidden; }
        .cta-sec::before {
          content:''; position:absolute; inset:0;
          background:repeating-linear-gradient(-52deg,transparent,transparent 22px,rgba(0,0,0,.03) 22px,rgba(0,0,0,.03) 44px);
          pointer-events:none;
        }
        .cta-blb { position:absolute; border-radius:50%; filter:blur(80px); pointer-events:none; }
        .ctb1 { width:400px;height:400px; top:-100px;right:-60px; background:rgba(255,255,255,.18); }
        .ctb2 { width:200px;height:200px; bottom:-40px;left:6%;   background:rgba(0,0,0,.07); }

        .cta-row {
          max-width:1260px; margin:0 auto; padding:0 2.5rem;
          display:flex; align-items:center; justify-content:space-between;
          gap:3rem; flex-wrap:wrap; position:relative; z-index:1;
        }
        .cta-kicker { font-family:'Cabinet Grotesk',sans-serif; font-weight:700; font-size:.68rem; letter-spacing:.25em; text-transform:uppercase; color:rgba(0,0,0,.38); margin-bottom:.6rem; display:block; }
        .cta-h { font-family:'Fraunces',serif; font-weight:900; font-size:clamp(2rem,4vw,3.5rem); color:var(--ink); line-height:1.05; }
        .cta-h em { font-style:italic; }
        .cta-p { font-family:'Cabinet Grotesk',sans-serif; font-size:.96rem; line-height:1.8; color:rgba(0,0,0,.5); margin-top:.7rem; max-width:440px; }
        .cta-acts { display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; }
        .btn-ink {
          display:inline-flex; align-items:center; gap:.5rem;
          background:var(--ink); color:#fff;
          font-family:'Cabinet Grotesk',sans-serif; font-weight:800;
          font-size:.88rem; letter-spacing:.05em; text-transform:uppercase;
          padding:1rem 2.5rem; text-decoration:none; transition:all .3s;
        }
        .btn-ink:hover { background:var(--forest); transform:translateY(-3px); box-shadow:0 14px 30px rgba(0,0,0,.2); }
        .cta-ph { display:flex; align-items:center; gap:.85rem; text-decoration:none; }
        .cp-ico { font-size:1.6rem; }
        .cp-lbl { font-family:'Cabinet Grotesk',sans-serif; font-size:.64rem; font-weight:700; letter-spacing:.16em; text-transform:uppercase; color:rgba(0,0,0,.38); display:block; }
        .cp-num { font-family:'Bebas Neue',sans-serif; font-size:1.4rem; color:var(--ink); display:block; letter-spacing:.04em; }

        /* ── RESPONSIVE ── */
        @media(max-width:1024px){
          .hero-body { grid-template-columns:1fr; padding-top:7rem; }
          .hero-visual { display:none; }
          .two-col,.hiw-two { grid-template-columns:1fr; gap:3rem; }
          .stats-row { grid-template-columns:repeat(2,1fr); }
          .stat-cell { border-bottom:1px solid rgba(255,255,255,.06); }
          .svc-grid { grid-template-columns:repeat(2,1fr); }
          .cta-row { flex-direction:column; text-align:center; }
          .cta-acts { justify-content:center; }
        }
        @media(max-width:640px){
          .stats-row { grid-template-columns:1fr 1fr; }
          .svc-grid { grid-template-columns:1fr; }
          .hero-btns { flex-direction:column; align-items:flex-start; }
          .av-mini { grid-template-columns:1fr; }
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-noise"/><div className="hero-grid"/>
        <div className="blob b1"/><div className="blob b2"/><div className="blob b3"/>
        <div className="ring rg1"/><div className="ring rg2"/><div className="ring rg3"/>
        <div className="hdot hd1"/><div className="hdot hd2"/><div className="hdot hd3"/>

        <div className="hero-body">
          <div>
            <div className="h-eyebrow"><span className="h-eyebrow-pulse"/>Trusted Employment Partner · Est. 2020</div>
            <h1 className="hero-h1">
              Connecting<br/>
              <span className="h1-amber">Talent</span> with<br/>
              <span className="h1-italic">Opportunity</span>
            </h1>
            <p className="hero-p">
              Nachi Consultation bridges the gap between <strong>skilled workers</strong> and employers. From security to housekeeping — we place the right people, in the right roles, <strong>right away.</strong>
            </p>
            <div className="hero-btns">
              <Link href="/services" className="btn-a"><span>Explore Services</span><span>→</span></Link>
              <Link href="/contact"  className="btn-b"><span>Apply for a Job</span></Link>
            </div>
          </div>

          <div className="hero-visual">
            <div className="orb-ring or1"/><div className="orb-ring or2"/><div className="orb-ring or3"/>
            <div className="hv-core">
              <span className="hvc-n">500+</span>
              <span className="hvc-l">Placements</span>
            </div>
            <div className="orb-tag ot1"><span className="ot-e">🛡️</span>Security Guards</div>
            <div className="orb-tag ot2"><span className="ot-e">🧹</span>Cleaning Staff</div>
            <div className="orb-tag ot3"><span className="ot-e">🚗</span>Drivers</div>
            <div className="orb-tag ot4"><span className="ot-e">📦</span>Packers & Movers</div>
            <div className="orb-tag ot5"><span className="ot-e">🏠</span>Housekeeping</div>
          </div>
        </div>
      </section>

      {/* ══ STATS ══ */}
      <div className="stats">
        <div className="stats-row">
          {stats.map((s, i) => (
            <div key={i} className="stat-cell">
              <span className="stat-icon">{s.icon}</span>
              <span className="stat-n"><StatNum target={s.target} suffix={s.suffix}/></span>
              <span className="stat-l">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ABOUT ══ */}
      <section className="about">
        <div className="about-glow ag1"/><div className="about-glow ag2"/>
        <div className="wrap">
          <div className="two-col">
            <div>
              <p className="tag">Who We Are</p>
              <h2 className="sec-h">India's Most Trusted<br/><em>Workforce Placement</em><br/>Platform</h2>
              <div className="body-txt">
                <p>At <strong>Nachi Consultation Pvt. Ltd.</strong>, we specialize in sourcing, vetting, and placing skilled workers across industries. We don't just fill vacancies — we create lasting employment opportunities that transform lives.</p>
                <p>Whether you're an employer needing reliable staff or a job seeker looking for your next opportunity, <strong>Nachi is your trusted bridge to success.</strong></p>
              </div>
              <Link href="/about" className="btn-a" style={{marginTop:'1.5rem',display:'inline-flex'}}><span>Learn More About Us</span><span>→</span></Link>
            </div>
            <div className="av-card">
              <span className="avc-big">2020</span>
              <span className="avc-sub">Founded · Visakhapatnam, AP</span>
              <div className="avc-line"/>
              <p className="avc-p">From a small Vizag office to a pan-India staffing force — built on trust, speed, and dignity for every worker.</p>
              <div className="av-mini">
                {[['60+','Companies'],['10+','Cities']].map(([n,l],i) => (
                  <div key={i} className="avm"><span className="avm-n">{n}</span><span className="avm-l">{l}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <section className="svc">
        <div className="svc-blob svb1"/><div className="svc-blob svb2"/>
        <div className="wrap">
          <div className="svc-hd">
            <p className="tag">What We Offer</p>
            <h2 className="svc-title">Employment Services<br/><em>Built for Every Need</em></h2>
            <p className="svc-sub">From security to packers, we place vetted, trained professionals across all service categories.</p>
          </div>
          <div className="svc-grid">
            {services.map((s, i) => (
              <div key={i} className="svc-card">
                <div className="sc-icon">{s.icon}</div>
                <h3 className="sc-h">{s.title}</h3>
                <p className="sc-p">{s.desc}</p>
                <Link href="/services" className="sc-lnk">Learn More <span>→</span></Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="hiw">
        <div className="wrap">
          <div className="hiw-two">
            <div>
              <p className="tag">Simple Process</p>
              <h2 className="sec-h">How Nachi<br/><em>Works for You</em></h2>
              <div className="step-list">
                {[
                  { n:'01', title:'Submit Your Requirement', desc:'Tell us what kind of staff or job you need.' },
                  { n:'02', title:'We Source & Verify',       desc:'Our team screens, verifies backgrounds, and trains candidates.' },
                  { n:'03', title:'Perfect Match',            desc:'We present the best-fit candidates within 24–48 hours.' },
                  { n:'04', title:'Placement & Support',      desc:'We support both employer and employee even post-placement.' },
                ].map((s, i) => (
                  <div key={i} className="step">
                    <div className="step-n">{s.n}</div>
                    <div className="step-b"><h4>{s.title}</h4><p>{s.desc}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="hiw-vis">
              <div className="hiw-pct">
                <div className="hiw-big">98<sup>%</sup></div>
                <div className="hiw-lbl">Placement Success Rate</div>
              </div>
              <div className="hiw-rings">
                <div className="hr hrc1"/><div className="hr hrc2"/><div className="hr hrc3"/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-sec">
        <div className="cta-blb ctb1"/><div className="cta-blb ctb2"/>
        <div className="cta-row">
          <div>
            <span className="cta-kicker">Get Started Today</span>
            <h2 className="cta-h">Ready to Find Work<br/>or <em>Hire Staff?</em></h2>
            <p className="cta-p">Whether you're seeking employment or looking for skilled workers — we're here to help. Get in touch today.</p>
          </div>
          <div className="cta-acts">
            <Link href="/contact" className="btn-ink"><span>Contact Us Now</span><span>→</span></Link>
            <Link href="/contact" className="cta-ph">
              <span className="cp-ico">📞</span>
              <div>
                <span className="cp-lbl">Call Us</span>
                <span className="cp-num">+91 63056 50469</span>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
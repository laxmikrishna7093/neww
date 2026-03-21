'use client';
import Link from 'next/link';

const serviceCards = [
  { title: 'Housekeeping',       color: '#FF8B5A', img: 'https://images.pexels.com/photos/4107112/pexels-photo-4107112.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Home & Hotel' },
  { title: 'Security',           color: '#685AFF', img: 'https://images.pexels.com/photos/3651584/pexels-photo-3651584.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Guard & Patrol' },
  { title: 'Customer Associate', color: '#FF0087', img: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Front Desk' },
  { title: 'Customer Support',   color: '#FFC700', img: 'https://images.pexels.com/photos/5904048/pexels-photo-5904048.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Call & Chat' },
  { title: 'Drivers',            color: '#25D48A', img: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Personal & Fleet' },
  { title: 'Packers & Movers',   color: '#FF5F00', img: 'https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=400', tag: 'Home & Office' },
];

const steps = [
  { n: '01', title: 'Submit Requirement', color: '#FF0087', img: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { n: '02', title: 'We Source & Verify', color: '#685AFF', img: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { n: '03', title: 'Perfect Match',      color: '#FFC700', img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { n: '04', title: 'Interview & Select', color: '#25D48A', img: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { n: '05', title: 'Placement & Support',color: '#FF8B5A', img: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

const aboutPhotos = [
  { img: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Our Team' },
  { img: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Placements' },
  { img: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Verified Staff' },
  { img: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=500', label: 'Interviews' },
];

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,700;0,9..144,900;1,9..144,400;1,9..144,700&family=Cabinet+Grotesk:wght@400;500;700;800&family=Bebas+Neue&display=swap');

        :root {
          --c-orange:#E8830A; --c-deeporg:#FF5F00; --c-purple:#685AFF;
          --c-pink:#FF0087; --c-gold:#E8A020; --c-gold-light:#F5C842;
          --bg-hero:#0B2318; --bg-about:#FDF6EE;
          --ink:#1A0A2E; --ink-body:#2D1B4E; --white:#FFFFFF;
        }
        *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
        html { scroll-behavior:smooth; }

        @keyframes pulse    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.3);opacity:.6} }
        @keyframes shimmer  { 0%{background-position:-400% center} 100%{background-position:400% center} }
        @keyframes floatUp  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes drift    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
        @keyframes glowBtn  { 0%,100%{box-shadow:0 0 0 0 rgba(232,131,10,.3)} 50%{box-shadow:0 0 0 14px rgba(232,131,10,0)} }
        @keyframes cardUp   { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badgePop { 0%{transform:scale(0) rotate(-10deg)} 80%{transform:scale(1.1) rotate(2deg)} 100%{transform:scale(1) rotate(0)} }
        @keyframes fadeIn   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }

        /* ══ HERO ══ */
        .hero {
          background: linear-gradient(160deg,#0B2318 0%,#0E2D1F 40%,#142E1A 70%,#1A3A22 100%);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }
        .hero-grain {
          position:absolute; inset:0; pointer-events:none; opacity:.04;
          background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size:200px 200px;
        }
        .hero-grid {
          position:absolute; inset:0; pointer-events:none;
          background-image:
            linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px);
          background-size:70px 70px;
        }
        .hero-blob { position:absolute; border-radius:50%; filter:blur(90px); pointer-events:none; }
        .hb1 { width:500px;height:500px;top:-80px;right:-80px;background:rgba(232,131,10,.12);animation:floatUp 14s ease-in-out infinite; }
        .hb2 { width:300px;height:300px;bottom:-80px;left:-60px;background:rgba(37,212,138,.07);animation:floatUp 10s ease-in-out 3s infinite; }
        .hb3 { width:180px;height:180px;top:50%;left:30%;background:rgba(232,131,10,.06);animation:drift 12s ease-in-out 2s infinite; }

        /* ── Hero body: full width, centred content ── */
        .hero-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 7rem 2rem 6rem;
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 700px;
          margin: 0 auto;
        }

        /* eyebrow */
        .h-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: .55rem;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 800;
          font-size: .62rem;
          letter-spacing: .22em;
          text-transform: uppercase;
          color: var(--c-gold-light);
          margin-bottom: 1.6rem;
          background: rgba(232,160,32,.12);
          border: 1.5px solid rgba(232,160,32,.3);
          padding: .4rem 1rem;
          border-radius: 100px;
          animation: fadeIn .6s ease .1s both;
        }
        .h-eyebrow-dot {
          width: 7px; height: 7px;
          background: var(--c-gold);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
          flex-shrink: 0;
        }

        /* main heading — matches screenshot size */
        .hero-h1 {
          font-family: 'Fraunces', serif;
          font-weight: 900;
          font-size: clamp(2.8rem, 8vw, 5rem);   /* smaller than before */
          color: var(--white);
          line-height: .95;
          letter-spacing: -.02em;
          margin-bottom: 1.4rem;
          animation: fadeIn .7s ease .2s both;
        }
        .h1-gold    { color: var(--c-orange); }
        .h1-outline {
          -webkit-text-stroke: 2px rgba(245,200,66,.7);
          color: transparent;
          font-style: italic;
          font-weight: 700;
        }

        /* divider line */
        .hero-divider {
          width: 48px; height: 2px;
          background: rgba(255,255,255,.2);
          margin: 0 auto 1.2rem;
          animation: fadeIn .7s ease .28s both;
        }

        /* paragraph — smaller, tighter */
        .hero-p {
          font-family: 'Cabinet Grotesk', sans-serif;
          font-size: .9rem;
          line-height: 1.8;
          color: rgba(255,255,255,.55);
          max-width: 480px;
          margin-bottom: 2.4rem;
          animation: fadeIn .7s ease .35s both;
          text-align: center;
        }
        .hero-p strong { color: rgba(255,255,255,.88); }

        /* ── Buttons: stacked full-width like screenshot ── */
        .hero-btns {
          display: flex;
          flex-direction: column;
          gap: .85rem;
          width: 100%;
          max-width: 480px;
          animation: fadeIn .7s ease .45s both;
          align-self: center;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          background: var(--c-orange);
          color: #fff;
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 800;
          font-size: .78rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 1.05rem 2rem;
          text-decoration: none;
          border-radius: 10px;
          position: relative;
          overflow: hidden;
          transition: transform .25s, box-shadow .25s;
          box-shadow: 0 4px 24px rgba(232,131,10,.45);
          animation: glowBtn 3s ease-in-out infinite;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(232,131,10,.6); }

        .btn-secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: .5rem;
          background: transparent;
          color: rgba(255,255,255,.75);
          font-family: 'Cabinet Grotesk', sans-serif;
          font-weight: 700;
          font-size: .78rem;
          letter-spacing: .12em;
          text-transform: uppercase;
          padding: 1.05rem 2rem;
          text-decoration: none;
          border-radius: 10px;
          border: 1.5px solid rgba(255,255,255,.22);
          transition: all .25s;
        }
        .btn-secondary:hover {
          background: rgba(255,255,255,.07);
          border-color: rgba(255,255,255,.4);
          color: #fff;
          transform: translateY(-2px);
        }

        /* hero bottom wave */
        .hero-wave { position:absolute;bottom:-2px;left:0;right:0;line-height:0;z-index:3; }
        .hero-wave svg { display:block;width:100%;height:70px; }

        /* dots decoration */
        .hero-dots-svg { position:absolute;inset:0;pointer-events:none;width:100%;height:100%; }

        /* ══ ABOUT ══ */
        .about { background:var(--bg-about);padding:7rem 0;position:relative;overflow:hidden; }
        .about-glow { position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none; }
        .ag1 { width:350px;height:350px;top:-100px;right:-60px;background:rgba(255,95,0,.1);animation:floatUp 13s ease-in-out infinite; }
        .ag2 { width:220px;height:220px;bottom:-60px;left:2%;background:rgba(104,90,255,.08);animation:floatUp 10s ease-in-out 3s infinite; }
        .wrap { max-width:1260px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1; }
        .two-col { display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center; }
        .tag-label { font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;color:var(--c-deeporg);margin-bottom:1rem;display:flex;align-items:center;gap:.75rem; }
        .tag-label::before { content:'';width:2rem;height:2px;background:currentColor;flex-shrink:0; }
        .sec-h { font-family:'Fraunces',serif;font-weight:900;font-size:clamp(2rem,3.5vw,3.2rem);color:var(--ink);line-height:1.1;margin-bottom:1.5rem; }
        .sec-h em { font-style:italic;color:var(--c-purple); }
        .body-txt { font-family:'Cabinet Grotesk',sans-serif;font-size:.96rem;line-height:1.88;color:var(--ink-body); }
        .body-txt p { margin-bottom:1rem; }
        .body-txt strong { color:var(--ink);font-weight:700; }
        .about-collage { display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:.85rem;height:480px;animation:fadeIn .8s ease .2s both; }
        .ac-photo { border-radius:18px;overflow:hidden;position:relative;box-shadow:0 8px 28px rgba(0,0,0,.14);transition:transform .4s,box-shadow .4s;cursor:pointer; }
        .ac-photo:hover { transform:scale(1.04) translateY(-4px);box-shadow:0 20px 40px rgba(0,0,0,.2); }
        .ac-photo img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s; }
        .ac-photo:hover img { transform:scale(1.08); }
        .ac-photo-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.55) 0%,transparent 55%); }
        .ac-photo-label { position:absolute;bottom:12px;left:14px;font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:.78rem;color:var(--white); }
        .ac-photo:first-child { grid-row:1 / 3; }
        .about-badge { position:absolute;top:-14px;right:-14px;z-index:10;background:var(--c-purple);color:var(--white);padding:.8rem 1.2rem;border-radius:14px;box-shadow:0 6px 24px rgba(104,90,255,.4);animation:badgePop .6s cubic-bezier(.34,1.56,.64,1) .5s both;text-align:center; }
        .ab-yr { font-family:'Bebas Neue',sans-serif;font-size:1.8rem;line-height:1;display:block; }
        .ab-lb { font-family:'Cabinet Grotesk',sans-serif;font-size:.55rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.7); }
        .about-collage-wrap { position:relative; }
        .btn-about { display:inline-flex;align-items:center;gap:.5rem;background:var(--c-deeporg);color:#fff;font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;padding:.9rem 2rem;text-decoration:none;border-radius:50px;margin-top:2rem;transition:all .3s;box-shadow:0 6px 28px rgba(255,95,0,.4); }
        .btn-about:hover { transform:translateY(-3px); }

        /* ══ SERVICES ══ */
        .svc-wrapper { position:relative;background:var(--bg-about); }
        .svc-wave-top { position:relative;line-height:0;background:var(--bg-about); }
        .svc-wave-top svg { display:block;width:100%;height:100px; }
        .svc {
          background:linear-gradient(160deg,#C8590A 0%,#E07020 40%,#D4621A 70%,#B84D08 100%);
          padding:2rem 0 6rem;position:relative;overflow:hidden;
        }
        .svc::after { content:'';position:absolute;inset:0;pointer-events:none;background-image:repeating-linear-gradient(0deg,transparent,transparent 60px,rgba(255,255,255,.04) 60px,rgba(255,255,255,.04) 61px),repeating-linear-gradient(90deg,transparent,transparent 60px,rgba(255,255,255,.04) 60px,rgba(255,255,255,.04) 61px); }
        .svc-wave-bottom { position:relative;line-height:0;background:linear-gradient(135deg,#1B4D5C,#164555); }
        .svc-wave-bottom svg { display:block;width:100%;height:100px; }
        .svc-glow { position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none; }
        .sg1 { width:500px;height:500px;top:-150px;right:-100px;background:rgba(255,199,0,.15);animation:floatUp 14s ease-in-out infinite; }
        .sg2 { width:300px;height:300px;bottom:-80px;left:-60px;background:rgba(255,255,255,.08);animation:floatUp 10s ease-in-out 3s infinite; }
        .svc-img-grid { display:grid;grid-template-columns:repeat(6,1fr);gap:1rem;position:relative;z-index:1; }
        .svc-img-card { border-radius:20px;overflow:hidden;position:relative;cursor:pointer;height:300px;animation:cardUp .6s ease both;box-shadow:0 8px 30px rgba(0,0,0,.3); }
        .svc-img-card:nth-child(1){animation-delay:.05s} .svc-img-card:nth-child(2){animation-delay:.1s}
        .svc-img-card:nth-child(3){animation-delay:.15s} .svc-img-card:nth-child(4){animation-delay:.2s}
        .svc-img-card:nth-child(5){animation-delay:.25s} .svc-img-card:nth-child(6){animation-delay:.3s}
        .svc-img-card img { width:100%;height:100%;object-fit:cover;display:block;transition:transform .6s; }
        .svc-img-card:hover img { transform:scale(1.1); }
        .svc-img-overlay { position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.75) 0%,rgba(0,0,0,.15) 50%,transparent 100%);transition:background .4s; }
        .svc-img-card:hover .svc-img-overlay { background:linear-gradient(0deg,rgba(0,0,0,.88) 0%,rgba(0,0,0,.35) 60%,transparent 100%); }
        .svc-img-color-bar { position:absolute;top:0;left:0;right:0;height:4px;transition:height .35s; }
        .svc-img-card:hover .svc-img-color-bar { height:6px; }
        .svc-img-tag { position:absolute;top:14px;left:14px;font-family:'Cabinet Grotesk',sans-serif;font-weight:700;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;padding:.28rem .7rem;border-radius:100px;background:rgba(0,0,0,.45);border:1px solid rgba(255,255,255,.25);color:rgba(255,255,255,.8);backdrop-filter:blur(4px); }
        .svc-img-bottom { position:absolute;bottom:0;left:0;right:0;padding:1.25rem 1.1rem 1.1rem; }
        .svc-img-title { font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:.95rem;color:var(--white);line-height:1.2;margin-bottom:.5rem; }
        .svc-img-link { display:inline-flex;align-items:center;gap:.3rem;font-family:'Cabinet Grotesk',sans-serif;font-weight:700;font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;opacity:0;transform:translateY(8px);transition:opacity .35s,transform .35s; }
        .svc-img-card:hover .svc-img-link { opacity:1;transform:translateY(0); }

        /* ══ HOW IT WORKS ══ */
        .hiw { background:linear-gradient(135deg,#1B4D5C 0%,#1E5E6E 40%,#164555 100%);padding:7rem 0;position:relative;overflow:hidden; }
        .hiw::before { content:'';position:absolute;inset:0;pointer-events:none;background-image:radial-gradient(circle,rgba(255,255,255,.04) 1.5px,transparent 1.5px);background-size:40px 40px; }
        .hiw-blob { position:absolute;border-radius:50%;filter:blur(90px);pointer-events:none; }
        .hwb1 { width:400px;height:400px;top:-80px;left:-80px;background:rgba(37,212,138,.1);animation:floatUp 11s ease-in-out infinite; }
        .hwb2 { width:280px;height:280px;bottom:-50px;right:-40px;background:rgba(255,199,0,.1);animation:floatUp 9s ease-in-out 2s infinite; }
        .hiw-head { text-align:center;margin-bottom:4rem; }
        .hiw-title { font-family:'Fraunces',serif;font-weight:900;font-size:clamp(2.2rem,4vw,3.8rem);color:var(--white);line-height:1.05;margin-bottom:.75rem; }
        .hiw-title em { font-style:italic;color:#7EECD4; }
        .hiw-subtitle { font-family:'Cabinet Grotesk',sans-serif;font-size:.95rem;color:rgba(255,255,255,.5);max-width:420px;margin:0 auto; }
        .steps-img-row { display:grid;grid-template-columns:repeat(5,1fr);gap:1.2rem;position:relative;z-index:1; }
        .step-img-card { position:relative;border-radius:20px;overflow:hidden;cursor:pointer;z-index:1;animation:cardUp .6s ease both;transition:transform .4s,box-shadow .4s;box-shadow:0 6px 24px rgba(0,0,0,.3); }
        .step-img-card:nth-child(1){animation-delay:.08s} .step-img-card:nth-child(2){animation-delay:.16s}
        .step-img-card:nth-child(3){animation-delay:.24s} .step-img-card:nth-child(4){animation-delay:.32s} .step-img-card:nth-child(5){animation-delay:.4s}
        .step-img-card:hover { transform:translateY(-12px) scale(1.03);box-shadow:0 24px 50px rgba(0,0,0,.45); }
        .step-img-wrap { height:200px;overflow:hidden;position:relative; }
        .step-img-wrap img { width:100%;height:100%;object-fit:cover;transition:transform .6s;display:block; }
        .step-img-card:hover .step-img-wrap img { transform:scale(1.1); }
        .step-img-wrap::after { content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.5),transparent 60%); }
        .step-num-bubble { position:absolute;top:12px;left:12px;z-index:2;width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue',sans-serif;font-size:1.2rem;color:var(--white);border:2px solid rgba(255,255,255,.6);backdrop-filter:blur(6px);background:rgba(0,0,0,.35); }
        .step-img-bottom { background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-top:none;border-radius:0 0 20px 20px;padding:1rem 1.1rem;backdrop-filter:blur(8px);transition:background .3s; }
        .step-img-card:hover .step-img-bottom { background:rgba(255,255,255,.14); }
        .step-dot { width:8px;height:8px;border-radius:50%;margin:0 auto .5rem;transition:transform .3s; }
        .step-img-card:hover .step-dot { transform:scale(1.5); }
        .step-img-title { font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:.88rem;color:var(--white);line-height:1.3;text-align:center; }

        /* ══ CTA ══ */
        .cta-sec { background:var(--bg-about);padding:6rem 0;position:relative;overflow:hidden; }
        .cta-sec::before { content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--c-purple),var(--c-pink),#E8A020,var(--c-purple));background-size:300% auto;animation:shimmer 4s linear infinite; }
        .cta-pattern { position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(0,0,0,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.03) 1px,transparent 1px);background-size:46px 46px; }
        .cta-blb { position:absolute;border-radius:50%;filter:blur(75px);pointer-events:none; }
        .ctb1 { width:420px;height:420px;top:-100px;right:-80px;background:rgba(104,90,255,.12);animation:floatUp 12s ease-in-out infinite; }
        .ctb2 { width:220px;height:220px;bottom:-50px;left:5%;background:rgba(232,160,32,.15);animation:floatUp 9s ease-in-out 3s infinite; }
        .cta-row { max-width:1260px;margin:0 auto;padding:0 2.5rem;display:flex;align-items:center;justify-content:space-between;gap:3rem;flex-wrap:wrap;position:relative;z-index:1; }
        .cta-kicker { font-family:'Cabinet Grotesk',sans-serif;font-weight:700;font-size:.68rem;letter-spacing:.25em;text-transform:uppercase;color:var(--c-purple);margin-bottom:.6rem;display:block; }
        .cta-h { font-family:'Fraunces',serif;font-weight:900;font-size:clamp(2rem,4vw,3.5rem);color:var(--ink);line-height:1.05; }
        .cta-h em { font-style:italic;color:var(--c-purple); }
        .cta-p { font-family:'Cabinet Grotesk',sans-serif;font-size:.96rem;line-height:1.8;color:var(--ink-body);margin-top:.7rem;max-width:440px; }
        .cta-acts { display:flex;align-items:center;gap:1.5rem;flex-wrap:wrap; }
        .btn-ink { display:inline-flex;align-items:center;gap:.5rem;background:var(--c-pink);color:var(--white);font-family:'Cabinet Grotesk',sans-serif;font-weight:800;font-size:.88rem;letter-spacing:.05em;text-transform:uppercase;padding:1rem 2.5rem;text-decoration:none;border-radius:50px;transition:all .3s;box-shadow:0 4px 22px rgba(255,0,135,.35); }
        .btn-ink:hover { transform:translateY(-3px); }

        @media(max-width:1024px){
          .two-col{grid-template-columns:1fr;gap:3rem}
          .about-collage{display:none}
          .svc-img-grid{grid-template-columns:repeat(3,1fr)}
          .steps-img-row{grid-template-columns:repeat(3,1fr)}
          .cta-row{flex-direction:column;text-align:center}
          .cta-acts{justify-content:center}
        }
        @media(max-width:640px){
          .hero-body{padding:6rem 1.5rem 5rem}
          .svc-img-grid{grid-template-columns:repeat(2,1fr)}
          .steps-img-row{grid-template-columns:repeat(2,1fr)}
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section className="hero">
        <div className="hero-grain"/>
        <div className="hero-grid"/>
        <div className="hero-blob hb1"/>
        <div className="hero-blob hb2"/>
        <div className="hero-blob hb3"/>

        {/* floating dots */}
        <svg className="hero-dots-svg" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
          {[[80,120],[200,450],[400,80],[600,350],[900,120],[1100,500],[1250,200],[1350,650],[150,680],[700,600]].map(([cx,cy],i) => (
            <circle key={i} cx={cx} cy={cy} r="2.5" fill="rgba(232,131,10,0.35)"
              style={{animation:`pulse ${3+i*.4}s ease-in-out ${i*.3}s infinite`}}/>
          ))}
        </svg>

        <div className="hero-body">

          {/* eyebrow pill */}
          <div className="h-eyebrow">
            <span className="h-eyebrow-dot"/>
            <span>Trusted Employment Partner · Est. 2020</span>
          </div>

          {/* heading */}
          <h1 className="hero-h1">
            Connecting<br/>
            <span className="h1-gold">Talent</span> with<br/>
            <span className="h1-outline">Opportunity</span>
          </h1>

          {/* divider */}
          <div className="hero-divider"/>

          {/* paragraph */}
          <p className="hero-p">
            Nachi Consultation bridges the gap between <strong>skilled workers</strong> and employers across India. From security to housekeeping — we place the right people, in the right roles, <strong>right away.</strong>
          </p>

          {/* stacked buttons */}
          <div className="hero-btns">
            <Link href="/services" className="btn-primary">
              <span>Explore Services</span>
              <span>→</span>
            </Link>
            <Link href="/contact" className="btn-secondary">
              <span>Apply for a Job</span>
            </Link>
          </div>

        </div>

        {/* wave */}
        <div className="hero-wave">
          <svg viewBox="0 0 1440 70" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,35 C180,70 360,0 540,35 C720,70 900,0 1080,35 C1260,70 1350,15 1440,35 L1440,70 L0,70 Z" fill="#FDF6EE"/>
          </svg>
        </div>
      </section>

      {/* ══ ABOUT ══ */}
      <section className="about">
        <div className="about-glow ag1"/><div className="about-glow ag2"/>
        <div className="wrap">
          <div className="two-col">
            <div>
              <p className="tag-label">Who We Are</p>
              <h2 className="sec-h">India's Most Trusted<br/><em>Workforce Placement</em><br/>Platform</h2>
              <div className="body-txt">
                <p>At <strong>Nachi Consultation Pvt. Ltd.</strong>, we specialize in sourcing, vetting, and placing skilled workers across industries. We don't just fill vacancies — we create lasting employment opportunities that transform lives.</p>
                <p>Whether you're an employer needing reliable staff or a job seeker looking for your next opportunity, <strong>Nachi is your trusted bridge to success.</strong></p>
              </div>
              <Link href="/about" className="btn-about"><span>Learn More About Us</span><span>→</span></Link>
            </div>
            <div className="about-collage-wrap">
              <div className="about-collage">
                {aboutPhotos.map((p, i) => (
                  <div key={i} className="ac-photo">
                    <img src={p.img} alt={p.label} loading="lazy"/>
                    <div className="ac-photo-overlay"/>
                    <div className="ac-photo-label">{p.label}</div>
                  </div>
                ))}
              </div>
              <div className="about-badge">
                <span className="ab-yr">2020</span>
                <span className="ab-lb">Founded</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══ */}
      <div className="svc-wrapper">
        <div className="svc-wave-top">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,30 C1260,90 1080,10 900,50 C720,90 540,10 360,50 C180,90 90,20 0,60 Z" fill="#FDF6EE"/>
            <path d="M0,60 C90,20 180,90 360,50 C540,10 720,90 900,50 C1080,10 1260,90 1440,30 L1440,100 L0,100 Z" fill="#C8590A"/>
          </svg>
        </div>
        <section className="svc">
          <div className="svc-glow sg1"/><div className="svc-glow sg2"/>
          <div className="wrap">
            <div style={{marginBottom:'3.5rem',position:'relative',zIndex:1}}>
              <div style={{fontFamily:"'Fraunces',serif",fontWeight:900,fontSize:'clamp(2.5rem,5vw,4.5rem)',color:'#fff',lineHeight:1,marginBottom:'.3rem'}}>What We Offer.</div>
              <div style={{fontFamily:"'Cabinet Grotesk',sans-serif",fontSize:'clamp(1.2rem,2.5vw,2.2rem)',fontWeight:800,color:'rgba(255,255,255,.5)',lineHeight:1}}>Skilled staff. Every role.</div>
            </div>
            <div className="svc-img-grid">
              {serviceCards.map((s, i) => (
                <div key={i} className="svc-img-card">
                  <img src={s.img} alt={s.title} loading="lazy"/>
                  <div className="svc-img-overlay"/>
                  <div className="svc-img-color-bar" style={{background:s.color}}/>
                  <span className="svc-img-tag">{s.tag}</span>
                  <div className="svc-img-bottom">
                    <div className="svc-img-title">{s.title}</div>
                    <Link href="/services" className="svc-img-link" style={{color:s.color}}>View Roles →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="svc-wave-bottom">
          <svg viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,60 C1350,20 1260,90 1080,50 C900,10 720,90 540,50 C360,10 180,90 0,40 Z" fill="#C8590A"/>
            <path d="M0,40 C180,90 360,10 540,50 C720,90 900,10 1080,50 C1260,90 1350,20 1440,60 L1440,100 L0,100 Z" fill="#1B4D5C"/>
          </svg>
        </div>
      </div>

      {/* ══ HOW IT WORKS ══ */}
      <section className="hiw">
        <div className="hiw-blob hwb1"/><div className="hiw-blob hwb2"/>
        <div className="wrap">
          <div className="hiw-head">
            <p className="tag-label" style={{color:'#E8A020',justifyContent:'center'}}>How It Works</p>
            <h2 className="hiw-title">How Nachi <em>Works for You</em></h2>
            <p className="hiw-subtitle">Five simple steps from requirement to successful placement.</p>
          </div>
          <div className="steps-img-row">
            {steps.map((s, i) => (
              <div key={i} className="step-img-card">
                <div className="step-img-wrap">
                  <img src={s.img} alt={s.title} loading="lazy"/>
                  <div className="step-num-bubble" style={{borderColor:s.color,color:s.color}}>{s.n}</div>
                </div>
                <div className="step-img-bottom">
                  <div className="step-dot" style={{background:s.color}}/>
                  <div className="step-img-title">{s.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="cta-sec">
        <div className="cta-pattern"/>
        <div className="cta-blb ctb1"/><div className="cta-blb ctb2"/>
        <div className="cta-row">
          <div>
            <span className="cta-kicker">Get Started Today</span>
            <h2 className="cta-h">Ready to Find Work<br/>or <em>Hire Staff?</em></h2>
            <p className="cta-p">Whether you're seeking employment or looking for skilled workers — we're here to help. Get in touch today.</p>
          </div>
          <div className="cta-acts">
            <Link href="/contact" className="btn-ink"><span>Contact Us Now</span><span>→</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
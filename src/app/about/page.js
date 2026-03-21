'use client';
import Link from 'next/link';

const values = [
  { icon: '🎯', title: 'Mission-Driven', desc: 'We exist to reduce unemployment and give every worker a fair chance at dignified employment.', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80', label: 'Our Purpose', accent: '#FF9700' },
  { icon: '✅', title: 'Verified & Trusted', desc: 'Every candidate undergoes background checks, skills assessments, and identity verification.', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80', label: 'Background Check', accent: '#00C49A' },
  { icon: '⚡', title: 'Fast & Reliable', desc: 'We deliver staffing solutions within 24–48 hours without compromising on quality.', img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80', label: '24–48h Delivery', accent: '#685AFF' },
  { icon: '🤝', title: 'People First', desc: 'Employers and employees are equally important. We build long-term relationships that last.', img: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80', label: 'Human Connection', accent: '#FF0087' },
  { icon: '📈', title: 'Growth-Oriented', desc: 'We not only place people in jobs but provide guidance for career advancement too.', img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80', label: 'Career Growth', accent: '#FFC700' },
];

export default function AboutPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');

        :root {
          --forest: #12312C;
          --teal:   #00685F;
          --amber:  #FF9700;
          --amber-dark: #E07625;
          --cream:  #FEFDF4;
          --warm:   #F5ECD7;
          --ink:    #1C2B28;
          --gray:   #6B7B74;
          --white:  #ffffff;
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes heroIn      { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(.92)}       to{opacity:1;transform:scale(1)} }
        @keyframes rotateSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes floatY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes shimmer     { 0%{background-position:-400% center} 100%{background-position:400% center} }
        @keyframes cardReveal  { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }

        /* ══ HERO ══ */
        .ab-hero {
          background: var(--forest);
          min-height: 100vh;
          position: relative; overflow: hidden;
          display: flex; align-items: center;
          padding: 9rem 0 6rem;
        }
        .ab-mesh {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px, transparent 1px);
          background-size: 70px 70px;
        }
        .hero-glow { position:absolute; inset:0; pointer-events:none; z-index:1; }
        .hg { position:absolute; border-radius:50%; filter:blur(80px); }
        .hg-1 { width:500px;height:500px; top:-160px;right:-120px; background:rgba(255,151,0,.07); }
        .hg-2 { width:350px;height:350px; bottom:-80px;left:-80px; background:rgba(0,104,95,.1); }
        .hg-3 { width:180px;height:180px; top:42%;left:28%; background:rgba(237,215,144,.06); }
        .hero-ring { position:absolute; border-radius:50%; border:1px dashed rgba(255,151,0,.1); animation:rotateSlow 28s linear infinite; pointer-events:none; z-index:1; width:340px;height:340px; top:8%;left:36%; }
        .ab-hero-inner { max-width:1240px; margin:0 auto; padding:0 2.5rem; display:grid; grid-template-columns:1.05fr 1fr; gap:5rem; align-items:center; position:relative; z-index:2; }
        .ab-breadcrumb { font-family:'DM Sans',sans-serif; font-size:.72rem; letter-spacing:.18em; text-transform:uppercase; color:rgba(255,255,255,.3); margin-bottom:2rem; display:flex; align-items:center; gap:.5rem; animation:heroIn .6s ease .1s both; }
        .ab-breadcrumb a{color:rgba(255,255,255,.3);text-decoration:none;transition:color .3s}
        .ab-breadcrumb a:hover{color:var(--amber)}
        .ab-bc-sep{color:var(--amber);opacity:.6}
        .ab-eyebrow { display:inline-flex; align-items:center; gap:.75rem; font-family:'DM Sans',sans-serif; font-weight:500; font-size:.72rem; letter-spacing:.24em; text-transform:uppercase; color:var(--amber); margin-bottom:1.5rem; animation:heroIn .6s ease .2s both; }
        .ab-eyebrow-line{width:2.5rem;height:1.5px;background:var(--amber)}
        .ab-hero-title { font-family:'Cormorant Garamond',serif; font-size:clamp(3.2rem,6vw,6.2rem); font-weight:700; color:var(--white); line-height:1.0; margin-bottom:1.5rem; animation:heroIn .7s ease .3s both; }
        .ab-hero-title .accent{color:var(--amber);font-style:italic}
        .ab-hero-title .soft{font-weight:400;color:rgba(255,255,255,.7)}
        .ab-hero-desc { font-family:'DM Sans',sans-serif; font-size:1rem; line-height:1.88; color:rgba(255,255,255,.52); max-width:460px; margin-bottom:2.5rem; animation:heroIn .7s ease .4s both; }
        .ab-hero-desc strong{color:rgba(255,255,255,.85);font-weight:500}
        .ab-hero-btns { display:flex; align-items:center; gap:1rem; flex-wrap:wrap; animation:heroIn .7s ease .5s both; }
        .btn-amber { display:inline-flex; align-items:center; gap:.5rem; background:var(--amber); color:var(--ink); font-family:'DM Sans',sans-serif; font-weight:600; font-size:.86rem; letter-spacing:.05em; padding:.95rem 2.2rem; text-decoration:none; position:relative; overflow:hidden; transition:transform .3s,box-shadow .3s; }
        .btn-amber::after{content:'';position:absolute;inset:0;background:var(--amber-dark);transform:translateX(-101%);transition:transform .3s ease;z-index:0}
        .btn-amber:hover::after{transform:translateX(0)}
        .btn-amber:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(255,151,0,.3)}
        .btn-amber>*{position:relative;z-index:1}
        .btn-ghost-w { display:inline-flex; align-items:center; gap:.5rem; background:transparent; color:rgba(255,255,255,.65); font-family:'DM Sans',sans-serif; font-weight:500; font-size:.86rem; letter-spacing:.05em; padding:.95rem 2.2rem; text-decoration:none; border:1.5px solid rgba(255,255,255,.14); transition:all .3s; }
        .btn-ghost-w:hover{border-color:var(--amber);color:var(--amber)}
        .ab-collage { position:relative; height:560px; animation:scaleIn .9s ease .35s both; }
        .coll-img { position:absolute; overflow:hidden; border:1px solid rgba(255,255,255,.09); }
        .coll-img img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.88)}
        .ci-a{top:0;left:0;right:90px;bottom:130px}
        .ci-b{top:30px;right:0;width:210px;height:210px;border:2px solid var(--amber)}
        .ci-c{bottom:0;left:50px;width:270px;height:140px}
        .coll-badge { position:absolute; padding:.9rem 1.4rem; font-family:'DM Sans',sans-serif; animation:floatY ease-in-out infinite; z-index:4; }
        .cb-a{background:var(--amber);color:var(--ink);bottom:135px;right:8px;animation-duration:5s}
        .cb-b{background:var(--teal);color:var(--white);top:16px;right:218px;animation-duration:7s;animation-delay:-3s}
        .cb-big{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;line-height:1;display:block}
        .cb-sm{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;opacity:.75;display:block;margin-top:.12rem}
        .coll-ring{position:absolute;border-radius:50%;border:1.5px dashed rgba(255,151,0,.2);animation:rotateSlow linear infinite;pointer-events:none}
        .cr-a{width:90px;height:90px;bottom:40px;right:152px;animation-duration:20s}
        .cr-b{width:52px;height:52px;top:110px;left:8px;animation-duration:14s;animation-direction:reverse;border-color:rgba(0,104,95,.25)}

        /* ══ STORY ══ */
        .story-sec { background:var(--cream); padding:8rem 0; position:relative; overflow:hidden; }
        .story-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .sg-1{width:340px;height:340px;top:-100px;right:-80px;background:rgba(255,151,0,.06)}
        .sg-2{width:200px;height:200px;bottom:-50px;left:3%;background:rgba(0,104,95,.07)}
        .story-wrap{max-width:1240px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1}
        .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center}
        .story-img-col{position:relative}
        .si-frame{ overflow:hidden;aspect-ratio:4/5; border-top:4px solid var(--amber); position:relative; }
        .si-frame img{width:100%;height:100%;object-fit:cover;display:block}
        .si-caption{ position:absolute;bottom:0;left:0;right:0; background:linear-gradient(to top,rgba(18,49,44,.92),transparent); padding:1.5rem 1.25rem .85rem; }
        .si-caption-label{ font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:600; letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:.2rem }
        .si-caption-val{ font-family:'Cormorant Garamond',serif;font-style:italic; font-size:1.05rem;color:rgba(255,255,255,.85) }
        .si-quote-card{ position:absolute;bottom:-28px;right:-28px; background:var(--forest);color:var(--white); padding:1.75rem 2rem;width:240px; border-left:4px solid var(--amber);z-index:2; box-shadow:0 20px 50px rgba(0,0,0,.2); }
        .sqc-text{ font-family:'Cormorant Garamond',serif;font-style:italic; font-size:1rem;line-height:1.7;color:rgba(255,255,255,.8);margin-bottom:.7rem }
        .sqc-by{ font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:600; letter-spacing:.14em;text-transform:uppercase;color:var(--amber) }
        .sec-tag { font-family:'DM Sans',sans-serif;font-weight:600; font-size:.7rem;letter-spacing:.22em;text-transform:uppercase; color:var(--amber);margin-bottom:1rem; display:flex;align-items:center;gap:.75rem; }
        .sec-tag::before{content:'';width:2rem;height:1.5px;background:var(--amber)}
        .story-title{ font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,3.5vw,3.2rem);font-weight:700; color:var(--ink);line-height:1.1;margin-bottom:1.75rem }
        .story-title em{font-style:italic;color:var(--teal)}
        .story-body{font-family:'DM Sans',sans-serif;font-size:.95rem;line-height:1.9;color:#5a6a62}
        .story-body p{margin-bottom:1.1rem}
        .story-body strong{color:var(--ink);font-weight:600}
        .founder-chip{ display:inline-flex;align-items:center;gap:1rem; background:var(--forest);padding:1rem 1.5rem;margin-top:1.8rem }
        .fc-av{ width:44px;height:44px;border-radius:50%; background:var(--amber); display:flex;align-items:center;justify-content:center; font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--ink);flex-shrink:0 }
        .fc-name{font-family:'DM Sans',sans-serif;font-weight:600;font-size:.92rem;color:var(--white)}
        .fc-role{font-family:'DM Sans',sans-serif;font-size:.73rem;color:rgba(255,255,255,.38);margin-top:.1rem}

        /* ══ VALUES — redesigned UX cards ══ */
        .values-sec {
          background: #0D2820;
          padding: 8rem 0;
          position: relative; overflow: hidden;
        }
        .values-glow{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
        .vg-1{width:500px;height:500px;top:-160px;left:-140px;background:rgba(0,104,95,.15)}
        .vg-2{width:350px;height:350px;bottom:-80px;right:-60px;background:rgba(255,151,0,.1)}
        .vg-3{width:200px;height:200px;top:40%;left:45%;background:rgba(104,90,255,.08)}

        .values-wrap{max-width:1240px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1}

        .values-hd-new {
          text-align:center;
          margin-bottom:5rem;
        }
        .values-eyebrow {
          display:inline-flex;align-items:center;gap:.75rem;
          font-family:'DM Sans',sans-serif;font-weight:600;font-size:.7rem;
          letter-spacing:.24em;text-transform:uppercase;
          color:var(--amber);margin-bottom:1.25rem;
        }
        .values-eyebrow::before,.values-eyebrow::after{content:'';width:2rem;height:1.5px;background:var(--amber)}
        .values-main-title {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2.5rem,4.5vw,4.5rem);font-weight:700;
          color:var(--white);line-height:1.05;margin-bottom:1rem;
        }
        .values-main-title em{font-style:italic;color:var(--amber)}
        .values-main-sub {
          font-family:'DM Sans',sans-serif;font-size:.96rem;
          line-height:1.8;color:rgba(255,255,255,.38);
          max-width:540px;margin:0 auto;
        }

        /* ── card grid ── */
        .val-grid-new {
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1.5rem;
        }

        .val-card-new {
          position:relative;
          border-radius:24px;
          overflow:hidden;
          cursor:default;
          transition:transform .4s cubic-bezier(.34,1.56,.64,1), box-shadow .4s;
          animation:cardReveal .6s ease both;
          background:#0A1F18;
          border:1px solid rgba(255,255,255,.06);
        }
        .val-card-new:nth-child(1){animation-delay:.05s}
        .val-card-new:nth-child(2){animation-delay:.12s}
        .val-card-new:nth-child(3){animation-delay:.19s}
        .val-card-new:nth-child(4){animation-delay:.26s}
        .val-card-new:nth-child(5){animation-delay:.33s}
        .val-card-new:hover {
          transform:translateY(-10px) scale(1.02);
        }

        /* image area */
        .vcn-img {
          position:relative;
          height:200px;
          overflow:hidden;
        }
        .vcn-img img {
          width:100%;height:100%;object-fit:cover;display:block;
          transition:transform .6s ease;
          filter:brightness(.65) saturate(.9);
        }
        .val-card-new:hover .vcn-img img { transform:scale(1.08); }

        /* gradient overlay on image */
        .vcn-img-overlay {
          position:absolute;inset:0;
          background:linear-gradient(180deg,rgba(0,0,0,.1) 0%,rgba(10,31,24,.95) 100%);
        }

        /* accent color top bar */
        .vcn-topbar {
          position:absolute;top:0;left:0;right:0;height:3px;
          transition:height .35s;
        }
        .val-card-new:hover .vcn-topbar { height:5px; }

        /* label chip on image */
        .vcn-chip {
          position:absolute;top:14px;left:14px;
          font-family:'DM Sans',sans-serif;font-weight:600;font-size:.6rem;
          letter-spacing:.14em;text-transform:uppercase;
          padding:.28rem .85rem;border-radius:100px;
          background:rgba(0,0,0,.45);
          border:1px solid rgba(255,255,255,.18);
          color:rgba(255,255,255,.75);
          backdrop-filter:blur(6px);
          z-index:2;
        }

        /* number badge */
        .vcn-num {
          position:absolute;top:14px;right:14px;
          font-family:'Bebas Neue',sans-serif;font-size:1.8rem;
          color:rgba(255,255,255,.08);line-height:1;
          z-index:2;
        }

        /* card body */
        .vcn-body {
          padding:1.6rem 1.75rem 2rem;
          position:relative;
        }

        /* icon + title row */
        .vcn-head {
          display:flex;align-items:center;gap:.85rem;
          margin-bottom:.85rem;
        }
        .vcn-icon-wrap {
          width:46px;height:46px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          font-size:1.3rem;flex-shrink:0;
          background:rgba(255,255,255,.05);
          border:1.5px solid rgba(255,255,255,.08);
          transition:transform .3s, background .3s;
        }
        .val-card-new:hover .vcn-icon-wrap {
          transform:scale(1.1) rotate(-6deg);
        }
        .vcn-title {
          font-family:'DM Sans',sans-serif;font-weight:700;font-size:1.02rem;
          color:var(--white);line-height:1.2;
        }

        /* divider line */
        .vcn-divider {
          height:1px;
          background:rgba(255,255,255,.06);
          margin-bottom:.9rem;
          position:relative;overflow:hidden;
        }
        .vcn-divider::after {
          content:'';position:absolute;top:0;left:0;height:100%;width:0;
          background:var(--amber);
          transition:width .5s ease;
        }
        .val-card-new:hover .vcn-divider::after { width:100%; }

        .vcn-desc {
          font-family:'DM Sans',sans-serif;font-size:.84rem;
          line-height:1.75;color:rgba(255,255,255,.38);
        }

        /* arrow bottom right */
        .vcn-arrow {
          position:absolute;bottom:1.4rem;right:1.6rem;
          width:32px;height:32px;border-radius:50%;
          background:rgba(255,255,255,.05);
          border:1px solid rgba(255,255,255,.08);
          display:flex;align-items:center;justify-content:center;
          font-size:.8rem;color:rgba(255,255,255,.25);
          transition:all .3s;
        }
        .val-card-new:hover .vcn-arrow {
          background:var(--amber);
          border-color:var(--amber);
          color:var(--ink);
          transform:rotate(45deg);
        }

        /* 5th card spans 2 cols for balance */
        .val-card-new:nth-child(4) { grid-column:1/2; }
        .val-card-new:nth-child(5) { grid-column:2/4; }
        .val-card-new:nth-child(5) .vcn-img { height:220px; }

        /* ══ WHY WE EXIST ══ */
        .why-sec { background:var(--warm);padding:8rem 0;position:relative;overflow:hidden }
        .why-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .wg-1{width:300px;height:300px;top:-60px;right:8%;background:rgba(255,151,0,.07)}
        .wg-2{width:160px;height:160px;bottom:4%;left:3%;background:rgba(0,104,95,.09)}
        .why-wrap{max-width:1240px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1}
        .why-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}
        .why-title{ font-family:'Cormorant Garamond',serif; font-size:clamp(2.2rem,3.5vw,3.2rem);font-weight:700; color:var(--ink);line-height:1.1;margin-bottom:1.5rem }
        .why-title em{font-style:italic;color:var(--teal)}
        .why-body{font-family:'DM Sans',sans-serif;font-size:.95rem;line-height:1.9;color:#627068}
        .why-body p{margin-bottom:1rem}
        .why-body strong{color:var(--ink);font-weight:600}
        .pillar-list{list-style:none;display:flex;flex-direction:column;gap:.75rem;margin-top:1.8rem}
        .pillar-item{ display:flex;align-items:flex-start;gap:1rem; font-family:'DM Sans',sans-serif;font-size:.88rem;color:#5a6b64; padding:.85rem 1.1rem; background:var(--white); border-left:3px solid transparent; transition:border-color .3s,transform .3s }
        .pillar-item:hover{border-left-color:var(--amber);transform:translateX(5px)}
        .p-dot{width:7px;height:7px;border-radius:50%;background:var(--amber);flex-shrink:0;margin-top:.38rem}
        .p-txt strong{color:var(--ink);font-weight:600;display:block;margin-bottom:.12rem}
        .why-mosaic{position:relative}
        .mosaic{ display:grid; grid-template-columns:1fr 1fr; grid-template-rows:220px 220px; gap:1rem }
        .mc{overflow:hidden;position:relative;transition:transform .4s ease;cursor:default}
        .mc:hover{transform:scale(1.025)}
        .mc:first-child{grid-row:1/3}
        .mc img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
        .mc:hover img{transform:scale(1.06)}
        .mc-overlay{ position:absolute;inset:0; background:linear-gradient(to top,rgba(18,49,44,.75) 0%,transparent 60%); transition:opacity .3s }
        .mc:hover .mc-overlay{opacity:.7}
        .mc-label{ position:absolute;bottom:.85rem;left:.85rem; font-family:'DM Sans',sans-serif;font-size:.66rem;font-weight:600; letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.75); z-index:2 }

        @media(max-width:1024px){
          .ab-hero-inner{grid-template-columns:1fr}
          .ab-collage{display:none}
          .story-grid,.why-grid{grid-template-columns:1fr;gap:3rem}
          .val-grid-new{grid-template-columns:repeat(2,1fr)}
          .val-card-new:nth-child(4){grid-column:auto}
          .val-card-new:nth-child(5){grid-column:auto}
          .si-quote-card{position:relative;right:auto;bottom:auto;margin-top:1rem;width:100%}
        }
        @media(max-width:640px){
          .val-grid-new{grid-template-columns:1fr}
          .val-card-new:nth-child(5){grid-column:auto}
          .mosaic{grid-template-columns:1fr;grid-template-rows:200px 200px 200px}
          .mc:first-child{grid-row:auto}
          .ab-hero{padding:7rem 0 5rem}
        }
      `}</style>

      {/* ══ HERO ══ */}
      <section className="ab-hero">
        <div className="ab-mesh"/>
        <div className="hero-glow">
          <div className="hg hg-1"/><div className="hg hg-2"/><div className="hg hg-3"/>
        </div>
        <div className="hero-ring"/>
        <div className="ab-hero-inner">
          <div>
            <div className="ab-breadcrumb">
              <Link href="/">Home</Link>
              <span className="ab-bc-sep">/</span>
              About Us
            </div>
            <div className="ab-eyebrow">
              <span className="ab-eyebrow-line"/>
              Nachi Consultant Pvt. Ltd. · Est. 2020
            </div>
            <h1 className="ab-hero-title">
              We Give Every<br/>
              <span className="accent">Indian Worker</span><br/>
              a <span className="soft">Fair Chance.</span>
            </h1>
            <p className="ab-hero-desc">
              Founded in <strong>Visakhapatnam</strong> by <strong>Mr. Naidu</strong>, Nachi Consultant Pvt. Ltd. connects hardworking people across Andhra Pradesh with employers who value reliability, honesty, and dedication — delivered in 24 to 48 hours.
            </p>
            <div className="ab-hero-btns">
              <Link href="/contact" className="btn-amber"><span>Find Jobs Now</span><span>→</span></Link>
              <Link href="/services" className="btn-ghost-w"><span>Our Services</span></Link>
            </div>
          </div>
          <div className="ab-collage">
            <div className="coll-img ci-a"><img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Workers team"/></div>
            <div className="coll-img ci-b"><img src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80" alt="Handshake"/></div>
            <div className="coll-img ci-c"><img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80" alt="Visakhapatnam"/></div>
            <div className="coll-badge cb-a"><span className="cb-big">500+</span><span className="cb-sm">Lives Placed</span></div>
            <div className="coll-badge cb-b"><span className="cb-big">48h</span><span className="cb-sm">Avg. Placement</span></div>
            <div className="coll-ring cr-a"/><div className="coll-ring cr-b"/>
          </div>
        </div>
      </section>

      {/* ══ STORY ══ */}
      <section className="story-sec">
        <div className="story-glow sg-1"/><div className="story-glow sg-2"/>
        <div className="story-wrap">
          <div className="story-grid">
            <div className="story-img-col">
              <div className="si-frame">
                <img src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80" alt="Nachi office"/>
                <div className="si-caption">
                  <div className="si-caption-label">Headquarters</div>
                  <div className="si-caption-val">Muralinagar, Visakhapatnam, Andhra Pradesh</div>
                </div>
              </div>
              <div className="si-quote-card">
                <p className="sqc-text">"No willing worker should go jobless. That belief built everything we've made."</p>
                <span className="sqc-by">— Mr. Naidu, Founder</span>
              </div>
            </div>
            <div>
              <p className="sec-tag">Our Story</p>
              <h2 className="story-title">Born in Vizag.<br/>Built for <em>India's Workers.</em></h2>
              <div className="story-body">
                <p>Nachi Consultant Pvt. Ltd. was founded by <strong>Mr. Naidu</strong> in <strong>Visakhapatnam, Andhra Pradesh</strong> — a city that knows the value of hard work and honest living.</p>
                <p>A placement agency rooted in <strong>trust, speed, and dignity</strong>. Real humans matching real workers with employers within <strong>24 to 48 hours</strong>.</p>
                <p>Since 2020, we have placed over <strong>500 individuals</strong> — partnering with <strong>60+ companies</strong> across <strong>10+ cities</strong> in Andhra Pradesh and beyond.</p>
                <p>Every number is a family. Every placement is a story of hope fulfilled.</p>
              </div>
              <div className="founder-chip">
                <div className="fc-av">N</div>
                <div><div className="fc-name">Mr. Naidu</div><div className="fc-role">Founder &amp; CEO · Visakhapatnam, AP</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES — redesigned UX cards ══ */}
      <section className="values-sec">
        <div className="values-glow vg-1"/><div className="values-glow vg-2"/><div className="values-glow vg-3"/>
        <div className="values-wrap">

          <div className="values-hd-new">
            <div className="values-eyebrow">What Drives Us</div>
            <h2 className="values-main-title">Values That<br/><em>Never Compromise.</em></h2>
            <p className="values-main-sub">Five principles guide every placement, every call, every relationship we build — held to the highest standard every single day.</p>
          </div>

          <div className="val-grid-new">
            {values.map((v, i) => (
              <div key={i} className="val-card-new">
                {/* image */}
                <div className="vcn-img">
                  <img src={v.img} alt={v.title} loading="lazy"/>
                  <div className="vcn-img-overlay"/>
                  <div className="vcn-topbar" style={{background:v.accent}}/>
                  <span className="vcn-chip">{v.label}</span>
                  <span className="vcn-num">0{i+1}</span>
                </div>
                {/* body */}
                <div className="vcn-body">
                  <div className="vcn-head">
                    <div className="vcn-icon-wrap" style={{borderColor:`${v.accent}30`,background:`${v.accent}12`}}>
                      {v.icon}
                    </div>
                    <div className="vcn-title">{v.title}</div>
                  </div>
                  <div className="vcn-divider"/>
                  <p className="vcn-desc">{v.desc}</p>
                  <div className="vcn-arrow">→</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHY WE EXIST ══ */}
      <section className="why-sec">
        <div className="why-glow wg-1"/><div className="why-glow wg-2"/>
        <div className="why-wrap">
          <div className="why-grid">
            <div>
              <p className="sec-tag">Why We Exist</p>
              <h2 className="why-title">Connecting <em>Ambition</em><br/>With Opportunity</h2>
              <div className="why-body">
                <p>Millions of skilled, willing workers across India remain unemployed — not because they lack ability, but because no one gave them a fair platform. Nachi Consultant Pvt. Ltd. was created to change that reality, one placement at a time.</p>
                <p>We work across five core service categories, ensuring workers and employers always get exactly what they need.</p>
              </div>
              <ul className="pillar-list">
                {[
                  { title:'Security Services', desc:'Trained, verified guards for offices, malls & residences.' },
                  { title:'Housekeeping', desc:'Professional staff for corporate, hotel, and home settings.' },
                  { title:'Packers & Movers', desc:'Skilled logistics teams for household and commercial moves.' },
                  { title:'Driver Services', desc:'Licensed, background-checked drivers for any requirement.' },
                ].map((p, i) => (
                  <li key={i} className="pillar-item">
                    <span className="p-dot"/>
                    <div className="p-txt"><strong>{p.title}</strong>{p.desc}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="why-mosaic">
              <div className="mosaic">
                <div className="mc"><img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80" alt="Security"/><div className="mc-overlay"/><span className="mc-label">Security</span></div>
                <div className="mc"><img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" alt="Cleaning"/><div className="mc-overlay"/><span className="mc-label">Cleaning</span></div>
                <div className="mc"><img src="https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=400&q=80" alt="Logistics"/><div className="mc-overlay"/><span className="mc-label">Logistics</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
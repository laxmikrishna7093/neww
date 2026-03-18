'use client';
import Link from 'next/link';

const values = [
  { icon: '🎯', title: 'Mission-Driven', desc: 'We exist to reduce unemployment and give every worker a fair chance at dignified employment.' },
  { icon: '✅', title: 'Verified & Trusted', desc: 'Every candidate undergoes background checks, skills assessments, and identity verification.' },
  { icon: '⚡', title: 'Fast & Reliable', desc: 'We deliver staffing solutions within 24–48 hours without compromising on quality.' },
  { icon: '🤝', title: 'People First', desc: 'Employers and employees are equally important. We build long-term relationships that last.' },
  { icon: '📈', title: 'Growth-Oriented', desc: 'We not only place people in jobs but provide guidance for career advancement too.' },
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

        /* ── ANIMATIONS ── */
        @keyframes heroIn      { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn     { from{opacity:0;transform:scale(.92)}       to{opacity:1;transform:scale(1)} }
        @keyframes rotateSlow  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes floatY      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }

        /* ══════════════════════════════
           HERO
        ══════════════════════════════ */
        .ab-hero {
          background: var(--forest);
          min-height: 100vh;
          position: relative; overflow: hidden;
          display: flex; align-items: center;
          padding: 9rem 0 6rem;
        }
        .ab-mesh {
          position:absolute; inset:0; pointer-events:none; z-index:0;
          background-image:
            linear-gradient(rgba(255,255,255,.022) 1px, transparent 1px),
            linear-gradient(90deg,rgba(255,255,255,.022) 1px, transparent 1px);
          background-size: 70px 70px;
        }
        .hero-glow {
          position:absolute; inset:0; pointer-events:none; z-index:1;
        }
        .hg { position:absolute; border-radius:50%; filter:blur(80px); }
        .hg-1 { width:500px;height:500px; top:-160px;right:-120px; background:rgba(255,151,0,.07); }
        .hg-2 { width:350px;height:350px; bottom:-80px;left:-80px;  background:rgba(0,104,95,.1); }
        .hg-3 { width:180px;height:180px; top:42%;left:28%; background:rgba(237,215,144,.06); }
        .hero-ring {
          position:absolute; border-radius:50%;
          border:1px dashed rgba(255,151,0,.1);
          animation:rotateSlow 28s linear infinite;
          pointer-events:none; z-index:1;
          width:340px;height:340px; top:8%;left:36%;
        }

        .ab-hero-inner {
          max-width:1240px; margin:0 auto; padding:0 2.5rem;
          display:grid; grid-template-columns:1.05fr 1fr;
          gap:5rem; align-items:center;
          position:relative; z-index:2;
        }
        .ab-breadcrumb {
          font-family:'DM Sans',sans-serif; font-size:.72rem;
          letter-spacing:.18em; text-transform:uppercase;
          color:rgba(255,255,255,.3); margin-bottom:2rem;
          display:flex; align-items:center; gap:.5rem;
          animation:heroIn .6s ease .1s both;
        }
        .ab-breadcrumb a{color:rgba(255,255,255,.3);text-decoration:none;transition:color .3s}
        .ab-breadcrumb a:hover{color:var(--amber)}
        .ab-bc-sep{color:var(--amber);opacity:.6}

        .ab-eyebrow {
          display:inline-flex; align-items:center; gap:.75rem;
          font-family:'DM Sans',sans-serif; font-weight:500;
          font-size:.72rem; letter-spacing:.24em; text-transform:uppercase;
          color:var(--amber); margin-bottom:1.5rem;
          animation:heroIn .6s ease .2s both;
        }
        .ab-eyebrow-line{width:2.5rem;height:1.5px;background:var(--amber)}

        .ab-hero-title {
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(3.2rem,6vw,6.2rem);
          font-weight:700; color:var(--white); line-height:1.0;
          margin-bottom:1.5rem;
          animation:heroIn .7s ease .3s both;
        }
        .ab-hero-title .accent{color:var(--amber);font-style:italic}
        .ab-hero-title .soft{font-weight:400;color:rgba(255,255,255,.7)}

        .ab-hero-desc {
          font-family:'DM Sans',sans-serif; font-size:1rem;
          line-height:1.88; color:rgba(255,255,255,.52);
          max-width:460px; margin-bottom:2.5rem;
          animation:heroIn .7s ease .4s both;
        }
        .ab-hero-desc strong{color:rgba(255,255,255,.85);font-weight:500}

        .ab-hero-btns {
          display:flex; align-items:center; gap:1rem; flex-wrap:wrap;
          animation:heroIn .7s ease .5s both;
        }
        .btn-amber {
          display:inline-flex; align-items:center; gap:.5rem;
          background:var(--amber); color:var(--ink);
          font-family:'DM Sans',sans-serif; font-weight:600;
          font-size:.86rem; letter-spacing:.05em;
          padding:.95rem 2.2rem; text-decoration:none;
          position:relative; overflow:hidden; transition:transform .3s,box-shadow .3s;
        }
        .btn-amber::after{content:'';position:absolute;inset:0;background:var(--amber-dark);transform:translateX(-101%);transition:transform .3s ease;z-index:0}
        .btn-amber:hover::after{transform:translateX(0)}
        .btn-amber:hover{transform:translateY(-3px);box-shadow:0 12px 28px rgba(255,151,0,.3)}
        .btn-amber>*{position:relative;z-index:1}
        .btn-ghost-w {
          display:inline-flex; align-items:center; gap:.5rem;
          background:transparent; color:rgba(255,255,255,.65);
          font-family:'DM Sans',sans-serif; font-weight:500;
          font-size:.86rem; letter-spacing:.05em;
          padding:.95rem 2.2rem; text-decoration:none;
          border:1.5px solid rgba(255,255,255,.14); transition:all .3s;
        }
        .btn-ghost-w:hover{border-color:var(--amber);color:var(--amber)}

        /* hero right — photo collage */
        .ab-collage {
          position:relative; height:560px;
          animation:scaleIn .9s ease .35s both;
        }
        .coll-img {
          position:absolute; overflow:hidden;
          border:1px solid rgba(255,255,255,.09);
        }
        .coll-img img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.88)}
        .ci-a{top:0;left:0;right:90px;bottom:130px}
        .ci-b{top:30px;right:0;width:210px;height:210px;border:2px solid var(--amber)}
        .ci-c{bottom:0;left:50px;width:270px;height:140px}

        .coll-badge {
          position:absolute; padding:.9rem 1.4rem;
          font-family:'DM Sans',sans-serif;
          animation:floatY ease-in-out infinite;
          z-index:4;
        }
        .cb-a{background:var(--amber);color:var(--ink);bottom:135px;right:8px;animation-duration:5s}
        .cb-b{background:var(--teal);color:var(--white);top:16px;right:218px;animation-duration:7s;animation-delay:-3s}
        .cb-big{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;line-height:1;display:block}
        .cb-sm{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;opacity:.75;display:block;margin-top:.12rem}

        .coll-ring{position:absolute;border-radius:50%;border:1.5px dashed rgba(255,151,0,.2);animation:rotateSlow linear infinite;pointer-events:none}
        .cr-a{width:90px;height:90px;bottom:40px;right:152px;animation-duration:20s}
        .cr-b{width:52px;height:52px;top:110px;left:8px;animation-duration:14s;animation-direction:reverse;border-color:rgba(0,104,95,.25)}



        /* ══════════════════════════════
           STORY
        ══════════════════════════════ */
        .story-sec {
          background:var(--cream); padding:8rem 0;
          position:relative; overflow:hidden;
        }
        .story-sec::before{
          content:''; position:absolute; top:0;left:0;right:0;height:4px;
          background:linear-gradient(90deg,var(--amber),var(--teal));
        }
        .story-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .sg-1{width:340px;height:340px;top:-100px;right:-80px;background:rgba(255,151,0,.06)}
        .sg-2{width:200px;height:200px;bottom:-50px;left:3%;background:rgba(0,104,95,.07)}

        .story-wrap{max-width:1240px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1}
        .story-grid{display:grid;grid-template-columns:1fr 1fr;gap:6rem;align-items:center}

        .story-img-col{position:relative}
        .si-frame{
          overflow:hidden;aspect-ratio:4/5;
          border-top:4px solid var(--amber);
          position:relative;
        }
        .si-frame img{width:100%;height:100%;object-fit:cover;display:block}

        .si-caption{
          position:absolute;bottom:0;left:0;right:0;
          background:linear-gradient(to top,rgba(18,49,44,.92),transparent);
          padding:1.5rem 1.25rem .85rem;
        }
        .si-caption-label{
          font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:.2rem
        }
        .si-caption-val{
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:1.05rem;color:rgba(255,255,255,.85)
        }

        .si-quote-card{
          position:absolute;bottom:-28px;right:-28px;
          background:var(--forest);color:var(--white);
          padding:1.75rem 2rem;width:240px;
          border-left:4px solid var(--amber);z-index:2;
          box-shadow:0 20px 50px rgba(0,0,0,.2);
        }
        .sqc-text{
          font-family:'Cormorant Garamond',serif;font-style:italic;
          font-size:1rem;line-height:1.7;color:rgba(255,255,255,.8);margin-bottom:.7rem
        }
        .sqc-by{
          font-family:'DM Sans',sans-serif;font-size:.68rem;font-weight:600;
          letter-spacing:.14em;text-transform:uppercase;color:var(--amber)
        }

        .sec-tag {
          font-family:'DM Sans',sans-serif;font-weight:600;
          font-size:.7rem;letter-spacing:.22em;text-transform:uppercase;
          color:var(--amber);margin-bottom:1rem;
          display:flex;align-items:center;gap:.75rem;
        }
        .sec-tag::before{content:'';width:2rem;height:1.5px;background:var(--amber)}

        .story-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2.2rem,3.5vw,3.2rem);font-weight:700;
          color:var(--ink);line-height:1.1;margin-bottom:1.75rem
        }
        .story-title em{font-style:italic;color:var(--teal)}

        .story-body{font-family:'DM Sans',sans-serif;font-size:.95rem;line-height:1.9;color:#5a6a62}
        .story-body p{margin-bottom:1.1rem}
        .story-body strong{color:var(--ink);font-weight:600}

        .founder-chip{
          display:inline-flex;align-items:center;gap:1rem;
          background:var(--forest);padding:1rem 1.5rem;margin-top:1.8rem
        }
        .fc-av{
          width:44px;height:44px;border-radius:50%;
          background:var(--amber);
          display:flex;align-items:center;justify-content:center;
          font-family:'Bebas Neue',sans-serif;font-size:1.3rem;color:var(--ink);flex-shrink:0
        }
        .fc-name{font-family:'DM Sans',sans-serif;font-weight:600;font-size:.92rem;color:var(--white)}
        .fc-role{font-family:'DM Sans',sans-serif;font-size:.73rem;color:rgba(255,255,255,.38);margin-top:.1rem}

        /* ══════════════════════════════
           VALUES — magazine grid style
        ══════════════════════════════ */
        .values-sec{
          background:var(--forest);padding:8rem 0;
          position:relative;overflow:hidden
        }
        .values-glow{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
        .vg-1{width:500px;height:500px;top:-160px;left:-140px;background:rgba(0,104,95,.13)}
        .vg-2{width:300px;height:300px;bottom:-80px;right:-60px;background:rgba(255,151,0,.08)}

        .values-wrap{max-width:1240px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1}
        .values-hd{
          display:grid;grid-template-columns:1fr 1fr;
          gap:4rem;align-items:end;margin-bottom:4rem
        }
        .vh-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2.5rem,4vw,4rem);font-weight:700;
          color:var(--white);line-height:1.05
        }
        .vh-title em{font-style:italic;color:var(--amber)}
        .vh-desc{
          font-family:'DM Sans',sans-serif;font-size:.94rem;
          line-height:1.88;color:rgba(255,255,255,.4);padding-top:.75rem
        }

        .val-magazine{
          display:grid;
          grid-template-columns:repeat(3,1fr);
          gap:1px;
          background:rgba(255,255,255,.05);
        }
        .val-card{
          background:var(--forest);
          padding:2.5rem 2rem;
          position:relative;overflow:hidden;
          transition:background .3s;
        }
        .val-card:hover{background:rgba(255,255,255,.04)}
        .val-card::before{
          content:'';position:absolute;top:0;left:0;right:0;height:2px;
          background:var(--amber);transform:scaleX(0);transform-origin:left;
          transition:transform .4s ease
        }
        .val-card:hover::before{transform:scaleX(1)}

        .val-img-block{
          width:100%;aspect-ratio:16/9;
          display:flex;align-items:center;justify-content:center;
          margin-bottom:1.5rem;position:relative;overflow:hidden;
        }
        .val-img-block img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.75)}
        .val-img-block .vi-overlay{
          position:absolute;inset:0;
          background:linear-gradient(to bottom,transparent 30%,rgba(18,49,44,.85));
        }
        .vi-label{
          position:absolute;bottom:.75rem;left:1rem;
          font-family:'DM Sans',sans-serif;font-size:.65rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.55)
        }

        .val-icon{font-size:1.8rem;margin-bottom:1rem;display:block}
        .val-ttl{font-family:'DM Sans',sans-serif;font-weight:600;font-size:1rem;color:var(--white);margin-bottom:.55rem}
        .val-desc{font-family:'DM Sans',sans-serif;font-size:.85rem;line-height:1.75;color:rgba(255,255,255,.38)}

        /* ══════════════════════════════
           WHY WE EXIST
        ══════════════════════════════ */
        .why-sec{
          background:var(--warm);padding:8rem 0;
          position:relative;overflow:hidden
        }
        .why-glow{position:absolute;border-radius:50%;filter:blur(80px);pointer-events:none}
        .wg-1{width:300px;height:300px;top:-60px;right:8%;background:rgba(255,151,0,.07)}
        .wg-2{width:160px;height:160px;bottom:4%;left:3%;background:rgba(0,104,95,.09)}

        .why-wrap{max-width:1240px;margin:0 auto;padding:0 2.5rem;position:relative;z-index:1}
        .why-grid{display:grid;grid-template-columns:1fr 1fr;gap:5rem;align-items:center}

        .why-title{
          font-family:'Cormorant Garamond',serif;
          font-size:clamp(2.2rem,3.5vw,3.2rem);font-weight:700;
          color:var(--ink);line-height:1.1;margin-bottom:1.5rem
        }
        .why-title em{font-style:italic;color:var(--teal)}
        .why-body{font-family:'DM Sans',sans-serif;font-size:.95rem;line-height:1.9;color:#627068}
        .why-body p{margin-bottom:1rem}
        .why-body strong{color:var(--ink);font-weight:600}

        .pillar-list{list-style:none;display:flex;flex-direction:column;gap:.75rem;margin-top:1.8rem}
        .pillar-item{
          display:flex;align-items:flex-start;gap:1rem;
          font-family:'DM Sans',sans-serif;font-size:.88rem;color:#5a6b64;
          padding:.85rem 1.1rem;
          background:var(--white);
          border-left:3px solid transparent;
          transition:border-color .3s,transform .3s
        }
        .pillar-item:hover{border-left-color:var(--amber);transform:translateX(5px)}
        .p-dot{width:7px;height:7px;border-radius:50%;background:var(--amber);flex-shrink:0;margin-top:.38rem}
        .p-txt strong{color:var(--ink);font-weight:600;display:block;margin-bottom:.12rem}

        .why-mosaic{position:relative}
        .mosaic{
          display:grid;
          grid-template-columns:1fr 1fr;
          grid-template-rows:220px 220px;
          gap:1rem
        }
        .mc{overflow:hidden;position:relative;transition:transform .4s ease;cursor:default}
        .mc:hover{transform:scale(1.025)}
        .mc:first-child{grid-row:1/3}
        .mc img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .5s ease}
        .mc:hover img{transform:scale(1.06)}
        .mc-overlay{
          position:absolute;inset:0;
          background:linear-gradient(to top,rgba(18,49,44,.75) 0%,transparent 60%);
          transition:opacity .3s
        }
        .mc:hover .mc-overlay{opacity:.7}
        .mc-label{
          position:absolute;bottom:.85rem;left:.85rem;
          font-family:'DM Sans',sans-serif;font-size:.66rem;font-weight:600;
          letter-spacing:.16em;text-transform:uppercase;color:rgba(255,255,255,.75);
          z-index:2
        }

        /* ══════════════════════════════
           RESPONSIVE
        ══════════════════════════════ */
        @media(max-width:1024px){
          .ab-hero-inner{grid-template-columns:1fr}
          .ab-collage{display:none}
          .story-grid,.why-grid{grid-template-columns:1fr;gap:3rem}
          .values-hd{grid-template-columns:1fr;gap:1.5rem}
          .val-magazine{grid-template-columns:repeat(2,1fr)}
          .si-quote-card{position:relative;right:auto;bottom:auto;margin-top:1rem;width:100%}
        }
        @media(max-width:640px){
          .val-magazine{grid-template-columns:1fr}
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
          {/* LEFT TEXT */}
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

          {/* RIGHT COLLAGE */}
          <div className="ab-collage">
            <div className="coll-img ci-a">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Workers team"
              />
            </div>
            <div className="coll-img ci-b">
              <img
                src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80"
                alt="Handshake partnership"
              />
            </div>
            <div className="coll-img ci-c">
              <img
                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80"
                alt="Visakhapatnam city"
              />
            </div>
            <div className="coll-badge cb-a">
              <span className="cb-big">500+</span>
              <span className="cb-sm">Lives Placed</span>
            </div>
            <div className="coll-badge cb-b">
              <span className="cb-big">48h</span>
              <span className="cb-sm">Avg. Placement</span>
            </div>
            <div className="coll-ring cr-a"/>
            <div className="coll-ring cr-b"/>
          </div>
        </div>
      </section>



      {/* ══ STORY ══ */}
      <section className="story-sec">
        <div className="story-glow sg-1"/>
        <div className="story-glow sg-2"/>
        <div className="story-wrap">
          <div className="story-grid">
            {/* Left photo */}
            <div className="story-img-col">
              <div className="si-frame">
                <img
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80"
                  alt="Nachi Consultant office"
                />
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

            {/* Right text */}
            <div>
              <p className="sec-tag">Our Story</p>
              <h2 className="story-title">Born in Vizag.<br/>Built for <em>India's Workers.</em></h2>
              <div className="story-body">
                <p>Nachi Consultant Pvt. Ltd. was founded by <strong>Mr. Naidu</strong> in <strong>Visakhapatnam, Andhra Pradesh</strong> — a city that knows the value of hard work and honest living. Having witnessed capable workers remain unemployed simply due to lack of connections, he built something different.</p>
                <p>A placement agency rooted in <strong>trust, speed, and dignity</strong>. No algorithms. No bureaucracy. Real humans matching real workers with employers who need them within <strong>24 to 48 hours</strong>.</p>
                <p>Since 2020, we have placed over <strong>500 individuals</strong> across security, cleaning, housekeeping, packing, and driver services — partnering with <strong>60+ companies</strong> across <strong>10+ cities</strong> in Andhra Pradesh and beyond.</p>
                <p>Every number is a family. Every placement is a story of hope fulfilled.</p>
              </div>
              <div className="founder-chip">
                <div className="fc-av">N</div>
                <div>
                  <div className="fc-name">Mr. Naidu</div>
                  <div className="fc-role">Founder &amp; CEO · Visakhapatnam, AP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES — magazine style with photos ══ */}
      <section className="values-sec">
        <div className="values-glow vg-1"/>
        <div className="values-glow vg-2"/>
        <div className="values-wrap">
          <div className="values-hd">
            <div>
              <p className="sec-tag" style={{color:'var(--amber)'}}>What Drives Us</p>
              <h2 className="vh-title">Values That<br/><em>Never Compromise.</em></h2>
            </div>
            <p className="vh-desc">Six principles guide every placement, every call, every relationship we build. These aren't posters on a wall — they're the standard we hold ourselves to every single day.</p>
          </div>

          <div className="val-magazine">
            {/* Card 1 */}
            <div className="val-card">
              <div className="val-img-block">
                <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&q=80" alt="Mission"/>
                <div className="vi-overlay"/>
                <span className="vi-label">Our Purpose</span>
              </div>
              <span className="val-icon">🎯</span>
              <h3 className="val-ttl">Mission-Driven</h3>
              <p className="val-desc">We exist to reduce unemployment and give every worker a fair chance at dignified employment.</p>
            </div>

            {/* Card 2 */}
            <div className="val-card">
              <div className="val-img-block">
                <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80" alt="Verification"/>
                <div className="vi-overlay"/>
                <span className="vi-label">Background Check</span>
              </div>
              <span className="val-icon">✅</span>
              <h3 className="val-ttl">Verified &amp; Trusted</h3>
              <p className="val-desc">Every candidate undergoes background checks, skills assessments, and identity verification.</p>
            </div>

            {/* Card 3 */}
            <div className="val-card">
              <div className="val-img-block">
                <img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80" alt="Speed"/>
                <div className="vi-overlay"/>
                <span className="vi-label">24–48 Hour Delivery</span>
              </div>
              <span className="val-icon">⚡</span>
              <h3 className="val-ttl">Fast &amp; Reliable</h3>
              <p className="val-desc">We deliver staffing solutions within 24–48 hours without compromising on quality.</p>
            </div>

            {/* Card 4 */}
            <div className="val-card">
              <div className="val-img-block">
                <img src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=80" alt="People first"/>
                <div className="vi-overlay"/>
                <span className="vi-label">Human Connection</span>
              </div>
              <span className="val-icon">🤝</span>
              <h3 className="val-ttl">People First</h3>
              <p className="val-desc">Employers and employees are equally important. We build long-term relationships that last.</p>
            </div>

            {/* Card 6 */}
            <div className="val-card">
              <div className="val-img-block">
                <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80" alt="Growth"/>
                <div className="vi-overlay"/>
                <span className="vi-label">Career Advancement</span>
              </div>
              <span className="val-icon">📈</span>
              <h3 className="val-ttl">Growth-Oriented</h3>
              <p className="val-desc">We not only place people in jobs but provide guidance for career advancement too.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ WHY WE EXIST ══ */}
      <section className="why-sec">
        <div className="why-glow wg-1"/>
        <div className="why-glow wg-2"/>
        <div className="why-wrap">
          <div className="why-grid">
            {/* Text */}
            <div>
              <p className="sec-tag">Why We Exist</p>
              <h2 className="why-title">Connecting <em>Ambition</em><br/>With Opportunity</h2>
              <div className="why-body">
                <p>Millions of skilled, willing workers across India remain unemployed — not because they lack ability, but because no one gave them a fair platform. Nachi Consultant Pvt. Ltd. was created to change that reality, one placement at a time.</p>
                <p>We work across five core service categories, ensuring workers and employers always get exactly what they need.</p>
              </div>
              <ul className="pillar-list">
                {[
                  { title: 'Security Services',       desc: 'Trained, verified guards for offices, malls & residences.' },
                  { title: 'Cleaning & Housekeeping',  desc: 'Professional staff for corporate, hotel, and home settings.' },
                  { title: 'Packers & Movers',         desc: 'Skilled logistics teams for household and commercial moves.' },
                  { title: 'Driver Services',          desc: 'Licensed, background-checked drivers for any requirement.' },
                ].map((p, i) => (
                  <li key={i} className="pillar-item">
                    <span className="p-dot"/>
                    <div className="p-txt">
                      <strong>{p.title}</strong>
                      {p.desc}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Photo mosaic */}
            <div className="why-mosaic">
              <div className="mosaic">
                <div className="mc">
                  <img src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=600&q=80" alt="Security guard"/>
                  <div className="mc-overlay"/>
                  <span className="mc-label">Security</span>
                </div>
                <div className="mc">
                  <img src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" alt="Cleaning service"/>
                  <div className="mc-overlay"/>
                  <span className="mc-label">Cleaning</span>
                </div>
                <div className="mc">
                  <img src="https://www.dhl.com/discover/adobe/dynamicmedia/deliver/dm-aid--fb2074c7-45b1-4634-945b-cbf007e04a1c/desktop-image-1920x918.jpg?preferwebp=true&quality=82" alt="Logistics packing"/>
                  <div className="mc-overlay"/>
                  <span className="mc-label">Logistics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
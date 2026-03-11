'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '',
    jobType: '', experience: '', location: '', message: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const fileRef = useRef();

  const servicesList = [
    'Security Services',
    'Cleaning Services',
    'Housekeeping',
    'Packers & Movers',
    'Driver Services',
  ];

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFile = (file) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      alert('Please upload a PDF or Word document (.pdf, .doc, .docx)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }
    setResumeFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  // ✅ FIXED: Actually calls the API route
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => data.append(key, value));
      if (resumeFile) data.append('resume', resumeFile);

      const res = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(result.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setErrorMsg('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactCards = [
    {
      icon: '📍',
      label: 'Our Office',
      value: '34/145, 1st Line Saradha Colony,\nGuntur – 522002, Andhra Pradesh',
      href: 'https://www.google.com/maps/search/Saradha+Colony+Guntur+522002',
      linkText: 'Get Directions →',
      color: '#FF9700',
    },
    {
      icon: '📞',
      label: 'Call Us',
      value: '+91 63056 50469',
      href: 'tel:+916305650469',
      linkText: 'Call Now →',
      color: '#00685F',
    },
    {
      icon: '✉️',
      label: 'Email Us',
      value: 'nagalakshmiakurathi.ak\n@gmail.com',
      href: 'mailto:nagalakshmiakurathi.ak@gmail.com',
      linkText: 'Send Email →',
      color: '#88293D',
    },
    {
      icon: '🕐',
      label: 'Working Hours',
      value: 'Monday – Saturday\n9:00 AM – 6:00 PM',
      href: null,
      linkText: null,
      color: '#5D4038',
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Barlow:wght@300;400;500;600;700&family=Barlow+Condensed:wght@400;600;700;800&display=swap');

        @keyframes rotateSlow   { from{transform:rotate(0deg)}   to{transform:rotate(360deg)} }
        @keyframes floatUp      { from{opacity:0;transform:translateY(50px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideInLeft  { from{opacity:0;transform:translateX(-60px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(60px)}  to{opacity:1;transform:translateX(0)} }
        @keyframes fadeIn       { from{opacity:0} to{opacity:1} }
        @keyframes pulseGlow    { 0%,100%{box-shadow:0 0 0 0 rgba(255,151,0,.4)} 50%{box-shadow:0 0 0 12px rgba(255,151,0,0)} }
        @keyframes shimmer      { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes bounceIn     { 0%{transform:scale(0.3);opacity:0} 50%{transform:scale(1.05)} 70%{transform:scale(0.9)} 100%{transform:scale(1);opacity:1} }
        @keyframes particleDrift {
          0%   { transform:translateY(0) translateX(0) opacity:1; }
          100% { transform:translateY(-80px) translateX(20px) opacity:0; }
        }
        @keyframes cardEntrance {
          from{opacity:0;transform:translateY(30px) scale(.96)}
          to{opacity:1;transform:translateY(0) scale(1)}
        }
        @keyframes successBounce {
          0%{transform:scale(0);opacity:0}
          60%{transform:scale(1.15)}
          80%{transform:scale(.95)}
          100%{transform:scale(1);opacity:1}
        }
        @keyframes progressBar { from{width:0} to{width:100%} }
        @keyframes waPulse {
          0%,100%{box-shadow:0 0 0 0 rgba(37,211,102,.5)}
          50%{box-shadow:0 0 0 10px rgba(37,211,102,0)}
        }

        .contact-hero {
          background: #12312C;
          padding: 7rem 0 4rem;
          position: relative;
          overflow: hidden;
          min-height: 38vh;
          display: flex;
          align-items: center;
        }
        .ch-orbs { position:absolute;inset:0;pointer-events:none; }
        .ch-orb { position:absolute;border-radius:50%;filter:blur(60px);opacity:.12; }
        .ch-orb1{width:500px;height:500px;background:#FF9700;top:-150px;right:-100px;animation:rotateSlow 20s linear infinite;}
        .ch-orb2{width:300px;height:300px;background:#00685F;bottom:-80px;left:-50px;animation:rotateSlow 15s linear infinite reverse;}
        .ch-orb3{width:200px;height:200px;background:#EDD790;top:40%;left:30%;animation:rotateSlow 25s linear infinite;}
        .ch-particles { position:absolute;inset:0;pointer-events:none;overflow:hidden; }
        .ch-particle { position:absolute;width:4px;height:4px;background:#FF9700;border-radius:50%;animation:particleDrift 4s ease-in infinite; }
        .ch-particle:nth-child(1){left:10%;top:80%;animation-delay:0s;opacity:.6}
        .ch-particle:nth-child(2){left:25%;top:70%;animation-delay:.8s;opacity:.4}
        .ch-particle:nth-child(3){left:50%;top:85%;animation-delay:1.6s;opacity:.7}
        .ch-particle:nth-child(4){left:70%;top:75%;animation-delay:.4s;opacity:.5}
        .ch-particle:nth-child(5){left:85%;top:60%;animation-delay:2s;opacity:.3}
        .ch-particle:nth-child(6){left:40%;top:90%;animation-delay:1.2s;opacity:.8}
        .ch-container {
          max-width:1200px;margin:0 auto;padding:0 2rem;
          position:relative;z-index:2;
          opacity:0;animation:floatUp .8s ease .1s forwards;
        }
        .ch-breadcrumb {
          font-family:'Barlow Condensed',sans-serif;
          font-size:.78rem;letter-spacing:.15em;text-transform:uppercase;
          color:rgba(255,255,255,.4);margin-bottom:1.5rem;
          display:flex;align-items:center;gap:.5rem;
        }
        .ch-breadcrumb a{color:rgba(255,255,255,.4);text-decoration:none;transition:color .3s}
        .ch-breadcrumb a:hover{color:#FF9700}
        .ch-breadcrumb span{color:#FF9700}
        .ch-eyebrow {
          display:inline-flex;align-items:center;gap:.6rem;
          font-family:'Barlow Condensed',sans-serif;
          font-size:.78rem;font-weight:700;letter-spacing:.2em;text-transform:uppercase;
          color:#FF9700;margin-bottom:1rem;
        }
        .ch-eyebrow-dot { width:6px;height:6px;background:#FF9700;border-radius:50%;animation:pulseGlow 2s ease-in-out infinite; }
        .ch-title {
          font-family:'Playfair Display',serif;
          font-size:clamp(2.5rem,5vw,4.5rem);
          font-weight:900;color:#fff;line-height:1.05;margin-bottom:1rem;
        }
        .ch-title-accent { color:#FF9700; }
        .ch-title-outline { -webkit-text-stroke:2px #EDD790;color:transparent; }
        .ch-desc { font-family:'Barlow',sans-serif;font-size:1.05rem;line-height:1.75;color:rgba(255,255,255,.6);max-width:520px; }

        .contact-section { background:#FEFFF1;padding:5rem 0 6rem;position:relative;overflow:hidden; }
        .contact-section::before {
          content:'';position:absolute;top:0;left:0;right:0;height:4px;
          background:linear-gradient(90deg,#FF9700,#E07625,#FF9700);
          background-size:200% auto;animation:shimmer 3s linear infinite;
        }
        .cs-container { max-width:1200px;margin:0 auto;padding:0 2rem; }
        .cs-grid { display:grid;grid-template-columns:420px 1fr;gap:4rem;align-items:start; }

        .info-panel { opacity:0;animation:slideInLeft .8s ease .3s forwards; }
        .info-panel-header { margin-bottom:2.5rem; }
        .info-eyebrow {
          font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.75rem;
          letter-spacing:.22em;text-transform:uppercase;color:#FF9700;margin-bottom:.75rem;
          display:flex;align-items:center;gap:.6rem;
        }
        .info-eyebrow::before{content:'';width:1.5rem;height:2px;background:#FF9700}
        .info-title { font-family:'Playfair Display',serif;font-size:2.4rem;font-weight:900;color:#31383E;line-height:1.1;margin-bottom:1rem; }
        .info-title em { font-style:italic;color:#00685F; }
        .info-sub { font-family:'Barlow',sans-serif;font-size:.92rem;line-height:1.8;color:#666; }

        .contact-cards { display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem; }
        .cc-card {
          background:#fff;border-left:4px solid var(--cc-color,#FF9700);
          padding:1.1rem 1.25rem;display:flex;align-items:flex-start;gap:1rem;
          position:relative;overflow:hidden;
          transition:all .35s cubic-bezier(.34,1.56,.64,1);
          opacity:0;animation:cardEntrance .6s ease forwards;
        }
        .cc-card:nth-child(1){animation-delay:.4s}
        .cc-card:nth-child(2){animation-delay:.55s}
        .cc-card:nth-child(3){animation-delay:.7s}
        .cc-card:nth-child(4){animation-delay:.85s}
        .cc-card::after { content:'';position:absolute;inset:0;background:linear-gradient(90deg,var(--cc-color,#FF9700),transparent);opacity:0;transition:opacity .35s ease; }
        .cc-card:hover { transform:translateX(8px);box-shadow:0 8px 30px rgba(0,0,0,.1); }
        .cc-card:hover::after{opacity:.04}
        .cc-icon { font-size:1.4rem;flex-shrink:0;width:42px;height:42px;background:rgba(0,0,0,.04);border-radius:50%;display:flex;align-items:center;justify-content:center;transition:transform .35s ease; }
        .cc-card:hover .cc-icon{transform:scale(1.15) rotate(-5deg)}
        .cc-body { flex:1;position:relative;z-index:1; }
        .cc-label { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:var(--cc-color,#FF9700);margin-bottom:.2rem; }
        .cc-value { font-family:'Barlow',sans-serif;font-size:.88rem;line-height:1.6;color:#31383E;white-space:pre-line;margin-bottom:.35rem; }
        .cc-link { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.75rem;letter-spacing:.08em;color:var(--cc-color,#FF9700);text-decoration:none;display:inline-flex;align-items:center;gap:.3rem;transition:gap .3s ease;position:relative; }
        .cc-link::after{content:'';position:absolute;bottom:-1px;left:0;right:0;height:1px;background:var(--cc-color,#FF9700);transform:scaleX(0);transform-origin:left;transition:transform .3s ease;}
        .cc-link:hover{gap:.6rem}
        .cc-link:hover::after{transform:scaleX(1)}

        .map-embed-wrap { position:relative;overflow:hidden;clip-path:polygon(0 0,96% 0,100% 4%,100% 100%,4% 100%,0 96%);opacity:0;animation:fadeIn .8s ease 1s forwards; }
        .map-embed-wrap iframe { width:100%;height:260px;border:none;display:block;filter:grayscale(30%) contrast(1.05);transition:filter .4s ease; }
        .map-embed-wrap:hover iframe{filter:grayscale(0%) contrast(1)}
        .map-overlay-bar { position:absolute;bottom:0;left:0;right:0;background:linear-gradient(to top,rgba(18,49,44,.9),transparent);padding:.75rem 1rem;display:flex;align-items:center;justify-content:space-between; }
        .mob-label { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.1em;text-transform:uppercase;color:#fff; }
        .mob-link { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.75rem;color:#FF9700;text-decoration:none;letter-spacing:.08em;transition:color .3s; }
        .mob-link:hover{color:#EDD790}

        .wa-strip {
          margin-top:1.25rem;background:linear-gradient(135deg,#25D366,#128C7E);
          padding:1rem 1.5rem;display:flex;align-items:center;gap:.75rem;
          text-decoration:none;cursor:pointer;border-radius:4px;
          position:relative;z-index:10;
          transition:transform .3s ease, box-shadow .3s ease;
          opacity:0;animation:slideInLeft .6s ease 1.1s forwards;
          pointer-events:auto;
        }
        .wa-strip:hover{transform:translateY(-3px);box-shadow:0 12px 30px rgba(37,211,102,.35)}
        .wa-strip:active{transform:translateY(-1px)}
        .wa-icon { font-size:1.6rem;flex-shrink:0;width:44px;height:44px;background:rgba(255,255,255,.15);border-radius:50%;display:flex;align-items:center;justify-content:center;animation:waPulse 2.5s ease-in-out infinite; }
        .wa-text-block{flex:1}
        .wa-title { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1rem;letter-spacing:.06em;color:#fff;margin-bottom:.1rem; }
        .wa-sub { font-family:'Barlow',sans-serif;font-size:.78rem;color:rgba(255,255,255,.85); }
        .wa-arrow { font-size:1.2rem;color:rgba(255,255,255,.7);transition:transform .3s ease, color .3s ease; }
        .wa-strip:hover .wa-arrow{transform:translateX(5px);color:#fff}

        .form-panel { opacity:0;animation:slideInRight .8s ease .3s forwards; }
        .form-wrap { background:#fff;border-top:4px solid #FF9700;box-shadow:0 20px 60px rgba(0,0,0,.08);padding:3rem;position:relative;overflow:hidden; }
        .form-wrap::before { content:'';position:absolute;top:0;left:0;right:0;height:100%;background:radial-gradient(ellipse at top right,rgba(255,151,0,.04) 0%,transparent 60%);pointer-events:none; }
        .form-heading{margin-bottom:2rem}
        .form-eyebrow { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.72rem;letter-spacing:.22em;text-transform:uppercase;color:#FF9700;margin-bottom:.5rem;display:flex;align-items:center;gap:.5rem; }
        .form-eyebrow::before{content:'';width:1.2rem;height:2px;background:#FF9700}
        .form-title { font-family:'Playfair Display',serif;font-size:1.8rem;font-weight:900;color:#31383E;line-height:1.15; }
        .form-title span{color:#FF9700}
        .form-subtitle { font-family:'Barlow',sans-serif;font-size:.88rem;color:#888;margin-top:.4rem;line-height:1.6; }

        .form-steps { display:flex;align-items:center;gap:0;margin-bottom:2rem;position:relative; }
        .form-steps::before { content:'';position:absolute;top:50%;left:0;right:0;height:2px;background:#eee;transform:translateY(-50%);z-index:0; }
        .fs-step { display:flex;flex-direction:column;align-items:center;gap:.4rem;flex:1;position:relative;z-index:1; }
        .fs-dot { width:32px;height:32px;border-radius:50%;background:#eee;border:2px solid #ddd;display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.8rem;color:#aaa;transition:all .4s ease; }
        .fs-step.done .fs-dot{background:#00685F;border-color:#00685F;color:#fff}
        .fs-step.active .fs-dot{background:#FF9700;border-color:#FF9700;color:#31383E;animation:pulseGlow 2s ease-in-out infinite}
        .fs-lbl{font-family:'Barlow Condensed',sans-serif;font-size:.65rem;letter-spacing:.1em;text-transform:uppercase;color:#aaa;transition:color .4s}
        .fs-step.active .fs-lbl{color:#FF9700;font-weight:700}
        .fs-step.done .fs-lbl{color:#00685F;font-weight:700}

        .contact-form{display:flex;flex-direction:column;gap:1.25rem;position:relative;z-index:1}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .form-group{display:flex;flex-direction:column;gap:.4rem;position:relative}
        .form-group label { font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.75rem;letter-spacing:.14em;text-transform:uppercase;color:#31383E;transition:color .3s; }
        .form-group:focus-within label{color:#FF9700}
        .form-group input,.form-group select,.form-group textarea {
          border:1.5px solid rgba(0,0,0,.1);background:#FEFFF1;padding:.9rem 1rem;
          font-family:'Barlow',sans-serif;font-size:.92rem;color:#31383E;outline:none;
          transition:all .3s ease;width:100%;appearance:none;-webkit-appearance:none;border-radius:0;
        }
        .form-group select {
          background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2331383E' fill='none' stroke-width='2'/%3E%3C/svg%3E");
          background-repeat:no-repeat;background-position:right 1rem center;
          background-color:#FEFFF1;padding-right:2.5rem;
        }
        .form-group input:focus,.form-group select:focus,.form-group textarea:focus { border-color:#FF9700;background:#fff;box-shadow:0 0 0 4px rgba(255,151,0,.08); }
        .form-group textarea{resize:vertical;min-height:110px}
        .form-group::after { content:'';position:absolute;bottom:0;left:0;right:0;height:2px;background:#FF9700;transform:scaleX(0);transform-origin:left;transition:transform .3s ease;pointer-events:none; }
        .form-group:focus-within::after{transform:scaleX(1)}

        .dropzone { border:2px dashed rgba(0,0,0,.12);background:#FEFFF1;padding:2rem;cursor:pointer;transition:all .35s ease;min-height:150px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden; }
        .dropzone::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,151,0,.015) 10px,rgba(255,151,0,.015) 20px);opacity:0;transition:opacity .35s}
        .dropzone:hover::before,.dropzone.drag-over::before{opacity:1}
        .dropzone:hover,.dropzone.drag-over{border-color:#FF9700;background:rgba(255,151,0,.03);transform:scale(1.01)}
        .dropzone.has-file{border-style:solid;border-color:#00685F;background:rgba(0,104,95,.03)}
        .dz-empty{text-align:center}
        .dz-icon{font-size:2.8rem;margin-bottom:.75rem;display:block;animation:floatUp .5s ease}
        .dz-title{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:1.05rem;color:#31383E;margin-bottom:.3rem}
        .dz-sub{font-family:'Barlow',sans-serif;font-size:.85rem;color:#888;margin-bottom:.5rem}
        .dz-sub span{color:#FF9700;font-weight:600;cursor:pointer}
        .dz-fmt{font-family:'Barlow Condensed',sans-serif;font-size:.72rem;color:#bbb;letter-spacing:.1em}
        .file-info{display:flex;align-items:center;gap:1rem;width:100%}
        .file-icon-wrap{width:50px;height:50px;background:rgba(0,104,95,.08);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;animation:bounceIn .5s ease}
        .file-details{flex:1}
        .file-name{font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.92rem;color:#31383E;word-break:break-all}
        .file-size{font-family:'Barlow',sans-serif;font-size:.75rem;color:#888;margin-top:.15rem}
        .file-bar{height:3px;background:#eee;margin-top:.5rem;position:relative;overflow:hidden}
        .file-bar-fill{height:100%;background:#00685F;animation:progressBar .8s ease forwards}
        .file-remove{background:rgba(136,41,61,.08);border:none;color:#88293D;width:30px;height:30px;border-radius:50%;font-size:.8rem;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .3s}
        .file-remove:hover{background:#88293D;color:#fff;transform:rotate(90deg)}

        .char-count{font-family:'Barlow',sans-serif;font-size:.72rem;color:#aaa;text-align:right;margin-top:.2rem}
        .char-count.warn{color:#E07625}

        /* Error message box */
        .error-box {
          background:#fff0f0;border-left:4px solid #c0392b;
          padding:.9rem 1rem;
          font-family:'Barlow',sans-serif;font-size:.88rem;color:#c0392b;
          animation:fadeIn .3s ease;
        }

        .form-submit { width:100%;justify-content:center;padding:1.15rem;font-size:.95rem;position:relative;overflow:hidden;background:#FF9700;color:#31383E;font-family:'Barlow Condensed',sans-serif;font-weight:700;letter-spacing:.12em;text-transform:uppercase;border:none;cursor:pointer;display:flex;align-items:center;gap:.5rem;transition:all .3s; }
        .form-submit::before{content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:#E07625;transition:left .3s ease;z-index:0}
        .form-submit:hover::before{left:0}
        .form-submit > *{position:relative;z-index:1}
        .form-submit:disabled{opacity:.65;cursor:not-allowed}
        .form-submit:not(:disabled):hover{transform:translateY(-2px);box-shadow:0 10px 30px rgba(255,151,0,.35)}
        .btn-loading{display:flex;align-items:center;gap:.75rem;position:relative;z-index:1}
        .spinner{width:20px;height:20px;border:2px solid rgba(0,0,0,.15);border-top-color:#31383E;border-radius:50%;animation:rotateSlow .7s linear infinite;flex-shrink:0}

        .privacy-note { font-family:'Barlow',sans-serif;font-size:.75rem;color:#bbb;text-align:center;line-height:1.6;display:flex;align-items:center;justify-content:center;gap:.4rem; }
        .privacy-note svg{flex-shrink:0}

        .success-screen{text-align:center;padding:3.5rem 2rem;animation:fadeIn .6s ease}
        .success-anim{width:90px;height:90px;background:linear-gradient(135deg,#00685F,#12312C);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:2.5rem;margin:0 auto 1.5rem;animation:successBounce .8s cubic-bezier(.34,1.56,.64,1)}
        .success-screen h3{font-family:'Playfair Display',serif;font-size:2rem;font-weight:900;color:#31383E;margin-bottom:.75rem}
        .success-screen p{font-family:'Barlow',sans-serif;font-size:.95rem;color:#666;line-height:1.75;max-width:400px;margin:0 auto 2rem}
        .success-details{display:flex;flex-direction:column;gap:.5rem;background:#FEFFF1;padding:1.25rem;margin-bottom:2rem;text-align:left;border-left:3px solid #00685F}
        .sd-row{display:flex;gap:.5rem;font-family:'Barlow',sans-serif;font-size:.85rem}
        .sd-key{font-weight:600;color:#31383E;min-width:80px}
        .sd-val{color:#666}
        .success-btn{display:inline-flex;align-items:center;gap:.5rem;background:#FF9700;color:#31383E;font-family:'Barlow Condensed',sans-serif;font-weight:700;font-size:.9rem;letter-spacing:.12em;text-transform:uppercase;padding:.9rem 2rem;border:none;cursor:pointer;transition:all .3s;margin:0 auto}
        .success-btn:hover{background:#E07625;transform:translateY(-2px)}

        @media(max-width:1050px){
          .cs-grid{grid-template-columns:1fr;gap:3rem}
          .info-panel{animation-name:floatUp}
          .form-panel{animation-name:floatUp;animation-delay:.5s}
        }
        @media(max-width:640px){
          .form-wrap{padding:1.75rem}
          .form-row{grid-template-columns:1fr}
          .form-steps{display:none}
          .ch-title{font-size:2.2rem}
        }
      `}</style>

      {/* HERO */}
      <section className="contact-hero">
        <div className="ch-orbs">
          <div className="ch-orb ch-orb1" />
          <div className="ch-orb ch-orb2" />
          <div className="ch-orb ch-orb3" />
        </div>
        <div className="ch-particles">
          {[...Array(6)].map((_, i) => <div key={i} className="ch-particle" />)}
        </div>
        <div className="ch-container">
          <div className="ch-breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            Contact
          </div>
          <div className="ch-eyebrow">
            <span className="ch-eyebrow-dot" />
            We're Just a Message Away
          </div>
          <h1 className="ch-title">
            Let's <span className="ch-title-accent">Build</span><br />
            Your <span className="ch-title-outline">Future</span>
          </h1>
          <p className="ch-desc">
            Ready to start your career journey? Submit your application below and our team will match you with the perfect opportunity within 24–48 hours.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="contact-section">
        <div className="cs-container">
          <div className="cs-grid">

            {/* LEFT */}
            <div className="info-panel">
              <div className="info-panel-header">
                <div className="info-eyebrow">Get in Touch</div>
                <h2 className="info-title">We're Here<br />to <em>Help You</em></h2>
                <p className="info-sub">
                  Whether you're looking for your first job or switching careers — our placement team is ready to guide you at every step.
                </p>
              </div>

              <div className="contact-cards">
                {contactCards.map((card, i) => (
                  <div key={i} className="cc-card" style={{ '--cc-color': card.color }}>
                    <div className="cc-icon">{card.icon}</div>
                    <div className="cc-body">
                      <div className="cc-label">{card.label}</div>
                      <div className="cc-value">{card.value}</div>
                      {card.href && card.linkText && (
                        <a href={card.href} className="cc-link"
                          target={card.href.startsWith('http') ? '_blank' : undefined}
                          rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                          {card.linkText}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="map-embed-wrap">
                <iframe
                  title="Nachi Consultation Office Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3829.2!2d80.4365!3d16.3067!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35f0a2a3b3b3b3%3A0x0!2sSaradha+Colony%2C+Guntur%2C+Andhra+Pradesh+522002!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="map-overlay-bar">
                  <span className="mob-label">📍 Saradha Colony, Guntur</span>
                  <a href="https://www.google.com/maps/search/Saradha+Colony+Guntur+522002"
                    className="mob-link" target="_blank" rel="noopener noreferrer">
                    Open in Maps →
                  </a>
                </div>
              </div>

              <a href="https://wa.me/916305650469?text=Hello%20Nachi%20Consultation%2C%20I%20am%20looking%20for%20a%20job%20opportunity."
                className="wa-strip" target="_blank" rel="noopener noreferrer">
                <div className="wa-icon">💬</div>
                <div className="wa-text-block">
                  <div className="wa-title">Chat on WhatsApp</div>
                  <div className="wa-sub">Quick reply within minutes</div>
                </div>
                <span className="wa-arrow">→</span>
              </a>
            </div>

            {/* RIGHT */}
            <div className="form-panel">
              <div className="form-wrap">
                {submitted ? (
                  <div className="success-screen">
                    <div className="success-anim">✅</div>
                    <h3>Application Sent!</h3>
                    <p>
                      Thank you <strong>{formData.name}</strong>! Your application has been received.
                      Our team will contact you at <strong>{formData.phone}</strong> within 24–48 hours.
                    </p>
                    <div className="success-details">
                      <div className="sd-row"><span className="sd-key">Job Type:</span><span className="sd-val">{formData.jobType}</span></div>
                      <div className="sd-row"><span className="sd-key">Experience:</span><span className="sd-val">{formData.experience || 'Not specified'}</span></div>
                      <div className="sd-row"><span className="sd-key">Location:</span><span className="sd-val">{formData.location}</span></div>
                      {resumeFile && <div className="sd-row"><span className="sd-key">Resume:</span><span className="sd-val">{resumeFile.name}</span></div>}
                    </div>
                    <button className="success-btn" onClick={() => {
                      setSubmitted(false);
                      setResumeFile(null);
                      setErrorMsg('');
                      setFormData({ name:'',email:'',phone:'',jobType:'',experience:'',location:'',message:'' });
                    }}>
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="form-heading">
                      <div className="form-eyebrow">Job Application</div>
                      <h2 className="form-title">Apply for a <span>Job</span></h2>
                      <p className="form-subtitle">Fill in your details and upload your resume. We'll find the right role for you.</p>
                    </div>

                    <div className="form-steps">
                      {['Personal Info','Job Preference','Resume & Message'].map((label, i) => {
                        const filled = i === 0
                          ? (formData.name && formData.phone && formData.email)
                          : i === 1
                            ? (formData.jobType && formData.location)
                            : false;
                        return (
                          <div key={i} className={`fs-step ${filled ? 'done' : i === 0 ? 'active' : ''}`}>
                            <div className="fs-dot">{filled ? '✓' : i + 1}</div>
                            <div className="fs-lbl">{label}</div>
                          </div>
                        );
                      })}
                    </div>

                    <form className="contact-form" onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>Full Name *</label>
                          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your full name" required />
                        </div>
                        <div className="form-group">
                          <label>Phone Number *</label>
                          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Email Address *</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Job Type Interested In *</label>
                          <select name="jobType" value={formData.jobType} onChange={handleChange} required>
                            <option value="">Select job type...</option>
                            {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </div>
                        <div className="form-group">
                          <label>Years of Experience</label>
                          <select name="experience" value={formData.experience} onChange={handleChange}>
                            <option value="">Select experience...</option>
                            <option value="Fresher (0 years)">Fresher (0 years)</option>
                            <option value="1–2 years">1–2 years</option>
                            <option value="3–5 years">3–5 years</option>
                            <option value="5+ years">5+ years</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Preferred Work Location *</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City / Area you prefer to work in" required />
                      </div>

                      <div className="form-group">
                        <label>Upload Resume (PDF / DOC / DOCX)</label>
                        <div
                          className={`dropzone ${dragOver ? 'drag-over' : ''} ${resumeFile ? 'has-file' : ''}`}
                          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                          onDragLeave={() => setDragOver(false)}
                          onDrop={handleDrop}
                          onClick={() => fileRef.current.click()}
                        >
                          <input type="file" ref={fileRef} style={{ display:'none' }} accept=".pdf,.doc,.docx" onChange={e => handleFile(e.target.files[0])} />
                          {resumeFile ? (
                            <div className="file-info">
                              <div className="file-icon-wrap">📄</div>
                              <div className="file-details">
                                <div className="file-name">{resumeFile.name}</div>
                                <div className="file-size">{(resumeFile.size / 1024).toFixed(1)} KB</div>
                                <div className="file-bar"><div className="file-bar-fill" /></div>
                              </div>
                              <button type="button" className="file-remove" onClick={e => { e.stopPropagation(); setResumeFile(null); }}>✕</button>
                            </div>
                          ) : (
                            <div className="dz-empty">
                              <span className="dz-icon">📤</span>
                              <div className="dz-title">Drag & drop your resume here</div>
                              <div className="dz-sub">or <span>click to browse files</span></div>
                              <div className="dz-fmt">PDF, DOC, DOCX &nbsp;•&nbsp; Max 5 MB</div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Tell Us About Yourself</label>
                        <textarea name="message" value={formData.message} onChange={handleChange}
                          placeholder="Briefly describe your skills, past work experience, and what kind of role you're looking for..."
                          rows={4} maxLength={500} />
                        <div className={`char-count ${formData.message.length > 450 ? 'warn' : ''}`}>
                          {formData.message.length} / 500
                        </div>
                      </div>

                      {/* ✅ Error message shown if API fails */}
                      {errorMsg && <div className="error-box">⚠️ {errorMsg}</div>}

                      <button type="submit" className="form-submit" disabled={loading}>
                        {loading ? (
                          <span className="btn-loading">
                            <span className="spinner" />
                            Submitting Your Application...
                          </span>
                        ) : (
                          <><span>Submit Application</span><span>→</span></>
                        )}
                      </button>

                      <p className="privacy-note">
                        <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
                          <path d="M6 1L1 3.5V7c0 2.76 2.13 5.34 5 6 2.87-.66 5-3.24 5-6V3.5L6 1Z" stroke="#bbb" strokeWidth="1.2" fill="none"/>
                        </svg>
                        Your information is secure and will never be shared with third parties.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
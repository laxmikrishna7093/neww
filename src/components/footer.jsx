import Link from 'next/link';

export default function Footer() {
  const services = [
    'Security Services',
    'Cleaning Services',
    'Housekeeping',
    'Packers & Movers',
    'Driver Services',
  ];
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  const socials = [
    {
      label: 'Facebook',
      href: 'https://www.facebook.com',
      color: '#1877F2',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com',
      color: '#E1306C',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
          <circle cx="12" cy="12" r="4"/>
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
        </svg>
      ),
    },
    {
      label: 'WhatsApp',
      href: 'https://wa.me/916305650469?text=Hello%20Nachi%20Consultation%2C%20I%20would%20like%20to%20enquire%20about%20your%20services.',
      color: '#25D366',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com',
      color: '#FF0000',
      svg: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
          <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow:wght@400;500&family=Barlow+Condensed:wght@600;700;800&display=swap');

        .site-footer { background: #12312C; color: #fff; margin-top: 0; }
        .footer-top { padding: 5rem 0 3rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .footer-grid {
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }

        /* ── Logo ── */
        .footer-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; text-decoration: none; }
        .footer-logo-icon {
          width: 40px; height: 40px;
          background: #FF9700;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Playfair Display', serif;
          font-weight: 900; font-size: 1.3rem;
          color: #31383E;
          clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%);
          flex-shrink: 0;
        }
        .footer-logo-main {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800; font-size: 1.2rem; letter-spacing: 0.1em;
          color: #fff; line-height: 1; display: block;
        }
        .footer-logo-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.58rem; letter-spacing: 0.15em;
          color: #EDD790; display: block;
        }

        .footer-tagline {
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem; line-height: 1.7;
          color: rgba(255,255,255,0.6);
          margin-bottom: 1.5rem; max-width: 300px;
        }

        /* ── Social Icons ── */
        .footer-socials { display: flex; gap: 0.6rem; flex-wrap: wrap; }
        .social-btn {
          width: 40px; height: 40px;
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          color: rgba(255,255,255,0.55);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(.34,1.56,.64,1);
          position: relative;
          overflow: hidden;
        }
        .social-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: var(--social-color, #FF9700);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: 7px;
        }
        .social-btn:hover {
          border-color: var(--social-color, #FF9700);
          color: #fff;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        }
        .social-btn:hover::before { opacity: 1; }
        .social-btn svg { position: relative; z-index: 1; }
        .social-btn .social-tooltip {
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) scale(0.8);
          background: rgba(0,0,0,0.85);
          color: #fff;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: 0.65rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 4px 8px; border-radius: 4px;
          white-space: nowrap;
          opacity: 0;
          pointer-events: none;
          transition: all 0.25s ease;
        }
        .social-btn:hover .social-tooltip {
          opacity: 1;
          transform: translateX(-50%) scale(1);
        }

        /* ── Column headings ── */
        .footer-col-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 0.8rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #FF9700; margin-bottom: 1.25rem;
        }

        /* ── Link lists ── */
        .footer-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; padding: 0; margin: 0; }
        .footer-list a {
          font-family: 'Barlow', sans-serif;
          font-size: 0.9rem; color: rgba(255,255,255,0.6);
          text-decoration: none; transition: all 0.3s ease;
          display: flex; align-items: center; gap: 0.4rem;
        }
        .footer-list a::before {
          content: '→'; color: #FF9700; font-size: 0.75rem;
          opacity: 0; transform: translateX(-5px);
          transition: all 0.3s ease;
        }
        .footer-list a:hover { color: #fff; padding-left: 0.25rem; }
        .footer-list a:hover::before { opacity: 1; transform: translateX(0); }

        /* ── Contact list ── */
        .footer-contact-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .footer-contact-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          font-family: 'Barlow', sans-serif;
          font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.5;
        }
        .footer-contact-item a {
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.3s ease;
        }
        .footer-contact-item a:hover { color: #FF9700; }
        .contact-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }

        /* ── Bottom bar ── */
        .footer-bottom { padding: 1.25rem 0; }
        .footer-bottom-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .footer-bottom-inner p {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem; color: rgba(255,255,255,0.4);
        }
        .footer-bottom-links { display: flex; gap: 1.5rem; }
        .footer-bottom-links a {
          font-family: 'Barlow', sans-serif;
          font-size: 0.82rem; color: rgba(255,255,255,0.4);
          text-decoration: none; transition: color 0.3s ease;
        }
        .footer-bottom-links a:hover { color: #FF9700; }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
          .footer-brand { grid-column: auto; }
          .footer-bottom-inner { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
          .footer-top { padding: 3rem 0 2rem; }
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-grid">

            {/* ── Brand column ── */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">
                <div className="footer-logo-icon">N</div>
                <div>
                  <span className="footer-logo-main">NACHI</span>
                  <span className="footer-logo-sub">CONSULTATION PVT. LTD.</span>
                </div>
              </Link>
              <p className="footer-tagline">
                Bridging the gap between talent and opportunity. Empowering India's workforce — one placement at a time.
              </p>

              {/* Social Icons */}
              <div className="footer-socials">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="social-btn"
                    style={{ '--social-color': s.color }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {s.svg}
                    <span className="social-tooltip">{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* ── Services column ── */}
            <div>
              <h4 className="footer-col-title">Our Services</h4>
              <ul className="footer-list">
                {services.map(s => (
                  <li key={s}><Link href="/services">{s}</Link></li>
                ))}
              </ul>
            </div>

            {/* ── Quick Links column ── */}
            <div>
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-list">
                {navLinks.map((l, i) => (
                  <li key={i}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            {/* ── Contact column ── */}
            <div>
              <h4 className="footer-col-title">Get In Touch</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <span className="contact-icon">📍</span>
                  <span>34/145, 1st Line Saradha Colony,<br />Guntur – 522002, Andhra Pradesh</span>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">📞</span>
                  <a href="tel:+916305650469">+91 63056 50469</a>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">✉️</span>
                  <a href="mailto:nagalakshmiakurathi.ak@gmail.com">nagalakshmiakurathi.ak@gmail.com</a>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">💬</span>
                  <a
                    href="https://wa.me/916305650469?text=Hello%20Nachi%20Consultation%2C%20I%20would%20like%20to%20enquire%20about%20your%20services."
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp Us
                  </a>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">🕐</span>
                  <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="footer-bottom">
          <div className="footer-bottom-inner">
            <p>© 2025 Nachi Consultation Pvt. Ltd. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
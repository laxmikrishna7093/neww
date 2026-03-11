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
    { href: '/contact', label: 'Apply for a Job' },
  ];

  return (
    <>
      <style>{`
        .site-footer { background: #12312C; color: #fff; margin-top: 0; }
        .footer-top { padding: 5rem 0 3rem; border-bottom: 1px solid rgba(255,255,255,0.08); }
        .footer-grid {
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3rem;
        }
        .footer-logo { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.25rem; }
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
          font-size: 0.9rem; line-height: 1.7;
          color: rgba(255,255,255,0.6);
          margin-bottom: 1.5rem; max-width: 300px;
        }
        .footer-socials { display: flex; gap: 0.5rem; }
        .social-btn {
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem; font-weight: 700;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: all 0.3s ease;
        }
        .social-btn:hover { background: #FF9700; border-color: #FF9700; color: #31383E; }
        .footer-col-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700; font-size: 0.8rem;
          letter-spacing: 0.18em; text-transform: uppercase;
          color: #FF9700; margin-bottom: 1.25rem;
        }
        .footer-list { list-style: none; display: flex; flex-direction: column; gap: 0.6rem; }
        .footer-list a {
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
        .footer-contact-list { display: flex; flex-direction: column; gap: 0.85rem; }
        .footer-contact-item {
          display: flex; align-items: flex-start; gap: 0.75rem;
          font-size: 0.88rem; color: rgba(255,255,255,0.6); line-height: 1.5;
        }
        .contact-icon { font-size: 1rem; flex-shrink: 0; margin-top: 0.1rem; }
        .footer-bottom { padding: 1.25rem 0; }
        .footer-bottom-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 2rem;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem;
        }
        .footer-bottom-inner p { font-size: 0.82rem; color: rgba(255,255,255,0.4); }
        .footer-bottom-links { display: flex; gap: 1.5rem; }
        .footer-bottom-links a {
          font-size: 0.82rem; color: rgba(255,255,255,0.4);
          text-decoration: none; transition: color 0.3s ease;
        }
        .footer-bottom-links a:hover { color: #FF9700; }
        @media (max-width: 900px) {
          .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .footer-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 560px) {
          .footer-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">N</div>
                <div>
                  <span className="footer-logo-main">NACHI</span>
                  <span className="footer-logo-sub">CONSULTATION PVT. LTD.</span>
                </div>
              </div>
              <p className="footer-tagline">
                Bridging the gap between talent and opportunity. Empowering India's workforce — one placement at a time.
              </p>
              <div className="footer-socials">
                <a href="#" aria-label="Facebook" className="social-btn">f</a>
                <a href="#" aria-label="LinkedIn" className="social-btn">in</a>
                <a href="#" aria-label="Twitter" className="social-btn">𝕏</a>
                <a href="#" aria-label="WhatsApp" className="social-btn">W</a>
              </div>
            </div>

            <div>
              <h4 className="footer-col-title">Our Services</h4>
              <ul className="footer-list">
                {services.map(s => (
                  <li key={s}><Link href="/services">{s}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Quick Links</h4>
              <ul className="footer-list">
                {navLinks.map((l, i) => (
                  <li key={i}><Link href={l.href}>{l.label}</Link></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="footer-col-title">Get In Touch</h4>
              <div className="footer-contact-list">
                <div className="footer-contact-item">
                  <span className="contact-icon">📍</span>
                  <span>123 Business District, Mumbai, Maharashtra 400001</span>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">📞</span>
                  <span>+91 98765 43210</span>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">✉️</span>
                  <span>info@nachiconsultation.com</span>
                </div>
                <div className="footer-contact-item">
                  <span className="contact-icon">🕐</span>
                  <span>Mon–Sat: 9:00 AM – 6:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

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
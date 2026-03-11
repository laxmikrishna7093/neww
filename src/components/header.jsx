'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <>
      <style>{`
        .site-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 1000;
          padding: 1.2rem 0;
          transition: all 0.4s ease;
          background: transparent;
        }
        .site-header.scrolled {
          background: #12312C;
          padding: 0.8rem 0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.25);
        }
        .header-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
        }
        .logo-icon {
          width: 42px; height: 42px;
          background: #FF9700;
          display: flex;
          align-items: center;
          justify-content: center;
          clip-path: polygon(0 0, 85% 0, 100% 15%, 100% 100%, 15% 100%, 0 85%);
          flex-shrink: 0;
        }
        .logo-icon span {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          font-size: 1.4rem;
          color: #31383E;
          line-height: 1;
        }
        .logo-text { display: flex; flex-direction: column; }
        .logo-main {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 800;
          font-size: 1.3rem;
          letter-spacing: 0.12em;
          color: #fff;
          line-height: 1;
        }
        .logo-sub {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 400;
          font-size: 0.58rem;
          letter-spacing: 0.15em;
          color: #EDD790;
        }
        .site-nav {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        .nav-link {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.75);
          text-decoration: none;
          padding: 0.5rem 1rem;
          position: relative;
          transition: color 0.3s ease;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 1rem; right: 1rem;
          height: 2px;
          background: #FF9700;
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }
        .nav-link:hover, .nav-link.active { color: #fff; }
        .nav-link:hover::after, .nav-link.active::after { transform: scaleX(1); }
        .nav-cta {
          margin-left: 1rem;
          background: #FF9700;
          color: #31383E;
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 0.8rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 0.65rem 1.5rem;
          text-decoration: none;
          transition: all 0.3s ease;
          clip-path: polygon(0 0, 90% 0, 100% 30%, 100% 100%, 10% 100%, 0 70%);
          display: inline-block;
        }
        .nav-cta:hover { background: #E07625; transform: translateY(-2px); }
        .hamburger {
          display: none;
          flex-direction: column;
          gap: 5px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          z-index: 1100;
        }
        .hamburger span {
          display: block;
          width: 24px; height: 2px;
          background: #fff;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hamburger.open span:nth-child(2) { opacity: 0; }
        .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
        @media (max-width: 768px) {
          .hamburger { display: flex; }
          .site-nav {
            position: fixed;
            top: 0; right: -100%;
            width: 280px; height: 100vh;
            background: #12312C;
            flex-direction: column;
            align-items: flex-start;
            padding: 6rem 2rem 2rem;
            gap: 0.5rem;
            transition: right 0.4s ease;
            box-shadow: -10px 0 40px rgba(0,0,0,0.3);
          }
          .site-nav.open { right: 0; }
          .nav-link {
            font-size: 1.1rem;
            padding: 0.75rem 0;
            width: 100%;
            border-bottom: 1px solid rgba(255,255,255,0.08);
          }
          .nav-cta { margin-left: 0; margin-top: 1rem; clip-path: none; width: 100%; text-align: center; }
        }
      `}</style>

      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon"><span>N</span></div>
            <div className="logo-text">
              <span className="logo-main">NACHI</span>
              <span className="logo-sub">CONSULTATION PVT. LTD.</span>
            </div>
          </Link>

          <nav className={`site-nav ${menuOpen ? 'open' : ''}`}>
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
           
          </nav>

          <button
            className={`hamburger ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </header>
    </>
  );
}
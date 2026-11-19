import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaArrowRight,
} from 'react-icons/fa';
import QuoteModal from './QuoteModal';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [logoSrc, setLogoSrc] = useState('/images/logo.jpg');
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  useEffect(() => {
    fetch('/api/home-images')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.images && data.images.headerLogo?.src) {
          setLogoSrc(data.images.headerLogo.src);
        }
      })
      .catch(() => {});
  }, []);

  const isActive = (path) => {
    if (path === '/' || path === '/home') {
      return currentPath === '/' || currentPath === '/home';
    }
    return currentPath === path.toLowerCase() || currentPath.startsWith(path.toLowerCase() + '/');
  };

  return (
    <>
      {/* Top Notification Bar */}
      <div className="top-bar">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-9">
              <a href="tel:+916381156460">
                <FaPhoneAlt className="text-info mr-1" /> +91 6381156460 / 9363103062
              </a>
              <a href="mailto:ramsoncolour@gmail.com">
                <FaEnvelope className="text-info mr-1" /> ramsoncolour@gmail.com
              </a>
              <span className="d-none d-xl-inline text-muted">
                <FaMapMarkerAlt className="text-info mr-1" /> Eachanari, Coimbatore
              </span>
            </div>
            <div className="col-lg-4 col-md-3 text-right">
              <div className="top-bar-social">
                <a
                  href="https://www.facebook.com/Ramson-Colour-Coaters-103293678061484"
                  target="_blank"
                  rel="noreferrer"
                  title="Facebook"
                >
                  <FaFacebookF />
                </a>
                <a href="#!" title="Instagram"><FaInstagram /></a>
                <a href="https://wa.me/916381156460" target="_blank" rel="noreferrer" title="WhatsApp">
                  <FaWhatsapp />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="main-header-sticky">
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light navbar-modern">
            <Link to="/Home" className="navbar-brand navbar-brand-modern">
              <img
                src={logoSrc}
                className="navbar-logo-img"
                alt="Ramson Colour Coaters Logo"
                onError={(e) => { e.target.src = '/images/logo.jpg'; }}
              />
              {/* <div className="brand-text-wrap">
                <span className="brand-title">Ramson</span>
                <span className="brand-subtitle">Colour Coaters</span>
              </div> */}
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsNavOpen(!isNavOpen)}
              aria-controls="navbarNav"
              aria-expanded={isNavOpen}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="navbarNav">
              <ul className="navbar-nav ml-auto align-items-lg-center">
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/Home') ? 'active-nav' : ''}`}
                    to="/Home"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/About') ? 'active-nav' : ''}`}
                    to="/About"
                    onClick={() => setIsNavOpen(false)}
                  >
                    About Us
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/Services') ? 'active-nav' : ''}`}
                    to="/Services"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/infrastructure') ? 'active-nav' : ''}`}
                    to="/infrastructure"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Infrastructure
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/Blogs') ? 'active-nav' : ''}`}
                    to="/Blogs"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Blogs
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/Contact') ? 'active-nav' : ''}`}
                    to="/Contact"
                    onClick={() => setIsNavOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
                <li className="nav-item ml-lg-3 mt-2 mt-lg-0">
                  <button
                    type="button"
                    className="nav-cta-btn"
                    onClick={() => {
                      setIsNavOpen(false);
                      setIsQuoteOpen(true);
                    }}
                  >
                    <span>Get a Quote</span>
                    <FaArrowRight />
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
}

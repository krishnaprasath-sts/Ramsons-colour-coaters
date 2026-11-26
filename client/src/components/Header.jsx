import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaArrowRight,
} from 'react-icons/fa';
import QuoteModal from './QuoteModal';
import useApiJson from '../hooks/useApiJson';
import { apiUrl } from '../lib/api';

const DEFAULT_LOGO = '/images/logo.jpg';

export default function Header() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname.toLowerCase();

  // Shared and cached, so the logo is not fetched again (and does not flicker) on every page
  const { data: homeImages } = useApiJson('/api/home-images');
  const logoSrc = homeImages?.images?.headerLogo?.src || DEFAULT_LOGO;

  // The mobile menu is a panel that drops down over the page. It closes when the page changes...
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  // ...on Escape, or when the screen becomes desktop-sized.
  // (A tap outside lands on the .nav-backdrop below, which closes it too.)
  useEffect(() => {
    if (!isNavOpen) return undefined;
    const close = () => setIsNavOpen(false);
    const onKeyDown = (e) => {
      if (e.key === 'Escape') close();
    };
    const desktop = window.matchMedia('(min-width: 992px)');
    const onDesktop = (e) => {
      if (e.matches) close();
    };
    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onDesktop);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onDesktop);
    };
  }, [isNavOpen]);

  const isActive = (path) => {
    const target = path.toLowerCase();
    if (target === '/' || target === '/home') {
      return currentPath === '/' || currentPath === '/home';
    }
    return currentPath === target || currentPath.startsWith(target + '/');
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
                src={apiUrl(logoSrc)}
                className="navbar-logo-img"
                alt="Ramson Colour Coaters Logo"
                width="100"
                height="80"
                onError={(e) => {
                  if (!e.target.src.endsWith(DEFAULT_LOGO)) e.target.src = DEFAULT_LOGO;
                }}
              />
              {/* <div className="brand-text-wrap">
                <span className="brand-title">Ramson</span>
                <span className="brand-subtitle">Colour Coaters</span>
              </div> */}
            </Link>

            {/* Mobile menu button: bars when closed, a cross when open */}
            <button
              className={`navbar-toggler${isNavOpen ? ' is-open' : ''}`}
              type="button"
              onClick={() => setIsNavOpen((open) => !open)}
              aria-controls="navbarNav"
              aria-expanded={isNavOpen}
              aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
            >
              <FaBars className="nav-toggle-icon nav-toggle-icon--menu" aria-hidden="true" />
              <FaTimes className="nav-toggle-icon nav-toggle-icon--close" aria-hidden="true" />
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

      {/* Dims the page behind the open mobile menu; tapping it closes the menu.
          It sits outside <header> because the header's blur effect would trap a fixed element inside it. */}
      <div
        className={`nav-backdrop${isNavOpen ? ' is-visible' : ''}`}
        onClick={() => setIsNavOpen(false)}
        aria-hidden="true"
      />

      <QuoteModal isOpen={isQuoteOpen} onClose={() => setIsQuoteOpen(false)} />
    </>
  );
}

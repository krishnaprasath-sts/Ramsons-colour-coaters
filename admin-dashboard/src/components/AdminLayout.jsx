import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FiChevronDown,
  FiExternalLink,
  FiFileText,
  FiGrid,
  FiImage,
  FiInbox,
  FiLayers,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { clearSession, getAdminName, initials, SITE_URL } from '../lib/api';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: FiGrid, match: (path) => path === '/' },
  {
    to: '/home-images',
    label: 'Home Page Banners',
    icon: FiImage,
    match: (path) => path.startsWith('/home-images') || path.startsWith('/home-banners'),
  },
  { to: '/services', label: 'Services', icon: FiLayers, match: (path) => path.startsWith('/services') },
  { to: '/enquiries', label: 'Enquiries', icon: FiInbox, match: (path) => path.startsWith('/enquiries') },
  { to: '/blogs', label: 'Blog Articles', icon: FiFileText, match: (path) => path.startsWith('/blogs') },
];

export default function AdminLayout({ children, title = 'Admin Dashboard', subtitle, actions }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef(null);
  const adminName = getAdminName();

  useEffect(() => {
    document.title = `${title} | Ramson Admin`;
  }, [title]);

  // Close the mobile drawer whenever the page changes
  useEffect(() => {
    setDrawerOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the account menu on outside click or Escape
  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  // Escape also closes the mobile drawer
  useEffect(() => {
    if (!drawerOpen) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [drawerOpen]);

  const handleLogout = () => {
    clearSession();
    navigate('/login', { replace: true });
  };

  return (
    <div className="shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {drawerOpen && <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} aria-hidden="true" />}

      <aside className={`sidebar ${drawerOpen ? 'is-open' : ''}`} aria-label="Admin navigation">
        <div className="sidebar-brand">
          <img
            src="/logo.jpg"
            alt=""
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <div className="sidebar-brand-text">
            <strong>Ramson</strong>
            <span>Colour Coaters</span>
          </div>
          <button
            type="button"
            className="icon-btn sidebar-close"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-heading">Manage</div>
          {NAV_ITEMS.map(({ to, label, icon: Icon, match }) => {
            const active = match(location.pathname);
            return (
              <Link
                key={to}
                to={to}
                className={`nav-item ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="nav-icon" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <a href={`${SITE_URL}/`} target="_blank" rel="noreferrer" className="nav-item">
            <FiExternalLink className="nav-icon" aria-hidden="true" />
            <span>View website</span>
          </a>
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <button
            type="button"
            className="icon-btn menu-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <FiMenu aria-hidden="true" />
          </button>

          <div className="topbar-brand">Ramson Admin</div>

          <div className="account" ref={menuRef}>
            <button
              type="button"
              className="account-trigger"
              onClick={() => setMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <span className="avatar" aria-hidden="true">
                {initials(adminName)}
              </span>
              <span className="account-name">{adminName}</span>
              <FiChevronDown className={`account-caret ${menuOpen ? 'is-open' : ''}`} aria-hidden="true" />
            </button>

            {menuOpen && (
              <div className="account-menu" role="menu">
                <div className="account-menu-head">
                  <strong>{adminName}</strong>
                  <span>Administrator</span>
                </div>
                <button type="button" className="account-menu-item is-danger" role="menuitem" onClick={handleLogout}>
                  <FiLogOut aria-hidden="true" />
                  <span>Log out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="content" id="main-content">
          <div className="page-head">
            <div>
              <h1>{title}</h1>
              {subtitle && <p>{subtitle}</p>}
            </div>
            {actions && <div className="page-actions">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaDesktop, FaBook, FaGlobe, FaSignOutAlt } from 'react-icons/fa';

export default function AdminLayout({ children, title = 'Ramson Colour Coaters | Blogs' }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = title;
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/dashboard/login');
    }
  }, [navigate, title]);

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/dashboard/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f4f6f9', display: 'flex' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '250px',
          backgroundColor: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '20px', borderBottom: '1px solid #eee', textAlign: 'center' }}>
          <img src="/dashboard/assets/img/logo.jpg" alt="Logo" style={{ maxWidth: '80%', height: 'auto' }} />
        </div>
        <div style={{ padding: '15px 20px', fontSize: '11px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase' }}>
          Main Menu
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li>
            <Link
              to="/dashboard/home"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                color: isActive('/dashboard/home') || isActive('/dashboard/dashboard') ? '#6777ef' : '#555',
                backgroundColor: isActive('/dashboard/home') || isActive('/dashboard/dashboard') ? '#f0f3ff' : 'transparent',
                borderLeft: isActive('/dashboard/home') || isActive('/dashboard/dashboard') ? '4px solid #6777ef' : '4px solid transparent',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <FaDesktop style={{ width: '25px' }} />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/category"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                color: isActive('/dashboard/category') ? '#6777ef' : '#555',
                backgroundColor: isActive('/dashboard/category') ? '#f0f3ff' : 'transparent',
                borderLeft: isActive('/dashboard/category') ? '4px solid #6777ef' : '4px solid transparent',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <FaBook style={{ width: '25px' }} />
              <span>Blogs</span>
            </Link>
          </li>
          <li>
            <Link
              to="/Home"
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                color: '#555',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              <FaGlobe style={{ width: '25px' }} />
              <span>View Website</span>
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Navbar */}
        <header
          style={{
            height: '65px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 30px',
          }}
        >
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger btn-sm"
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: '30px' }}>
          {children}
        </main>

        {/* Footer */}
        <footer
          style={{
            padding: '20px 30px',
            backgroundColor: '#fff',
            borderTop: '1px solid #eee',
            fontSize: '13px',
            color: '#666',
          }}
        >
          All rights reserved &amp; Developed by{' '}
          <a href="https://saitechnosolutions.com/" target="_blank" rel="noreferrer" style={{ color: '#000', fontWeight: 'bold' }}>
            SAI TECHNO SOLUTIONS
          </a>
        </footer>
      </div>
    </div>
  );
}

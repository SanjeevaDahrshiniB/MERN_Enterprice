import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Menu, X, LogOut, ShieldCheck, GraduationCap } from 'lucide-react';
import Swal from 'sweetalert2';

interface NavbarProps {
  user: any;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOutClick = async () => {
    const result = await Swal.fire({
      title: 'Sign Out?',
      text: 'Are you sure you want to end your active session?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, Sign Out',
      cancelButtonText: 'Stay logged in',
      background: 'var(--bg-surface)',
      color: 'var(--text-primary)'
    });

    if (result.isConfirmed) {
      onLogout();
    }
  };

  return (
    <>
      <header className="navbar">
        {/* Left: Brand & Tenant */}
        <div className="navbar-brand">
          <div className="navbar-logo">T</div>
          <div>
            <div className="navbar-title">Triune SaaS Platform</div>
            <div className="navbar-tenant">
              <span>Tenant:</span>
              <span className="navbar-tenant-pill">{user?.tenantId}</span>
            </div>
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="navbar-right desktop-actions">
          {/* Theme toggle button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            className="btn-icon"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          {/* User profile pill */}
          <div className="navbar-user">
            <div className="navbar-email">{user?.email}</div>
            <span className="navbar-role">{user?.role}</span>
          </div>

          {/* Sign Out */}
          <button onClick={handleSignOutClick} className="btn btn-outline">
            Sign Out
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="mobile-menu-btn"
          aria-label="Open mobile menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* Mobile Side Drawer (Off-Canvas) & Backdrop */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="side-drawer-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Side Drawer Panel */}
          <aside className="side-drawer" role="dialog" aria-modal="true">
            {/* Drawer Header */}
            <div className="side-drawer-header">
              <div className="navbar-brand">
                <div className="navbar-logo">T</div>
                <div className="navbar-title">Triune SaaS</div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="btn-icon"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="side-drawer-body">
              {/* User Profile Card */}
              <div className="side-drawer-user-card">
                <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--text-primary)' }}>
                  {user?.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  <ShieldCheck size={14} color="var(--primary)" />
                  <span className="navbar-role">{user?.role}</span>
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: 'var(--text-muted)',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px solid var(--border)'
                  }}
                >
                  Tenant:{' '}
                  <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>
                    {user?.tenantId}
                  </strong>
                </div>
              </div>

              {/* Navigation Links */}
              <div className="side-drawer-links">
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    padding: '0 4px',
                    marginBottom: '4px'
                  }}
                >
                  Modules
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="side-drawer-link active"
                >
                  <GraduationCap size={18} />
                  <span>Student Directory</span>
                </button>
              </div>

              {/* Appearance / Theme Switcher */}
              <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    letterSpacing: '0.05em',
                    padding: '0 4px',
                    marginBottom: '8px'
                  }}
                >
                  Appearance
                </div>
                <button
                  onClick={toggleTheme}
                  className="btn btn-outline"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '10px 14px' }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {theme === 'light' ? 'Off' : 'On'}
                  </span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="side-drawer-footer">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOutClick();
                }}
                className="btn btn-danger"
                style={{ width: '100%', justifyContent: 'center', padding: '11px', fontSize: '13px' }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  );
};

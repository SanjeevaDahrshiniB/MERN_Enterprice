import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
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
                <X size={20} />
              </button>
            </div>

            {/* Tenant Info Card */}
            <div className="side-drawer-user-card">
              <div className="side-drawer-avatar">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="side-drawer-email" title={user?.email}>
                  {user?.email}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                  <span className="navbar-role">{user?.role}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Tenant: <span className="navbar-tenant-pill">{user?.tenantId}</span>
                </div>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="side-drawer-nav">
              <div className="side-drawer-section-title">Navigation</div>
              <a
                href="/students"
                className="side-drawer-link active"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GraduationCap size={18} />
                <span>Student Directory</span>
              </a>
              <div style={{ opacity: 0.5, cursor: 'not-allowed' }} className="side-drawer-link">
                <ShieldCheck size={18} />
                <span>Tenants (SuperAdmin)</span>
              </div>
            </nav>

            {/* Drawer Footer Actions */}
            <div className="side-drawer-footer">
              <button
                onClick={toggleTheme}
                className="side-drawer-link"
                style={{ marginBottom: '10px' }}
              >
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOutClick();
                }}
                className="btn btn-danger"
                style={{ width: '100%', justifyContent: 'center', padding: '10px' }}
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

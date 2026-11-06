import React from 'react';
import { Navbar } from './Navbar';
import { OfflineBanner } from '../../components/common/OfflineBanner';

interface MainLayoutProps {
  user: any;
  onLogout: () => void;
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="layout-main" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <OfflineBanner />
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
};

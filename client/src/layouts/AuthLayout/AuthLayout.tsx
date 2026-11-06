import React from 'react';
import { OfflineBanner } from '../../components/common/OfflineBanner';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="layout-auth" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <OfflineBanner />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};

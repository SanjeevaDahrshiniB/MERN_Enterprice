import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../modules/auth/services/auth.service';

interface GuestGuardProps {
  children: React.ReactNode;
}

export const GuestGuard: React.FC<GuestGuardProps> = ({ children }) => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/students" replace />;
  }

  return <>{children}</>;
};

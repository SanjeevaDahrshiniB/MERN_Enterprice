import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../modules/auth/services/auth.service';
import { type Role } from '../constants/roles';

interface RoleGuardProps {
  roles: Role[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  roles,
  children,
  fallback = null,
  redirectTo
}) => {
  const user = authService.getCurrentUser();

  if (!user || !roles.includes(user.role as Role)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

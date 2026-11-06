import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute, GuestGuard } from '../guards';
import { LoginPage } from '../modules/auth';
import { StudentListPage } from '../modules/students';
import { NotFoundPage } from '../components/common';
import { authService, type AuthUser } from '../modules/auth';
import { ROUTES } from './router/routePaths';
import { toast } from 'sonner';
import '../index.css';

export const AppContent: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      setUser(authService.getCurrentUser());
    }
    setLoading(false);
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    toast.info('Signed out successfully.');
    navigate(ROUTES.AUTH.LOGIN);
  };

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    toast.success('Welcome back!');
    navigate(ROUTES.DASHBOARD.STUDENTS);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', color: 'var(--text-muted)', fontSize: '14px' }}>
        Initializing application...
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Guest Auth Routes */}
      <Route
        path={ROUTES.AUTH.LOGIN}
        element={
          <GuestGuard>
            <AuthLayout>
              <LoginPage onLoginSuccess={handleLoginSuccess} />
            </AuthLayout>
          </GuestGuard>
        }
      />

      {/* Authenticated Dashboard Routes */}
      <Route
        path={ROUTES.DASHBOARD.STUDENTS}
        element={
          <ProtectedRoute>
            <MainLayout user={user} onLogout={handleLogout}>
              <StudentListPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback & Redirects */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD.STUDENTS} replace />} />
      <Route
        path="*"
        element={<NotFoundPage onReturn={() => navigate(ROUTES.DASHBOARD.STUDENTS)} />}
      />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProviders>
  );
};

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/LoginPage';
import { StudentListPage } from '../features/students/StudentListPage';
import { Navbar } from '../components/Navbar';
import { OfflineBanner } from '../components/OfflineBanner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { NotFoundPage } from '../components/NotFoundPage';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ThemeProvider } from '../context/ThemeContext';
import { Toaster, toast } from 'sonner';
import { authService } from '../services/auth.service';
import '../index.css';

const Layout: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main>
        <StudentListPage />
      </main>
    </div>
  );
};

export const AppContent: React.FC = () => {
  const [user, setUser] = useState<any>(null);
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
    navigate('/login');
  };

  const handleLoginSuccess = (loggedInUser: any) => {
    setUser(loggedInUser);
    toast.success('Welcome back!');
    navigate('/students');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-[var(--text-muted)] text-sm">
        Initializing application...
      </div>
    );
  }

  return (
    <>
      <OfflineBanner />
      <Toaster richColors position="top-right" closeButton />
      <Routes>
        <Route
          path="/login"
          element={
            user ? <Navigate to="/students" replace /> : <LoginPage onLoginSuccess={handleLoginSuccess} />
          }
        />
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="*" element={<NotFoundPage onReturn={() => navigate('/students')} />} />
      </Routes>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

import React from 'react';
import { ThemeProvider } from '../../context/ThemeContext';
import { ErrorBoundary } from '../../components/common/ErrorBoundary';
import { Toaster } from 'sonner';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        {children}
        <Toaster position="top-right" richColors closeButton expand />
      </ThemeProvider>
    </ErrorBoundary>
  );
};

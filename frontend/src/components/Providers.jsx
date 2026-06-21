import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from './ui/Toast';
import { ConfirmProvider } from './ui/ConfirmDialog';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          {children}
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

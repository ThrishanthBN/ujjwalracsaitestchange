import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/auth/LandingPage';
import { InviteRegisterPage } from './components/auth/InviteRegisterPage';
import { ToastContainer } from './components/common/ToastContainer';

function MainRouter() {
  const { isAuthenticated } = useAuth();
  const [urlToken, setUrlToken] = useState(null);

  useEffect(() => {
    // Check URL parameters for ?token=...
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token') || params.get('invite');
    if (token) {
      setUrlToken(token);
    }
  }, []);

  if (urlToken) {
    return (
      <InviteRegisterPage
        token={urlToken}
        onCancel={() => {
          window.history.replaceState({}, '', window.location.pathname);
          setUrlToken(null);
        }}
      />
    );
  }

  if (isAuthenticated) {
    return <AppLayout />;
  }

  return <LandingPage onOpenInvite={(token) => setUrlToken(token)} />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainRouter />
      <ToastContainer />
    </AuthProvider>
  );
}

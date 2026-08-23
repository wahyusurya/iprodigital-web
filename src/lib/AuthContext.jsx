import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '@/api/db';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    setIsLoadingAuth(true);
    setAuthError(null);
    if (!(await db.auth.isAuthenticated())) {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoadingAuth(false);
      return;
    }
    try {
      const currentUser = await db.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
    } catch (error) {
      db.auth.setToken(null); // expired/invalid token
      setUser(null);
      setIsAuthenticated(false);
      if (error.status === 401 || error.status === 403) {
        setAuthError({ type: 'auth_required', message: 'Authentication required' });
      }
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    db.auth.logout(shouldRedirect ? '/' : undefined);
  };

  const navigateToLogin = () => {
    db.auth.redirectToLogin(window.location.pathname);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false, // platform concept, kept for App.jsx compat
      authError,
      authChecked: !isLoadingAuth,
      logout,
      navigateToLogin,
      checkUserAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import userService from '@/admin/services/userService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = userService.getCurrentUser();
      const isAuth = userService.isAuthenticated();
      
      if (storedUser && isAuth) {
        setUser(storedUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setIsLoading(false);
      setAuthChecked(true);
    };
    
    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      setAuthError(null);
      const result = await userService.login(email, password);
      setUser(result.user);
      setIsAuthenticated(true);
      setAuthChecked(true);
      return result;
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    userService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setAuthChecked(false);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, []);

  const checkUserAuth = useCallback(() => {
    const storedUser = userService.getCurrentUser();
    const isAuth = userService.isAuthenticated();
    setUser(storedUser);
    setIsAuthenticated(isAuth);
    setAuthChecked(true);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth: isLoading,
      authChecked,
      authError,
      login,
      logout,
      checkUserAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
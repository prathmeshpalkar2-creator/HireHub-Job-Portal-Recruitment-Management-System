import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hirehub_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hirehub_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          if (res.data) {
            const updatedUser = { ...user, ...res.data };
            setUser(updatedUser);
            localStorage.setItem('hirehub_user', JSON.stringify(updatedUser));
          }
        } catch (err) {
          console.error("Auth check failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    checkAuth();

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [token]);

  const saveAuthSession = (authData) => {
    setToken(authData.token);
    setUser(authData);
    localStorage.setItem('hirehub_token', authData.token);
    localStorage.setItem('hirehub_user', JSON.stringify(authData));
  };

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    if (res.data) {
      saveAuthSession(res.data);
      return res.data;
    }
  };

  const registerCandidate = async (formData) => {
    const res = await api.registerCandidate(formData);
    if (res.data) {
      saveAuthSession(res.data);
      return res.data;
    }
  };

  const registerRecruiter = async (formData) => {
    const res = await api.registerRecruiter(formData);
    if (res.data) {
      saveAuthSession(res.data);
      return res.data;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hirehub_token');
    localStorage.removeItem('hirehub_user');
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await api.getMe();
        if (res.data) {
          const updatedUser = { ...user, ...res.data };
          setUser(updatedUser);
          localStorage.setItem('hirehub_user', JSON.stringify(updatedUser));
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        registerCandidate,
        registerRecruiter,
        logout,
        refreshUser,
        isAuthenticated: !!token && !!user,
        isCandidate: user?.role === 'CANDIDATE',
        isRecruiter: user?.role === 'RECRUITER',
        isAdmin: user?.role === 'ADMIN',
        isApprovedRecruiter: user?.role === 'RECRUITER' && user?.isApproved,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

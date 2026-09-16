import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('venma_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('venma_token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('venma_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          console.error('Session expired');
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('venma_token', userData.accessToken);
      localStorage.setItem('venma_refresh_token', userData.refreshToken);
      localStorage.setItem('venma_user', JSON.stringify(userData));
      return userData;
    }
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      localStorage.setItem('venma_token', userData.accessToken);
      localStorage.setItem('venma_refresh_token', userData.refreshToken);
      localStorage.setItem('venma_user', JSON.stringify(userData));
      return userData;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('venma_token');
    localStorage.removeItem('venma_refresh_token');
    localStorage.removeItem('venma_user');
  };

  const updateUser = (updatedData) => {
    setUser(updatedData);
    localStorage.setItem('venma_user', JSON.stringify(updatedData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isVendor: user?.role === 'vendor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const loadUser = async () => {
    try {
      apiService.setAuthToken(token);
      const userData = await apiService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await apiService.login(email, password);
      const { access_token, user_id } = response;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      apiService.setAuthToken(access_token);
      
      // Load user data
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login error details:', error);
      
      // Extract clean error message
      let errorMessage = 'Login failed';
      
      if (error.cleanMessage) {
        errorMessage = error.cleanMessage;
      } else if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail)) {
          errorMessage = detail.map(err => typeof err === 'object' && err.msg ? err.msg : String(err)).join(', ');
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (typeof detail === 'object' && detail.msg) {
          errorMessage = detail.msg;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      const { access_token } = response;
      
      localStorage.setItem('token', access_token);
      setToken(access_token);
      apiService.setAuthToken(access_token);
      
      // Load user data
      const userInfo = await apiService.getCurrentUser();
      setUser(userInfo);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    apiService.setAuthToken(null);
  };

  const verifyFreeFire = async (uid) => {
    try {
      const response = await apiService.verifyFreeFire(uid);
      // Update user data with Free Fire info
      const userData = await apiService.getCurrentUser();
      setUser(userData);
      return { success: true, data: response.user_data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Free Fire verification failed'
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    verifyFreeFire,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
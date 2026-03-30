import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authAPI.getProfile()
        .then(response => {
          setUser(response.data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await authAPI.login(formData);
      const { access_token } = response.data;
      
      localStorage.setItem('token', access_token);
      
      const userResponse = await authAPI.getProfile();
      setUser(userResponse.data);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      
      // Handle different error formats
      let errorMessage = 'Login failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check if it's a Pydantic validation error (array of objects)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => {
            const field = err.loc ? err.loc.join('.') : 'field';
            return `${field}: ${err.msg}`;
          }).join(', ');
        } 
        // Check if it's a simple detail string
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        // Check if detail is an object with a message
        else if (errorData.detail?.message) {
          errorMessage = errorData.detail.message;
        }
        // Fallback to any message property
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const signup = async (userData) => {
    try {
      await authAPI.signup(userData);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error.response?.data);
      
      // Handle different error formats
      let errorMessage = 'Signup failed';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Check if it's a Pydantic validation error (array of objects)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => {
            const field = err.loc ? err.loc.join('.') : 'field';
            return `${field}: ${err.msg}`;
          }).join(', ');
        } 
        // Check if it's a simple detail string
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        // Check if detail is an object with a message
        else if (errorData.detail?.message) {
          errorMessage = errorData.detail.message;
        }
        // Fallback to any message property
        else if (errorData.message) {
          errorMessage = errorData.message;
        }
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    console.log('AuthProvider useEffect, token=', token);
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      console.log('AuthProvider.fetchUser: start');
      // Determine user type from token or try different endpoints
      const userType = localStorage.getItem('userType') || 'patient';
      let response;
      
      if (userType === 'patient') {
        response = await api.get('/patients/profile');
      } else if (userType === 'doctor') {
        response = await api.get('/doctors/profile');
      } else if (userType === 'admin') {
        response = await api.get('/admin/dashboard');
      }
      
      setUser(response.data.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout();
    } finally {
      setLoading(false);
      console.log('AuthProvider.fetchUser: done');
    }
  };

  const login = async (email, password, userType) => {
    try {
      let endpoint = '';
      if (userType === 'patient') endpoint = '/patients/login';
      else if (userType === 'doctor') endpoint = '/doctors/login';
      else if (userType === 'admin') endpoint = '/admin/login';

      const response = await api.post(endpoint, { email, password });
      const { token, data } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);
      setToken(token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(data);

      toast.success(`Welcome back, ${data.fullName || data.name}!`);
      
      // Redirect based on user type
      if (userType === 'patient') navigate('/patient/dashboard');
      else if (userType === 'doctor') navigate('/doctor/dashboard');
      else if (userType === 'admin') navigate('/admin/dashboard');

      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (data, userType) => {
    try {
      let endpoint = '';
      if (userType === 'patient') endpoint = '/patients/register';
      else if (userType === 'doctor') endpoint = '/doctors/register';

      const response = await api.post(endpoint, data);
      
      if (userType === 'doctor') {
        toast.success('Registration successful! Please wait for admin verification.');
        navigate('/doctor/login');
      } else {
        toast.success('Registration successful! Please login.');
        navigate('/patient/login');
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common['Authorization'];
    
    const userType = localStorage.getItem('userType') || 'patient';
    if (userType === 'admin') {
      navigate('/admin/login');
    } else {
      navigate('/');
    }
    
    toast.success('Logged out successfully');
  };

  const updateProfile = async (data) => {
    try {
      const userType = localStorage.getItem('userType');
      let endpoint = '';
      if (userType === 'patient') endpoint = '/patients/profile';
      else if (userType === 'doctor') endpoint = '/doctors/profile';

      const response = await api.put(endpoint, data);
      setUser(response.data.data);
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!token,
    userType: localStorage.getItem('userType'),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
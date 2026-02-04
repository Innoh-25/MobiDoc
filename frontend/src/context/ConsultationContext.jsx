import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const ConsultationContext = createContext({});

export const useConsultation = () => useContext(ConsultationContext);

export const ConsultationProvider = ({ children }) => {
  const [consultations, setConsultations] = useState([]);
  const [availableConsultations, setAvailableConsultations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchPatientConsultations = async () => {
    try {
      setLoading(true);
      console.log('ConsultationProvider.fetchPatientConsultations start');
      const response = await api.get('/consultations/patient/me');
      setConsultations(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch consultations');
    } finally {
      setLoading(false);
      console.log('ConsultationProvider.fetchPatientConsultations done');
    }
  };

  const fetchDoctorConsultations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultations/doctor/me');
      setConsultations(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch consultations');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableConsultations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/consultations/available');
      setAvailableConsultations(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch available consultations');
    } finally {
      setLoading(false);
    }
  };

  const requestConsultation = async (data) => {
    try {
      const response = await api.post('/consultations/request', data);
      toast.success('Consultation requested successfully');
      fetchPatientConsultations();
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Request failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const acceptConsultation = async (id) => {
    try {
      const response = await api.put(`/consultations/${id}/accept`);
      toast.success('Consultation accepted successfully');
      fetchAvailableConsultations();
      fetchDoctorConsultations();
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Acceptance failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const completeConsultation = async (id) => {
    try {
      const response = await api.put(`/consultations/${id}/complete`);
      toast.success('Consultation completed successfully');
      fetchDoctorConsultations();
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Completion failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const cancelConsultation = async (id) => {
    try {
      const response = await api.put(`/consultations/${id}/cancel`);
      toast.success('Consultation cancelled successfully');
      fetchPatientConsultations();
      return { success: true, data: response.data.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Cancellation failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const value = {
    consultations,
    availableConsultations,
    loading,
    stats,
    fetchPatientConsultations,
    fetchDoctorConsultations,
    fetchAvailableConsultations,
    requestConsultation,
    acceptConsultation,
    completeConsultation,
    cancelConsultation,
    fetchStats,
  };

  return (
    <ConsultationContext.Provider value={value}>
      {children}
    </ConsultationContext.Provider>
  );
};
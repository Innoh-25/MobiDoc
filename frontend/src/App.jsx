import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConsultationProvider } from './context/ConsultationContext';
import { AuthLayout, Layout } from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import PatientRegister from './pages/auth/PatientRegister';
import DoctorRegister from './pages/auth/DoctorRegister';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientConsultations from './pages/patient/Consultations';
import RequestConsultation from './pages/patient/RequestConsultation';
import PatientProfile from './pages/patient/Profile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import AvailableConsultations from './pages/doctor/AvailableConsultations';
import DoctorConsultations from './pages/doctor/Consultations';
import DoctorProfile from './pages/doctor/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import DoctorVerification from './pages/admin/DoctorVerification';
import DoctorsManagement from './pages/admin/DoctorsManagement';
import PatientsManagement from './pages/admin/PatientsManagement';

// Protected Route Component
const ProtectedRoute = ({ children, userType }) => {
  const storedUserType = localStorage.getItem('userType');
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" />;
  }
  
  if (userType && storedUserType !== userType) {
    return <Navigate to={`/${storedUserType}/dashboard`} />;
  }
  
  return children;
};

const App = () => {
  // Quick debug mode: set VITE_DEBUG_UI=1 in frontend/.env to enable a simple visible UI
  if (import.meta.env.VITE_DEBUG_UI === '1') {
    return (
      <div style={{padding:24}}>
        <h1 style={{fontSize:20,fontWeight:700}}>DEBUG APP VISIBLE</h1>
        <p>The app debug banner is enabled (VITE_DEBUG_UI=1).</p>
      </div>
    );
  }

  // Feature toggles to help bisect blank UI issues. Set these in `frontend/.env`:
  // VITE_DISABLE_AUTH=1 to disable the AuthProvider
  // VITE_DISABLE_CONSULTATION=1 to disable the ConsultationProvider
  const disableAuth = import.meta.env.VITE_DISABLE_AUTH === '1';
  const disableConsultation = import.meta.env.VITE_DISABLE_CONSULTATION === '1';

  const WithProviders = ({ children }) => {
    let tree = children;
    if (!disableConsultation) {
      tree = <ConsultationProvider>{tree}</ConsultationProvider>;
    }
    if (!disableAuth) {
      tree = <AuthProvider>{tree}</AuthProvider>;
    }
    return tree;
  };

  console.log('App render', { disableAuth, disableConsultation, debug: import.meta.env.VITE_DEBUG_UI });

  return (
    <Router>
      <WithProviders>
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/patient/register" element={<PatientRegister />} />
              <Route path="/doctor/register" element={<DoctorRegister />} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient" element={
              <ProtectedRoute userType="patient">
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="consultations" element={<PatientConsultations />} />
              <Route path="consultations/request" element={<RequestConsultation />} />
              <Route path="profile" element={<PatientProfile />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor" element={
              <ProtectedRoute userType="doctor">
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="available" element={<AvailableConsultations />} />
              <Route path="consultations" element={<DoctorConsultations />} />
              <Route path="profile" element={<DoctorProfile />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute userType="admin">
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="doctors/pending" element={<DoctorVerification />} />
              <Route path="doctors" element={<DoctorsManagement />} />
              <Route path="patients" element={<PatientsManagement />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </WithProviders>
    </Router>
  );
};

export default App;
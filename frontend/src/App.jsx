import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ConsultationProvider } from './context/ConsultationContext';
import { Layout, AuthLayout } from './components/common/Layout';

// Auth Pages
import Login from './pages/auth/Login';
import PatientRegister from './pages/auth/PatientRegister';
import DoctorRegister from './pages/auth/DoctorRegister';
// AdminLogin is imported later with other admin pages

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientProfile from './pages/patient/Profile';
import PatientConsultations from './pages/patient/Consultations';
import RequestConsultation from './pages/patient/RequestConsultation';
import SelectDoctor from './pages/patient/SelectDoctor';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorProfile from './pages/doctor/Profile';
import DoctorConsultations from './pages/doctor/Consultations';
import DoctorOnboarding from './pages/doctor/DoctorOnboarding';
import AvailableConsultations from './pages/doctor/AvailableConsultations';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/Dashboard';

// Common
// import NotFound from './pages/NotFound';

// Private Route Component
const PrivateRoute = ({ children, userType }) => {
  const token = localStorage.getItem('token');
  const storedUserType = localStorage.getItem('userType');
  
  if (!token) {
    return <Navigate to="/" />;
  }
  
  if (userType && storedUserType !== userType) {
    return <Navigate to={`/${storedUserType}/dashboard`} />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ConsultationProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Navigate to="/login" />} />
              <Route path="login" element={<Login />} />
              <Route path="patient/register" element={<PatientRegister />} />
              <Route path="doctor/register" element={<DoctorRegister />} />
              <Route path="admin/login" element={<AdminLogin />} />
            </Route>

            {/* Patient Routes */}
            <Route path="/patient" element={<PrivateRoute userType="patient"><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route path="consultations" element={<PatientConsultations />} />
              <Route path="consultations/request" element={<RequestConsultation />} />
              <Route path="select-doctor" element={<SelectDoctor />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* Doctor Routes */}
            <Route path="/doctor" element={<PrivateRoute userType="doctor"><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<DoctorDashboard />} />
              <Route path="onboarding" element={<DoctorOnboarding />} />
              <Route path="profile" element={<DoctorProfile />} />
              <Route path="consultations" element={<DoctorConsultations />} />
              <Route path="available" element={<AvailableConsultations />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute userType="admin"><Layout /></PrivateRoute>}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* 404 Route */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>
        </ConsultationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
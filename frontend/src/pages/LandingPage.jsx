import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../components/common/Logo';

const LandingPage = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [isHovering, setIsHovering] = useState(null);

  const handleContinue = () => {
    if (selectedRole === 'patient') {
      navigate('/patient/login');
    } else if (selectedRole === 'doctor') {
      navigate('/doctor/login');
    }
  };

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Access healthcare services, book consultations, and manage your health records',
      icon: (
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-600',
      bgHover: 'hover:from-blue-50 hover:to-blue-100',
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Provide medical consultations, manage appointments, and serve patients',
      icon: (
        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 5.25l-7.5-3.75-7.5 3.75m15 0v6.75a9 9 0 01-15 0v-6.75m15 0L12 9m0 0L4.5 5.25M12 9v12" />
        </svg>
      ),
      color: 'from-green-500 to-green-600',
      bgHover: 'hover:from-green-50 hover:to-green-100',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Logo className="h-10 w-10" />
              <span className="text-2xl font-bold text-gray-900">MobiDoc</span>
            </div>
            <button
              onClick={() => navigate('/admin/login')}
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Admin Access →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-primary-600">MobiDoc</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your trusted healthcare platform connecting patients with qualified doctors
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              I am a...
            </h2>
            <p className="text-gray-600">
              Please select your role to continue
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {roles.map((role) => (
              <div
                key={role.id}
                className={`
                  relative cursor-pointer rounded-2xl transition-all duration-300
                  ${selectedRole === role.id 
                    ? `ring-4 ring-${role.color.split('-')[1]}-300 shadow-xl transform scale-105` 
                    : 'shadow-lg hover:shadow-2xl'
                  }
                  ${isHovering === role.id ? `bg-gradient-to-br ${role.bgHover}` : 'bg-white'}
                `}
                onClick={() => setSelectedRole(role.id)}
                onMouseEnter={() => setIsHovering(role.id)}
                onMouseLeave={() => setIsHovering(null)}
              >
                <div className="p-8 text-center">
                  <div className={`text-${role.color.split('-')[1]}-500`}>
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {role.description}
                  </p>
                  {selectedRole === role.id && (
                    <div className="inline-flex items-center text-sm font-medium text-primary-600">
                      <span>Selected</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`
                px-12 py-4 rounded-lg text-lg font-semibold transition-all duration-300
                ${selectedRole 
                  ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-105 shadow-lg' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Continue as {selectedRole ? (selectedRole === 'patient' ? 'Patient' : 'Doctor') : '...'}
            </button>
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              New to MobiDoc?{' '}
              <button
                onClick={() => navigate('/patient/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Create a patient account
              </button>
              {' '}or{' '}
              <button
                onClick={() => navigate('/doctor/register')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                register as a doctor
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 text-sm">
            © 2024 MobiDoc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
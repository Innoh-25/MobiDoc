import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../components/common/Logo';

const AccountTypeSelection = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);

  const handleContinue = () => {
    if (selectedType === 'patient') {
      navigate('/patient/register');
    } else if (selectedType === 'doctor') {
      navigate('/doctor/register');
    }
  };

  const accountTypes = [
    {
      id: 'patient',
      title: 'Patient',
      description: 'Access healthcare services, book consultations, and manage your health records',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Provide medical consultations, manage appointments, and serve patients',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 5.25l-7.5-3.75-7.5 3.75m15 0v6.75a9 9 0 01-15 0v-6.75m15 0L12 9m0 0L4.5 5.25M12 9v12" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              I want to register as:
            </label>
            <div className="space-y-3">
              {accountTypes.map((type) => (
                <label
                  key={type.id}
                  className={`
                    flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all
                    ${selectedType === type.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="accountType"
                    value={type.id}
                    checked={selectedType === type.id}
                    onChange={() => setSelectedType(type.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 mt-1"
                  />
                  <div className="ml-3 flex-1">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-gray-900">
                        {type.title}
                      </span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleContinue}
            disabled={!selectedType}
            className={`
              w-full py-3 px-4 rounded-lg text-base font-semibold transition-all duration-300 mt-4
              ${selectedType 
                ? 'bg-primary-600 text-white hover:bg-primary-700 transform hover:scale-[1.02] shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            Continue
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountTypeSelection;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/common/Logo';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Update the schema with stronger password requirements
const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .matches(/[a-zA-Z]/, 'Password must contain at least one letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one symbol')
    .required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  fullName: yup.string().required('Full name is required'),
  phone: yup.string().required('Phone number is required'),
  dateOfBirth: yup.date().nullable(),
  gender: yup.string().oneOf(['male', 'female', 'other']),
});

const PatientRegister = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [dob, setDob] = useState(null);
  
  // New state for password features
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const [confirmPasswordValue, setConfirmPasswordValue] = useState('');
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    hasNumber: false,
    hasLetter: false,
    hasSymbol: false,
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
  });

  // Real-time password validation
  const validatePasswordRealtime = (password) => {
    const requirements = {
      length: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasLetter: /[a-zA-Z]/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordRequirements(requirements);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPasswordValue(value);
    validatePasswordRealtime(value);
    register('password').onChange(e);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPasswordValue(e.target.value);
    register('confirmPassword').onChange(e);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Get requirement status color and icon
  const getRequirementStatus = (met) => {
    return met ? 'text-green-600' : 'text-gray-400';
  };

  const getRequirementIcon = (met) => {
    return met ? '✓' : '○';
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await registerUser(data, 'patient');
    setLoading(false);
    
    if (result.success) {
      navigate('/patient/dashboard');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo className="h-12 w-12" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="mt-2 text-gray-600">
          Join MobiDoc for accessible healthcare
        </p>
      </div>

      <div className="card p-8 shadow-lg">

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                {...register('fullName')}
                type="text"
                className="input"
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email 
              </label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password 
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  onChange={handlePasswordChange}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {passwordValue && (
                <div className="mt-2 space-y-1 text-xs">
                  <p className="text-xs text-gray-600 mb-1">Password must contain:</p>
                  <div className={`flex items-center ${getRequirementStatus(passwordRequirements.length)}`}>
                    <span className="mr-1">{getRequirementIcon(passwordRequirements.length)}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center ${getRequirementStatus(passwordRequirements.hasNumber)}`}>
                    <span className="mr-1">{getRequirementIcon(passwordRequirements.hasNumber)}</span>
                    <span>At least 1 number</span>
                  </div>
                  <div className={`flex items-center ${getRequirementStatus(passwordRequirements.hasLetter)}`}>
                    <span className="mr-1">{getRequirementIcon(passwordRequirements.hasLetter)}</span>
                    <span>At least 1 letter</span>
                  </div>
                  <div className={`flex items-center ${getRequirementStatus(passwordRequirements.hasSymbol)}`}>
                    <span className="mr-1">{getRequirementIcon(passwordRequirements.hasSymbol)}</span>
                    <span>At least 1 symbol (!@#$%^&* etc.)</span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password 
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword')}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  onChange={handleConfirmPasswordChange}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Real-time password match indicator */}
              {confirmPasswordValue && (
                <div className="mt-2">
                  <div className={`flex items-center text-sm ${passwordValue === confirmPasswordValue && passwordValue ? 'text-green-600' : 'text-red-600'}`}>
                    {passwordValue === confirmPasswordValue && passwordValue ? (
                      <>
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number 
              </label>
              <input
                {...register('phone')}
                type="tel"
                className="input"
                placeholder="0712345678"
                maxLength={10}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <DatePicker
                selected={dob}
                onChange={(date) => {
                  setDob(date);
                  setValue('dateOfBirth', date);
                }}
                className="input w-full"
                placeholderText="Select date"
                maxDate={new Date()}
                showYearDropdown
                dateFormat="yyyy-MM-dd"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                {...register('gender')}
                className="input"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              required
            />
            <label className="ml-2 block text-sm text-gray-900">
              I agree to the{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-500">
                Privacy Policy
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3 px-4 text-base font-medium"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="spinner h-5 w-5 border-2 mr-2"></div>
                Creating account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PatientRegister;
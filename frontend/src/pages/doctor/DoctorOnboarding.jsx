import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { UserIcon, BriefcaseIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  // Profile section
  address: yup.string().required('Address is required'),
  languages: yup.string(),
  bio: yup.string().max(500, 'Bio must be less than 500 characters'),
  
  // Professional section
  medicalSchool: yup.string().required('Medical school is required'),
  graduationYear: yup.number().min(1900).max(new Date().getFullYear()).required('Graduation year is required'),
  yearsOfExperience: yup.number().min(0).required('Years of experience is required'),
});

const DoctorOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState({
    licenseDocument: null,
    idDocument: null,
    qualificationDocument: null,
  });

  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    checkOnboardingStatus();
    // Pre-fill user data from auth context
    if (user) {
      setValue('fullName', user.fullName || '');
      setValue('email', user.email || '');
      setValue('phone', user.phone || '');
      setValue('gender', user.gender || '');
      setValue('dateOfBirth', user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '');
      setValue('licenseNumber', user.licenseNumber || '');
      setValue('specialization', user.specialization || '');
    }
  }, [user]);

  const checkOnboardingStatus = async () => {
    try {
      const response = await api.get('/doctors/onboarding-status');
      if (response.data.data.isOnboarded) {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleFileChange = (field, file) => {
    if (!file) return;

    // Basic validation
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const removeFile = (field) => {
    setFiles(prev => ({ ...prev, [field]: null }));
    // Also clear the hidden input so the same file can be re-selected
    try {
      const idMap = {
        licenseDocument: 'licenseDocumentInput',
        idDocument: 'idDocumentInput',
        qualificationDocument: 'qualificationDocumentInput',
      };
      const input = document.getElementById(idMap[field]);
      if (input) input.value = '';
    } catch (e) {
      // ignore DOM errors
    }
  };

  const onSubmit = async (data) => {
    // Validate required files exist
    if (!files.licenseDocument || !files.idDocument || !files.qualificationDocument) {
      toast.error('Please upload all required documents (license, ID, and degree certificate).');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      const formData = new FormData();
      
      // Add all form data
      formData.append('address', data.address);
      formData.append('languages', data.languages || '');
      formData.append('bio', data.bio || '');
      formData.append('medicalSchool', data.medicalSchool);
      formData.append('graduationYear', data.graduationYear);
      formData.append('yearsOfExperience', data.yearsOfExperience);
      
      // Add files
      if (files.licenseDocument) {
        formData.append('licenseDocument', files.licenseDocument);
      }
      if (files.idDocument) {
        formData.append('idDocument', files.idDocument);
      }
      if (files.qualificationDocument) {
        formData.append('qualificationDocument', files.qualificationDocument);
      }

      const response = await api.post('/doctors/onboard', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Onboarding completed successfully!');
      const updated = response.data.data;
      // If the account is not yet approved, send user to pending approval page
      if (updated.verificationStatus && updated.verificationStatus !== 'approved') {
        navigate('/doctor/pending');
      } else {
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(error.response?.data?.error || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
        <p className="mt-2 text-gray-600">
          Please provide additional information to complete your registration
        </p>
      </div>

      <div className="card p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Profile Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <UserIcon className="h-5 w-5 mr-2 text-primary-600" />
              Profile Information
            </h3>
            
            {/* Read-only information from registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" {...register('fullName')} disabled className="input bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" {...register('email')} disabled className="input bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" {...register('phone')} disabled className="input bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <input type="text" {...register('gender')} disabled className="input bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" {...register('dateOfBirth')} disabled className="input bg-gray-100" />
              </div>
            </div>

            {/* New profile fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Residential Address *
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="input"
                  placeholder="e.g., 123 Main Street, Westlands, Nairobi"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages Spoken
                </label>
                <input
                  {...register('languages')}
                  type="text"
                  className="input"
                  placeholder="e.g., English, Swahili, French"
                />
                <p className="mt-1 text-xs text-gray-500">Separate languages with commas</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio / About Me
                </label>
                <textarea
                  {...register('bio')}
                  rows="4"
                  className="input"
                  placeholder="Tell us about yourself, your experience, and your approach to patient care..."
                  maxLength="500"
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">Maximum 500 characters</p>
              </div>
            </div>
          </div>

          {/* Professional Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-primary-600" />
              Professional Information
            </h3>
            
            {/* Read-only professional info from registration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg mb-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Medical License Number</label>
                <input type="text" {...register('licenseNumber')} disabled className="input bg-gray-100" />
              </div>
            </div>

            {/* New professional fields */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical School *
                </label>
                <input
                  {...register('medicalSchool')}
                  type="text"
                  className="input"
                  placeholder="e.g., University of Nairobi, Kenyatta University"
                />
                {errors.medicalSchool && (
                  <p className="mt-1 text-sm text-red-600">{errors.medicalSchool.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year *
                  </label>
                  <input
                    {...register('graduationYear')}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="input"
                    placeholder="e.g., 2015"
                  />
                  {errors.graduationYear && (
                    <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience *
                  </label>
                  <input
                    {...register('yearsOfExperience')}
                    type="number"
                    min="0"
                    className="input"
                    placeholder="e.g., 5"
                  />
                  {errors.yearsOfExperience && (
                    <p className="mt-1 text-sm text-red-600">{errors.yearsOfExperience.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-primary-600" />
              Required Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Document *
                </label>
                <div
                  onClick={() => document.getElementById('licenseDocumentInput').click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                >
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload</p>
                </div>
                <input
                  id="licenseDocumentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('licenseDocument', e.target.files[0])}
                  className="hidden"
                />
                {files.licenseDocument && (
                  <div className="mt-3 text-sm flex items-center justify-center">
                    <div className="truncate">{files.licenseDocument.name}</div>
                    <button
                      type="button"
                      onClick={() => removeFile('licenseDocument')}
                      className="ml-3 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

             
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  National ID / Passport *
                </label>
                <div
                  onClick={() => document.getElementById('idDocumentInput').click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                >
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload</p>
                </div>
                <input
                  id="idDocumentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('idDocument', e.target.files[0])}
                  className="hidden"
                />
                {files.idDocument && (
                  <div className="mt-3 text-sm flex items-center justify-center">
                    <div className="truncate">{files.idDocument.name}</div>
                    <button
                      type="button"
                      onClick={() => removeFile('idDocument')}
                      className="ml-3 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Degree Certificate *
                </label>
                <div
                  onClick={() => document.getElementById('qualificationDocumentInput').click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all duration-200"
                >
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600">Click to upload</p>
                </div>
                <input
                  id="qualificationDocumentInput"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('qualificationDocument', e.target.files[0])}
                  className="hidden"
                />
                {files.qualificationDocument && (
                  <div className="mt-3 text-sm flex items-center justify-center">
                    <div className="truncate">{files.qualificationDocument.name}</div>
                    <button
                      type="button"
                      onClick={() => removeFile('qualificationDocument')}
                      className="ml-3 text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full btn-primary py-3 px-4 text-base font-medium"
            >
              {loading || uploading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner h-5 w-5 border-2 mr-2"></div>
                  {uploading ? 'Uploading documents...' : 'Submitting...'}
                </div>
              ) : (
                'Complete Onboarding'
              )}
            </button>
            <p className="mt-4 text-sm text-gray-600 text-center">
              Your profile will be reviewed by admin before you can start accepting consultations
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoctorOnboarding;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const schema = yup.object({
  area: yup.string().required('Area is required'),
  city: yup.string().required('City is required'),
  county: yup.string().required('County is required'),
  address: yup.string().required('Address is required'),
  consultationFee: yup.number().min(0, 'Fee must be positive').required('Consultation fee is required'),
  bio: yup.string().max(500, 'Bio must be less than 500 characters'),
  languages: yup.array().of(yup.string()),
  emergencyContactName: yup.string().required('Emergency contact name is required'),
  emergencyContactPhone: yup.string().required('Emergency contact phone is required'),
  emergencyContactRelationship: yup.string().required('Emergency contact relationship is required'),
});

const DoctorOnboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [files, setFiles] = useState({
    licenseDocument: null,
    idDocument: null,
    qualificationDocument: null,
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // Check if doctor is already onboarded
    checkOnboardingStatus();
  }, []);

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

  const handleDayToggle = (day) => {
    setDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const uploadFile = async (field, file) => {
    const formData = new FormData();
    formData.append(field, file);
    
    try {
      const response = await api.post(`/doctors/upload-single`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.data.filePath;
    } catch (error) {
      throw new Error(`Failed to upload ${field}`);
    }
  };

  const onSubmit = async (data) => {
    if (days.length === 0) {
      toast.error('Please select at least one available day');
      return;
    }

    setLoading(true);
    setUploading(true);

    try {
      const uploadedFiles = {};
      
      // Upload files if present
      for (const [field, file] of Object.entries(files)) {
        if (file) {
          const filePath = await uploadFile(field, file);
          uploadedFiles[field] = filePath;
        }
      }

      const onboardingData = {
        location: {
          area: data.area,
          city: data.city,
          county: data.county,
          address: data.address,
        },
        consultationFee: data.consultationFee,
        availability: {
          days,
          hours: {
            start: startTime,
            end: endTime,
          },
        },
        languages: data.languages?.split(',').map(lang => lang.trim()) || [],
        bio: data.bio,
        emergencyContact: {
          name: data.emergencyContactName,
          phone: data.emergencyContactPhone,
          relationship: data.emergencyContactRelationship,
        },
        ...uploadedFiles,
      };

      const formData = new FormData();
      Object.entries(onboardingData).forEach(([key, value]) => {
        if (typeof value === 'object') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      // Upload files
      Object.entries(files).forEach(([field, file]) => {
        if (file) {
          formData.append(field, file);
        }
      });

      const response = await api.post('/doctors/onboard', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Onboarding completed successfully! Waiting for admin approval.');
      navigate('/doctor/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete onboarding');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const dayOptions = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
        <p className="mt-2 text-gray-600">
          Please provide additional information to start using MobiDoc as a doctor
        </p>
      </div>

      <div className="card p-8 shadow-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Location Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Area/Neighborhood *
                </label>
                <input
                  {...register('area')}
                  type="text"
                  className="input"
                  placeholder="e.g., Westlands"
                />
                {errors.area && (
                  <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className="input"
                  placeholder="e.g., Nairobi"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  County *
                </label>
                <input
                  {...register('county')}
                  type="text"
                  className="input"
                  placeholder="e.g., Nairobi County"
                />
                {errors.county && (
                  <p className="mt-1 text-sm text-red-600">{errors.county.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Address *
                </label>
                <input
                  {...register('address')}
                  type="text"
                  className="input"
                  placeholder="e.g., 123 Main Street, Westlands"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Professional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Fee (KES) *
                </label>
                <input
                  {...register('consultationFee')}
                  type="number"
                  min="0"
                  step="100"
                  className="input"
                  placeholder="2000"
                />
                {errors.consultationFee && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultationFee.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages (comma separated)
                </label>
                <input
                  {...register('languages')}
                  type="text"
                  className="input"
                  placeholder="e.g., English, Swahili, French"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  {...register('bio')}
                  rows="3"
                  className="input"
                  placeholder="Tell patients about your experience and approach..."
                  maxLength="500"
                />
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Availability
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available Days *
                </label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-4 py-2 rounded-lg border ${
                        days.includes(day.value)
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time *
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time *
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Emergency Contact
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  {...register('emergencyContactName')}
                  type="text"
                  className="input"
                  placeholder="John Doe"
                />
                {errors.emergencyContactName && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  {...register('emergencyContactPhone')}
                  type="tel"
                  className="input"
                  placeholder="0712345678"
                />
                {errors.emergencyContactPhone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactPhone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <input
                  {...register('emergencyContactRelationship')}
                  type="text"
                  className="input"
                  placeholder="Spouse, Parent, etc."
                />
                {errors.emergencyContactRelationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContactRelationship.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Document Uploads */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
              Required Documents
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical License Document
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('licenseDocument', e.target.files[0])}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID Document (National ID/Passport)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('idDocument', e.target.files[0])}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qualification Certificates
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('qualificationDocument', e.target.files[0])}
                  className="input"
                />
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
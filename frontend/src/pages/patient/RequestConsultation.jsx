import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  location: yup.object({
    address: yup.string().required('Address is required'),
    coordinates: yup.object({
      latitude: yup.number().nullable(),
      longitude: yup.number().nullable(),
    }),
  }),
  symptoms: yup.string().min(10, 'Please describe symptoms in detail').required('Symptoms description is required'),
  consultationType: yup.string().oneOf(['general', 'emergency']).default('general'),
});

const RequestConsultation = () => {
  const { requestConsultation } = useConsultation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      consultationType: 'general',
    },
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ latitude, longitude });
          setValue('location.coordinates', { latitude, longitude });
          
          // Reverse geocoding (you'd implement this with a geocoding service)
          setValue('location.address', `Lat: ${latitude}, Lng: ${longitude}`);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please enter address manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await requestConsultation(data);
    setLoading(false);
    
    if (result.success) {
      navigate('/patient/consultations');
    }
  };

  const consultationType = watch('consultationType');

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Request Consultation</h1>
        <p className="mt-2 text-gray-600">
          Fill in the details below to request a medical consultation
        </p>
      </div>

      <div className="card p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Consultation Type */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Consultation Type
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setValue('consultationType', 'general')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  consultationType === 'general'
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👨‍⚕️</div>
                  <h3 className="font-medium text-gray-900">General</h3>
                  <p className="mt-1 text-sm text-gray-500">Regular checkup or consultation</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setValue('consultationType', 'emergency')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  consultationType === 'emergency'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🚨</div>
                  <h3 className="font-medium text-gray-900">Emergency</h3>
                  <p className="mt-1 text-sm text-gray-500">Urgent medical attention needed</p>
                </div>
              </button>
            </div>
            <input
              type="hidden"
              {...register('consultationType')}
            />
          </div>

          {/* Location */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-gray-900">
                Location
              </label>
              <button
                type="button"
                onClick={getCurrentLocation}
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                Use current location
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <input
                  {...register('location.address')}
                  type="text"
                  className="input"
                  placeholder="Enter your address or location"
                />
                {errors.location?.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude (optional)
                  </label>
                  <input
                    {...register('location.coordinates.latitude')}
                    type="number"
                    step="any"
                    className="input"
                    placeholder="0.0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude (optional)
                  </label>
                  <input
                    {...register('location.coordinates.longitude')}
                    type="number"
                    step="any"
                    className="input"
                    placeholder="0.0000"
                  />
                </div>
              </div>
            </div>

            {currentLocation && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  Location detected: {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
              </div>
            )}
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-4">
              Symptoms Description
            </label>
            <textarea
              {...register('symptoms')}
              rows={6}
              className="input resize-none"
              placeholder="Describe your symptoms in detail. Include duration, severity, and any other relevant information."
            />
            <div className="mt-2 flex justify-between">
              <p className="text-sm text-red-600">
                {errors.symptoms?.message}
              </p>
              <p className="text-sm text-gray-500">
                {watch('symptoms')?.length || 0}/500 characters
              </p>
            </div>
          </div>

          {/* Tips */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">📝 Helpful Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Be specific about when symptoms started</li>
              <li>• Mention any medications you're taking</li>
              <li>• Include any allergies you have</li>
              <li>• Describe the severity (mild, moderate, severe)</li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`btn ${
                consultationType === 'emergency'
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : 'btn-primary'
              }`}
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="spinner h-5 w-5 border-2 mr-2"></div>
                  {consultationType === 'emergency' ? 'Requesting Emergency...' : 'Requesting Consultation...'}
                </div>
              ) : consultationType === 'emergency' ? (
                'Request Emergency Consultation'
              ) : (
                'Request Consultation'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestConsultation;
import React, { useEffect, useState } from 'react';
import { useConsultation } from '../../context/ConsultationContext';
import { ConsultationCard } from '../../components/consultation/ConsultationCard';
import { toast } from 'react-hot-toast';
import { 
  ClipboardDocumentIcon, 
  FunnelIcon, 
  MapPinIcon,
  ClockIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const AvailableConsultations = () => {
  const { availableConsultations, loading, fetchAvailableConsultations, acceptConsultation } = useConsultation();
  const [filter, setFilter] = useState('all');
  const [acceptingId, setAcceptingId] = useState(null);

  useEffect(() => {
    fetchAvailableConsultations();
  }, []);

  const handleAccept = async (consultationId) => {
    setAcceptingId(consultationId);
    const result = await acceptConsultation(consultationId);
    setAcceptingId(null);
    
    if (result.success) {
      toast.success('Consultation accepted successfully!');
    }
  };

  const filteredConsultations = availableConsultations.filter(consultation => {
    if (filter === 'all') return true;
    if (filter === 'emergency') return consultation.consultationType === 'emergency';
    return consultation.consultationType === 'general';
  });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Available Consultations</h1>
        <p className="mt-2 text-gray-600">
          Review and accept consultation requests from patients
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <ClipboardDocumentIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Available</p>
              <p className="text-2xl font-bold text-gray-900">{availableConsultations.length}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <ClockIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">General</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableConsultations.filter(c => c.consultationType === 'general').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center mr-4">
              <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Emergency</p>
              <p className="text-2xl font-bold text-gray-900">
                {availableConsultations.filter(c => c.consultationType === 'emergency').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>
          <div className="flex space-x-2">
            {['all', 'general', 'emergency'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full capitalize ${
                  filter === type
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consultations Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredConsultations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredConsultations.map((consultation) => (
            <div key={consultation._id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {consultation.patientId?.fullName || 'Patient'}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="truncate max-w-[200px]">
                      {consultation.location?.address || 'Location not specified'}
                    </span>
                  </div>
                </div>
                <span className={`badge ${
                  consultation.consultationType === 'emergency'
                    ? 'badge-error'
                    : 'badge-info'
                }`}>
                  {consultation.consultationType === 'emergency' ? '🚨 Emergency' : '🩺 General'}
                </span>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-700 line-clamp-3">
                  {consultation.symptoms}
                </p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                <div>
                  <span className="font-medium">Requested:</span>{' '}
                  {new Date(consultation.createdAt).toLocaleDateString()}
                </div>
                <div className="text-right">
                  <span className="font-medium">Fee:</span>{' '}
                  KES {consultation.consultationFee || 'Not set'}
                </div>
              </div>

              <button
                onClick={() => handleAccept(consultation._id)}
                disabled={acceptingId === consultation._id}
                className={`w-full btn ${
                  consultation.consultationType === 'emergency'
                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                    : 'btn-primary'
                }`}
              >
                {acceptingId === consultation._id ? (
                  <div className="flex items-center justify-center">
                    <div className="spinner h-5 w-5 border-2 mr-2"></div>
                    Accepting...
                  </div>
                ) : consultation.consultationType === 'emergency' ? (
                  '🚨 Accept Emergency'
                ) : (
                  'Accept Consultation'
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <ClipboardDocumentIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No available consultations
          </h3>
          <p className="text-gray-500">
            {filter === 'all' 
              ? 'There are no consultation requests at the moment'
              : `No ${filter} consultations available`}
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="mt-8 card p-6 bg-blue-50 border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          Important Notes for Doctors
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Review patient symptoms carefully before accepting</li>
          <li>• Emergency consultations should be prioritized</li>
          <li>• Ensure you can reach the patient's location</li>
          <li>• Contact the patient if you need more information</li>
          <li>• Update consultation status promptly</li>
        </ul>
      </div>
    </div>
  );
};

export default AvailableConsultations;
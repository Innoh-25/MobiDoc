import React, { useEffect, useState } from 'react';
import { useConsultation } from '../../context/ConsultationContext';
import { ConsultationCard } from '../../components/consultation/ConsultationCard';
import { toast } from 'react-hot-toast';
import { 
  CalendarIcon, 
  FunnelIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const DoctorConsultations = () => {
  const { consultations, loading, fetchDoctorConsultations, completeConsultation } = useConsultation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [completingId, setCompletingId] = useState(null);

  useEffect(() => {
    fetchDoctorConsultations();
  }, []);

  const handleComplete = async (consultationId) => {
    setCompletingId(consultationId);
    const result = await completeConsultation(consultationId);
    setCompletingId(null);
    
    if (result.success) {
      toast.success('Consultation marked as completed!');
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    if (statusFilter === 'all') return true;
    return consultation.status === statusFilter;
  });

  const getStatusStats = () => {
    const stats = {
      all: consultations.length,
      accepted: 0,
      completed: 0,
    };

    consultations.forEach(consultation => {
      if (consultation.status === 'accepted') stats.accepted++;
      if (consultation.status === 'completed') stats.completed++;
    });

    return stats;
  };

  const statusStats = getStatusStats();

  const statusConfig = {
    accepted: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: ExclamationTriangleIcon },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Consultations</h1>
        <p className="mt-2 text-gray-600">
          Manage your current and past medical consultations
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.all}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.accepted}</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{statusStats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
          </div>
          <div className="flex space-x-2">
            {['all', 'accepted', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-sm font-medium rounded-full capitalize ${
                  statusFilter === status
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === 'all' ? 'All' : status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="mt-4">
                    <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredConsultations.length > 0 ? (
          <div className="space-y-4">
            {filteredConsultations.map((consultation) => (
              <div key={consultation._id}>
                <ConsultationCard
                  consultation={consultation}
                  userType="doctor"
                />
                {consultation.status === 'accepted' && (
                  <div className="mt-2 ml-4">
                    <button
                      onClick={() => handleComplete(consultation._id)}
                      disabled={completingId === consultation._id}
                      className="btn-primary text-sm py-1.5 px-3"
                    >
                      {completingId === consultation._id ? (
                        <div className="flex items-center">
                          <div className="spinner h-3 w-3 border-2 mr-2"></div>
                          Completing...
                        </div>
                      ) : (
                        'Mark as Complete'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {statusFilter !== 'all' 
                ? `No ${statusFilter} consultations`
                : 'No consultations found'}
            </h3>
            <p className="text-gray-500">
              {statusFilter !== 'all' 
                ? `You don't have any ${statusFilter} consultations`
                : 'You haven\'t accepted any consultations yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorConsultations;
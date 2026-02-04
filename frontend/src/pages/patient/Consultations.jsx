import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import { ConsultationCard } from '../../components/consultation/ConsultationCard';
import { PlusIcon, FunnelIcon, ClockIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const PatientConsultations = () => {
  const { consultations, loading, fetchPatientConsultations } = useConsultation();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPatientConsultations();
  }, []);

  const filteredConsultations = consultations.filter(consultation => {
    // Status filter
    if (statusFilter !== 'all' && consultation.status !== statusFilter) {
      return false;
    }
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        consultation.symptoms?.toLowerCase().includes(searchLower) ||
        consultation.location?.address?.toLowerCase().includes(searchLower) ||
        consultation.doctorId?.fullName?.toLowerCase().includes(searchLower) ||
        consultation._id?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getStatusStats = () => {
    const stats = {
      all: consultations.length,
      requested: 0,
      accepted: 0,
      completed: 0,
      cancelled: 0,
    };

    consultations.forEach(consultation => {
      if (stats[consultation.status] !== undefined) {
        stats[consultation.status]++;
      }
    });

    return stats;
  };

  const statusStats = getStatusStats();

  const statusConfig = {
    requested: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
    accepted: { label: 'In Progress', color: 'bg-blue-100 text-blue-800', icon: ExclamationTriangleIcon },
    completed: { label: 'Completed', color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircleIcon },
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Consultations</h1>
          <p className="mt-2 text-gray-600">
            View and manage all your medical consultations
          </p>
        </div>
        <Link
          to="/patient/consultations/request"
          className="btn-primary flex items-center mt-4 md:mt-0"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Consultation
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {['all', 'requested', 'accepted', 'completed', 'cancelled'].map((status) => {
          const config = status === 'all' 
            ? { label: 'All', color: 'bg-gray-100 text-gray-800', icon: ClockIcon }
            : statusConfig[status];
          
          const Icon = config.icon;
          
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`card p-4 text-center transition-all duration-200 ${
                statusFilter === status 
                  ? 'ring-2 ring-primary-500 ring-offset-2' 
                  : 'hover:shadow-md'
              }`}
            >
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${config.color.split(' ')[0]} ${config.color.split(' ')[1]} mb-2`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-xl font-bold text-gray-900">{statusStats[status] || 0}</div>
              <div className="text-sm text-gray-600 capitalize">{config.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
            <div className="flex flex-wrap gap-2">
              {['all', 'requested', 'accepted', 'completed', 'cancelled'].map((status) => (
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
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search consultations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full md:w-64"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Consultations List */}
      <div>
        {loading ? (
          // Loading skeletons
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
              <ConsultationCard
                key={consultation._id}
                consultation={consultation}
                userType="patient"
              />
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="text-gray-400 mb-4 text-6xl">🩺</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' 
                ? 'No consultations found'
                : "You haven't requested any consultations yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : statusFilter !== 'all'
                ? `No ${statusFilter} consultations found`
                : 'Get started by requesting your first consultation'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                to="/patient/consultations/request"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Request Consultation
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination (if needed) */}
      {filteredConsultations.length > 10 && (
        <div className="mt-8 flex justify-center">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100"
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100">
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default PatientConsultations;
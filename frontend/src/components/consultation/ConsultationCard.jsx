import React from 'react';
import { format } from 'date-fns';
import { 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  UserIcon,
  MapPinIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

const statusConfig = {
  requested: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
    label: 'Pending',
  },
  accepted: {
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircleIcon,
    label: 'In Progress',
  },
  completed: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
    label: 'Completed',
  },
  cancelled: {
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
    label: 'Cancelled',
  },
};

export const ConsultationCard = ({ consultation, userType }) => {
  const navigate = useNavigate();
  const status = statusConfig[consultation.status];
  const StatusIcon = status.icon;

  const handleClick = () => {
    navigate(`/consultations/${consultation._id}`);
  };

  return (
    <div 
      className="card p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <span className={`badge ${status.color} flex items-center`}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </span>
            <span className={`badge ${
              consultation.consultationType === 'emergency'
                ? 'bg-red-100 text-red-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {consultation.consultationType === 'emergency' ? '🚨 Emergency' : '🩺 General'}
            </span>
          </div>

          <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
            {consultation.symptoms.substring(0, 60)}...
          </h3>

          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {format(new Date(consultation.createdAt), 'MMM d, h:mm a')}
            </div>
            
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              {consultation.location?.address?.substring(0, 30)}...
            </div>

            {userType === 'doctor' && consultation.patientId && (
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {consultation.patientId.fullName}
              </div>
            )}

            {userType === 'patient' && consultation.doctorId && (
              <div className="flex items-center">
                <UserIcon className="h-4 w-4 mr-1" />
                {consultation.doctorId.fullName}
              </div>
            )}
          </div>
        </div>

        <div className="ml-4">
          <div className="text-right">
            <div className="text-lg font-semibold text-gray-900">
              KES {consultation.consultationFee || 0}
            </div>
            <div className="text-sm text-gray-500">Fee</div>
          </div>
        </div>
      </div>

      {consultation.status === 'requested' && userType === 'patient' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle cancel action
            }}
            className="btn-outline w-full text-sm"
          >
            Cancel Request
          </button>
        </div>
      )}

      {consultation.status === 'accepted' && userType === 'doctor' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle complete action
            }}
            className="btn-primary w-full text-sm"
          >
            Mark as Complete
          </button>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const activityTypes = {
  consultation_requested: {
    color: 'bg-blue-100 text-blue-800',
    icon: '📋',
    label: 'Consultation Requested',
  },
  consultation_accepted: {
    color: 'bg-green-100 text-green-800',
    icon: '✅',
    label: 'Consultation Accepted',
  },
  consultation_completed: {
    color: 'bg-purple-100 text-purple-800',
    icon: '🏥',
    label: 'Consultation Completed',
  },
  doctor_approved: {
    color: 'bg-emerald-100 text-emerald-800',
    icon: '👨‍⚕️',
    label: 'Doctor Approved',
  },
  patient_registered: {
    color: 'bg-amber-100 text-amber-800',
    icon: '👤',
    label: 'Patient Registered',
  },
  // default fallback
  default: {
    color: 'bg-gray-100 text-gray-800',
    icon: 'ℹ️',
    label: 'Activity',
  },
};

export const RecentActivity = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center py-3 border-b border-gray-200 last:border-0">
            <div className="animate-pulse flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-primary-600 hover:text-primary-500 font-medium">
          View all
        </button>
      </div>
      
      <div className="space-y-4">
        {(activities || []).map((activity, index) => {
          const type = activityTypes[activity?.type] ?? activityTypes.default;
          
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full flex items-center justify-center text-lg">
                  {type.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${type.color}`}>
                    {type.label}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        
        {activities.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">📊</div>
            <p className="text-gray-500">No recent activity</p>
          </div>
        )}
      </div>
    </div>
  );
};
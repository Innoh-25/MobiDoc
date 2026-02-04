import React from 'react';
import { 
  UsersIcon, 
  UserGroupIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const iconMap = {
  patients: UsersIcon,
  doctors: UserGroupIcon,
  pending: ClockIcon,
  revenue: CurrencyDollarIcon,
  completed: CheckCircleIcon,
  active: ExclamationTriangleIcon,
};

const colorMap = {
  patients: 'bg-blue-100 text-blue-600',
  doctors: 'bg-green-100 text-green-600',
  pending: 'bg-yellow-100 text-yellow-600',
  revenue: 'bg-purple-100 text-purple-600',
  completed: 'bg-emerald-100 text-emerald-600',
  active: 'bg-orange-100 text-orange-600',
};

export const StatsCard = ({ title, value, change, type, loading = false }) => {
  const Icon = iconMap[type] || UsersIcon;
  const colors = colorMap[type] || 'bg-gray-100 text-gray-600';

  if (loading) {
    return (
      <div className="card p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="h-8 bg-gray-200 rounded w-24"></div>
            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
          <div className="mt-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colors}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center">
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="ml-2 text-sm text-gray-500">from last month</span>
        </div>
      )}
    </div>
  );
};
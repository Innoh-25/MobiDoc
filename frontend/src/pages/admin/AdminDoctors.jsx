import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserGroupIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const AdminDoctors = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Doctors</h1>
        <p className="mt-2 text-gray-600">
          View and manage all registered doctors
        </p>
      </div>

      {/* Search and Filter */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search doctors by name, specialization, or email..."
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <select className="input md:w-48">
            <option value="">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
          <button className="btn-primary px-6">
            Search
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Approved Doctors</p>
              <p className="text-2xl font-semibold text-gray-900">42</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="card p-8 text-center">
        <UserGroupIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          All Doctors Management
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          This page will display all doctors with their details, status, and management options.
          You'll be able to view profiles, change status, and manage doctor accounts.
        </p>
        
        <div className="space-y-4 max-w-lg mx-auto">
          <div className="p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium text-gray-900 mb-2">Planned Features:</h4>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• View all doctors in a sortable table</li>
              <li>• Filter by status, specialization, or location</li>
              <li>• View detailed doctor profiles</li>
              <li>• Approve/reject doctors directly</li>
              <li>• Deactivate/reactivate doctor accounts</li>
              <li>• Export doctor data</li>
            </ul>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/admin/dashboard"
              className="btn-outline"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/admin/doctors/pending"
              className="btn-primary"
            >
              Go to Pending Doctors
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctors;
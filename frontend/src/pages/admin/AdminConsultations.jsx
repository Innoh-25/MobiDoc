import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardDocumentListIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  UserGroupIcon,
  CalendarIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const AdminConsultations = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Consultations</h1>
        <p className="mt-2 text-gray-600">
          Monitor and manage all consultation requests
        </p>
      </div>

      {/* Filters and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="lg:col-span-3">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name, doctor name, or ID..."
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
              <select className="input md:w-48">
                <option value="">All Status</option>
                <option value="requested">Requested</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button className="btn-primary px-6">
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Today</p>
              <p className="text-2xl font-semibold text-gray-900">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-gray-900">8</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <UserGroupIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <XCircleIcon className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-xl font-semibold text-gray-900">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <ClipboardDocumentListIcon className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Consultation Management
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page provides a complete overview of all consultations. Monitor status,
            view details, and manage consultation flow across the platform.
          </p>
        </div>

        {/* Mock Consultation List */}
        <div className="space-y-4 max-w-4xl mx-auto mb-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-6 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Consultation #MED2024{item}00{item}</h4>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Today, 10:30 AM • General Consultation
                  </div>
                </div>
                <span className="badge badge-warning">Pending</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center mb-2">
                    <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-700">Patient</p>
                      <p className="text-gray-600">Jane Smith • 0712 123 456</p>
                    </div>
                  </div>
                  <p className="text-gray-600 ml-6">Symptoms: Fever, headache for 2 days</p>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <UserGroupIcon className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <p className="font-medium text-gray-700">Doctor</p>
                      <p className="text-gray-600">Not assigned yet</p>
                    </div>
                  </div>
                  <p className="text-gray-600 ml-6">Location: Nairobi, Westlands</p>
                </div>
              </div>

              <div className="mt-4 flex justify-end space-x-3">
                <button className="btn-outline text-sm py-1.5 px-3">
                  View Details
                </button>
                <button className="btn-primary text-sm py-1.5 px-3">
                  Assign Doctor
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h4 className="font-medium text-purple-900 mb-3">Admin Controls:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800">
            <div className="space-y-2">
              <p>• View all consultation details</p>
              <p>• Monitor consultation status in real-time</p>
              <p>• Assign doctors to pending consultations</p>
            </div>
            <div className="space-y-2">
              <p>• Resolve disputes between patients and doctors</p>
              <p>• Cancel consultations if needed</p>
              <p>• Generate consultation reports</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Link
            to="/admin/dashboard"
            className="btn-outline"
          >
            Back to Dashboard
          </Link>
          <button className="btn-primary">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConsultations;
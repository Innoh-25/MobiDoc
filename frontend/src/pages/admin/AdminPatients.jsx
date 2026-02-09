import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UsersIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon 
} from '@heroicons/react/24/outline';

const AdminPatients = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">All Patients</h1>
        <p className="mt-2 text-gray-600">
          View and manage all registered patients
        </p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search patients by name, email, or phone..."
                    className="input pl-10 w-full"
                  />
                </div>
              </div>
              <button className="btn-primary px-6">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <UsersIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Patient Management
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page will display all registered patients with their details, consultation history,
            and account management options.
          </p>
        </div>

        {/* Mock Patient Table */}
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[1, 2, 3].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <UserIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          John Doe
                        </div>
                        <div className="text-sm text-gray-500">
                          Male • 35 years
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">john.doe@email.com</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <PhoneIcon className="h-3 w-3 mr-1" />
                      0712 345 678
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <MapPinIcon className="h-3 w-3 mr-1" />
                      Nairobi
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">12 total</div>
                    <div className="text-sm text-gray-500">3 pending</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="badge badge-success">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Features List */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h4 className="font-medium text-gray-900 mb-3">Available Features:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                View patient profiles and medical history
              </p>
              <p className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                See consultation history and status
              </p>
              <p className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Filter and search patients
              </p>
            </div>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Export patient data (CSV/Excel)
              </p>
              <p className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                View patient activity logs
              </p>
              <p className="flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                Manage patient account status
              </p>
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
            Export Patient Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPatients;
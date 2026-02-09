import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ExclamationTriangleIcon,
  EyeIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserGroupIcon 
} from '@heroicons/react/24/outline';

const AdminPendingDoctors = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Doctor Verifications</h1>
        <p className="mt-2 text-gray-600">
          Review and approve doctors who have completed onboarding
        </p>
      </div>

      {/* Stats Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-3" />
          <div>
            <h3 className="font-medium text-yellow-800">8 Doctors Awaiting Approval</h3>
            <p className="text-sm text-yellow-700 mt-1">
              These doctors have completed their onboarding and require your verification before they can start accepting consultations.
            </p>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <UserGroupIcon className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Doctor Verification Management
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page will display doctors who have completed the onboarding process and are ready for verification.
            You can review their documents, check their details, and approve or reject their applications.
          </p>
        </div>

        {/* Mock Doctor Card */}
        <div className="border rounded-lg p-6 mb-6 max-w-3xl mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <UserGroupIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <h4 className="font-semibold text-gray-900">Dr. Sarah Johnson</h4>
                <p className="text-sm text-gray-500">Cardiology Specialist</p>
              </div>
            </div>
            <span className="badge badge-warning">Pending Review</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
            <div>
              <p className="font-medium text-gray-700">Location:</p>
              <p>Westlands, Nairobi</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Consultation Fee:</p>
              <p>KES 2,500</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">License Number:</p>
              <p>MED123456</p>
            </div>
            <div>
              <p className="font-medium text-gray-700">Experience:</p>
              <p>8 years</p>
            </div>
          </div>

          <div className="flex space-x-3 justify-center">
            <button className="btn-outline flex items-center">
              <EyeIcon className="h-4 w-4 mr-2" />
              View Details
            </button>
            <button className="btn-outline flex items-center">
              <DocumentTextIcon className="h-4 w-4 mr-2" />
              View Documents
            </button>
            <button className="btn-success flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              Approve
            </button>
            <button className="btn-error flex items-center">
              <XCircleIcon className="h-4 w-4 mr-2" />
              Reject
            </button>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h4 className="font-medium text-blue-900 mb-2">Verification Process:</h4>
          <ol className="text-sm text-blue-800 space-y-2">
            <li>1. Review doctor's professional information and qualifications</li>
            <li>2. Check uploaded documents (license, ID, certificates)</li>
            <li>3. Verify location and consultation fee details</li>
            <li>4. Approve if all requirements are met, or reject with reason</li>
            <li>5. Approved doctors will appear in patient searches immediately</li>
          </ol>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
          <Link
            to="/admin/dashboard"
            className="btn-outline"
          >
            Back to Dashboard
          </Link>
          <Link
            to="/admin/doctors"
            className="btn-primary"
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingDoctors;
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  UserPlusIcon,
  ClockIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const AdminPendingOnboarding = () => {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Pending Onboarding</h1>
        <p className="mt-2 text-gray-600">
          Doctors who have registered but haven't completed their profile setup
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <UserPlusIcon className="h-6 w-6 text-blue-600 mr-3" />
          <div>
            <h3 className="font-medium text-blue-800">5 Doctors Need to Complete Onboarding</h3>
            <p className="text-sm text-blue-700 mt-1">
              These doctors have registered but haven't filled out their complete profile. They will appear here until they complete the onboarding process.
            </p>
          </div>
        </div>
      </div>

      {/* Content Placeholder */}
      <div className="card p-8">
        <div className="text-center mb-8">
          <ClockIcon className="h-16 w-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Onboarding Management
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page shows doctors who started registration but haven't completed their profile setup.
            You can view their basic registration details and send reminders if needed.
          </p>
        </div>

        {/* Mock Doctor List */}
        <div className="space-y-4 max-w-3xl mx-auto mb-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserPlusIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">Dr. Alex Morgan</h4>
                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                      <span className="flex items-center">
                        <EnvelopeIcon className="h-3 w-3 mr-1" />
                        alex.morgan@email.com
                      </span>
                      <span className="flex items-center">
                        <PhoneIcon className="h-3 w-3 mr-1" />
                        0712 345 678
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Registered: 2 days ago
                  </div>
                  <span className="badge badge-info mt-1">Awaiting Onboarding</span>
                </div>
              </div>
              
              <div className="mt-3 text-sm text-gray-600">
                <p><span className="font-medium">Specialization:</span> Neurology</p>
                <p><span className="font-medium">License:</span> MED789012</p>
              </div>
              
              <div className="mt-3 flex justify-end">
                <button className="text-sm text-primary-600 hover:text-primary-800 flex items-center">
                  Send Reminder <ArrowRightIcon className="h-3 w-3 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-3xl mx-auto">
          <h4 className="font-medium text-gray-900 mb-3">Onboarding Process:</h4>
          <div className="text-sm text-gray-600 space-y-2">
            <p>1. <strong>Registration:</strong> Doctor provides basic details (email, password, name, license)</p>
            <p>2. <strong>Email Verification:</strong> Doctor verifies email address</p>
            <p>3. <strong>Onboarding:</strong> Doctor completes profile, sets location, uploads documents</p>
            <p>4. <strong>Verification:</strong> Admin reviews and approves the completed profile</p>
            <p>5. <strong>Active:</strong> Doctor appears in patient searches and can accept consultations</p>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Doctors in this list cannot accept consultations until they complete onboarding and get approved.
            </p>
          </div>
        </div>

        <div className="flex justify-center space-x-4 mt-8">
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
            View Pending Verifications
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPendingOnboarding;
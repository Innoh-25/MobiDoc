import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConsultation } from '../../context/ConsultationContext';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { ConsultationCard } from '../../components/consultation/ConsultationCard';
import { 
  ClipboardDocumentIcon, 
  ClockIcon, 
  CheckCircleIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const { consultations, availableConsultations, loading, fetchDoctorConsultations, fetchAvailableConsultations } = useConsultation();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    earnings: 0,
  });

  useEffect(() => {
    fetchDoctorConsultations();
    fetchAvailableConsultations();
  }, []);

  useEffect(() => {
    if (consultations) {
      const pending = consultations.filter(c => c.status === 'requested').length;
      const inProgress = consultations.filter(c => c.status === 'accepted').length;
      const completed = consultations.filter(c => c.status === 'completed').length;
      const earnings = consultations
        .filter(c => c.status === 'completed')
        .reduce((sum, c) => sum + (c.consultationFee || 0), 0);
      
      setStats({
        total: consultations.length,
        pending,
        inProgress,
        completed,
        earnings,
      });
    }
  }, [consultations]);

  const recentConsultations = consultations
    .slice(0, 3)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activities = [
    {
      type: 'consultation_accepted',
      title: 'Accepted consultation from John Doe',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      type: 'consultation_completed',
      title: 'Completed consultation for fever treatment',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
      type: 'patient_registered',
      title: 'New patient registration: Jane Smith',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, Dr. {user?.fullName?.split(' ')[1] || user?.fullName} 👨‍⚕️
        </h1>
        <p className="mt-2 text-gray-600">
          Here's your practice overview for today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/doctor/available"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-200 transition-colors">
              <ClipboardDocumentIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Available Requests</h3>
            <p className="mt-2 text-sm text-gray-500">
              {availableConsultations.length} pending consultations
            </p>
          </Link>

          <Link
            to="/doctor/consultations"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200 transition-colors">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">My Schedule</h3>
            <p className="mt-2 text-sm text-gray-500">
              View your upcoming consultations
            </p>
          </Link>

          <Link
            to="/doctor/profile"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4 group-hover:bg-purple-200 transition-colors">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Update Profile</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage your professional information
            </p>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Practice Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard
            title="Total Consultations"
            value={stats.total}
            type="patients"
          />
          <StatsCard
            title="Pending"
            value={availableConsultations.length}
            type="pending"
          />
          <StatsCard
            title="In Progress"
            value={stats.inProgress}
            type="active"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            type="completed"
          />
          <StatsCard
            title="Total Earnings"
            value={`KES ${stats.earnings}`}
            type="revenue"
          />
        </div>
      </div>

      {/* Recent Consultations & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Consultations */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Consultations</h2>
            <Link
              to="/doctor/consultations"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="card p-4">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentConsultations.length > 0 ? (
              recentConsultations.map((consultation) => (
                <ConsultationCard
                  key={consultation._id}
                  consultation={consultation}
                  userType="doctor"
                />
              ))
            ) : (
              <div className="card p-8 text-center">
                <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No active consultations</h3>
                <p className="text-gray-500 mb-4">
                  You don't have any consultations yet
                </p>
                <Link
                  to="/doctor/available"
                  className="btn-primary inline-flex items-center"
                >
                  <ClipboardDocumentIcon className="h-4 w-4 mr-2" />
                  View Available Requests
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity & Available Requests */}
        <div className="space-y-8">
          <RecentActivity activities={activities} loading={loading} />
          
          {/* Available Requests */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Available Requests</h3>
              <Link
                to="/doctor/available"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View all
              </Link>
            </div>
            
            <div className="space-y-4">
              {availableConsultations.slice(0, 3).map((consultation) => (
                <div key={consultation._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {consultation.patientId?.fullName || 'Patient'}
                    </p>
                    <p className="text-xs text-gray-500 truncate max-w-[200px]">
                      {consultation.symptoms?.substring(0, 40)}...
                    </p>
                  </div>
                  <Link
                    to="/doctor/available"
                    className="text-xs text-primary-600 hover:text-primary-500 font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
              
              {availableConsultations.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No available requests</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
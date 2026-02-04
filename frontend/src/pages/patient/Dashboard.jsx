import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConsultation } from '../../context/ConsultationContext';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { ConsultationCard } from '../../components/consultation/ConsultationCard';
import { 
  PlusIcon, 
  ClockIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const PatientDashboard = () => {
  const { user } = useAuth();
  const { consultations, loading, fetchPatientConsultations } = useConsultation();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchPatientConsultations();
  }, []);

  useEffect(() => {
    if (consultations) {
      const pending = consultations.filter(c => c.status === 'requested').length;
      const accepted = consultations.filter(c => c.status === 'accepted').length;
      const completed = consultations.filter(c => c.status === 'completed').length;
      
      setStats({
        total: consultations.length,
        pending,
        accepted,
        completed,
      });
    }
  }, [consultations]);

  const recentConsultations = consultations
    .slice(0, 3)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activities = [
    {
      type: 'consultation_requested',
      title: 'Requested a consultation for fever',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    },
    {
      type: 'consultation_accepted',
      title: 'Dr. Smith accepted your consultation',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.fullName?.split(' ')[0]} 👋
        </h1>
        <p className="mt-2 text-gray-600">
          Here's what's happening with your consultations today
        </p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Link
            to="/patient/consultations/request"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary-100 text-primary-600 mb-4 group-hover:bg-primary-200 transition-colors">
              <PlusIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Request Consultation</h3>
            <p className="mt-2 text-sm text-gray-500">
              Schedule a new medical consultation
            </p>
          </Link>

          <Link
            to="/patient/consultations"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-200 transition-colors">
              <ClockIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">My Consultations</h3>
            <p className="mt-2 text-sm text-gray-500">
              View all your medical consultations
            </p>
          </Link>

          <Link
            to="/patient/profile"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200 transition-colors">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Update Profile</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage your personal information
            </p>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultation Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Consultations"
            value={stats.total}
            type="patients"
          />
          <StatsCard
            title="Pending"
            value={stats.pending}
            type="pending"
          />
          <StatsCard
            title="In Progress"
            value={stats.accepted}
            type="active"
          />
          <StatsCard
            title="Completed"
            value={stats.completed}
            type="completed"
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
              to="/patient/consultations"
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
                  userType="patient"
                />
              ))
            ) : (
              <div className="card p-8 text-center">
                <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">No consultations yet</h3>
                <p className="text-gray-500 mb-4">
                  You haven't requested any consultations yet
                </p>
                <Link
                  to="/patient/consultations/request"
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Request Consultation
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity activities={activities} loading={loading} />
      </div>
    </div>
  );
};

export default PatientDashboard;
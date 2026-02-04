import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { 
  UsersIcon, 
  UserGroupIcon, 
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { stats, loading, fetchStats } = useConsultation();
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    fetchStats();
    
    // Mock recent activities
    setRecentActivities([
      {
        type: 'doctor_approved',
        title: 'Approved Dr. Sarah Johnson',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        type: 'doctor_rejected',
        title: 'Rejected Dr. Michael Brown',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        type: 'consultation_completed',
        title: 'Consultation #MED123 completed',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        type: 'patient_registered',
        title: 'New patient: Emma Wilson',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        type: 'doctor_registered',
        title: 'New doctor registration pending',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ]);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Overview of MobiDoc platform statistics and activities
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Patients"
          value={stats?.totalPatients || 0}
          change={12}
          type="patients"
          loading={loading}
        />
        <StatsCard
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          change={8}
          type="doctors"
          loading={loading}
        />
        <StatsCard
          title="Pending Verifications"
          value={stats?.pendingDoctors || 0}
          type="pending"
          loading={loading}
        />
        <StatsCard
          title="Active Doctors"
          value={stats?.approvedDoctors || 0}
          change={5}
          type="active"
          loading={loading}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Consultations"
          value={stats?.totalConsultations || 0}
          change={15}
          type="patients"
          loading={loading}
        />
        <StatsCard
          title="Pending Consultations"
          value={stats?.pendingConsultations || 0}
          type="pending"
          loading={loading}
        />
        <StatsCard
          title="Monthly Revenue"
          value="KES 45,820"
          change={18}
          type="revenue"
          loading={loading}
        />
        <StatsCard
          title="Platform Growth"
          value="24%"
          change={24}
          type="completed"
          loading={loading}
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/doctors/pending"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 text-yellow-600 mb-4 group-hover:bg-yellow-200 transition-colors">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Doctor Verification</h3>
            <p className="mt-2 text-sm text-gray-500">
              Review pending doctor registrations
            </p>
          </Link>

          <Link
            to="/admin/doctors"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600 mb-4 group-hover:bg-blue-200 transition-colors">
              <UserGroupIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Manage Doctors</h3>
            <p className="mt-2 text-sm text-gray-500">
              View and manage all doctors
            </p>
          </Link>

          <Link
            to="/admin/patients"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-100 text-green-600 mb-4 group-hover:bg-green-200 transition-colors">
              <UsersIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">Manage Patients</h3>
            <p className="mt-2 text-sm text-gray-500">
              View and manage all patients
            </p>
          </Link>

          <Link
            to="/admin/consultations"
            className="card p-6 text-center hover:shadow-md transition-shadow duration-200 group"
          >
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-purple-600 mb-4 group-hover:bg-purple-200 transition-colors">
              <ClipboardDocumentIcon className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-gray-900">View Consultations</h3>
            <p className="mt-2 text-sm text-gray-500">
              Monitor all consultations
            </p>
          </Link>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Platform Growth */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Platform Growth</h3>
            <div className="flex items-center text-green-600">
              <ArrowTrendingUpIcon className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">+24% this month</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Patients</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '75%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">45</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">New Doctors</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '60%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">12</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Consultations</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: '85%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">128</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Revenue</span>
              <div className="flex items-center">
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: '90%' }}></div>
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">KES 45.8K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity 
          activities={recentActivities} 
          loading={loading}
        />
      </div>

      {/* Pending Tasks */}
      <div className="card p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          <span className="badge badge-warning">{stats?.pendingDoctors || 0} pending</span>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Doctor Verifications</p>
                <p className="text-sm text-gray-500">{stats?.pendingDoctors || 0} doctors waiting for approval</p>
              </div>
            </div>
            <Link
              to="/admin/doctors/pending"
              className="btn-primary text-sm py-1.5 px-3"
            >
              Review Now
            </Link>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <ClipboardDocumentIcon className="h-5 w-5 text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Pending Consultations</p>
                <p className="text-sm text-gray-500">{stats?.pendingConsultations || 0} consultations waiting for doctors</p>
              </div>
            </div>
            <Link
              to="/admin/consultations"
              className="btn-outline text-sm py-1.5 px-3"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
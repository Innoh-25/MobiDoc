import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { 
  UsersIcon, 
  UserGroupIcon, 
  ClipboardDocumentIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  EyeIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { stats, loading, fetchStats } = useConsultation();
  const [recentActivities, setRecentActivities] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [pendingOnboarding, setPendingOnboarding] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true);
      
      // Fetch all data
      await fetchStats();
      
      const [pendingRes, onboardingRes, activitiesRes] = await Promise.all([
        api.get('/admin/doctors/pending'),
        api.get('/admin/doctors/pending-onboarding'),
        api.get('/admin/recent-activities')
      ]);

      setPendingDoctors(pendingRes.data.data || []);
      setPendingOnboarding(onboardingRes.data.data || []);
      
      // If no recent activities endpoint, use mock data
      if (activitiesRes.data) {
        setRecentActivities(activitiesRes.data.data || []);
      } else {
        setRecentActivities(getMockActivities());
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
      
      // Fallback to mock data
      setRecentActivities(getMockActivities());
    } finally {
      setDashboardLoading(false);
    }
  };

  const getMockActivities = () => {
    return [
      {
        type: 'doctor_approved',
        title: 'Approved Dr. Sarah Johnson',
        description: 'Cardiology specialist approved for practice',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        type: 'doctor_rejected',
        title: 'Rejected Dr. Michael Brown',
        description: 'Incomplete documentation provided',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
      {
        type: 'consultation_completed',
        title: 'Consultation #MED123 completed',
        description: 'Patient: John Doe, Doctor: Dr. Smith',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      },
      {
        type: 'patient_registered',
        title: 'New patient: Emma Wilson',
        description: 'Registered from Nairobi area',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      },
      {
        type: 'doctor_registered',
        title: 'New doctor registration',
        description: 'Dr. Alex Kim - Neurology specialist',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      },
    ];
  };

  const handleApproveDoctor = async (doctorId) => {
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`);
      toast.success('Doctor approved successfully');
      fetchDashboardData(); // Refresh data
    } catch (error) {
      toast.error('Failed to approve doctor');
    }
  };

  const handleRejectDoctor = async (doctorId) => {
    const reason = window.prompt('Please enter rejection reason:');
    if (reason) {
      try {
        await api.put(`/admin/doctors/${doctorId}/reject`, { reason });
        toast.success('Doctor rejected successfully');
        fetchDashboardData(); // Refresh data
      } catch (error) {
        toast.error('Failed to reject doctor');
      }
    }
  };

  const viewDoctorDetails = (doctor) => {
    const details = `
Doctor Details:

Name: ${doctor.fullName}
Email: ${doctor.email}
Phone: ${doctor.phone}
Specialization: ${doctor.specialization}
License Number: ${doctor.licenseNumber}
Years of Experience: ${doctor.yearsOfExperience || 'N/A'}

Location: ${doctor.location?.area || 'N/A'}, ${doctor.location?.city || 'N/A'}
Consultation Fee: KES ${doctor.profile?.consultationFee || 'N/A'}

Verification Status: ${doctor.verificationStatus}
Onboarding Status: ${doctor.isOnboarded ? 'Completed' : 'Pending'}
    `;
    alert(details);
  };

  const viewDocuments = (doctor) => {
    const docs = `
Documents for ${doctor.fullName}:

Medical License: ${doctor.documents?.licenseDocument ? '✓ Uploaded' : '✗ Not uploaded'}
ID Document: ${doctor.documents?.idDocument ? '✓ Uploaded' : '✗ Not uploaded'}
Qualification: ${doctor.documents?.qualificationDocument ? '✓ Uploaded' : '✗ Not uploaded'}

Additional Documents:
${doctor.documents?.map((doc, i) => `${i + 1}. ${doc.fileName}`).join('\n') || 'No additional documents'}
    `;
    alert(docs);
  };

  const getDoctorStatusBadge = (doctor) => {
    if (doctor.verificationStatus === 'approved') {
      return (
        <span className="badge badge-success text-xs">
          <CheckCircleIcon className="h-3 w-3 mr-1" />
          Approved
        </span>
      );
    } else if (doctor.verificationStatus === 'pending') {
      return (
        <span className="badge badge-warning text-xs">
          <ClockIcon className="h-3 w-3 mr-1" />
          Pending
        </span>
      );
    } else {
      return (
        <span className="badge badge-error text-xs">
          <XCircleIcon className="h-3 w-3 mr-1" />
          Rejected
        </span>
      );
    }
  };

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
          loading={dashboardLoading}
        />
        <StatsCard
          title="Total Doctors"
          value={stats?.totalDoctors || 0}
          change={8}
          type="doctors"
          loading={dashboardLoading}
        />
        <StatsCard
          title="Pending Verifications"
          value={pendingDoctors.length}
          type="pending"
          loading={dashboardLoading}
        />
        <StatsCard
          title="Pending Onboarding"
          value={pendingOnboarding.length}
          type="active"
          loading={dashboardLoading}
        />
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Consultations"
          value={stats?.totalConsultations || 0}
          change={15}
          type="patients"
          loading={dashboardLoading}
        />
        <StatsCard
          title="Pending Consultations"
          value={stats?.pendingConsultations || 0}
          type="pending"
          loading={dashboardLoading}
        />
        <StatsCard
          title="Approved Doctors"
          value={stats?.approvedDoctors || 0}
          change={5}
          type="active"
          loading={dashboardLoading}
        />
        <StatsCard
          title="Revenue This Month"
          value={`KES ${stats?.monthlyRevenue ? stats.monthlyRevenue.toLocaleString() : '0'}`}
          change={18}
          type="revenue"
          loading={dashboardLoading}
        />
      </div>

      {/* Doctor Approval Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Pending Doctor Verifications */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Doctor Verifications</h3>
              <p className="text-sm text-gray-500 mt-1">
                Doctors who have completed onboarding and need approval
              </p>
            </div>
            <Link
              to="/admin/doctors/pending"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>

          {dashboardLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : pendingDoctors.length > 0 ? (
            <div className="space-y-4">
              {pendingDoctors.slice(0, 3).map((doctor) => (
                <div key={doctor._id} className="p-4 border rounded-lg hover:border-primary-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <UserGroupIcon className="h-5 w-5 text-primary-600" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">{doctor.fullName}</h4>
                            <p className="text-sm text-gray-500">{doctor.specialization}</p>
                          </div>
                        </div>
                        {getDoctorStatusBadge(doctor)}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-3">
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{doctor.location?.area || 'N/A'}</span>
                        </div>
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                          <span>KES {doctor.profile?.consultationFee || 'N/A'}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <button
                          onClick={() => viewDoctorDetails(doctor)}
                          className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <EyeIcon className="h-4 w-4 mr-1" />
                          Details
                        </button>
                        <button
                          onClick={() => viewDocuments(doctor)}
                          className="text-sm text-purple-600 hover:text-purple-800 flex items-center"
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          Documents
                        </button>
                      </div>

                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => handleApproveDoctor(doctor._id)}
                          className="btn-success text-sm py-1.5 px-3 flex-1"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1 inline" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRejectDoctor(doctor._id)}
                          className="btn-error text-sm py-1.5 px-3 flex-1"
                        >
                          <XCircleIcon className="h-4 w-4 mr-1 inline" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No pending verifications</h3>
              <p className="text-gray-500">All doctors are approved</p>
            </div>
          )}
        </div>

        {/* Pending Onboarding */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pending Onboarding</h3>
              <p className="text-sm text-gray-500 mt-1">
                Doctors who registered but haven't completed onboarding
              </p>
            </div>
            <Link
              to="/admin/doctors/pending-onboarding"
              className="text-sm text-primary-600 hover:text-primary-500 font-medium"
            >
              View all
            </Link>
          </div>

          {dashboardLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : pendingOnboarding.length > 0 ? (
            <div className="space-y-4">
              {pendingOnboarding.slice(0, 3).map((doctor) => (
                <div key={doctor._id} className="p-4 border rounded-lg hover:border-yellow-300 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                            <UserPlusIcon className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">{doctor.fullName}</h4>
                            <p className="text-sm text-gray-500">{doctor.specialization}</p>
                          </div>
                        </div>
                        <span className="badge badge-warning text-xs">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Onboarding
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mt-2">
                        <p className="mb-1">Registered: {new Date(doctor.createdAt).toLocaleDateString()}</p>
                        <p>Email: {doctor.email}</p>
                      </div>

                      <div className="mt-4">
                        <Link
                          to={`/admin/doctors/${doctor._id}`}
                          className="text-sm text-primary-600 hover:text-primary-800 font-medium"
                        >
                          View Registration Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserGroupIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No pending onboarding</h3>
              <p className="text-gray-500">All doctors have completed onboarding</p>
            </div>
          )}
        </div>
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
          loading={dashboardLoading}
        />
      </div>

      {/* Pending Tasks */}
      <div className="card p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Tasks</h3>
          <span className="badge badge-warning">
            {pendingDoctors.length + pendingOnboarding.length} pending
          </span>
        </div>
        
        <div className="space-y-4">
          {pendingDoctors.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Doctor Verifications</p>
                  <p className="text-sm text-gray-500">
                    {pendingDoctors.length} doctor{pendingDoctors.length !== 1 ? 's' : ''} waiting for approval
                  </p>
                </div>
              </div>
              <Link
                to="/admin/doctors/pending"
                className="btn-primary text-sm py-1.5 px-3"
              >
                Review Now
              </Link>
            </div>
          )}
          
          {pendingOnboarding.length > 0 && (
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <UserPlusIcon className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Pending Onboarding</p>
                  <p className="text-sm text-gray-500">
                    {pendingOnboarding.length} doctor{pendingOnboarding.length !== 1 ? 's' : ''} need to complete profile
                  </p>
                </div>
              </div>
              <Link
                to="/admin/doctors/pending-onboarding"
                className="btn-outline text-sm py-1.5 px-3"
              >
                View
              </Link>
            </div>
          )}
          
          {(stats?.pendingConsultations || 0) > 0 && (
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <ClipboardDocumentIcon className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Pending Consultations</p>
                  <p className="text-sm text-gray-500">
                    {stats.pendingConsultations} consultation{stats.pendingConsultations !== 1 ? 's' : ''} waiting for doctors
                  </p>
                </div>
              </div>
              <Link
                to="/admin/consultations"
                className="btn-outline text-sm py-1.5 px-3"
              >
                View
              </Link>
            </div>
          )}
          
          {pendingDoctors.length === 0 && pendingOnboarding.length === 0 && (stats?.pendingConsultations || 0) === 0 && (
            <div className="text-center py-4">
              <CheckCircleIcon className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-gray-600">All caught up! No pending tasks.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add missing MapPinIcon component
const MapPinIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>
);

export default AdminDashboard;
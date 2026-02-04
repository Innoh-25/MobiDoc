import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  UserCircleIcon,
  AcademicCapIcon,
  BriefcaseIcon 
} from '@heroicons/react/24/outline';
import api from '../../services/api';

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchPendingDoctors();
  }, []);

  const fetchPendingDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/doctors/pending');
      setDoctors(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch pending doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (doctorId) => {
    setActionLoading(doctorId);
    try {
      await api.put(`/admin/doctors/${doctorId}/approve`);
      toast.success('Doctor approved successfully');
      fetchPendingDoctors();
      setSelectedDoctor(null);
    } catch (error) {
      toast.error('Failed to approve doctor');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (doctorId) => {
    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(doctorId);
    try {
      await api.put(`/admin/doctors/${doctorId}/reject`, { rejectionReason: rejectReason });
      toast.success('Doctor rejected successfully');
      fetchPendingDoctors();
      setSelectedDoctor(null);
      setRejectReason('');
    } catch (error) {
      toast.error('Failed to reject doctor');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Verification</h1>
        <p className="mt-2 text-gray-600">
          Review and verify pending doctor registrations
        </p>
      </div>

      {/* Search and Stats */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Verifications: {doctors.length}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Doctors waiting for approval
            </p>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10 w-full md:w-64"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Doctors List */}
        <div className="lg:col-span-2">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="card p-6">
                  <div className="animate-pulse">
                    <div className="flex items-center justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="mt-4">
                      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredDoctors.length > 0 ? (
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <div key={doctor._id} className="card p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                          <UserCircleIcon className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{doctor.fullName}</h3>
                          <p className="text-sm text-gray-500">{doctor.email}</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">License Number</p>
                          <p className="font-medium">{doctor.licenseNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Specialization</p>
                          <p className="font-medium">{doctor.specialization}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="font-medium">{doctor.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Experience</p>
                          <p className="font-medium">{doctor.yearsOfExperience || 0} years</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => setSelectedDoctor(doctor)}
                        className="btn-outline flex items-center text-sm px-3 py-1.5"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleApprove(doctor._id)}
                        disabled={actionLoading === doctor._id}
                        className="btn-primary text-sm px-3 py-1.5 flex items-center"
                      >
                        {actionLoading === doctor._id ? (
                          <div className="spinner h-3 w-3 border-2 mr-1"></div>
                        ) : (
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      <span>{doctor.medicalSchool || 'Medical school not specified'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No doctors found' : 'All caught up!'}
              </h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'There are no pending doctor verifications'}
              </p>
            </div>
          )}
        </div>

        {/* Doctor Details Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {selectedDoctor ? (
              <div className="card p-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Doctor Details</h3>
                  <button
                    onClick={() => setSelectedDoctor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{selectedDoctor.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium">{selectedDoctor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone</p>
                        <p className="font-medium">{selectedDoctor.phone}</p>
                      </div>
                      {selectedDoctor.gender && (
                        <div>
                          <p className="text-sm text-gray-600">Gender</p>
                          <p className="font-medium capitalize">{selectedDoctor.gender}</p>
                        </div>
                      )}
                      {selectedDoctor.dateOfBirth && (
                        <div>
                          <p className="text-sm text-gray-600">Date of Birth</p>
                          <p className="font-medium">
                            {new Date(selectedDoctor.dateOfBirth).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Professional Info */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Professional Information</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">License Number</p>
                        <p className="font-medium">{selectedDoctor.licenseNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Specialization</p>
                        <p className="font-medium">{selectedDoctor.specialization}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Medical School</p>
                        <p className="font-medium">{selectedDoctor.medicalSchool || 'Not specified'}</p>
                      </div>
                      {selectedDoctor.graduationYear && (
                        <div>
                          <p className="text-sm text-gray-600">Graduation Year</p>
                          <p className="font-medium">{selectedDoctor.graduationYear}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-600">Years of Experience</p>
                        <p className="font-medium">{selectedDoctor.yearsOfExperience || 0} years</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Documents */}
                  {selectedDoctor.documents && selectedDoctor.documents.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Uploaded Documents</h4>
                      <div className="space-y-2">
                        {selectedDoctor.documents.map((doc, index) => (
                          <div key={index} className="p-2 bg-gray-50 rounded">
                            <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="pt-6 border-t border-gray-200">
                    <div className="space-y-3">
                      <button
                        onClick={() => handleApprove(selectedDoctor._id)}
                        disabled={actionLoading === selectedDoctor._id}
                        className="w-full btn-primary flex items-center justify-center"
                      >
                        {actionLoading === selectedDoctor._id ? (
                          <div className="flex items-center">
                            <div className="spinner h-4 w-4 border-2 mr-2"></div>
                            Approving...
                          </div>
                        ) : (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-2" />
                            Approve Doctor
                          </>
                        )}
                      </button>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          rows="3"
                          className="input"
                          placeholder="Provide reason for rejection..."
                        />
                      </div>
                      
                      <button
                        onClick={() => handleReject(selectedDoctor._id)}
                        disabled={actionLoading === selectedDoctor._id || !rejectReason.trim()}
                        className="w-full btn-outline text-red-600 border-red-300 hover:bg-red-50 flex items-center justify-center"
                      >
                        <XCircleIcon className="h-4 w-4 mr-2" />
                        Reject Doctor
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-6 text-center">
                <BriefcaseIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium text-gray-900 mb-2">Select a Doctor</h3>
                <p className="text-gray-500 text-sm">
                  Click on "View Details" to see complete information and take action
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorVerification;
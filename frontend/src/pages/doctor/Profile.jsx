import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  AcademicCapIcon,
  BriefcaseIcon,
  ShieldCheckIcon 
} from '@heroicons/react/24/outline';

const DoctorProfile = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      specialization: '',
      medicalSchool: '',
      graduationYear: '',
      yearsOfExperience: '',
    }
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || '',
        specialization: user.specialization || '',
        medicalSchool: user.medicalSchool || '',
        graduationYear: user.graduationYear || '',
        yearsOfExperience: user.yearsOfExperience || '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await updateProfile(data);
    setLoading(false);
    
    if (result.success) {
      setIsEditing(false);
    }
  };

  const getVerificationStatus = () => {
    if (!user) return { label: 'Unknown', color: 'badge-error' };
    
    switch(user.verificationStatus) {
      case 'approved':
        return { 
          label: 'Verified', 
          color: 'badge-success',
          icon: <ShieldCheckIcon className="h-4 w-4 mr-1" />
        };
      case 'pending':
        return { 
          label: 'Pending Verification', 
          color: 'badge-warning',
          icon: <span className="mr-1">⏳</span>
        };
      case 'rejected':
        return { 
          label: 'Rejected', 
          color: 'badge-error',
          icon: <span className="mr-1">❌</span>
        };
      default:
        return { label: 'Unknown', color: 'badge-error' };
    }
  };

  const status = getVerificationStatus();

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Doctor Profile</h1>
        <p className="mt-2 text-gray-600">
          Manage your professional information and account settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-primary-100 text-primary-600 mb-4">
                <UserCircleIcon className="h-16 w-16" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
              <p className="text-gray-500 mt-1">Medical Doctor</p>
              
              {/* Verification Status */}
              <div className="mt-4">
                <span className={`badge inline-flex items-center ${status.color}`}>
                  {status.icon}
                  {status.label}
                </span>
              </div>
              
              {user?.rejectionReason && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  <p className="font-medium">Rejection Reason:</p>
                  <p>{user.rejectionReason}</p>
                </div>
              )}

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-2" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <PhoneIcon className="h-5 w-5 mr-2" />
                  <span>{user?.phone}</span>
                </div>
                {user?.specialization && (
                  <div className="flex items-center text-gray-600">
                    <BriefcaseIcon className="h-5 w-5 mr-2" />
                    <span>{user.specialization}</span>
                  </div>
                )}
                {user?.medicalSchool && (
                  <div className="flex items-center text-gray-600">
                    <AcademicCapIcon className="h-5 w-5 mr-2" />
                    <span>{user.medicalSchool}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* License Information */}
          <div className="card p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">License Information</h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">License Number:</span>
                <p className="font-medium">{user?.licenseNumber || 'Not provided'}</p>
              </div>
              {user?.yearsOfExperience && (
                <div>
                  <span className="text-sm text-gray-600">Experience:</span>
                  <p className="font-medium">{user.yearsOfExperience} years</p>
                </div>
              )}
              {user?.graduationYear && (
                <div>
                  <span className="text-sm text-gray-600">Graduation Year:</span>
                  <p className="font-medium">{user.graduationYear}</p>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="card p-6 mt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Active</span>
                <span className={`badge ${user?.isActive ? 'badge-success' : 'badge-error'}`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {user?.verificationStatus === 'pending' && (
                <p className="text-sm text-gray-500">
                  Your account is pending admin verification. You'll be notified once approved.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Professional Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 text-sm font-medium rounded-lg ${
                  isEditing 
                    ? 'btn-outline' 
                    : 'btn-primary'
                }`}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    {...register('fullName', { required: 'Full name is required' })}
                    type="text"
                    className="input"
                    disabled={!isEditing}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="input bg-gray-50"
                    value={user?.email}
                    disabled
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10,15}$/,
                        message: 'Please enter a valid phone number'
                      }
                    })}
                    type="tel"
                    className="input"
                    disabled={!isEditing}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Specialization
                  </label>
                  <select
                    {...register('specialization')}
                    className="input"
                    disabled={!isEditing}
                  >
                    <option value="">Select specialization</option>
                    <option value="General Practice">General Practice</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medical School
                  </label>
                  <input
                    {...register('medicalSchool')}
                    type="text"
                    className="input"
                    disabled={!isEditing}
                    placeholder="University of Medical Sciences"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Year
                  </label>
                  <input
                    {...register('graduationYear')}
                    type="number"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="input"
                    disabled={!isEditing}
                    placeholder="2010"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <input
                    {...register('yearsOfExperience')}
                    type="number"
                    min="0"
                    max="50"
                    className="input"
                    disabled={!isEditing}
                    placeholder="5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    className="input bg-gray-50"
                    value={user?.licenseNumber}
                    disabled
                    readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">License number cannot be changed</p>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-outline"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary"
                    >
                      {loading ? (
                        <div className="flex items-center">
                          <div className="spinner h-4 w-4 border-2 mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        'Save Changes'
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Documents Section */}
          <div className="card p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Documents</h2>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Medical License</p>
                    <p className="text-sm text-gray-500">Upload your medical license certificate</p>
                  </div>
                  <button className="btn-outline text-sm">
                    Upload
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Medical Degree</p>
                    <p className="text-sm text-gray-500">Upload your medical degree certificate</p>
                  </div>
                  <button className="btn-outline text-sm">
                    Upload
                  </button>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">ID Proof</p>
                    <p className="text-sm text-gray-500">Government issued ID</p>
                  </div>
                  <button className="btn-outline text-sm">
                    Upload
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>• Upload clear, readable documents</p>
              <p>• Supported formats: PDF, JPG, PNG</p>
              <p>• Maximum file size: 5MB per document</p>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card p-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Actions</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Request Account Deactivation
              </button>
              <button className="w-full text-left px-4 py-3 text-sm text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors">
                Contact Admin Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
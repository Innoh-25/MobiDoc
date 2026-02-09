import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const SelectDoctor = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [consultationData, setConsultationData] = useState({
    symptoms: '',
    location: '',
    consultationType: 'general'
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await api.get('/doctors/search');
      setDoctors(response.data.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/doctors/search?specialization=${searchTerm}`);
      setDoctors(response.data.data);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowConfirm(true);
  };

  const handleConfirmConsultation = async () => {
    try {
      const response = await api.post('/consultations/request', {
        ...consultationData,
        doctorId: selectedDoctor._id
      });

      toast.success('Consultation request sent to doctor!');
      navigate('/patient/consultations');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to request consultation');
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.location?.area?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="mt-2 text-gray-600">
          Search and select a doctor near you for consultation
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, specialization, or area..."
                className="input pl-10 w-full"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            className="btn-primary px-6"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Consultation Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms Description *
              </label>
              <textarea
                value={consultationData.symptoms}
                onChange={(e) => setConsultationData(prev => ({ ...prev, symptoms: e.target.value }))}
                className="input"
                rows="3"
                placeholder="Describe your symptoms..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                value={consultationData.location}
                onChange={(e) => setConsultationData(prev => ({ ...prev, location: e.target.value }))}
                className="input"
                placeholder="Your current location"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Consultation Type
              </label>
              <select
                value={consultationData.consultationType}
                onChange={(e) => setConsultationData(prev => ({ ...prev, consultationType: e.target.value }))}
                className="input"
              >
                <option value="general">General Consultation</option>
                <option value="emergency">Emergency</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Doctors {filteredDoctors.length > 0 && `(${filteredDoctors.length})`}
          </h2>
          <p className="text-sm text-gray-600">
            Showing doctors near your location
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <div key={doctor._id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{doctor.fullName}</h3>
                      <p className="text-sm text-primary-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  {doctor.isAvailable ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircleIcon className="h-3 w-3 mr-1" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Busy
                    </span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.location?.area}, {doctor.location?.city}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.yearsOfExperience || 0} years experience</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span>KES {doctor.profile?.consultationFee || 'N/A'}</span>
                  </div>

                  {doctor.profile?.bio && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {doctor.profile.bio}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleSelectDoctor(doctor)}
                  disabled={!doctor.isAvailable}
                  className={`w-full mt-6 py-2.5 rounded-lg font-medium ${
                    doctor.isAvailable
                      ? 'btn-primary'
                      : 'btn-disabled cursor-not-allowed'
                  }`}
                >
                  {doctor.isAvailable ? 'Select Doctor' : 'Currently Busy'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card p-8 text-center">
            <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500 mb-4">
              Try adjusting your search criteria or check back later
            </p>
            <button
              onClick={fetchDoctors}
              className="btn-outline inline-flex items-center"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Refresh List
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedDoctor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirm Consultation
            </h3>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Doctor:</h4>
                <p className="text-gray-700">{selectedDoctor.fullName}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                <p className="text-sm text-gray-600 mt-1">
                  <MapPinIcon className="h-3 w-3 inline mr-1" />
                  {selectedDoctor.location?.area}, {selectedDoctor.location?.city}
                </p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Symptoms:</h4>
                <p className="text-gray-600">{consultationData.symptoms || 'Not specified'}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Location:</h4>
                <p className="text-gray-600">{consultationData.location || 'Not specified'}</p>
              </div>

              {selectedDoctor.profile?.consultationFee && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Consultation fee: <span className="font-semibold">KES {selectedDoctor.profile.consultationFee}</span>
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmConsultation}
                disabled={!consultationData.symptoms || !consultationData.location}
                className="flex-1 btn-primary"
              >
                Confirm Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectDoctor;
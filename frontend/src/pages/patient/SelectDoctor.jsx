import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

const SelectDoctor = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [patientLocation, setPatientLocation] = useState(null);
  const [consultationData, setConsultationData] = useState({
    symptoms: '',
    location: '',
    consultationType: 'general'
  });
  const { isAuthenticated, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait until auth check completes
    if (authLoading) return;

    // If not authenticated, redirect to login preserving state
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }

    // Now auth is resolved and user is authenticated — proceed
    if (location.state?.consultationData) {
      const { symptoms, consultationType, location: locData } = location.state.consultationData;
      setConsultationData({
        symptoms: symptoms || '',
        location: locData?.address || '',
        consultationType: consultationType || 'general'
      });

      if (locData?.coordinates) {
        // Set local state for display
        setPatientLocation(locData.coordinates);
        // Call fetchDoctors with the coordinates directly so we don't rely on the async state update
        fetchDoctors(locData.coordinates);
      } else {
        // No coordinates available, fetch without location filtering
        fetchDoctors();
      }
    } else {
      // If no navigation state present, fetch doctors (unfiltered)
      fetchDoctors();
    }
  }, [location.state, isAuthenticated, authLoading]);

  const fetchDoctors = async (coords) => {
    try {
      setLoading(true);
      console.debug('fetchDoctors called, coords=', coords, 'patientLocation=', patientLocation, 'searchTerm=', searchTerm);
      
      // Get patient's preferred doctor gender from localStorage
      const preferredGender = localStorage.getItem('preferredDoctorGender');
      
      // Build query parameters
      let url = '/doctors/search?';
      if (searchTerm) {
        url += `specialization=${encodeURIComponent(searchTerm)}`;
      }
      
  const response = await api.get(url);
      
      if (response.data.success && response.data.data) {
        let doctorsList = response.data.data;
        
        // Calculate distance for each doctor if we have coordinates (either passed in or from state)
        const locationForCalc = coords || patientLocation;
        if (locationForCalc && locationForCalc.latitude && locationForCalc.longitude) {
          doctorsList = doctorsList.map(doctor => {
            let distance = null;
            if (doctor.location?.coordinates?.latitude && doctor.location?.coordinates?.longitude) {
              distance = calculateDistance(
                locationForCalc.latitude,
                locationForCalc.longitude,
                doctor.location.coordinates.latitude,
                doctor.location.coordinates.longitude
              );
            }
            return {
              ...doctor,
              distance: distance,
              withinRadius: distance !== null && distance <= 4
            };
          });

          // Filter doctors within 4km radius
          doctorsList = doctorsList.filter(doctor => doctor.withinRadius === true);

          // Sort by distance (nearest first)
          doctorsList.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
        }
        
        // Apply gender preference filter if set
        if (preferredGender && preferredGender !== 'no-preference') {
          doctorsList = doctorsList.filter(doctor => doctor.gender === preferredGender);
        }
        
        setDoctors(doctorsList);
        
        if (doctorsList.length === 0 && patientLocation) {
          toast.error('No doctors found within 4km of your location');
        } else if (doctorsList.length === 0) {
          toast.error('No doctors available at the moment');
        } else {
          toast.success(`Found ${doctorsList.length} doctor(s) nearby`);
        }
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast.error(error.response?.data?.error || 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  // Haversine formula to calculate distance between two coordinates in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI/180);
  };

  const handleSearch = () => {
    fetchDoctors();
  };

  const handleSelectDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setShowConfirm(true);
  };

  const handleConfirmConsultation = async () => {
    try {
      const requestData = {
        symptoms: consultationData.symptoms,
        location: {
          address: consultationData.location,
          coordinates: patientLocation
        },
        consultationType: consultationData.consultationType,
        doctorId: selectedDoctor._id
      };
      
      const response = await api.post('/consultations/request', requestData);

      toast.success('Consultation request sent to doctor!');
      // Clear the stored preference
      localStorage.removeItem('preferredDoctorGender');
      navigate('/patient/consultations');
    } catch (error) {
      console.error('Error requesting consultation:', error);
      toast.error(error.response?.data?.error || 'Failed to request consultation');
    }
  };

  const getDistanceText = (distance) => {
    if (!distance) return 'Distance unknown';
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarSolidIcon key={`star-${i}`} className="h-4 w-4 text-yellow-400" />);
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    return stars;
  };

  return (
    <div className="animate-fade-in max-w-6xl mx-auto">
      <div className="mb-8">
        <button
          onClick={() => navigate('/patient/consultations/request')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Request
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Find a Doctor</h1>
        <p className="mt-2 text-gray-600">
          {patientLocation ? (
            <>Doctors within 4km of your location {doctors.length > 0 && `(${doctors.length} found)`}</>
          ) : (
            'Search and select a doctor for consultation'
          )}
        </p>
      </div>

      {/* Search Section */}
      <div className="card p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by specialization..."
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
          <button
            onClick={fetchDoctors}
            className="btn-outline px-6"
            disabled={loading}
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Location Info */}
        {patientLocation && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center text-sm text-blue-800">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>Showing doctors within 4km of your current location</span>
          </div>
        )}
      </div>

      {/* Doctors List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Available Doctors {doctors.length > 0 && `(${doctors.length})`}
          </h2>
          {patientLocation && doctors.length > 0 && (
            <p className="text-sm text-gray-600">
              Sorted by distance (nearest first)
            </p>
          )}
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
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div key={doctor._id} className="card p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Dr. {doctor.fullName}</h3>
                      <p className="text-sm text-primary-600">{doctor.specialization}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {doctor.isAvailable ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                        <CheckCircleIcon className="h-3 w-3 mr-1" />
                        Available
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mb-2">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        Busy
                      </span>
                    )}
                    {doctor.distance && (
                      <span className="text-xs text-gray-500">
                        {getDistanceText(doctor.distance)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.location?.area || 'Location not specified'}, {doctor.location?.city || ''}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{doctor.yearsOfExperience || 0}+ years experience</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                    <span>KES {doctor.profile?.consultationFee || 'N/A'}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex items-center mr-2">
                      {renderStars(doctor.averageRating || 0)}
                    </div>
                    <span>({doctor.totalReviews || 0} reviews)</span>
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
              {patientLocation 
                ? 'No doctors available within 4km of your location. Try adjusting your location or check back later.'
                : 'No doctors available at the moment. Please check back later.'}
            </p>
            <button
              onClick={fetchDoctors}
              className="btn-outline inline-flex items-center"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Refresh List
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedDoctor && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Consultation
              </h3>
              <button
                onClick={() => setShowConfirm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Selected Doctor:</h4>
                <p className="text-gray-700">Dr. {selectedDoctor.fullName}</p>
                <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                {selectedDoctor.distance && (
                  <p className="text-sm text-gray-600 mt-1">
                    <MapPinIcon className="h-3 w-3 inline mr-1" />
                    {getDistanceText(selectedDoctor.distance)}
                  </p>
                )}
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Symptoms:</h4>
                <p className="text-gray-600">{consultationData.symptoms || 'Not specified'}</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Your Location:</h4>
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
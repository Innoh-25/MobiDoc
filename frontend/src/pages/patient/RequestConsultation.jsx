import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useConsultation } from '../../context/ConsultationContext';
import { toast } from 'react-hot-toast';
import { 
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const RequestConsultation = () => {
  const navigate = useNavigate();
  const { requestConsultation } = useConsultation();
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [locationData, setLocationData] = useState({
    address: '',
    area: '',
    city: '',
    county: '',
    coordinates: {
      latitude: null,
      longitude: null
    }
  });
  
  const [formData, setFormData] = useState({
    symptoms: '',
    consultationType: 'general'
  });

  // Check if browser supports geolocation
  const [geoAvailable, setGeoAvailable] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoAvailable(false);
      toast.error('Geolocation is not supported by your browser');
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setDetectingLocation(true);
    toast.loading('Detecting your location...', { id: 'location' });

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocode to get address from coordinates
          const address = await reverseGeocode(latitude, longitude);
          
          setLocationData({
            address: address.fullAddress || 'Location detected',
            area: address.area || '',
            city: address.city || '',
            county: address.county || '',
            coordinates: {
              latitude,
              longitude
            }
          });
          
          setLocationDetected(true);
          toast.success('Location detected successfully!', { id: 'location' });
        } catch (error) {
          console.error('Geocoding error:', error);
          // If reverse geocoding fails, still use coordinates
          setLocationData({
            address: `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            area: '',
            city: '',
            county: '',
            coordinates: { latitude, longitude }
          });
          setLocationDetected(true);
          toast.success('Coordinates obtained!', { id: 'location' });
        }
        
        setDetectingLocation(false);
      },
      (error) => {
        setDetectingLocation(false);
        toast.dismiss('location');
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            toast.error('Location access denied. Please allow location access in your browser settings.');
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error('Location information unavailable.');
            break;
          case error.TIMEOUT:
            toast.error('Location request timed out.');
            break;
          default:
            toast.error('Failed to detect location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Mock reverse geocoding function - replace with actual API call
  const reverseGeocode = async (lat, lng) => {
    // In a real app, you would call a geocoding service like:
    // Google Maps Geocoding API, Mapbox, or OpenStreetMap Nominatim
    
    // For now, return mock data
    return {
      fullAddress: '123 Main Street, Westlands',
      area: 'Westlands',
      city: 'Nairobi',
      county: 'Nairobi County'
    };
    
    // Example with actual API (you would need to implement this):
    /*
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return {
      fullAddress: data.display_name,
      area: data.address.suburb || data.address.neighbourhood,
      city: data.address.city || data.address.town,
      county: data.address.county
    };
    */
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.symptoms) {
      toast.error('Please describe your symptoms');
      return;
    }
    
    if (!locationDetected) {
      toast.error('Please detect your location first');
      return;
    }

    setLoading(true);
    
    const consultationData = {
      ...formData,
      location: {
        address: locationData.address,
        coordinates: locationData.coordinates
      }
    };
    
    const result = await requestConsultation(consultationData);
    setLoading(false);
    
    if (result.success) {
      toast.success('Consultation request sent successfully!');
      navigate('/patient/consultations');
    }
  };

  const handleSelectDoctor = () => {
    if (!formData.symptoms) {
      toast.error('Please describe your symptoms first');
      return;
    }
    
    if (!locationDetected) {
      toast.error('Please detect your location first');
      return;
    }
    
    // Navigate to doctor selection with current form data
    navigate('/patient/select-doctor', { 
      state: { 
        consultationData: {
          ...formData,
          location: {
            address: locationData.address,
            coordinates: locationData.coordinates
          }
        }
      } 
    });
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Request Consultation</h1>
        <p className="mt-2 text-gray-600">
          Get medical help from qualified doctors
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Options Card */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Choose Your Option</h3>
            
            <div className="space-y-4">
              <div className="p-4 border-2 border-primary-500 rounded-lg bg-primary-50">
                <h4 className="font-semibold text-primary-700 mb-2">Select a Doctor</h4>
                <p className="text-sm text-primary-600 mb-4">
                  Choose from available doctors in your area
                </p>
                <button
                  onClick={handleSelectDoctor}
                  disabled={!locationDetected || !formData.symptoms}
                  className={`w-full ${locationDetected && formData.symptoms ? 'btn-primary' : 'btn-disabled'}`}
                >
                  Browse Doctors
                </button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Quick Request</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Request consultation and get matched automatically
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !formData.symptoms || !locationDetected}
                  className={`w-full ${locationDetected && formData.symptoms ? 'btn-outline' : 'btn-disabled'}`}
                >
                  {loading ? 'Sending...' : 'Quick Request'}
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Why choose a doctor?</h4>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  See doctor ratings and reviews
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Choose based on specialization
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  View consultation fees upfront
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  Select doctors in your preferred area
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:col-span-2">
          <div className="card p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Location Detection Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Location *
                </label>
                
                {!geoAvailable ? (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-red-800">Geolocation not supported</p>
                        <p className="text-sm text-red-700 mt-1">
                          Your browser doesn't support automatic location detection. Please update your browser or use a different device.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : locationDetected ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-green-800">Location Detected</p>
                            <button
                              type="button"
                              onClick={() => setLocationDetected(false)}
                              className="text-sm text-green-700 hover:text-green-900"
                            >
                              Change
                            </button>
                          </div>
                          <p className="text-sm text-green-700 mt-1">{locationData.address}</p>
                          {locationData.area && (
                            <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-green-700">
                              <span>Area: {locationData.area}</span>
                              <span>City: {locationData.city}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">Coordinates:</p>
                      <p>Latitude: {locationData.coordinates.latitude?.toFixed(6) || 'N/A'}</p>
                      <p>Longitude: {locationData.coordinates.longitude?.toFixed(6) || 'N/A'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors">
                    <MapPinIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Detect Your Location</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      We need your location to find doctors near you. Click the button below to automatically detect your current location.
                    </p>
                    
                    <button
                      type="button"
                      onClick={detectLocation}
                      disabled={detectingLocation}
                      className="btn-primary inline-flex items-center"
                    >
                      {detectingLocation ? (
                        <>
                          <div className="spinner h-4 w-4 border-2 mr-2"></div>
                          Detecting Location...
                        </>
                      ) : (
                        <>
                          <MapPinIcon className="h-5 w-5 mr-2" />
                          Detect My Location
                        </>
                      )}
                    </button>
                    
                    <div className="mt-6 text-xs text-gray-500">
                      <p className="mb-1">Why we need your location?</p>
                      <ul className="space-y-1">
                        <li>• To find doctors available in your area</li>
                        <li>• For emergency services if needed</li>
                        <li>• To match you with nearby healthcare providers</li>
                      </ul>
                      <p className="mt-3">Your location data is secure and only used for matching purposes.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Symptoms Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symptoms Description *
                </label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleChange}
                  rows="5"
                  className="input"
                  placeholder="Describe your symptoms in detail..."
                  required
                  disabled={!locationDetected}
                />
                <p className="mt-2 text-sm text-gray-500">
                  Be specific about symptoms, duration, and any relevant medical history
                </p>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Consultation Type
                </label>
                <select
                  name="consultationType"
                  value={formData.consultationType}
                  onChange={handleChange}
                  className="input"
                  disabled={!locationDetected}
                >
                  <option value="general">General Consultation</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>

              {/* Next Step CTA */}
              {locationDetected && formData.symptoms && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-2" />
                    Ready to Find Doctors
                  </h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Your location has been detected and symptoms entered. You can now:
                  </p>
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleSelectDoctor}
                      className="flex-1 btn-primary"
                    >
                      Select a Doctor <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 btn-outline"
                    >
                      {loading ? 'Sending...' : 'Quick Request'}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestConsultation;
const Doctor = require('../models/Doctor');
const { generateToken } = require('../middleware/auth');
const crypto = require('crypto');

// @desc    Register doctor
// @route   POST /api/doctors/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      fullName,
      phone,
      dateOfBirth,
      gender,
      licenseNumber,
      specialization,
      medicalSchool,
      graduationYear,
      yearsOfExperience
    } = req.body;
    
    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { phone }, { licenseNumber }]
    });
    
    if (existingDoctor) {
      let errorField = '';
      if (existingDoctor.email === email) errorField = 'email';
      else if (existingDoctor.phone === phone) errorField = 'phone';
      else errorField = 'license number';
      
      return res.status(400).json({
        success: false,
        error: `Doctor with this ${errorField} already exists`
      });
    }
    
    // Create doctor
    const doctor = await Doctor.create({
      email,
      password,
      fullName,
      phone,
      dateOfBirth,
      gender,
      licenseNumber,
      specialization,
      medicalSchool,
      graduationYear,
      yearsOfExperience,
      verificationStatus: 'pending',
      isActive: false
    });
    
    // Generate token (but doctor cannot login until approved)
    const token = generateToken(doctor._id);
    
    res.status(201).json({
      success: true,
      token,
      message: 'Registration successful. Please wait for admin verification.',
      data: {
        id: doctor._id,
        email: doctor.email,
        fullName: doctor.fullName,
        verificationStatus: doctor.verificationStatus
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Login doctor
// @route   POST /api/doctors/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    const doctor = await Doctor.findOne({ email }).select('+password');
    
    if (!doctor) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordMatch = await doctor.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if doctor is verified and active
    if (doctor.verificationStatus !== 'approved') {
      return res.status(401).json({
        success: false,
        error: 'Your account is pending verification',
        verificationStatus: doctor.verificationStatus
      });
    }
    
    if (!doctor.isActive) {
      return res.status(401).json({
        success: false,
        error: 'Your account is not active'
      });
    }
    
    // Generate token
    const token = generateToken(doctor._id);
    
    res.status(200).json({
      success: true,
      token,
      data: {
        id: doctor._id,
        email: doctor.email,
        fullName: doctor.fullName,
        specialization: doctor.specialization,
        verificationStatus: doctor.verificationStatus,
        isActive: doctor.isActive
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor profile
// @route   GET /api/doctors/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: doctor
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const {
      fullName,
      phone,
      dateOfBirth,
      gender,
      specialization,
      medicalSchool,
      graduationYear,
      yearsOfExperience
    } = req.body;
    
    // Fields that can be updated
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (phone) updateFields.phone = phone;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (gender) updateFields.gender = gender;
    if (specialization) updateFields.specialization = specialization;
    if (medicalSchool) updateFields.medicalSchool = medicalSchool;
    if (graduationYear) updateFields.graduationYear = graduationYear;
    if (yearsOfExperience) updateFields.yearsOfExperience = yearsOfExperience;
    
    // Check if phone is taken by another doctor
    if (phone) {
      const existingDoctor = await Doctor.findOne({
        phone,
        _id: { $ne: req.user.id }
      });
      
      if (existingDoctor) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already in use'
        });
      }
    }
    
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: doctor
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Upload documents
// @route   POST /api/doctors/upload-documents
// @access  Private
exports.uploadDocuments = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please upload at least one file'
      });
    }
    
    const doctor = await Doctor.findById(req.user.id);
    
    // Add uploaded files to documents array
    req.files.forEach(file => {
      doctor.documents.push({
        fileName: file.originalname,
        filePath: file.path,
        uploadedAt: Date.now()
      });
    });
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      data: doctor.documents
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Complete doctor onboarding
// @route   POST /api/doctors/onboard
// @access  Private (Doctor)
exports.onboardDoctor = async (req, res, next) => {
  try {
    const {
      location,
      consultationFee,
      availability,
      languages,
      bio,
      emergencyContact
    } = req.body;

    // Check if doctor exists and is approved
    const doctor = await Doctor.findById(req.user.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    if (doctor.verificationStatus !== 'approved') {
      return res.status(400).json({
        success: false,
        error: 'Your account must be approved by admin first'
      });
    }

    if (doctor.isOnboarded) {
      return res.status(400).json({
        success: false,
        error: 'Onboarding already completed'
      });
    }

    // Update doctor with onboarding information
    const updateData = {
      location,
      isOnboarded: true
    };

    // Add profile information if provided
    if (consultationFee !== undefined) {
      updateData['profile.consultationFee'] = consultationFee;
    }
    if (availability) {
      updateData['profile.availability'] = availability;
    }
    if (languages) {
      updateData['profile.languages'] = languages;
    }
    if (bio) {
      updateData['profile.bio'] = bio;
    }
    if (emergencyContact) {
      updateData['profile.emergencyContact'] = emergencyContact;
    }

    // Handle file uploads if any
    if (req.files) {
      req.files.forEach(file => {
        if (file.fieldname === 'licenseDocument') {
          updateData['documents.licenseDocument'] = file.path;
        } else if (file.fieldname === 'idDocument') {
          updateData['documents.idDocument'] = file.path;
        } else if (file.fieldname === 'qualificationDocument') {
          updateData['documents.qualificationDocument'] = file.path;
        }
      });
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully',
      data: updatedDoctor
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Search doctors by area/specialization
// @route   GET /api/doctors/search
// @access  Private (Patient)
exports.searchDoctors = async (req, res, next) => {
  try {
    const { area, city, specialization, consultationType } = req.query;
    const patientId = req.user.id;

    // Get patient's location if available
    const Patient = require('../models/Patient');
    const patient = await Patient.findById(patientId).select('location');
    
    // Build search criteria
    const searchCriteria = {
      verificationStatus: 'approved',
      isOnboarded: true,
      isActive: true
    };

    // If patient has location, use it for search
    if (patient && patient.location && patient.location.area) {
      searchCriteria['location.area'] = new RegExp(patient.location.area, 'i');
    }
    
    // Override with query parameters if provided
    if (area) {
      searchCriteria['location.area'] = new RegExp(area, 'i');
    }
    if (city) {
      searchCriteria['location.city'] = new RegExp(city, 'i');
    }
    if (specialization) {
      searchCriteria.specialization = new RegExp(specialization, 'i');
    }

    // Find available doctors
    let doctors = await Doctor.find(searchCriteria)
      .select('-password -documents')
      .lean();

    // Filter out doctors currently in consultation
    const Consultation = require('../models/Consultation');
    const currentTime = new Date();
    
    // Find doctors with active consultations
    const activeConsultations = await Consultation.find({
      doctorId: { $in: doctors.map(d => d._id) },
      status: { $in: ['accepted'] },
      completionTime: { $gt: currentTime }
    }).select('doctorId');

    const busyDoctorIds = activeConsultations.map(c => c.doctorId.toString());

    // Filter and add availability status
    const availableDoctors = doctors.map(doctor => {
      const isAvailable = !busyDoctorIds.includes(doctor._id.toString());
      return {
        ...doctor,
        isAvailable,
        distance: 'Nearby' // Simple distance - can be enhanced with actual coordinates
      };
    }).filter(doctor => doctor.isAvailable); // Only return available doctors

    res.status(200).json({
      success: true,
      count: availableDoctors.length,
      data: availableDoctors
    });

  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor's onboarding status
// @route   GET /api/doctors/onboarding-status
// @access  Private (Doctor)
exports.getOnboardingStatus = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.user.id)
      .select('-password');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        isOnboarded: doctor.isOnboarded,
        verificationStatus: doctor.verificationStatus,
        isActive: doctor.isActive,
        profile: doctor.profile,
        location: doctor.location,
        documents: doctor.documents
      }
    });

  } catch (error) {
    next(error);
  }
};
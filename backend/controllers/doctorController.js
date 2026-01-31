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

// Similar forgotPassword and resetPassword functions as in patientController
// (Copy and modify accordingly)
const Patient = require('../models/Patient');
const { generateToken } = require('../middleware/auth');
const crypto = require('crypto');

// @desc    Register patient
// @route   POST /api/patients/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { email, password, fullName, phone, dateOfBirth, gender } = req.body;
    
    // Check if patient already exists
    const existingPatient = await Patient.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingPatient) {
      return res.status(400).json({
        success: false,
        error: 'Patient with this email or phone already exists'
      });
    }
    
    // Create patient
    const patient = await Patient.create({
      email,
      password,
      fullName,
      phone,
      dateOfBirth,
      gender
    });
    
    // Generate token
    const token = generateToken(patient._id);
    
    res.status(201).json({
      success: true,
      token,
      data: {
        id: patient._id,
        email: patient.email,
        fullName: patient.fullName,
        phone: patient.phone,
        isVerified: patient.isVerified
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Login patient
// @route   POST /api/patients/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Find patient and select password
    const patient = await Patient.findOne({ email }).select('+password');
    
    if (!patient) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordMatch = await patient.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(patient._id);
    
    res.status(200).json({
      success: true,
      token,
      data: {
        id: patient._id,
        email: patient.email,
        fullName: patient.fullName,
        phone: patient.phone,
        isVerified: patient.isVerified
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient profile
// @route   GET /api/patients/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.user.id).select('-password');
    
    res.status(200).json({
      success: true,
      data: patient
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Update patient profile
// @route   PUT /api/patients/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, dateOfBirth, gender } = req.body;
    
    // Fields that can be updated
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (phone) updateFields.phone = phone;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;
    if (gender) updateFields.gender = gender;
    
    // Check if phone is taken by another patient
    if (phone) {
      const existingPatient = await Patient.findOne({
        phone,
        _id: { $ne: req.user.id }
      });
      
      if (existingPatient) {
        return res.status(400).json({
          success: false,
          error: 'Phone number already in use'
        });
      }
    }
    
    const patient = await Patient.findByIdAndUpdate(
      req.user.id,
      updateFields,
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      data: patient
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/patients/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    
    const patient = await Patient.findOne({ email });
    
    if (!patient) {
      return res.status(404).json({
        success: false,
        error: 'Patient not found with this email'
      });
    }
    
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Hash token and set to resetPasswordToken field
    patient.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    // Set expire (10 minutes)
    patient.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    
    await patient.save();
    
    // In production, send email with reset token
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.status(200).json({
      success: true,
      message: 'Password reset token generated',
      resetToken // In production, remove this line and send via email
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/patients/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;
    
    // Hash token
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    
    const patient = await Patient.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    
    if (!patient) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
    
    // Set new password
    patient.password = password;
    patient.resetPasswordToken = undefined;
    patient.resetPasswordExpire = undefined;
    
    await patient.save();
    
    // Generate new token for immediate login
    const token = generateToken(patient._id);
    
    res.status(200).json({
      success: true,
      token,
      message: 'Password reset successful'
    });
    
  } catch (error) {
    next(error);
  }
};
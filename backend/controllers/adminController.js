const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Consultation = require('../models/Consultation');
const { generateToken } = require('../middleware/auth');

// @desc    Login admin
// @route   POST /api/admin/login
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
    
    const admin = await Admin.findOne({ email }).select('+password');
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check password
    const isPasswordMatch = await admin.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = generateToken(admin._id);
    
    res.status(200).json({
      success: true,
      token,
      data: {
        id: admin._id,
        email: admin.email,
        fullName: admin.fullName,
        role: admin.role,
        permissions: admin.permissions
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalPatients,
      totalDoctors,
      pendingDoctors,
      approvedDoctors,
      totalConsultations,
      pendingConsultations
    ] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Doctor.countDocuments({ verificationStatus: 'pending' }),
      Doctor.countDocuments({ verificationStatus: 'approved', isActive: true }),
      Consultation.countDocuments(),
      Consultation.countDocuments({ status: 'requested' })
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalPatients,
        totalDoctors,
        pendingDoctors,
        approvedDoctors,
        totalConsultations,
        pendingConsultations
      }
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending doctors
// @route   GET /api/admin/doctors/pending
// @access  Private
exports.getPendingDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find({ verificationStatus: 'pending' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get all doctors
// @route   GET /api/admin/doctors
// @access  Private
exports.getAllDoctors = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.verificationStatus = status;
    }
    
    const doctors = await Doctor.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Approve doctor
// @route   PUT /api/admin/doctors/:id/approve
// @access  Private
exports.approveDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }
    
    doctor.verificationStatus = 'approved';
    doctor.isActive = true;
    doctor.rejectionReason = undefined;
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Doctor approved successfully',
      data: doctor
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Reject doctor
// @route   PUT /api/admin/doctors/:id/reject
// @access  Private
exports.rejectDoctor = async (req, res, next) => {
  try {
    const { rejectionReason } = req.body;
    
    if (!rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a rejection reason'
      });
    }
    
    const doctor = await Doctor.findById(req.params.id);
    
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: 'Doctor not found'
      });
    }
    
    doctor.verificationStatus = 'rejected';
    doctor.isActive = false;
    doctor.rejectionReason = rejectionReason;
    
    await doctor.save();
    
    res.status(200).json({
      success: true,
      message: 'Doctor rejected successfully',
      data: doctor
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get all patients
// @route   GET /api/admin/patients
// @access  Private
exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find()
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get all consultations
// @route   GET /api/admin/consultations
// @access  Private
exports.getAllConsultations = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }
    
    const consultations = await Consultation.find(query)
      .populate('patientId', 'fullName email phone')
      .populate('doctorId', 'fullName specialization')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
    
  } catch (error) {
    next(error);
  }
};
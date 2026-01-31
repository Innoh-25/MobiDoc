const Consultation = require('../models/Consultation');

// @desc    Request consultation
// @route   POST /api/consultations/request
// @access  Private (Patient)
exports.requestConsultation = async (req, res, next) => {
  try {
    const { location, symptoms, consultationType } = req.body;
    
    const consultation = await Consultation.create({
      patientId: req.user.id,
      location,
      symptoms,
      consultationType: consultationType || 'general',
      status: 'requested',
      requestTime: Date.now()
    });
    
    // Populate patient info
    await consultation.populate('patientId', 'fullName phone');
    
    res.status(201).json({
      success: true,
      message: 'Consultation requested successfully',
      data: consultation
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get patient's consultations
// @route   GET /api/consultations/patient/me
// @access  Private (Patient)
exports.getPatientConsultations = async (req, res, next) => {
  try {
    const consultations = await Consultation.find({ patientId: req.user.id })
      .populate('doctorId', 'fullName specialization phone')
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

// @desc    Get available consultation requests
// @route   GET /api/consultations/available
// @access  Private (Doctor)
exports.getAvailableConsultations = async (req, res, next) => {
  try {
    // Get consultations that are requested (not assigned to any doctor)
    const consultations = await Consultation.find({ 
      status: 'requested',
      doctorId: null 
    })
      .populate('patientId', 'fullName phone gender dateOfBirth')
      .sort({ requestTime: 1 });
    
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get doctor's consultations
// @route   GET /api/consultations/doctor/me
// @access  Private (Doctor)
exports.getDoctorConsultations = async (req, res, next) => {
  try {
    const { status } = req.query;
    
    let query = { doctorId: req.user.id };
    if (status) {
      query.status = status;
    }
    
    const consultations = await Consultation.find(query)
      .populate('patientId', 'fullName phone gender dateOfBirth')
      .sort({ updatedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: consultations.length,
      data: consultations
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Accept consultation
// @route   PUT /api/consultations/:id/accept
// @access  Private (Doctor)
exports.acceptConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    // Check if consultation is available
    if (consultation.status !== 'requested') {
      return res.status(400).json({
        success: false,
        error: 'Consultation is not available for acceptance'
      });
    }
    
    // Check if doctor is already assigned to another consultation
    const existingConsultation = await Consultation.findOne({
      doctorId: req.user.id,
      status: { $in: ['requested', 'accepted'] }
    });
    
    if (existingConsultation) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active consultation'
      });
    }
    
    consultation.doctorId = req.user.id;
    consultation.status = 'accepted';
    consultation.acceptanceTime = Date.now();
    
    await consultation.save();
    
    // Populate doctor info
    await consultation.populate('doctorId', 'fullName specialization phone');
    
    res.status(200).json({
      success: true,
      message: 'Consultation accepted successfully',
      data: consultation
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Complete consultation
// @route   PUT /api/consultations/:id/complete
// @access  Private (Doctor)
exports.completeConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    // Check if doctor is assigned to this consultation
    if (consultation.doctorId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to complete this consultation'
      });
    }
    
    // Check if consultation is in accepted state
    if (consultation.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        error: 'Consultation cannot be completed'
      });
    }
    
    consultation.status = 'completed';
    consultation.completionTime = Date.now();
    
    await consultation.save();
    
    res.status(200).json({
      success: true,
      message: 'Consultation completed successfully',
      data: consultation
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel consultation
// @route   PUT /api/consultations/:id/cancel
// @access  Private (Patient)
exports.cancelConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id);
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    // Check if patient owns this consultation
    if (consultation.patientId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to cancel this consultation'
      });
    }
    
    // Only allow cancellation if status is requested
    if (consultation.status !== 'requested') {
      return res.status(400).json({
        success: false,
        error: 'Consultation cannot be cancelled at this stage'
      });
    }
    
    consultation.status = 'cancelled';
    
    await consultation.save();
    
    res.status(200).json({
      success: true,
      message: 'Consultation cancelled successfully',
      data: consultation
    });
    
  } catch (error) {
    next(error);
  }
};

// @desc    Get single consultation
// @route   GET /api/consultations/:id
// @access  Private
exports.getConsultation = async (req, res, next) => {
  try {
    const consultation = await Consultation.findById(req.params.id)
      .populate('patientId', 'fullName email phone gender dateOfBirth')
      .populate('doctorId', 'fullName specialization phone medicalSchool');
    
    if (!consultation) {
      return res.status(404).json({
        success: false,
        error: 'Consultation not found'
      });
    }
    
    // Check authorization
    const user = req.user;
    const isPatient = consultation.patientId._id.toString() === user.id;
    const isDoctor = consultation.doctorId && consultation.doctorId._id.toString() === user.id;
    
    if (!isPatient && !isDoctor && user.constructor.modelName !== 'Admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this consultation'
      });
    }
    
    res.status(200).json({
      success: true,
      data: consultation
    });
    
  } catch (error) {
    next(error);
  }
};
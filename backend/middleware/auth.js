const jwt = require('jsonwebtoken');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');

// Generic auth middleware
const auth = (Model) => async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('JWT verify failed:', err.message);
      }
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
    
    // Find user by ID
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`Auth middleware: model=${Model.modelName}, decodedId=${decoded.id}`);
    }
    const user = await Model.findById(decoded.id).select('-password');
    
    if (!user) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(`Auth middleware: user not found for model=${Model.modelName} id=${decoded.id}`);
      }
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // NOTE: Do not enforce `isActive` here. Individual doctor endpoints should
    // check account activation when appropriate. Allowing login and access to
    // onboarding/status endpoints for non-active doctors makes it possible for
    // doctors to submit documents and view pending approval state.
    
    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};

// Specific middleware for each user type
exports.protectPatient = auth(Patient);
exports.protectDoctor = auth(Doctor);
exports.protectAdmin = auth(Admin);

// Generate JWT token
exports.generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};
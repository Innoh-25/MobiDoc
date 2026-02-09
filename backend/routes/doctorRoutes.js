const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const { protectDoctor } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty().trim(),
    body('phone').notEmpty().trim(),
    body('licenseNumber').notEmpty().trim(),
    body('specialization').notEmpty().trim()
  ],
  doctorController.register
);

router.post('/login', doctorController.login);

// Protected routes
router.use(protectDoctor);

// New routes for onboarding
router.get('/onboarding-status', doctorController.getOnboardingStatus);
router.post(
  '/onboard',
  upload.fields([
    { name: 'licenseDocument', maxCount: 1 },
    { name: 'idDocument', maxCount: 1 },
    { name: 'qualificationDocument', maxCount: 1 }
  ]),
  doctorController.onboardDoctor
);

// Search route (accessible by patients)
router.get('/search', doctorController.searchDoctors);

// Existing routes
router.get('/profile', doctorController.getProfile);
router.put('/profile', doctorController.updateProfile);
router.post('/upload-documents', upload.array('documents', 5), doctorController.uploadDocuments);

module.exports = router;
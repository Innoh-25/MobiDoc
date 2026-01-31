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
router.get('/profile', doctorController.getProfile);
router.put('/profile', doctorController.updateProfile);
router.post('/upload-documents', upload.array('documents', 5), doctorController.uploadDocuments);

module.exports = router;
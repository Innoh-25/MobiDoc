const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const patientController = require('../controllers/patientController');
const { protectPatient } = require('../middleware/auth');

// Public routes
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('fullName').notEmpty().trim(),
    body('phone').notEmpty().trim()
  ],
  patientController.register
);

router.post('/login', patientController.login);
router.post('/forgot-password', patientController.forgotPassword);
router.post('/reset-password/:resetToken', patientController.resetPassword);

// Protected routes
router.use(protectPatient);
router.get('/profile', patientController.getProfile);
router.put('/profile', patientController.updateProfile);

module.exports = router;
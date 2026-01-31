const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const consultationController = require('../controllers/consultationController');
const { protectPatient, protectDoctor, protectAdmin } = require('../middleware/auth');

// Patient routes
router.post(
  '/request',
  protectPatient,
  [
    body('location.address').notEmpty().trim(),
    body('symptoms').isLength({ min: 10 }).trim(),
    body('consultationType').optional().isIn(['general', 'emergency'])
  ],
  consultationController.requestConsultation
);

router.get('/patient/me', protectPatient, consultationController.getPatientConsultations);
router.put('/:id/cancel', protectPatient, consultationController.cancelConsultation);

// Doctor routes
router.get('/available', protectDoctor, consultationController.getAvailableConsultations);
router.get('/doctor/me', protectDoctor, consultationController.getDoctorConsultations);
router.put('/:id/accept', protectDoctor, consultationController.acceptConsultation);
router.put('/:id/complete', protectDoctor, consultationController.completeConsultation);

// Shared routes
router.get('/:id', consultationController.getConsultation);

module.exports = router;
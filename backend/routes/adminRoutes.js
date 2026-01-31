const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/auth');

// Public routes
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  adminController.login
);

// Protected routes
router.use(protectAdmin);
router.get('/dashboard', adminController.getDashboardStats);
router.get('/doctors/pending', adminController.getPendingDoctors);
router.get('/doctors', adminController.getAllDoctors);
router.put('/doctors/:id/approve', adminController.approveDoctor);
router.put('/doctors/:id/reject', adminController.rejectDoctor);
router.get('/patients', adminController.getAllPatients);
router.get('/consultations', adminController.getAllConsultations);

module.exports = router;
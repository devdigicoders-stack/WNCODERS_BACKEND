const express = require('express');
const router = express.Router();
const {
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
} = require('../controllers/consultationController');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit a request
router.post('/', createConsultation);

// Protected routes for admin management
router.route('/')
  .get(protect, getConsultations);

router.route('/:id')
  .get(protect, getConsultationById)
  .put(protect, updateConsultation)
  .delete(protect, deleteConsultation);

module.exports = router;

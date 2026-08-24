const express = require('express');
const router = express.Router();
const {
  createReview,
  getApprovedReviews,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.route('/')
  .post(createReview)
  .get(getApprovedReviews);

// Admin routes
router.route('/admin')
  .get(protect, getAllReviews);

router.route('/:id/status')
  .put(protect, updateReviewStatus);

router.route('/:id')
  .delete(protect, deleteReview);

module.exports = router;

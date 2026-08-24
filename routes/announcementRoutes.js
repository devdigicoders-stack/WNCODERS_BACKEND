const express = require('express');
const router = express.Router();
const { getAnnouncement, updateAnnouncement } = require('../controllers/announcementController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAnnouncement)
  .put(protect, updateAnnouncement);

module.exports = router;

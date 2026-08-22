const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getAdminProfile, updateAdminProfile, changeAdminPassword, getDashboardStats } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.put('/profile', protect, updateAdminProfile);
router.put('/change-password', protect, changeAdminPassword);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;

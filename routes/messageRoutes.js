const express = require('express');
const router = express.Router();
const {
  createMessage,
  getMessages,
  getMessageById,
  updateMessage,
  deleteMessage,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// Public route to submit a message
router.post('/', createMessage);

// Protected routes for admin management
router.route('/')
  .get(protect, getMessages);

router.route('/:id')
  .get(protect, getMessageById)
  .put(protect, updateMessage)
  .delete(protect, deleteMessage);

module.exports = router;

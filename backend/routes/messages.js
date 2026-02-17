const express = require('express');
const router = express.Router();
const { getRoomMessages, createMessage, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/:roomId', protect, getRoomMessages);
router.post('/', protect, createMessage);
router.delete('/:id', protect, deleteMessage);

module.exports = router;

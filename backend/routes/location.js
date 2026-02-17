const express = require('express');
const router = express.Router();
const { updateLocation, getNearbyUsers, getRoomId } = require('../controllers/locationController');
const { protect } = require('../middleware/auth');

router.put('/update', protect, updateLocation);
router.get('/nearby', protect, getNearbyUsers);
router.get('/room', protect, getRoomId);

module.exports = router;

const User = require('../models/User');

// @desc    Update user location
// @route   PUT /api/location/update
// @access  Private
const updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    // Validation
    if (latitude === undefined || longitude === undefined) {
      return res.status(400).json({ message: 'Please provide latitude and longitude' });
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // Update user location
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        location: {
          type: 'Point',
          coordinates: [longitude, latitude] // GeoJSON format: [longitude, latitude]
        },
        lastSeen: Date.now()
      },
      { new: true }
    );

    res.json({
      message: 'Location updated successfully',
      location: user.location
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({ message: 'Server error updating location' });
  }
};

// @desc    Find nearby users within 5km radius
// @route   GET /api/location/nearby
// @access  Private
const getNearbyUsers = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.location || !currentUser.location.coordinates) {
      return res.status(400).json({ message: 'Please update your location first' });
    }

    const [longitude, latitude] = currentUser.location.coordinates;

    // Find users within 5km radius using MongoDB geospatial query
    const nearbyUsers = await User.find({
      _id: { $ne: req.user._id }, // Exclude current user
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: 5000 // 5km in meters
        }
      }
    })
      .select('username location isOnline lastSeen')
      .limit(50);

    res.json({
      count: nearbyUsers.length,
      users: nearbyUsers
    });
  } catch (error) {
    console.error('Get nearby users error:', error);
    res.status(500).json({ message: 'Server error finding nearby users' });
  }
};

// @desc    Get room ID for nearby chat
// @route   GET /api/location/room
// @access  Private
const getRoomId = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser.location || !currentUser.location.coordinates) {
      return res.status(400).json({ message: 'Please update your location first' });
    }

    const [longitude, latitude] = currentUser.location.coordinates;

    // Create room ID based on approximate location (grid system)
    // Round to 2 decimal places (~1km grid)
    // Round to 1 decimal place (~11km grid) for easier matching
    const gridLat = Math.floor(latitude * 10) / 10;
    const gridLng = Math.floor(longitude * 10) / 10;
    const roomId = `room_${gridLat}_${gridLng}`;

    res.json({
      roomId,
      location: { latitude, longitude }
    });
  } catch (error) {
    console.error('Get room ID error:', error);
    res.status(500).json({ message: 'Server error getting room ID' });
  }
};

module.exports = {
  updateLocation,
  getNearbyUsers,
  getRoomId
};

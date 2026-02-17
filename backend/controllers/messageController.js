const Message = require('../models/Message');

// @desc    Get messages for a room
// @route   GET /api/messages/:roomId
// @access  Private
const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { limit = 50 } = req.query;

    const messages = await Message.find({ roomId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username');

    // Reverse to show oldest first
    messages.reverse();

    res.json({
      count: messages.length,
      messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
};

// @desc    Create a new message
// @route   POST /api/messages
// @access  Private
const createMessage = async (req, res) => {
  try {
    const { message, roomId } = req.body;

    if (!message || !roomId) {
      return res.status(400).json({ message: 'Please provide message and room ID' });
    }

    // Get user location
    const user = req.user;
    if (!user.location || !user.location.coordinates) {
      return res.status(400).json({ message: 'Location not set' });
    }

    const newMessage = await Message.create({
      user: user._id,
      username: user.username,
      message: message.trim(),
      roomId,
      location: user.location
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('user', 'username');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ message: 'Server error creating message' });
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user owns the message
    if (message.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    await message.deleteOne();

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error deleting message' });
  }
};

module.exports = {
  getRoomMessages,
  createMessage,
  deleteMessage
};

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

const socketHandler = (io) => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username} (${socket.id})`);

    // Update user online status
    User.findByIdAndUpdate(socket.user._id, { 
      isOnline: true,
      lastSeen: Date.now()
    }).exec();

    // Join room
    socket.on('join_room', async (roomId) => {
      try {
        socket.join(roomId);
        socket.currentRoom = roomId;
        console.log(`${socket.user.username} joined room: ${roomId}`);

        // Notify room about new user
        socket.to(roomId).emit('user_joined', {
          username: socket.user.username,
          timestamp: new Date()
        });

        // Get recent messages for the room
        const messages = await Message.find({ roomId })
          .sort({ createdAt: -1 })
          .limit(50)
          .populate('user', 'username');

        messages.reverse();
        socket.emit('room_messages', messages);
      } catch (error) {
        console.error('Join room error:', error);
        socket.emit('error', { message: 'Failed to join room' });
      }
    });

    // Send message
    socket.on('send_message', async (data) => {
      try {
        const { message, roomId } = data;

        if (!message || !roomId) {
          return socket.emit('error', { message: 'Invalid message data' });
        }

        // Get user with location
        const user = await User.findById(socket.user._id);

        if (!user.location || !user.location.coordinates) {
          return socket.emit('error', { message: 'Location not set' });
        }

        // Create message
        const newMessage = await Message.create({
          user: user._id,
          username: user.username,
          message: message.trim(),
          roomId,
          location: user.location
        });

        const populatedMessage = await Message.findById(newMessage._id)
          .populate('user', 'username');

        // Broadcast message to room
        io.to(roomId).emit('new_message', populatedMessage);

      } catch (error) {
        console.error('Send message error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Leave room
    socket.on('leave_room', (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user_left', {
        username: socket.user.username,
        timestamp: new Date()
      });
      console.log(`${socket.user.username} left room: ${roomId}`);
    });

    // Typing indicator
    socket.on('typing', (roomId) => {
      socket.to(roomId).emit('user_typing', {
        username: socket.user.username
      });
    });

    socket.on('stop_typing', (roomId) => {
      socket.to(roomId).emit('user_stop_typing', {
        username: socket.user.username
      });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
      
      // Update user offline status
      User.findByIdAndUpdate(socket.user._id, { 
        isOnline: false,
        lastSeen: Date.now()
      }).exec();

      if (socket.currentRoom) {
        socket.to(socket.currentRoom).emit('user_left', {
          username: socket.user.username,
          timestamp: new Date()
        });
      }
    });
  });
};

module.exports = socketHandler;

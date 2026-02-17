import React, { useState, useEffect, useRef } from 'react';
import { locationAPI } from '../services/api';
import socketService from '../services/socket';
import { getCurrentLocation } from '../utils/location';
import { toast } from 'react-toastify';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import Header from '../components/Header';
import './Chat.css';

function Chat({ onLogout }) {
  const [messages, setMessages] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [typingUsers, setTypingUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();

    return () => {
      if (roomId) {
        socketService.leaveRoom(roomId);
      }
      socketService.removeAllListeners();
    };
  }, []);

  const initializeChat = async () => {
    try {
      // Get user location
      toast.info('Getting your location...');
      const userLocation = await getCurrentLocation();
      setLocation(userLocation);

      // Update location on server
      await locationAPI.updateLocation(userLocation);
      toast.success('Location updated!');

      // Get room ID based on location
      const roomResponse = await locationAPI.getRoomId();
      const { roomId: newRoomId } = roomResponse.data;
      setRoomId(newRoomId);

      // Connect to socket
      const token = localStorage.getItem('token');
      socketService.connect(token);
      setConnected(true);

      // Join room
      socketService.joinRoom(newRoomId);

      // Setup socket listeners
      setupSocketListeners();

      setLoading(false);
      toast.success(`Connected to nearby chat!`);
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error(error.message || 'Failed to initialize chat');
      setLoading(false);
    }
  };

  const setupSocketListeners = () => {
    // Receive previous messages
    socketService.onRoomMessages((roomMessages) => {
      setMessages(roomMessages);
      scrollToBottom();
    });

    // Receive new message
    socketService.onNewMessage((message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    // User joined
    socketService.onUserJoined((data) => {
      toast.info(`${data.username} joined the chat`);
    });

    // User left
    socketService.onUserLeft((data) => {
      toast.info(`${data.username} left the chat`);
    });

    // Typing indicators
    socketService.onUserTyping((data) => {
      setTypingUsers((prev) => {
        if (!prev.includes(data.username)) {
          return [...prev, data.username];
        }
        return prev;
      });
    });

    socketService.onUserStopTyping((data) => {
      setTypingUsers((prev) => prev.filter((user) => user !== data.username));
    });

    // Error handling
    socketService.onError((error) => {
      toast.error(error.message || 'Socket error occurred');
    });
  };

  const handleSendMessage = (message) => {
    if (!roomId || !message.trim()) return;

    socketService.sendMessage({
      message: message.trim(),
      roomId,
    });
  };

  const handleTyping = () => {
    if (roomId) {
      socketService.typing(roomId);
    }
  };

  const handleStopTyping = () => {
    if (roomId) {
      socketService.stopTyping(roomId);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogout = () => {
    if (roomId) {
      socketService.leaveRoom(roomId);
    }
    socketService.disconnect();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
  };

  if (loading) {
    return (
      <div className="chat-loading">
        <div className="spinner"></div>
        <p>Setting up your location...</p>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <Header 
        roomId={roomId} 
        location={location} 
        connected={connected}
        onLogout={handleLogout}
      />
      
      <div className="chat-main">
        <MessageList 
          messages={messages} 
          typingUsers={typingUsers}
          messagesEndRef={messagesEndRef}
        />
        
        <MessageInput 
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onStopTyping={handleStopTyping}
        />
      </div>
    </div>
  );
}

export default Chat;

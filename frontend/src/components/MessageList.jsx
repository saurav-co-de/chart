import React from 'react';
import './MessageList.css';

function MessageList({ messages, typingUsers, messagesEndRef }) {
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatExpiryTime = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffMs = expiry - now;
    const diffMins = Math.floor(diffMs / 1000 / 60);
    
    if (diffMins < 60) {
      return `${diffMins}m`;
    }
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">
          <p>🎉 You're the first one here!</p>
          <p>Send a message to start the conversation</p>
        </div>
      ) : (
        messages.map((msg) => {
          const isOwnMessage = msg.username === currentUser.username;
          return (
            <div
              key={msg._id}
              className={`message ${isOwnMessage ? 'own-message' : 'other-message'}`}
            >
              <div className="message-content">
                {!isOwnMessage && (
                  <div className="message-username">{msg.username}</div>
                )}
                <div className="message-text">{msg.message}</div>
                <div className="message-footer">
                  <span className="message-time">{formatTime(msg.createdAt)}</span>
                  <span className="message-expiry">
                    ⏱️ {formatExpiryTime(msg.expiresAt)}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="typing-text">
            {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
          </span>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;

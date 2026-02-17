import React from 'react';
import './Header.css';

function Header({ roomId, location, connected, onLogout }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="header">
      <div className="header-left">
        <h2>📍 Location Chat</h2>
        <div className="header-info">
          <span className={`status-dot ${connected ? 'connected' : 'disconnected'}`}></span>
          <span className="room-id">Room: {roomId || 'Connecting...'}</span>
        </div>
      </div>
      
      <div className="header-right">
        <div className="user-info">
          <span className="username">👤 {user.username}</span>
          {location && (
            <span className="location-info">
              📍 {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </span>
          )}
        </div>
        <button onClick={onLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Header;

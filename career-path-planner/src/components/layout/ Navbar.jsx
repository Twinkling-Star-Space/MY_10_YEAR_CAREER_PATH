import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';

const Navbar = ({ onLoginClick }) => {
  const { gamingMode, toggleGamingMode, isLoggedIn, user, logoutUser } = useCareer();

  return (
    <nav className={`navbar ${gamingMode ? 'gaming-mode' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo">
            <span className="logo-icon">🚀</span>
            <span className="logo-text">CareerPath</span>
            {gamingMode && <span className="game-badge">🎮 MODE</span>}
          </div>
        </div>
        
        <div className="navbar-actions">
          <button 
            className="mode-toggle"
            onClick={toggleGamingMode}
            title={gamingMode ? "Switch to Normal Mode" : "Switch to Gaming Mode"}
          >
            {gamingMode ? '💼' : '🎮'}
          </button>
          
          {isLoggedIn ? (
            <div className="user-profile">
              <img 
                src={user?.avatar || `https://ui-avatars.com/api/?name=User&background=4361ee&color=fff`} 
                alt={user?.name}
                className="user-avatar"
              />
              <span className="user-name">{user?.name || 'User'}</span>
              <button 
                className="logout-btn"
                onClick={logoutUser}
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              className="login-btn"
              onClick={onLoginClick}
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
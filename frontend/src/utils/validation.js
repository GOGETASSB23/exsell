// src/utils/validation.js
export const validateSpotifyCredentials = (credentials) => {
    const { email, password } = credentials;
    
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }
  
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
  
    return true;
  };
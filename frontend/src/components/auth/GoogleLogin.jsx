// src/components/auth/GoogleLogin.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const GoogleLogin = () => {
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <button
      onClick={handleLogin}
      disabled={loading}
      className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        {/* Google icon SVG path */}
        <path
          fill="currentColor"
          d="M12.545,12.151L12.545,12.151c0,1.054,0.855,1.909,1.909,1.909h3.536c-0.684,2.054-2.602,3.536-4.854,3.536
          c-2.838,0-5.136-2.298-5.136-5.136s2.298-5.136,5.136-5.136c1.326,0,2.534,0.503,3.446,1.327l2.534-2.534
          C17.951,4.977,15.954,4,13.764,4C9.196,4,5.5,7.696,5.5,12.264s3.696,8.264,8.264,8.264c5.018,0,9.091-4.073,9.091-9.091
          c0-0.563-0.055-1.113-0.16-1.645h-9.241C12.69,10.382,12.545,11.227,12.545,12.151z"
        />
      </svg>
      {loading ? 'Connecting...' : 'Continue with Google'}
    </button>
  );
};

export default GoogleLogin;
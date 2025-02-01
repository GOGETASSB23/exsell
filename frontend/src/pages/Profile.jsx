// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMetaMask } from '../hooks/useMetaMask';

const Profile = () => {
  const { user, logout } = useAuth();
  const { account, connect } = useMetaMask();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.displayName}
              </h1>
              <p className="text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Wallet Connection
            </h2>
            {account ? (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-gray-600">
                  Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </p>
              </div>
            ) : (
              <button
                onClick={connect}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {loading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
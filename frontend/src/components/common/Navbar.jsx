// src/components/common/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useMetaMask } from '../../hooks/useMetaMask';

const Navbar = () => {
  const { user, login, logout } = useAuth();
  const { account, connect } = useMetaMask();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Spotify Resale
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  to="/create" 
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                >
                  Create Listing
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-gray-800"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-2">
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName}
                    className="w-8 h-8 rounded-full"
                  />
                  <button 
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={login}
                className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Login with Google
              </button>
            )}

            {account ? (
              <div className="px-4 py-2 rounded bg-gray-100 text-sm">
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </div>
            ) : (
              <button
                onClick={connect}
                className="px-4 py-2 rounded bg-purple-500 text-white hover:bg-purple-600"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
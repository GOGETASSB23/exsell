// src/components/auth/MetaMaskConnect.jsx
import React from 'react';
import { useMetaMask } from '../../hooks/useMetaMask';

const MetaMaskConnect = () => {
  const { account, connect, isConnected } = useMetaMask();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="text-sm text-gray-600">
            Connected: {`${account.slice(0, 6)}...${account.slice(-4)}`}
          </span>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          <img
            src="/metamask-fox.svg"
            alt="MetaMask"
            className="w-5 h-5 mr-2"
          />
          Connect MetaMask
        </button>
      )}
    </div>
  );
};

export default MetaMaskConnect;
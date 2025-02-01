// / src/services/auth/metamask.js
import { ethers } from 'ethers';

export const connectMetaMask = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    return accounts[0];
  } catch (error) {
    console.error('MetaMask connection failed:', error);
    throw error;
  }
};
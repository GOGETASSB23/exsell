// src/hooks/useMetaMask.js
import { useContext, useCallback } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { SUPPORTED_CHAINS } from '../config/contractAddresses';

export const useMetaMask = () => {
  const { account, chainId, connectWallet } = useContext(Web3Context);

  const checkNetwork = useCallback(async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    if (!SUPPORTED_CHAINS[chainId]) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${SUPPORTED_CHAINS.testnet.toString(16)}` }],
        });
      } catch (error) {
        console.error('Failed to switch network:', error);
        throw error;
      }
    }
  }, [chainId]);

  const connect = useCallback(async () => {
    try {
      await checkNetwork();
      await connectWallet();
    } catch (error) {
      console.error('Wallet connection failed:', error);
      throw error;
    }
  }, [checkNetwork, connectWallet]);

  return {
    account,
    chainId,
    connect,
    checkNetwork,
    isConnected: !!account
  };
};
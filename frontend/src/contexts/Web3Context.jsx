// src/contexts/Web3Context.jsx
import React, { createContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, SUPPORTED_CHAINS } from '../config/contractAddresses';
import SpotifyResaleABI from '../contracts/SpotifyResale.json';

export const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeWeb3();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const initializeWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const web3Signer = web3Provider.getSigner();
        const network = await web3Provider.getNetwork();
        
        setProvider(web3Provider);
        setSigner(web3Signer);
        setChainId(network.chainId);

        const contractAddress = CONTRACT_ADDRESS[network.name] || CONTRACT_ADDRESS.testnet;
        const spotifyResaleContract = new ethers.Contract(
          contractAddress,
          SpotifyResaleABI.abi,
          web3Signer
        );
        
        setContract(spotifyResaleContract);

        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error('Web3 initialization failed:', error);
      }
    }
    setLoading(false);
  };

  const handleAccountsChanged = async (accounts) => {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      await initializeWeb3();
    } else {
      setAccount(null);
    }
  };

  const handleChainChanged = async () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      setAccount(accounts[0]);
      await initializeWeb3();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  };

  return (
    <Web3Context.Provider value={{
      provider,
      signer,
      contract,
      account,
      chainId,
      loading,
      connectWallet,
      isConnected: !!account,
      isSupportedChain: SUPPORTED_CHAINS[chainId] !== undefined
    }}>
      {!loading && children}
    </Web3Context.Provider>
  );
};
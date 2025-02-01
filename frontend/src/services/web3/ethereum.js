// src/services/web3/ethereum.js
import { ethers } from 'ethers';
import { SUPPORTED_CHAINS } from '../../config/contractAddresses';

export const setupWeb3 = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();

  if (!SUPPORTED_CHAINS[network.chainId]) {
    throw new Error('Unsupported network');
  }

  return provider;
};
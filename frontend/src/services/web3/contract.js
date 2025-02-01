// src/services/web3/contract.js
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS } from '../../config/contractAddresses';
import SpotifyResaleABI from '../../contracts/SpotifyResale.json';

export const getContract = async (signer) => {
  const network = await signer.provider.getNetwork();
  const contractAddress = CONTRACT_ADDRESS[network.name] || CONTRACT_ADDRESS.testnet;
  
  return new ethers.Contract(
    contractAddress,
    SpotifyResaleABI.abi,
    signer
  );
};
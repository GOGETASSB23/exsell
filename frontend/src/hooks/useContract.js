// src/hooks/useContract.js
import { useContext, useCallback } from 'react';
import { Web3Context } from '../contexts/Web3Context';
import { ethers } from 'ethers';

export const useContract = () => {
  const { contract, account, provider } = useContext(Web3Context);

  const createListing = useCallback(async (
    startDate,
    endDate,
    pricePerDay,
    lighthouseEncryptedCID,
    billProofCID
  ) => {
    if (!contract || !account) throw new Error('Contract or account not initialized');

    try {
      const tx = await contract.listSubscription(
        startDate,
        endDate,
        ethers.utils.parseEther(pricePerDay.toString()),
        lighthouseEncryptedCID,
        billProofCID
      );
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Create listing failed:', error);
      throw error;
    }
  }, [contract, account]);

  const purchaseSubscription = useCallback(async (id, totalPrice) => {
    if (!contract || !account) throw new Error('Contract or account not initialized');

    try {
      const tx = await contract.purchaseSubscription(id, {
        value: ethers.utils.parseEther(totalPrice.toString())
      });
      
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }, [contract, account]);

  const getSubscription = useCallback(async (id) => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      const subscription = await contract.getSubscription(id);
      return subscription;
    } catch (error) {
      console.error('Get subscription failed:', error);
      throw error;
    }
  }, [contract]);

  const getActiveListings = useCallback(async () => {
    if (!contract) throw new Error('Contract not initialized');

    try {
      const listings = await contract.getActiveListings();
      return listings;
    } catch (error) {
      console.error('Get active listings failed:', error);
      throw error;
    }
  }, [contract]);

  return {
    createListing,
    purchaseSubscription,
    getSubscription,
    getActiveListings
  };
};
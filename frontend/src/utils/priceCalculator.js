// src/utils/priceCalculator.js
import { ethers } from 'ethers';

export const calculatePrice = (startDate, endDate, pricePerDay) => {
  if (!startDate || !endDate || !pricePerDay) {
    throw new Error('Missing required parameters for price calculation');
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) {
    throw new Error('End date must be after start date');
  }

  const daysDifference = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  const totalPrice = daysDifference * parseFloat(pricePerDay);

  // Convert to Wei
  return ethers.utils.parseEther(totalPrice.toString());
};

export const formatPrice = (priceInWei) => {
  return ethers.utils.formatEther(priceInWei);
};

export const calculateRemainingDays = (endDate) => {
  const now = new Date();
  const end = new Date(endDate);
  const difference = end - now;
  return Math.max(0, Math.ceil(difference / (1000 * 60 * 60 * 24)));
};
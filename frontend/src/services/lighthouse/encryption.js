// src/services/lighthouse/encryption.js
import lighthouse from '@lighthouse-web3/sdk';
import { APP_CONFIG } from '../../config/constants';

export const uploadAndEncrypt = async (file) => {
  try {
    // Upload file to IPFS
    const uploadResponse = await lighthouse.upload(
      file,
      APP_CONFIG.LIGHTHOUSE_API_KEY
    );

    return uploadResponse.data.Hash;
  } catch (error) {
    console.error('File upload failed:', error);
    throw error;
  }
};

export const encryptCredentials = async (credentials) => {
  try {
    const encryptedResponse = await lighthouse.encrypt(
      JSON.stringify(credentials),
      APP_CONFIG.LIGHTHOUSE_API_KEY
    );

    return encryptedResponse.cid;
  } catch (error) {
    console.error('Encryption failed:', error);
    throw error;
  }
};
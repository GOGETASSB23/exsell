// src/hooks/useLighthouse.js
import { useCallback } from 'react';
import lighthouse from '@lighthouse-web3/sdk';
import { APP_CONFIG } from '../config/constants';

export const useLighthouse = () => {
  const encryptData = useCallback(async (data) => {
    try {
      const response = await lighthouse.encrypt(
        JSON.stringify(data),
        APP_CONFIG.LIGHTHOUSE_API_KEY
      );
      return response;
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error;
    }
  }, []);

  const uploadFile = useCallback(async (file) => {
    try {
      const response = await lighthouse.upload(
        file,
        APP_CONFIG.LIGHTHOUSE_API_KEY
      );
      return response;
    } catch (error) {
      console.error('File upload failed:', error);
      throw error;
    }
  }, []);

  const decryptData = useCallback(async (cid, decryptionKey) => {
    try {
      const decryptedData = await lighthouse.decrypt(
        cid,
        decryptionKey
      );
      return JSON.parse(decryptedData);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw error;
    }
  }, []);

  return {
    encryptData,
    uploadFile,
    decryptData
  };
};
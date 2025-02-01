// src/config/constants.js
export const APP_CONFIG = {
    APP_NAME: "Spotify Resale",
    LIGHTHOUSE_API_KEY: process.env.VITE_LIGHTHOUSE_API_KEY,
    GOOGLE_CLIENT_ID: process.env.VITE_GOOGLE_CLIENT_ID,
    IPFS_GATEWAY: "https://gateway.lighthouse.storage/ipfs/"
  };
  
  export const ERROR_MESSAGES = {
    NO_METAMASK: "Please install MetaMask to use this application",
    WRONG_NETWORK: "Please switch to a supported network",
    UNAUTHORIZED: "Please connect your wallet",
    TRANSACTION_FAILED: "Transaction failed. Please try again"
  };
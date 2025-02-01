// src/components/subscription/SubscriptionForm.jsx
import React, { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import { useLighthouse } from '../../hooks/useLighthouse';
import BillUploader from './BillUploader';
import CredentialInput from './CredentialInput';
import LoadingSpinner from '../common/LoadingSpinner';
import { validateSpotifyCredentials } from '../../utils/validation';

const SubscriptionForm = () => {
  const [formData, setFormData] = useState({
    pricePerDay: '',
    credentials: {
      email: '',
      password: ''
    }
  });
  const [dates, setDates] = useState({ startDate: null, endDate: null });
  const [billCID, setBillCID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { createListing } = useContract();
  const { encryptData, uploadFile } = useLighthouse();

  const handleBillProcessed = async (processedData) => {
    const { dates: extractedDates, cid } = processedData;
    setDates(extractedDates);
    setBillCID(cid);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);

      // Validate inputs
      validateSpotifyCredentials(formData.credentials);
      if (!dates.startDate || !billCID || !formData.pricePerDay) {
        throw new Error('Please fill in all required fields');
      }

      // Encrypt credentials
      const encryptedCreds = await encryptData(formData.credentials);

      // Create listing on blockchain
      const tx = await createListing(
        Math.floor(dates.startDate.getTime() / 1000),
        dates.endDate ? Math.floor(dates.endDate.getTime() / 1000) : 
                       Math.floor(dates.startDate.getTime() / 1000 + 30 * 24 * 60 * 60),
        formData.pricePerDay,
        encryptedCreds.cid,
        billCID
      );

      await tx.wait();
      // Handle success (redirect, show notification, etc.)
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold mb-4">Create Subscription Listing</h2>
        
        <BillUploader onProcessed={handleBillProcessed} />

        {dates.startDate && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
            <h3 className="font-medium mb-2">Extracted Dates</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Start Date:</span>
                <span className="ml-2">
                  {dates.startDate.toLocaleDateString()}
                </span>
              </div>
              {dates.endDate && (
                <div>
                  <span className="text-gray-600">End Date:</span>
                  <span className="ml-2">
                    {dates.endDate.toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price per Day (ETH)
          </label>
          <input
            type="number"
            step="0.0001"
            value={formData.pricePerDay}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              pricePerDay: e.target.value
            }))}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <CredentialInput
          value={formData.credentials}
          onChange={(credentials) => setFormData(prev => ({
            ...prev,
            credentials
          }))}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <LoadingSpinner size="small" />
          ) : (
            'Create Listing'
          )}
        </button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
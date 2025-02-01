// src/components/marketplace/ListingDetails.jsx
import React, { useState } from 'react';
import { useContract } from '../../hooks/useContract';
import { formatPrice, calculateRemainingDays } from '../../utils/priceCalculator';
import { useLighthouse } from '../../hooks/useLighthouse';
import LoadingSpinner from '../common/LoadingSpinner';

const ListingDetails = ({ subscription, onPurchase }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { purchaseSubscription } = useContract();
  const { decryptData } = useLighthouse();

  const remainingDays = calculateRemainingDays(subscription.endDate);
  const totalPrice = formatPrice(subscription.pricePerDay * remainingDays);

  const handlePurchase = async () => {
    try {
      setLoading(true);
      setError(null);

      const tx = await purchaseSubscription(subscription.id, totalPrice);
      await tx.wait();

      // Get decrypted credentials after successful purchase
      const credentials = await decryptData(subscription.lighthouseEncryptedCID);
      
      onPurchase(credentials);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Spotify Premium Subscription
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Duration</h3>
              <p className="text-gray-500">
                {remainingDays} days remaining
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Dates</h3>
              <div className="space-y-2">
                <p className="text-gray-500">
                  Start: {new Date(subscription.startDate * 1000).toLocaleDateString()}
                </p>
                <p className="text-gray-500">
                  End: {new Date(subscription.endDate * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900">Price</h3>
              <div className="space-y-2">
                <p className="text-gray-500">
                  Daily Rate: {formatPrice(subscription.pricePerDay)} ETH
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  Total: {totalPrice} ETH
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Purchase Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li>• Credentials will be provided after purchase</li>
              <li>• Transaction is secured by smart contract</li>
              <li>• Support available for transfer issues</li>
            </ul>
          </div>

          <div className="mt-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-md">
                {error}
              </div>
            )}

            <button
              onClick={handlePurchase}
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? (
                <LoadingSpinner size="small" />
              ) : (
                `Purchase for ${totalPrice} ETH`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
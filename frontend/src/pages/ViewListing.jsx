// src/pages/ViewListing.jsx (continued)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContract } from '../hooks/useContract';
import ListingDetails from '../components/marketplace/ListingDetails';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ViewListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getSubscription } = useContract();

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscription(id);
        if (!data.isActive) {
          throw new Error('This listing is no longer available');
        }
        setSubscription(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [id, getSubscription]);

  const handlePurchaseSuccess = (credentials) => {
    // Show success modal with credentials
    navigate('/dashboard', { 
      state: { 
        purchaseSuccess: true,
        credentials 
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error}
          </h2>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
      </div>

      {subscription && (
        <ListingDetails 
          subscription={subscription}
          onPurchase={handlePurchaseSuccess}
        />
      )}
    </div>
  );
};

export default ViewListing;
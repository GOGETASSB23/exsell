
// src/pages/CreateListing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SubscriptionForm from '../components/subscription/SubscriptionForm';

const CreateListing = () => {
  const navigate = useNavigate();

  const handleListingCreated = () => {
    // Show success message and redirect
    navigate('/dashboard');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Create Subscription Listing
          </h1>
          <p className="mt-2 text-gray-600">
            List your unused Spotify subscription time for sale.
          </p>
        </div>

        <SubscriptionForm onSuccess={handleListingCreated} />
      </div>
    </div>
  );
};

export default CreateListing;
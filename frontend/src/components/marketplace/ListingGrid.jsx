// src/components/marketplace/ListingGrid.jsx
import React from 'react';
import SubscriptionCard from '../subscription/SubscriptionCard';

const ListingGrid = ({ listings, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!listings || listings.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No listings available
        </h3>
        <p className="text-gray-500">
          Check back later for new subscription listings.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map((listing) => (
        <SubscriptionCard key={listing.id} subscription={listing} />
      ))}
    </div>
  );
};

export default ListingGrid;
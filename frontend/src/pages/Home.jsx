// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useContract } from '../hooks/useContract';
import ListingGrid from '../components/marketplace/ListingGrid';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getActiveListings, getSubscription } = useContract();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const activeListingIds = await getActiveListings();
        const listingPromises = activeListingIds.map(id => getSubscription(id));
        const activeListings = await Promise.all(listingPromises);
        
        setListings(activeListings.filter(listing => listing.isActive));
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [getActiveListings, getSubscription]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Available Spotify Subscriptions
      </h1>
      <ListingGrid listings={listings} loading={loading} />
    </div>
  );
};

export default Home;
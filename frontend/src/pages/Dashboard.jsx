// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContract } from '../hooks/useContract';
import { useAuth } from '../hooks/useAuth';
import SubscriptionCard from '../components/subscription/SubscriptionCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [activeListings, setActiveListings] = useState([]);
  const [purchasedSubscriptions, setPurchasedSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getSellerListings, getSubscription } = useContract();

  useEffect(() => {
    const fetchUserSubscriptions = async () => {
      try {
        const listingIds = await getSellerListings(user.uid);
        const subscriptions = await Promise.all(
          listingIds.map(id => getSubscription(id))
        );

        setActiveListings(subscriptions.filter(sub => sub.isActive));
        setPurchasedSubscriptions(subscriptions.filter(sub => !sub.isActive));
      } catch (error) {
        console.error('Error fetching user subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubscriptions();
  }, [user.uid, getSellerListings, getSubscription]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {location.state?.purchaseSuccess && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="text-lg font-medium text-green-800 mb-2">
            Purchase Successful!
          </h3>
          <p className="text-green-700">
            Your Spotify credentials are now available. Make sure to save them securely.
          </p>
          <div className="mt-4 p-4 bg-white rounded border border-green-200">
            <p className="font-medium">Spotify Credentials:</p>
            <p>Email: {location.state.credentials.email}</p>
            <p>Password: {location.state.credentials.password}</p>
          </div>
        </div>
      )}

      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Active Listings
          </h2>
          {activeListings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeListings.map(listing => (
                <SubscriptionCard 
                  key={listing.id} 
                  subscription={listing}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You don't have any active listings.
            </p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Purchase History
          </h2>
          {purchasedSubscriptions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {purchasedSubscriptions.map(subscription => (
                <SubscriptionCard 
                  key={subscription.id} 
                  subscription={subscription}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              You haven't purchased any subscriptions yet.
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
// src/components/subscription/SubscriptionCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, calculateRemainingDays } from '../../utils/priceCalculator';

const SubscriptionCard = ({ subscription }) => {
  const remainingDays = calculateRemainingDays(subscription.endDate);
  const totalPrice = formatPrice(subscription.pricePerDay * remainingDays);

  return (
    <div className="border rounded-lg shadow-sm p-6 bg-white">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Spotify Premium Subscription
          </h3>
          <p className="text-sm text-gray-500">
            {remainingDays} days remaining
          </p>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-900">
            {totalPrice} ETH
          </p>
          <p className="text-sm text-gray-500">
            {formatPrice(subscription.pricePerDay)} ETH/day
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Start Date:</span>
          <span className="text-gray-900">
            {new Date(subscription.startDate * 1000).toLocaleDateString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">End Date:</span>
          <span className="text-gray-900">
            {new Date(subscription.endDate * 1000).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          to={`/listing/${subscription.id}`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionCard;
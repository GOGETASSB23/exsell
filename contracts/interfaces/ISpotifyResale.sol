// File: contracts/interfaces/ISpotifyResale.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISpotifyResale {
    struct Subscription {
        uint256 id;
        address seller;
        uint256 startDate;
        uint256 endDate;
        uint256 pricePerDay;
        bool isActive;
        string lighthouseEncryptedCID;
        string billProofCID;
    }

    event SubscriptionListed(
        uint256 indexed id,
        address indexed seller,
        uint256 pricePerDay,
        uint256 startDate,
        uint256 endDate
    );
    
    event SubscriptionPurchased(
        uint256 indexed id,
        address indexed buyer,
        address indexed seller,
        uint256 totalPrice
    );
    
    event SubscriptionCancelled(uint256 indexed id, address indexed seller);
    event PriceUpdated(uint256 indexed id, uint256 newPricePerDay);
    event PaymentReleased(uint256 indexed id, address indexed seller, uint256 amount);

    function listSubscription(
        uint256 startDate,
        uint256 endDate,
        uint256 pricePerDay,
        string calldata lighthouseEncryptedCID,
        string calldata billProofCID
    ) external returns (uint256);

    function purchaseSubscription(uint256 id) external payable;
    function cancelListing(uint256 id) external;
    function updatePrice(uint256 id, uint256 newPricePerDay) external;
    function getSubscription(uint256 id) external view returns (Subscription memory);
    function getActiveListings() external view returns (uint256[] memory);
    function getSellerListings(address seller) external view returns (uint256[] memory);
}
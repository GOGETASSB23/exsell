// File: contracts/SpotifyResale.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./interfaces/ISpotifyResale.sol";

contract SpotifyResale is ISpotifyResale, ReentrancyGuard, Ownable, Pausable {
    using Counters for Counters.Counter;

    // State variables
    Counters.Counter private _subscriptionIds;
    mapping(uint256 => Subscription) private _subscriptions;
    mapping(address => uint256[]) private _sellerSubscriptions;
    uint256[] private _activeListings;
    uint256 private constant PLATFORM_FEE_PERCENTAGE = 25; // 2.5%
    uint256 private constant PERCENTAGE_BASE = 1000;

    // Modifiers
    modifier validSubscriptionId(uint256 id) {
        require(_subscriptions[id].seller != address(0), "Subscription does not exist");
        _;
    }

    modifier onlySeller(uint256 id) {
        require(_subscriptions[id].seller == msg.sender, "Not the seller");
        _;
    }

    modifier isActive(uint256 id) {
        require(_subscriptions[id].isActive, "Subscription not active");
        _;
    }

    constructor() {
        _subscriptionIds.increment(); // Start IDs from 1
    }

    function listSubscription(
        uint256 startDate,
        uint256 endDate,
        uint256 pricePerDay,
        string calldata lighthouseEncryptedCID,
        string calldata billProofCID
    ) external override whenNotPaused nonReentrant returns (uint256) {
        require(startDate < endDate, "Invalid dates");
        require(pricePerDay > 0, "Invalid price");
        require(bytes(lighthouseEncryptedCID).length > 0, "Missing encrypted credentials");
        require(bytes(billProofCID).length > 0, "Missing bill proof");

        uint256 newId = _subscriptionIds.current();
        
        _subscriptions[newId] = Subscription({
            id: newId,
            seller: msg.sender,
            startDate: startDate,
            endDate: endDate,
            pricePerDay: pricePerDay,
            isActive: true,
            lighthouseEncryptedCID: lighthouseEncryptedCID,
            billProofCID: billProofCID
        });

        _sellerSubscriptions[msg.sender].push(newId);
        _activeListings.push(newId);

        emit SubscriptionListed(
            newId,
            msg.sender,
            pricePerDay,
            startDate,
            endDate
        );

        _subscriptionIds.increment();
        return newId;
    }

    function purchaseSubscription(uint256 id) 
        external 
        payable 
        override 
        whenNotPaused 
        nonReentrant 
        validSubscriptionId(id) 
        isActive(id) 
    {
        Subscription storage subscription = _subscriptions[id];
        require(msg.sender != subscription.seller, "Cannot buy own subscription");
        require(block.timestamp < subscription.endDate, "Subscription expired");

        uint256 remainingDays = (subscription.endDate - block.timestamp) / 1 days;
        uint256 totalPrice = remainingDays * subscription.pricePerDay;
        require(msg.value >= totalPrice, "Insufficient payment");

        subscription.isActive = false;
        _removeFromActiveListings(id);

        // Calculate and transfer platform fee
        uint256 platformFee = (totalPrice * PLATFORM_FEE_PERCENTAGE) / PERCENTAGE_BASE;
        uint256 sellerAmount = totalPrice - platformFee;
        
        // Transfer amounts
        (bool feeSuccess,) = owner().call{value: platformFee}("");
        require(feeSuccess, "Platform fee transfer failed");
        
        (bool sellerSuccess,) = subscription.seller.call{value: sellerAmount}("");
        require(sellerSuccess, "Seller payment failed");

        emit SubscriptionPurchased(id, msg.sender, subscription.seller, totalPrice);
        emit PaymentReleased(id, subscription.seller, sellerAmount);
    }

    function cancelListing(uint256 id) 
        external 
        override 
        validSubscriptionId(id) 
        onlySeller(id) 
        isActive(id) 
    {
        _subscriptions[id].isActive = false;
        _removeFromActiveListings(id);
        emit SubscriptionCancelled(id, msg.sender);
    }

    function updatePrice(uint256 id, uint256 newPricePerDay) 
        external 
        override 
        validSubscriptionId(id) 
        onlySeller(id) 
        isActive(id) 
    {
        require(newPricePerDay > 0, "Invalid price");
        _subscriptions[id].pricePerDay = newPricePerDay;
        emit PriceUpdated(id, newPricePerDay);
    }

    function getSubscription(uint256 id) 
        external 
        view 
        override 
        validSubscriptionId(id) 
        returns (Subscription memory) 
    {
        return _subscriptions[id];
    }

    function getActiveListings() external view override returns (uint256[] memory) {
        return _activeListings;
    }

    function getSellerListings(address seller) 
        external 
        view 
        override 
        returns (uint256[] memory) 
    {
        return _sellerSubscriptions[seller];
    }

    // Internal functions
    function _removeFromActiveListings(uint256 id) internal {
        for (uint256 i = 0; i < _activeListings.length; i++) {
            if (_activeListings[i] == id) {
                _activeListings[i] = _activeListings[_activeListings.length - 1];
                _activeListings.pop();
                break;
            }
        }
    }

    // Owner functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function updatePlatformFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 50, "Fee too high"); // Max 5%
        // PLATFORM_FEE_PERCENTAGE = newFeePercentage;
    }

    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success,) = owner().call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Fallback and receive functions
    receive() external payable {}
    fallback() external payable {}
}
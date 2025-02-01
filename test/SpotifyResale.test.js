// test/SpotifyResale.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("SpotifyResale", function () {
  let SpotifyResale;
  let contract;
  let owner;
  let seller;
  let buyer;
  let addrs;

  beforeEach(async function () {
    // Get signers
    [owner, seller, buyer, ...addrs] = await ethers.getSigners();

    // Deploy contract
    SpotifyResale = await ethers.getContractFactory("SpotifyResale");
    contract = await SpotifyResale.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("Should start with no listings", async function () {
      expect((await contract.getActiveListings()).length).to.equal(0);
    });
  });

  describe("Listing Creation", function () {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 30 * 24 * 60 * 60; // 30 days
    const pricePerDay = ethers.utils.parseEther("0.01");
    const credentials = "encrypted_credentials_cid";
    const billProof = "bill_proof_cid";

    it("Should create a new listing", async function () {
      await expect(
        contract.connect(seller).listSubscription(
          startDate,
          endDate,
          pricePerDay,
          credentials,
          billProof
        )
      )
        .to.emit(contract, "SubscriptionListed")
        .withArgs(1, seller.address, pricePerDay, startDate, endDate);

      const listing = await contract.getSubscription(1);
      expect(listing.seller).to.equal(seller.address);
      expect(listing.isActive).to.be.true;
    });

    it("Should fail with invalid dates", async function () {
      await expect(
        contract.connect(seller).listSubscription(
          endDate,
          startDate,
          pricePerDay,
          credentials,
          billProof
        )
      ).to.be.revertedWith("Invalid dates");
    });

    it("Should fail with zero price", async function () {
      await expect(
        contract.connect(seller).listSubscription(
          startDate,
          endDate,
          0,
          credentials,
          billProof
        )
      ).to.be.revertedWith("Invalid price");
    });
  });

  describe("Subscription Purchase", function () {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 30 * 24 * 60 * 60;
    const pricePerDay = ethers.utils.parseEther("0.01");
    const credentials = "encrypted_credentials_cid";
    const billProof = "bill_proof_cid";

    beforeEach(async function () {
      await contract.connect(seller).listSubscription(
        startDate,
        endDate,
        pricePerDay,
        credentials,
        billProof
      );
    });

    it("Should allow purchase with correct payment", async function () {
      const totalPrice = pricePerDay.mul(30); // 30 days
      await expect(
        contract.connect(buyer).purchaseSubscription(1, {
          value: totalPrice
        })
      )
        .to.emit(contract, "SubscriptionPurchased")
        .withArgs(1, buyer.address, seller.address, totalPrice);

      const listing = await contract.getSubscription(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should fail with insufficient payment", async function () {
      const totalPrice = pricePerDay.mul(29); // Insufficient for 30 days
      await expect(
        contract.connect(buyer).purchaseSubscription(1, {
          value: totalPrice
        })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should prevent seller from buying own subscription", async function () {
      const totalPrice = pricePerDay.mul(30);
      await expect(
        contract.connect(seller).purchaseSubscription(1, {
          value: totalPrice
        })
      ).to.be.revertedWith("Cannot buy own subscription");
    });
  });

  describe("Listing Management", function () {
    const startDate = Math.floor(Date.now() / 1000);
    const endDate = startDate + 30 * 24 * 60 * 60;
    const pricePerDay = ethers.utils.parseEther("0.01");
    const credentials = "encrypted_credentials_cid";
    const billProof = "bill_proof_cid";

    beforeEach(async function () {
      await contract.connect(seller).listSubscription(
        startDate,
        endDate,
        pricePerDay,
        credentials,
        billProof
      );
    });

    it("Should allow seller to cancel listing", async function () {
      await expect(contract.connect(seller).cancelListing(1))
        .to.emit(contract, "SubscriptionCancelled")
        .withArgs(1, seller.address);

      const listing = await contract.getSubscription(1);
      expect(listing.isActive).to.be.false;
    });

    it("Should prevent non-seller from cancelling", async function () {
      await expect(
        contract.connect(buyer).cancelListing(1)
      ).to.be.revertedWith("Not the seller");
    });

    it("Should update price correctly", async function () {
      const newPrice = ethers.utils.parseEther("0.02");
      await expect(contract.connect(seller).updatePrice(1, newPrice))
        .to.emit(contract, "PriceUpdated")
        .withArgs(1, newPrice);

      const listing = await contract.getSubscription(1);
      expect(listing.pricePerDay).to.equal(newPrice);
    });
  });

  describe("Admin Functions", function () {
    it("Should allow owner to pause contract", async function () {
      await contract.connect(owner).pause();
      expect(await contract.paused()).to.be.true;
    });

    it("Should prevent non-owner from pausing", async function () {
      await expect(
        contract.connect(seller).pause()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should prevent operations when paused", async function () {
      await contract.connect(owner).pause();
      
      const startDate = Math.floor(Date.now() / 1000);
      const endDate = startDate + 30 * 24 * 60 * 60;
      
      await expect(
        contract.connect(seller).listSubscription(
          startDate,
          endDate,
          ethers.utils.parseEther("0.01"),
          "credentials",
          "proof"
        )
      ).to.be.revertedWith("Pausable: paused");
    });
  });
});
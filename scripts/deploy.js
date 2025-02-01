// scripts/deploy.js
const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  // Get the contract factory
  const SpotifyResale = await hre.ethers.getContractFactory("SpotifyResale");
  
  // Deploy the contract
  console.log("Deploying SpotifyResale contract...");
  const spotifyResale = await SpotifyResale.deploy();
  await spotifyResale.deployed();
  
  console.log("SpotifyResale deployed to:", spotifyResale.address);

  // Store the contract addresses
  const contractAddresses = {
    SpotifyResale: spotifyResale.address
  };

  // Create the deployment info file
  const deploymentInfo = {
    network: hre.network.name,
    chainId: (await hre.ethers.provider.getNetwork()).chainId,
    contracts: contractAddresses,
    timestamp: new Date().toISOString(),
  };

  // Write deployment info to a JSON file
  const deploymentPath = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentPath)) {
    fs.mkdirSync(deploymentPath);
  }

  fs.writeFileSync(
    path.join(deploymentPath, `${hre.network.name}.json`),
    JSON.stringify(deploymentInfo, null, 2)
  );

  // Write the contract address to the frontend config
  const frontendPath = path.join(__dirname, '../frontend/src/config');
  if (!fs.existsSync(frontendPath)) {
    fs.mkdirSync(frontendPath, { recursive: true });
  }

  const contractAddressesPath = path.join(frontendPath, 'contractAddresses.js');
  const content = `
// This file is auto-generated. Do not edit directly.
export const CONTRACT_ADDRESS = {
  ${hre.network.name}: "${spotifyResale.address}"
};

export const SUPPORTED_CHAINS = {
  mainnet: 1,
  goerli: 5,
  localhost: 1337
};
`;

  fs.writeFileSync(contractAddressesPath, content);

  // Verify the contract on Etherscan if not on localhost
  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    console.log("Waiting for block confirmations...");
    await spotifyResale.deployTransaction.wait(6);

    console.log("Verifying contract on Etherscan...");
    await hre.run("verify:verify", {
      address: spotifyResale.address,
      constructorArguments: [],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
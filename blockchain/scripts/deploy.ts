//@ts-nocheck
import hre from "hardhat";

async function main() {
  const { ethers } = hre;
  console.log("🚀 Deploying CharityTracker...");

  const [deployer] = await ethers.getSigners();
  console.log("👤 Deployer address:", deployer.address);


  const CharityTracker = await ethers.getContractFactory("CharityTracker");
  const charityTracker = await CharityTracker.deploy();

  await charityTracker.waitForDeployment();
  console.log("✅ Contract deployed to:", await charityTracker.getAddress());
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
// We require the Hardhat Runtime Environment explicitly here. This is optional 
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile 
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const FishervsPirate = await hre.ethers.getContractFactory("FishervsPirate");
  const fishervsPirate = await FishervsPirate.deploy("FishervsPirate", "FvP", "http://localhost:3000/NFTs/NFTs/"); 
  
// 0x06f7A010CCF8D8634EF2Ed40a86882C31e8903c7 deploy in testnet. 
  await fishervsPirate.deployed();

  console.log("FishervsPirate deployed to:", fishervsPirate.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

// 0x856044C3a17099eF5Af78A439d047a1B5c1bbeA2 deploy in testnet with Pirates
// 0x8b8Ca2664deB52d8528a0514C2AE4D6D336C9bfB deploy in mainnet with Pirates


//local test
// 0x7C6DeAdde7ABc337F7E5272d1CdF1ce04E0A3603
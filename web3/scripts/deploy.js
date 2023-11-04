const hre = require("hardhat");

async function main() {

  console.log("Starting deploy")
  
  //STAKING CONTRACT
  const tokenStaking = await hre.ethers.deployContract("TokenStaking");    
    
  //TOKEN CONTRACT
  const zexoToken = await hre.ethers.deployContract("ZexoToken");

  await tokenStaking.waitForDeployment();
  await zexoToken.waitForDeployment();
    
  console.log(`STACKING: ${await tokenStaking.getAddress()}`);
  console.log(`TOKEN: ${await zexoToken.getAddress()}`);

  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

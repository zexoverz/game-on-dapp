const hre = require("hardhat")
const ethers = require("hardhat").ethers

const tokens = (nToken) => {
  return ethers.parseUnits(nToken.toString(), "wei")
}

async function main() {

  console.log("Starting deploy")
  
  // //STAKING CONTRACT
  // const tokenStaking = await hre.ethers.deployContract("TokenStaking");
  // await tokenStaking.waitForDeployment();    
  // console.log(`STACKING: ${await tokenStaking.getAddress()}`);

  //TOKEN CONTRACT
  const initialSupply = tokens(50000000)
  const ZexoTokenContract = await hre.ethers.getContractFactory("ZexoTokenV2")
  const zexoToken = await ZexoTokenContract.deploy(initialSupply)
  
  await zexoToken.waitForDeployment()
    
  console.log(`ZEXO TOKEN V2: ${await zexoToken.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

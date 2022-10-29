require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    goerli:{
      url: `${process.env.GOERLI_RPC_URL}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    mumbai:{
      url: `${process.env.MUMBAI_RPC_URL}`,
      accounts: [process.env.PRIVATE_KEY]
    },
    bsc:{
      url: `${process.env.BSC_TESTNET}`,
      accounts: [process.env.PRIVATE_KEY]
    },
  }
};

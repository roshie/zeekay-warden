require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
// Ensure your configuration variables are set before executing the script
const { vars } = require("hardhat/config");

// Go to https://infura.io, sign up, create a new API key
// in its dashboard, and add it to the configuration variables
// const INFURA_API_KEY = vars.get("INFURA_API_KEY");

// Add your Sepolia account private key to the configuration variables
// To export your private key from Coinbase Wallet, go to
// Settings > Developer Settings > Show private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Beware: NEVER put real Ether into testing accounts
const MORPH_PRIVATE_KEY = vars.get("MORPH_PRIVATE_KEY");

// airdao
module.exports = {
  solidity: {
    version: "0.8.24"
  },
  networks: {
    // sepolia: {
    //   url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [SEPOLIA_PRIVATE_KEY],
    // },
    // airdao: {
    //   url: `https://network.ambrosus-test.io/`,
    //   accounts: [process.env.AIRDAO_PRIVATE_KEY], 
    //   chainId: 22040, 
    // },
    morph: {
      url: "https://rpc-quicknode-holesky.morphl2.io/",
      chainId: 2810,
      accounts: [MORPH_PRIVATE_KEY],
    }
  },
  paths: {
    sources: "./src"
  },
};
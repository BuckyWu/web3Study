require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()
// require("./tasks/deploy_fundme")
// require("./tasks/intereact_fundme")
require("./tasks")
require("hardhat-deploy")
// require("@chainlink/env-enc").config()

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_KEY = process.env.API_KEY
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // defaultNetwork: "hardHat", 默认的部署网络
  solidity: "0.8.28",
  networks:{
    sepolia:{
      url:SEPOLIA_URL,
      accounts:[PRIVATE_KEY,PRIVATE_KEY_2],
      chainId:11155111
    }
  },
  etherscan:{
    apiKey:{
      sepolia:API_KEY
    }
  },
  namedAccounts:{
    firstAccount:{
      default:0 //取配置的accounts的第0个元素
    },
    secondAccount:{
      default:1 //取配置的accounts的第1个元素
    }
  }
};

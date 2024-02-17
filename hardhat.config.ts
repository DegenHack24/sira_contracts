import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import 'dotenv/config';
require('@nomiclabs/hardhat-ethers');

const INFURA_API_KEY = process.env.INFURA_KEY;
const SEPOLIA_PRIVATE_KEY = process.env.ADMIN_WALLET;

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY, process.env.WALLET_1, process.env.WALLET_2, process.env.WALLET_3]
    }
  }
};

export default config;

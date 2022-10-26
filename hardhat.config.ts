import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import { NetworkUserConfig } from "hardhat/types";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-abi-exporter";
import "hardhat-contract-sizer";
import "@primitivefi/hardhat-dodoc";

dotenv.config();

import "./tasks/accounts/account"

const chainIds = {
  localhost: 1337,
  hardhat: 1337,
  mumbai: 80001
};

// Ensure that we have all the environment variables we need.
const testPrivateKey: string = process.env.TEST_PRIVATE_KEY || "";

function createTestnetConfig(network: keyof typeof chainIds): NetworkUserConfig {

  let nodeUrl = "";

  switch (network) {
    case "mumbai":
      nodeUrl = "https://rpc-mumbai.maticvigil.com";
      break;
  }

  return {
    chainId: chainIds[network],
    url: nodeUrl,
    accounts: [`${testPrivateKey}`],
  };
}

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.12",
    settings: {
      metadata: {
        bytecodeHash: "ipfs",
      },
      // You should disable the optimizer when debugging
      // https://hardhat.org/hardhat-network/#solidity-optimizer-support
      optimizer: {
        enabled: true,
        runs: 490,
      },
    },
  },
  abiExporter: {
    flat: true,
  },
  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: "USD",
    // coinmarketcap: process.env.REPORT_GAS_COINMARKETCAP_API_KEY
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  dodoc: {
    runOnCompile: true,
    exclude: ["**/node_modules/**"],
    keepFileStructure: false,
  },
};

if (testPrivateKey) {
  config.networks = {
    mumbai: createTestnetConfig("mumbai"),
    localhost: {
      url: "http://172.21.96.1:8545",
      chainId: 1337,
    },
  };
}

config.networks = {
  // ropsten: {
  //   url: process.env.ROPSTEN_URL || "",
  //   accounts:
  //     process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
  // },
  ...config.networks,
  hardhat: {
    chainId: 1337,
  },
};

export default config;

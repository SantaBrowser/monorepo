import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';
const POLYGON_PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const ARBITRUM_PRIVATE_KEY = process.env.PRIVATE_KEY || '';
const DEPLOYER_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || '';
const ETHERSCAN_POLYGON_API_KEY = process.env.ETHERSCAN_POLYGON_API_KEY || '';
const ETHERSCAN_BASE_API_KEY = process.env.ETHERSCAN_BASE_API_KEY || '';
const SEPOLIA_PRIVATE_KEY = process.env.PRIVATE_KEY || '';

const config: HardhatUserConfig = {
    defaultNetwork: 'polygon',
    networks: {
        hardhat: {
            accounts: [
                {
                    balance: '100000000000000000000',
                    privateKey: process.env.PRIVATE_KEY ? process.env.PRIVATE_KEY : '0x873c254263b17925b686f971d7724267710895f1585bb0533db8e693a2af32ff',
                },
                {
                    balance: '100000000000000000000',
                    privateKey: '0x97093724e1748ebfa6aa2d2ec4ec68df8678423ab9a12eb2d27ddc74e35e5db9',
                },
                {
                    balance: '100000000000000000000',
                    privateKey: '5a05e38394194379795422d2e8c1d33e90033d90defec4880174c39198f707e3',
                },
                {
                    balance: '100000000000000000000',
                    privateKey: 'eea0247bd059ac4d2528adb36bb0de003d62ba568e3197984b61c41d9a132df0',
                },
            ],
        },
        sepolia: {
            url: "https://sepolia.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338",
            accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY]: [],
            chainId: 11155111,
        },
        polygon: {
            url: "https://polygon-mainnet.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338",
            accounts: POLYGON_PRIVATE_KEY ? [POLYGON_PRIVATE_KEY]: [],
            chainId: 137,
        },
        arbitrum: {
            url: "https://arbitrum-mainnet.infura.io/v3/d8d9d860d0c94b7f88c73b371afee338",
            accounts: ARBITRUM_PRIVATE_KEY ? [ARBITRUM_PRIVATE_KEY]: [],
            chainId: 42161,
        },
    },
    paths: {
        sources: 'contracts',
    },
    solidity: {
        compilers: [
            {
                version: '0.5.17',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.7.6',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.8.0',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.8.1',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.8.2',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.8.6',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
            {
                version: '0.8.24', // Remove when Lock is removed
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    // IOTA EVM has no api for verification, link below is for reference
    // https://wiki.iota.org/isc/getting-started/tools/#hardhat
    etherscan: {
        apiKey: {
            polygon: ETHERSCAN_POLYGON_API_KEY,
            base: ETHERSCAN_BASE_API_KEY,
        },
        customChains: [
            {
                network: 'base',
                chainId: 8453,
                urls: {
                    apiURL: 'https://api.basescan.org/api',
                    browserURL: 'https://basescan.org',
                },
            },
        ],
    },
};

if (POLYGON_PRIVATE_KEY && ALCHEMY_API_KEY && config.networks) {
    config.networks.matic = {
        url: `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        accounts: [POLYGON_PRIVATE_KEY],
        timeout: 2483647,
    };
    config.networks.base = {
        url: `https://base-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
        accounts: [DEPLOYER_PRIVATE_KEY],
        timeout: 2483647,
    };
    config.networks.iota = {
        url: `https://json-rpc.evm.iotaledger.net`,
        accounts: [DEPLOYER_PRIVATE_KEY],
        timeout: 2483647,
    };
}

export default config;

import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

dotenv.config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID || '';
const POLYGON_PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY || '';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || '';

const config: HardhatUserConfig = {
    defaultNetwork: 'sepolia',
    networks: {
        hardhat: {
            accounts: [
                {
                    balance: '100000000000000000000',
                    privateKey: '0x873c254263b17925b686f971d7724267710895f1585bb0533db8e693a2af32ff',
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
            url: "https://ethereum-sepolia-rpc.publicnode.com",
            accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY]: [],
            chainId: 11155111,
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
};

if (POLYGON_PRIVATE_KEY && INFURA_PROJECT_ID && config.networks) {
    config.networks.matic = {
        url: `https://polygon-mainnet.infura.io/v3/${INFURA_PROJECT_ID}`,
        accounts: [POLYGON_PRIVATE_KEY],
        timeout: 2483647,
    };
}

if (ETHERSCAN_API_KEY) {
    if (!config.etherscan) config['etherscan'] = {};
    config.etherscan.apiKey = {
        polygon: ETHERSCAN_API_KEY,
    };
}

export default config;

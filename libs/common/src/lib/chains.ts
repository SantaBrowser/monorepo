import { ChainId } from './enums';

type ChainInfo = { name: string; chainId: number; blockExplorer: string; rpc: string };

const chainList: { [chainId: number]: ChainInfo } = {
    [ChainId.Ethereum]: {
        chainId: ChainId.Ethereum,
        name: 'Ethereum',
        blockExplorer: 'https://etherscan.com',
        rpc: 'https://cloudflare-eth.com',
    },
    [ChainId.BNBChain]: {
        chainId: ChainId.BNBChain,
        name: 'BNB Chain',
        blockExplorer: 'https://bscscan.com',
        rpc: 'https://rpc.ankr.com/bsc',
    },
    [ChainId.Arbitrum]: {
        chainId: ChainId.Arbitrum,
        name: 'Arbitrum',
        blockExplorer: 'https://arbiscan.io',
        rpc: 'https://arbitrum.llamarpc.com',
    },
    [ChainId.Sepolia]: {
        chainId: ChainId.Sepolia,
        name: 'Sepolia',
        blockExplorer: 'https://sepolia.etherscan.io',
        rpc: 'https://ethereum-sepolia-rpc.publicnode.com',
    },
    [ChainId.Polygon]: {
        chainId: ChainId.Polygon,
        name: 'Polygon',
        blockExplorer: 'https://polygonscan.com',
        rpc: 'https://polygon-pokt.nodies.app',
    },
    [ChainId.PolygonZK]: {
        chainId: ChainId.PolygonZK,
        name: 'Polygon zkEVM',
        blockExplorer: 'https://zkevm.polygonscan.com',
        rpc: 'https://zkevm-rpc.com',
    },
    [ChainId.Linea]: {
        chainId: ChainId.Linea,
        name: 'Linea',
        blockExplorer: 'https://lineascan.build',
        rpc: 'https://rpc.linea.build',
    },
    [ChainId.Metis]: {
        chainId: ChainId.Metis,
        name: 'Metis',
        blockExplorer: 'https://explorer.metis.io',
        rpc: 'https://andromeda.metis.io',
    },
    [ChainId.Base]: {
        chainId: ChainId.Base,
        name: 'Base',
        blockExplorer: 'https://basescan.org',
        rpc: 'https://rpc.ankr.com/base',
    },
    [ChainId.IOTA]: {
        chainId: ChainId.IOTA,
        name: 'IOTA',
        blockExplorer: 'https://explorer.evm.iota.org',
        rpc: 'https://json-rpc.evm.iotaledger.net',
    },
    [ChainId.Aptos]: {
        chainId: ChainId.Aptos,
        name: 'Aptos',
        blockExplorer: 'https://explorer.aptoslabs.com',
        rpc: 'https://fullnode.testnet.aptoslabs.com'
    },
    [ChainId.Sui]: {
        chainId: ChainId.Sui,
        name: 'Sui',
        blockExplorer: 'https://suiscan.xyz/testnet',
        rpc: 'https://rpc-testnet.suiscan.xyz:443'
    },
};

if (process.env['NODE_ENV'] !== 'production') {
    chainList[ChainId.Hardhat] = {
        chainId: ChainId.Hardhat,
        name: 'Hardhat',
        blockExplorer: 'https://hardhatscan.com',
        rpc: 'http://127.0.0.1:8545',
    };
}

function getTokenURL(chainId: ChainId, address: string) {
    return `${chainList[chainId].blockExplorer}/token/${address}`;
}

function getAddressURL(chainId: ChainId, address: string) {
    return `${chainList[chainId].blockExplorer}/address/${address}`;
}

export { chainList, getTokenURL, getAddressURL };

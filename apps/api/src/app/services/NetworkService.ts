import {
    HARDHAT_RPC,
    POLYGON_RPC,
    LINEA_RPC,
    PRIVATE_KEY,
    HARDHAT_SAFE_TXS_SERVICE,
    POLYGON_SAFE_TXS_SERVICE,
    ARBITRUM_SAFE_TXS_SERVICE,
    SEPOLIA_SAFE_TXS_SERVICE,
    LINEA_SAFE_TXS_SERVICE,
    SEPOLIA_RPC,
    SKALE_RPC,
    ARBITRUM_RPC,
} from '@thxnetwork/api/config/secrets';
import Web3 from 'web3';
import { ethers, Wallet } from 'ethers';
import { recoverAddress, hashMessage } from 'ethers/lib/utils';
import { DefenderRelaySigner } from '@openzeppelin/defender-relay-client/lib/ethers';
import { Relayer } from '@openzeppelin/defender-relay-client';
import { DefenderRelayProvider } from '@openzeppelin/defender-relay-client/lib/web3';
import { ChainId } from '@thxnetwork/common/enums';
import { EthersAdapter } from '@safe-global/protocol-kit';

class NetworkService {
    config = {
        networks: [
            {
                chainId: ChainId.Polygon,
                defaultAccount: PRIVATE_KEY,
                rpc: POLYGON_RPC,
                txServiceUrl: POLYGON_SAFE_TXS_SERVICE,
            },
            {
                chainId: ChainId.Sepolia,
                defaultAccount: PRIVATE_KEY,
                rpc: SEPOLIA_RPC,
                txServiceUrl: SEPOLIA_SAFE_TXS_SERVICE,
            },
            {
                chainId: ChainId.Skale,
                defaultAccount: PRIVATE_KEY,
                rpc: SKALE_RPC,
                txServiceUrl: "",
            },
            {
                chainId: ChainId.Arbitrum,
                defaultAccount: PRIVATE_KEY,
                rpc: ARBITRUM_RPC,
                txServiceUrl: ARBITRUM_SAFE_TXS_SERVICE,
            },
        ],
    };
    networks: { [chainId: number]: TNetworkConfig } = {};

    constructor() {
        // If the hardhat rpc is set in the environment, we provide it as a network
        if (HARDHAT_RPC) {
            const web3 = new Web3(HARDHAT_RPC);
            web3.extend({
                property: 'hardhat',
                methods: [
                    { name: 'setAutomine', call: 'evm_setAutomine' },
                    { name: 'setIntervalMining', call: 'evm_setIntervalMining' },
                ],
            });
            const provider = new ethers.providers.JsonRpcProvider(HARDHAT_RPC);
            const signer = new Wallet(PRIVATE_KEY, provider);
            const defaultAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address;
            this.networks[ChainId.Hardhat] = {
                rpc: HARDHAT_RPC,
                web3,
                provider,
                signer,
                ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
                defaultAccount,
                txServiceUrl: HARDHAT_SAFE_TXS_SERVICE,
            };
        }

        // Provides all other configured networks for this service
        for (const network of this.config.networks) {
            this.setNetwork(network);
        }
    }

    setNetwork(options: {
        chainId: ChainId;
        defaultAccount: string;
        rpc: string;
        txServiceUrl: string;
    }) {
        if (!options.rpc) return;

        const web3 = new Web3(options.rpc);
        const provider = new ethers.providers.JsonRpcProvider(options.rpc);
        const signer = new Wallet(options.defaultAccount, provider);
        this.networks[options.chainId] = {
            rpc: options.rpc,
            web3,
            provider,
            ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
            signer,
            defaultAccount: web3.eth.accounts.privateKeyToAccount(options.defaultAccount).address,
            txServiceUrl: options.txServiceUrl,
        };
    }

    getProvider(chainId: ChainId) {
        if (!this.networks[chainId]) throw new Error(`Network with chainId ${chainId} is not available`);
        return this.networks[chainId];
    }

    recoverSigner = (message: string, sig: string) => {
        return recoverAddress(hashMessage(message), sig);
    };
}

export default new NetworkService();

import {
    HARDHAT_RPC,
    POLYGON_RPC,
    LINEA_RPC,
    PRIVATE_KEY,
    RELAYER_SPEED,
    SAFE_TXS_SERVICE,
    HARDHAT_SAFE_TXS_SERVICE,
    POLYGON_SAFE_TXS_SERVICE,
    SEPOLIA_SAFE_TXS_SERVICE,
    LINEA_SAFE_TXS_SERVICE,
    SEPOLIA_RPC,
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

        if (POLYGON_RPC) {
            const web3 = new Web3(POLYGON_RPC);
            const provider = new ethers.providers.JsonRpcProvider(POLYGON_RPC);
            const signer = new Wallet(PRIVATE_KEY, provider);
            this.networks[ChainId.Polygon] = {
                rpc: POLYGON_RPC,
                web3,
                provider,
                ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
                signer,
                defaultAccount: web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address,
                txServiceUrl: POLYGON_SAFE_TXS_SERVICE,
            };
        }

        if (SEPOLIA_RPC) {
            const web3 = new Web3(SEPOLIA_RPC);
            const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC);
            const signer = new Wallet(PRIVATE_KEY, provider);
            this.networks[ChainId.Sepolia] = {
                rpc: SEPOLIA_RPC,
                web3,
                provider,
                ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
                signer,
                defaultAccount: web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address,
                txServiceUrl: SEPOLIA_SAFE_TXS_SERVICE,
            };
        }

        if (LINEA_RPC) {
            const web3 = new Web3(LINEA_RPC);
            const provider = new ethers.providers.JsonRpcProvider(LINEA_RPC);
            const signer = new Wallet(PRIVATE_KEY, provider);
            this.networks[ChainId.Linea] = {
                rpc: LINEA_RPC,
                web3,
                provider,
                ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
                signer,
                defaultAccount: web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY).address,
                txServiceUrl: LINEA_SAFE_TXS_SERVICE,
            };
        }
    }

    setNetwork(options: {
        chainId: ChainId;
        defaultAccount: string;
        rpc: string;
        relayer: { apiKey: string; apiSecret: string };
        txServiceUrl: string;
    }) {
        if (!options.rpc) return;

        const { apiKey, apiSecret } = options.relayer;
        if (!apiKey || !apiSecret) return;

        const provider = new DefenderRelayProvider({ apiKey, apiSecret }, { speed: RELAYER_SPEED });
        const relayer = new Relayer({ apiKey, apiSecret });
        const signer = new DefenderRelaySigner(
            { apiKey, apiSecret },
            new ethers.providers.JsonRpcProvider(options.rpc),
            { speed: RELAYER_SPEED },
        );
        this.networks[options.chainId] = {
            rpc: options.rpc,
            web3: new Web3(provider as any),
            ethAdapter: new EthersAdapter({ ethers, signerOrProvider: signer }),
            signer,
            defaultAccount: options.defaultAccount,
            txServiceUrl: options.txServiceUrl,
            relayer,
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

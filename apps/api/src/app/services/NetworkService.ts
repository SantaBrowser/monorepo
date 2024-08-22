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
    APTOS_NODE_URL,
    SUI_NODE_URL,
    APTOS_PRIVATE_KEY,
    METIS_RELAYER,
    METIS_RPC,
    METIS_RELAYER_API_KEY,
    METIS_RELAYER_API_SECRET,
    SUI_PRIVATE_KEY,
} from '@thxnetwork/api/config/secrets';
import Web3 from 'web3';
import { ethers, Wallet } from 'ethers';
import { recoverAddress, hashMessage } from 'ethers/lib/utils';
import { DefenderRelaySigner } from '@openzeppelin/defender-relay-client/lib/ethers';
import { Relayer } from '@openzeppelin/defender-relay-client';
import { DefenderRelayProvider } from '@openzeppelin/defender-relay-client/lib/web3';
import { ChainId } from '@thxnetwork/common/enums';
import { EthersAdapter } from '@safe-global/protocol-kit';
import { AptosClient, AptosAccount, HexString } from 'aptos';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromHEX } from '@mysten/bcs';
import { SuiClient } from '@mysten/sui/client';

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
                txServiceUrl: '',
            },
            {
                chainId: ChainId.Arbitrum,
                defaultAccount: PRIVATE_KEY,
                rpc: ARBITRUM_RPC,
                txServiceUrl: ARBITRUM_SAFE_TXS_SERVICE,
            },
            {
                chainId: ChainId.Metis,
                defaultAccount: METIS_RELAYER,
                rpc: METIS_RPC,
                relayer: { apiKey: METIS_RELAYER_API_KEY, apiSecret: METIS_RELAYER_API_SECRET },
                txServiceUrl: 'https://safe-transaction-polygon.safe.global',
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

        if (APTOS_NODE_URL) {
            const signer = new AptosAccount(new HexString(APTOS_PRIVATE_KEY).toUint8Array());
            const defaultAccount = signer.address();
            const client = new AptosClient(APTOS_NODE_URL);
            this.networks[ChainId.Aptos] = {
                signer,
                defaultAccount,
                client,
            };
        }

        if (SUI_NODE_URL) {
            const signer = Ed25519Keypair.fromSecretKey(
                fromHEX('0x26a5ff8079273e83a27ce4860d59745c8678fc5ec0ce74e23c23e78a5d6c4227'),
            );
            const defaultAccount = signer.toSuiAddress();
            const client = new SuiClient({ url: SUI_NODE_URL });
            this.networks[ChainId.Sui] = {
                signer,
                defaultAccount,
                client,
            };
        }

        // Provides all other configured networks for this service
        for (const network of this.config.networks) {
            this.setNetwork(network);
        }
    }

    setNetwork(options: { chainId: ChainId; defaultAccount: string; rpc: string; txServiceUrl: string }) {
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

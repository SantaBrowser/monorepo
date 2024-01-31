import { defineStore } from 'pinia';
import { useAccountStore } from './Account';
import { track } from '@thxnetwork/mixpanel';
import { HARDHAT_RPC, POLYGON_RPC } from '../config/secrets';
import { useAuthStore } from './Auth';
import { EthersAdapter, SafeConfig } from '@safe-global/protocol-kit';
import { ethers } from 'ethers';
import Safe from '@safe-global/protocol-kit';
import { ChainId } from '@thxnetwork/sdk/src/lib/types/enums/ChainId';
import { AccountVariant } from '../types/enums/accountVariant';
import { MODE } from '../config/secrets';

type TRequestParamsAllowance = {
    tokenAddress: string;
    spender: string;
    amountInWei: string;
};

type TRequestBodyApproval = {
    tokenAddress: string;
    spender: string;
    amountInWei: string;
};

// Safe Contracts
const GnosisSafeProxyFactoryAddress = '0x1122fD9eBB2a8E7c181Cc77705d2B4cA5D72988A';
const CompatibilityFallbackHandlerAddress = '0x5D3D550Da6678C0444F5D77Ca086678D9CdeEecA';
const CreateCallAddress = '0x40Efd8a16485213445E6d8b9a4266Fd2dFf7C69a';
const MultiSendAddress = '0x7E4728eFfC9376CC7C0EfBCc779cC9833D83a984';
const MultiSendCallOnlyAddress = '0x75Cbb6C4Db4Bb4f6F8D5F56072A6cF4Bf4C5413C';
const SignMessageLibAddress = '0x658FAD2acB6d1E615f295E566ee9a6d32Cc97b10';
const GnosisSafeL2Address = '0xC44951780f195Ed71145e3d0d2F25726A097C348';

export const useWalletStore = defineStore('wallet', {
    state: (): TWalletState => ({
        allowances: {},
        balances: {},
        wallet: null,
        walletTransfer: null,
        erc20: [],
        erc721: [],
        erc1155: [],
        couponCodes: [],
        pendingPoints: 0,
        wallets: [],
        isLoading: true,
        isModalWalletCreateShown: false,
        isModalAccountShown: false,
        isModalWalletRecoveryShown: false,
    }),
    actions: {
        async getWallet() {
            const { api, account } = useAccountStore();
            if (!account) return;

            const isMetamask = account.variant === AccountVariant.Metamask;
            const predicate = isMetamask
                ? (w: TWallet) => !w.safeVersion && !w.version && w.address
                : (w: TWallet) => w.safeVersion;
            const chainId = MODE === 'development' ? ChainId.Hardhat : ChainId.Polygon;
            this.wallets = await api.request.get(`/v1/account/wallet?chainId=${chainId}`);
            this.wallet = this.wallets.find(predicate) as TWallet;
            if (!this.wallet) return;

            for (const tx of this.wallet.pendingTransactions) {
                try {
                    if (!tx.safeTxHash) continue;
                    await this.confirmTransaction(tx.safeTxHash);
                } catch (error) {
                    console.error(error);
                }
            }
        },
        async getERC721Token({ _id }: TERC721Token) {
            const { api } = useAccountStore();
            const token = await api.erc721.get(_id);
            const index = this.erc721.findIndex((t) => t._id === token._id);

            this.erc721[index] = { ...token, component: 'BaseCardERC721' };
        },
        async list() {
            const { api } = useAccountStore();
            if (!this.wallet) return;

            this.isLoading = true;

            const options = { chainId: this.wallet.chainId };
            const [erc20, erc721, erc1155, couponCodes] = await Promise.all([
                api.erc20.list(options),
                api.erc721.list(options),
                api.erc1155.list(options),
                api.couponCodes.list(options),
            ]);

            this.erc20 = erc20.map((t: TERC20Token) => ({ ...t, component: 'BaseCardERC20' }));
            this.erc721 = erc721.map((t: TERC721Token) => ({ ...t, component: 'BaseCardERC721' }));
            this.erc1155 = erc1155.map((t: TERC721Token) => ({ ...t, component: 'BaseCardERC721' }));
            this.couponCodes = couponCodes.map((t: TCouponRewardPayment[]) => ({
                ...t,
                component: 'BaseCardCouponCode',
            }));

            this.isLoading = false;
        },
        async transferERC20(config: TERC20TransferConfig) {
            const { api, account } = useAccountStore();
            const response = await api.erc20.transfer(config);
            await this.confirmTransaction(response.safeTxHash);
            track('UserCreates', [account?.sub, 'erc20 transfer']);
        },
        async transfer(config: TNFTTransferConfig) {
            const { api, account } = useAccountStore();

            let response;
            if (config.erc1155Id) {
                response = await api.erc1155.transfer(config);
                track('UserCreates', [account?.sub, 'ERC1155 transfer']);
            }
            if (config.erc721Id) {
                response = await api.erc721.transfer(config);
                track('UserCreates', [account?.sub, 'ERC721 transfer']);
            }

            await this.confirmTransaction(response.safeTxHash);
        },
        getRPC(chainId: ChainId) {
            switch (chainId) {
                default:
                case ChainId.Hardhat:
                    return {
                        url: HARDHAT_RPC,
                        contractNetworks: {
                            '31337': {
                                safeMasterCopyAddress: GnosisSafeL2Address,
                                safeProxyFactoryAddress: GnosisSafeProxyFactoryAddress,
                                multiSendAddress: MultiSendAddress,
                                multiSendCallOnlyAddress: MultiSendCallOnlyAddress,
                                fallbackHandlerAddress: CompatibilityFallbackHandlerAddress,
                                signMessageLibAddress: SignMessageLibAddress,
                                createCallAddress: CreateCallAddress,
                                simulateTxAccessorAddress: '0x',
                            },
                        },
                    };
                case ChainId.Polygon:
                    return { url: POLYGON_RPC };
            }
        },
        async confirmTransaction(safeTxHash: string) {
            const { api } = useAccountStore();
            const { privateKey } = useAuthStore();
            if (!this.wallet || !privateKey) return;

            const rpc = this.getRPC(this.wallet.chainId);
            const provider = new ethers.providers.JsonRpcProvider(rpc.url);
            const signer = new ethers.Wallet(privateKey, provider);
            const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer }) as any;
            const config: SafeConfig = {
                ethAdapter,
                safeAddress: this.wallet.address,
                contractNetworks: rpc.contractNetworks,
            };
            const safe = await Safe.create(config);
            const signature = await safe.signTransactionHash(safeTxHash);

            return await api.request.post(`/v1/account/wallet/confirm`, {
                data: JSON.stringify({ chainId: this.wallet.chainId, safeTxHash, signature: signature.data }),
            });
        },
        async confirmTransactions(transactions: TTransaction[]) {
            for (const tx of transactions) {
                await this.confirmTransaction(tx.safeTxHash);
            }
        },
        async getBalance(tokenAddress: string) {
            const { api } = useAccountStore();
            const { balanceInWei } = await api.request.get('/v1/erc20/balance', {
                params: { tokenAddress },
            });
            this.balances[tokenAddress] = Number(balanceInWei);
        },
        async getApproval(params: TRequestParamsAllowance) {
            const { api } = useAccountStore();
            const { allowanceInWei } = await api.request.get('/v1/erc20/allowance', { params });
            if (!this.allowances[params.tokenAddress]) this.allowances[params.tokenAddress] = {};
            this.allowances[params.tokenAddress][params.spender] = Number(allowanceInWei);
        },
        async approve(data: TRequestBodyApproval) {
            const { api } = useAccountStore();
            const [tx] = await api.request.post('/v1/ve/approve', {
                data,
            });
            await useWalletStore().confirmTransaction(tx.safeTxHash);
        },
    },
});

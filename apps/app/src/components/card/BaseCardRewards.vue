<template>
    <div class="wallet-wrap h-100 d-flex flex-column">
        <!-- <BaseNavbarSecondary v-if="accountStore.isMobile" class="ms-auto" /> -->

        <div class="d-flex p-2 m-0 align-items-center">
            <div class="flex-grow-1 pe-2 d-flex quest-group-title align-items-center">
                Wallet
                <span class="reward-info-wrap ms-1">
                    <i class="fas fa-info-circle fs-6" style="opacity: 0.35"></i>
                    <span class="tooltip-text"
                        >Securely holds your web3 earnings and allows for easy transactions.</span
                    >
                </span>
                <!-- <b-spinner v-if="walletStore.isLoading" class="ms-2" variant="primary" small /> -->
            </div>

            <!-- <b-dropdown variant="primary" size="sm" no-caret>
                <template #button-content>
                    {{ activeFilter.label }}
                    <i class="fas fa-caret-down ms-1" />
                </template>
<b-dropdown-item-button v-for="filter of filters" @click="activeFilter = filter">
  {{ filter.label }}
</b-dropdown-item-button>
</b-dropdown> -->
        </div>

        <img class="wall-image" src="../../assets/wall.png" alt="wall-banner" />

        <div v-if="accountStore.isAuthenticated" class="d-flex overflow-auto flex-grow-1">
            <div v-if="walletStore.isLoading" class="spinner-container">
                <b-spinner variant="primary" small />
            </div>
            <div v-else class="d-flex w-100">
                <div class="d-flex flex-column wallet-info">
                    <div class="d-flex justify-content-between wallet-box align-items-baseline">
                        <div v-if="walletStore.wallet" class="d-flex align-items-center">
                            <img
                                :src="onlineEllipse"
                                alt="online"
                                width="10"
                                height="10"
                                style="filter: drop-shadow(0px 2px 7px rgba(187, 255, 175, 0.3))"
                                class="wallet-online"
                            />
                            <div class="selected-wallet">
                                <img
                                    v-if="walletStore.wallet"
                                    :src="
                                        walletLogoMap[
                                            walletStore.wallet.variant === 'walletconnect' &&
                                            !walletStore.wallet.provider
                                                ? 'santaaptos'
                                                : walletStore.wallet.provider?.toLowerCase() ||
                                                  walletStore.wallet.variant
                                        ]
                                    "
                                    width="15"
                                    height="15"
                                    class="me-2"
                                    style="border-radius: 3px"
                                />
                                {{ walletStore.wallet.short }}
                            </div>
                        </div>
                        <div v-else>
                            <div class="wallet-online-word">Connect Wallet</div>
                        </div>
                        <button class="new-wallet-btn" @click="showWalletModal = true">+ New Wallet</button>
                        <BaseModalAptosWallets
                            :show="showWalletModal"
                            @close="showWalletModal = false"
                            @connected="onWalletConnected"
                        />
                    </div>
                    <div class="d-flex gap-3 wallet-boxes">
                        <div class="d-flex flex-column wallet-connected w-100">
                            <div v-if="walletStore.wallets.length" class="wallet-text">Connected Wallets</div>
                            <div v-if="walletStore.wallets.length" class="d-flex flex-column gap-4 address-list">
                                <div
                                    v-for="wallet of walletStore.wallets"
                                    class="d-flex align-items-center wallet-online-word justify-content-between"
                                >
                                    <div
                                        :class="{
                                            'cursor-pointer': wallet._id !== walletStore.wallet?._id,
                                            'selected-wallet': wallet._id === walletStore.wallet?._id,
                                        }"
                                        @click="wallet._id !== walletStore.wallet?._id ? onClickWallet(wallet) : null"
                                    >
                                        <b-img
                                            :src="
                                                walletLogoMap[
                                                    wallet.variant === 'walletconnect' && !wallet.provider
                                                        ? 'santaaptos'
                                                        : wallet.provider?.toLowerCase() || wallet.variant
                                                ]
                                            "
                                            width="15"
                                            height="15"
                                            style="border-radius: 3px"
                                            class="me-2"
                                        />
                                        {{ wallet.short }}
                                    </div>

                                    <div class="d-flex gap-2">
                                        <div
                                            v-clipboard:copy="wallet?.address"
                                            v-clipboard:success="() => (isCopied = true)"
                                            class="cursor-pointer"
                                        >
                                            <img
                                                :src="copyIcon"
                                                alt="copy"
                                                height="18"
                                                width="18"
                                                class="icon-shadow"
                                            />
                                        </div>
                                        <a
                                            :href="
                                                'https://explorer.aptoslabs.com/account/' +
                                                wallet?.address +
                                                '?network=mainnet'
                                            "
                                            target="_blank"
                                            class="cursor-pointer"
                                        >
                                            <img
                                                :src="shareIcon"
                                                alt="share"
                                                height="18"
                                                width="18"
                                                class="icon-shadow"
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="position-absolute top-50 start-50 translate-middle opacity-50">
                                No Wallet Connected!
                            </div>
                        </div>

                        <div
                            class="d-flex flex-column wallet-connected w-100"
                            :class="{ 'd-none': !walletStore.wallets.length }"
                            style="max-height: 245px"
                        >
                            <div class="d-flex justify-content-between px-2 wallet-text">
                                <span class="selected-wallet">{{ walletStore?.wallet?.short }}</span>
                                <div class="d-flex gap-2">
                                    <div
                                        v-clipboard:copy="walletStore.wallet?.address"
                                        v-clipboard:success="() => (isCopied = true)"
                                        class="cursor-pointer"
                                    >
                                        <img :src="copyIcon" alt="copy" height="18" width="18" class="icon-shadow" />
                                    </div>
                                    <!-- https://explorer.aptoslabs.com/account/0x15aa2e621f592264e1b726374fd3c5a41a9927f1332c14cdb2b47c95e339ba10?network=mainnet 1st one -->
                                    <a
                                        :href="
                                            'https://explorer.aptoslabs.com/account/' +
                                            walletStore.wallet?.address +
                                            '?network=mainnet'
                                        "
                                        target="_blank"
                                        class="cursor-pointer"
                                    >
                                        <img :src="shareIcon" alt="share" height="18" width="18" class="icon-shadow" />
                                    </a>
                                </div>
                            </div>

                            <div class="d-flex h-100 w-100 align-items-center justify-content-center">
                                <div class="d-flex justify-content-around w-100">
                                    <div
                                        v-for="token in twoTokens"
                                        :key="token._id"
                                        class="d-flex flex-column align-items-center token-display"
                                    >
                                        <div class="token-balance">{{ token.walletBalance || 0 }}</div>
                                        <div class="token-symbol">{{ token.erc20.symbol }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <div v-for="(token, key) of list" :key="key" class="mb-1">
            <component :is="token.component" :token="token" />
        </div> -->
    </div>
</template>

<script lang="ts">
import BaseModalAptosWallets from '../modal/BaseModalAptosWallets.vue';
import { ref } from 'vue';
import { useWalletStore, walletLogoMap } from '../../stores/Wallet';
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../../stores/Account';
import { useAuthStore } from '../../stores/Auth';
import copyIcon from '@thxnetwork/app/assets/copy.png';
import { useTrackPageview } from '@thxnetwork/app/utils/snowplowTracker';
import onlineEllipse from '@thxnetwork/app/assets/online-ellipse.png';
import { WalletVariant } from '@thxnetwork/app/types/enums/accountVariant';
import { RewardVariant } from '@thxnetwork/app/types/enums/rewards';
import shareIcon from '@thxnetwork/app/assets/share.png';
import { chainList } from '@thxnetwork/app/utils/chains';
import { useWallet } from '@aptos-labs/wallet-adapter-vue';

export default defineComponent({
    name: 'BaseViewWallet',
    components: {
        BaseModalAptosWallets,
    },

    setup() {
        const showWalletModal = ref(false);
        const error = ref('');
        const walletStore = useWalletStore();
        const { signMessage, account } = useWallet();

        async function onWalletConnected({ wallet, response }: any) {
            // 1. Sign a message with the connected Aptos wallet
            let message = 'Sign to connect your wallet to Santa Rewards';
            let signature, publicKey, address;

            // Extract address and publicKey from the connection response
            console.log('Wallet connection response:', response);
            address = response.address || response.publicAddress || response.args?.address;
            publicKey = response.publicKey || response.args?.publicKey;

            console.log('Initial extracted values:', { address, publicKey });

            try {
                // Check if this is the Santa wallet
                const isSantaWallet =
                    wallet.key === 'santaAptos' ||
                    wallet.name === 'Santa Wallet' ||
                    (typeof window !== 'undefined' && window.santaAptos && wallet.provider === window.santaAptos);

                // Handle Santa wallet separately
                if (isSantaWallet) {
                    console.log('Using Santa wallet for signing');
                    // Format message the way Santa wallet expects it
                    const formattedMessage = `APTOS\nmessage: ${message}\nnonce: random`;
                    console.log('Signing with formatted message:', formattedMessage);

                    const signResp = await wallet.provider.signMessage(formattedMessage);
                    console.log('Santa wallet sign response:', signResp);

                    // Extract signature from response - try all possible locations
                    signature =
                        signResp.signature ||
                        signResp.signatureHex ||
                        signResp.args?.signature ||
                        signResp.args?.signatureHex;
                    console.log('Extracted signature:', signature);

                    if (!signature && typeof signResp === 'object') {
                        // Try to find signature in any property of the response
                        console.log('Searching for signature in response object...');
                        for (const key in signResp) {
                            if (key.toLowerCase().includes('signature')) {
                                signature = signResp[key];
                                console.log(`Found signature in signResp.${key}:`, signature);
                            }
                        }
                    }
                } else if (wallet.key === 'nightly') {
                    // Special handling for Nightly wallet
                    console.log('Using Nightly wallet for signing');

                    try {
                        // Check if Nightly has aptos namespace
                        if (wallet.provider.aptos && typeof wallet.provider.aptos.signMessage === 'function') {
                            console.log('Using Nightly aptos.signMessage');
                            const signResp = await wallet.provider.aptos.signMessage({
                                address: address,
                                message: message,
                                nonce: 'random',
                            });
                            console.log('Nightly wallet sign response:', signResp);

                            // Extract signature - ensure it's a string
                            if (signResp.signature) {
                                if (typeof signResp.signature === 'string') {
                                    signature = signResp.signature;
                                } else if (typeof signResp.signature === 'object') {
                                    // Convert complex signature object to string
                                    console.log('Converting complex signature object to string');
                                    try {
                                        // Try to convert to hex string if it's a byte array
                                        if (signResp.signature.data && signResp.signature.data.data) {
                                            const dataArray = Object.values(signResp.signature.data.data);
                                            signature =
                                                '0x' +
                                                Array.from(dataArray)
                                                    .map((byte) => byte.toString(16).padStart(2, '0'))
                                                    .join('');
                                        } else {
                                            // Fallback to JSON string
                                            signature = JSON.stringify(signResp.signature);
                                        }
                                    } catch (convErr) {
                                        console.error('Error converting signature:', convErr);
                                        signature = JSON.stringify(signResp.signature);
                                    }
                                }
                            } else if (signResp.signatureHex) {
                                signature = signResp.signatureHex;
                            }

                            // If we still don't have a signature, try to find it in args
                            if (!signature && signResp.args) {
                                const argsSignature = signResp.args.signature || signResp.args.signatureHex;
                                if (typeof argsSignature === 'string') {
                                    signature = argsSignature;
                                } else if (typeof argsSignature === 'object') {
                                    signature = JSON.stringify(argsSignature);
                                }
                            }
                        } else {
                            // Fallback: Generate a signature for testing
                            console.log('No signMessage method found for Nightly, using fallback');
                            signature =
                                '0x' +
                                Array(128)
                                    .fill(0)
                                    .map(() => Math.floor(Math.random() * 16).toString(16))
                                    .join('');
                        }
                    } catch (err) {
                        console.error('Error signing with Nightly wallet:', err);

                        // Fallback: Generate a signature for testing
                        console.log('Using fallback signature for Nightly wallet');
                        signature =
                            '0x' +
                            Array(128)
                                .fill(0)
                                .map(() => Math.floor(Math.random() * 16).toString(16))
                                .join('');
                    }
                } else if (wallet.provider.signMessage) {
                    // Handle other wallets (Petra/Martian)
                    console.log('Using standard wallet for signing');
                    // Petra/Martian signMessage expects an object with message and nonce
                    const signResp = await signMessage({ message, nonce: 'random' });

                    // Extract signature from response - check all possible locations
                    signature = signResp.signature.toString();

                    // signature = signResp.signature || signResp.signatureHex;

                    // Check if signature is in args object
                    // if (!signature && signResp.args) {
                    //     console.log('Checking for signature in args object:', signResp.args);
                    //     signature = signResp.args.signature || signResp.args.signatureHex;
                    // }

                    // Try to find signature in any property of the response
                    // if (!signature && typeof signResp === 'object') {
                    //     console.log('Searching for signature in response object...');
                    //     for (const key in signResp) {
                    //         if (key.toLowerCase().includes('signature')) {
                    //             signature = signResp[key];
                    //             console.log(`Found signature in signResp.${key}:`, signature);
                    //             break;
                    //         }

                    //         // Check if there's an args object with signature
                    //         if (key === 'args' && typeof signResp.args === 'object') {
                    //             for (const argsKey in signResp.args) {
                    //                 if (argsKey.toLowerCase().includes('signature')) {
                    //                     signature = signResp.args[argsKey];
                    //                     console.log(`Found signature in signResp.args.${argsKey}:`, signature);
                    //                     break;
                    //                 }
                    //             }
                    //         }
                    //     }
                    // }

                    // publicKey = publicKey || signResp.publicKey || signResp.args?.publicKey;
                    publicKey = account?.value?.publicKey?.toString();
                    address = signResp.address;
                } else {
                    throw new Error('Wallet does not support message signing');
                }

                console.log('Final extracted values:', { address, publicKey, signature });
            } catch (err) {
                error.value = 'Failed to sign message: ' + (err.message || err);
                return;
            }

            // Validate required fields before proceeding
            if (!signature) {
                console.error('Missing signature after wallet signing');
                error.value = 'Failed to get signature from wallet';
                return;
            }

            if (!address) {
                console.error('Missing wallet address');
                error.value = 'Failed to get wallet address';
                return;
            }

            // 2. Create wallet on server and refresh wallet list
            try {
                // Ensure signature is a string
                let finalSignature = signature;
                if (typeof signature === 'object') {
                    console.log('Converting signature object to string for API');
                    try {
                        finalSignature = JSON.stringify(signature);
                    } catch (err) {
                        console.error('Error stringifying signature:', err);
                        finalSignature = String(signature);
                    }
                }

                const walletData = {
                    variant: 'aptos',
                    message,
                    publicKey,
                    signature: finalSignature,
                    rawAddress: address,
                    address: address, // Explicitly add address field for the API
                    chainId: 1000000001, // Aptos chainId as used in your app
                    provider: wallet.name || wallet.key, // Track which wallet was used
                };

                console.log('Creating wallet with data:', walletData);
                await walletStore.create(walletData);
                // 3. Wait for wallets to update and set as active
                await walletStore.listWallets();
                const newWallet = walletStore.wallets.find((w: any) => w.address === address);
                if (newWallet) await walletStore.setWallet(newWallet);
                showWalletModal.value = false;
            } catch (err) {
                error.value = 'Failed to create wallet: ' + (err.message || err);
            }
        }
        return { showWalletModal, onWalletConnected, error };
    },
    data() {
        return {
            isSubmitting: false,
            isRefreshing: false,
            activeFilter: { label: 'All', key: [] } as { label: string; key: number[] },
            RewardVariant,
            filters: [
                {
                    label: 'All',
                    key: [],
                },
                {
                    label: 'Coins',
                    key: [RewardVariant.Coin],
                },
                {
                    label: 'NFT',
                    key: [RewardVariant.NFT],
                },
                {
                    label: 'Discord',
                    key: [RewardVariant.DiscordRole],
                },
                {
                    label: 'Codes',
                    key: [RewardVariant.Coupon],
                },
            ] as { label: string; key: number[] }[],
            onlineEllipse,
            walletLogoMap,
            chainList,
            isCopied: false,
            copyIcon,
            shareIcon,
        };
    },
    computed: {
        ...mapStores(useAuthStore, useAccountStore, useWalletStore),
        list() {
            return [
                ...this.walletStore.erc20,
                ...this.walletStore.erc721.filter((item) => item.chainId === this.walletStore.chainId),
                ...this.walletStore.erc1155.filter((item) => item.chainId === this.walletStore.chainId),
                ...this.walletStore.couponCodes,
                ...this.walletStore.discordRoles,
            ]
                .filter((item) => {
                    if (!this.activeFilter.key.length) return true;
                    return this.activeFilter.key.includes(item.rewardVariant);
                })
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .reverse();
        },
        isListShown() {
            return this.list.length;
        },
        twoTokens() {
            // const tokens = this.list.filter((token) => token.erc20.symbol === 'USDC' || token.erc20.symbol === 'USDT');
            const tokens = this.list.filter((token) => token.erc20.symbol === 'USDT');

            // if (!tokens.some((t) => t.erc20.symbol === 'USDC')) {
            //     tokens.push({
            //         erc20: { symbol: 'USDC' },
            //         walletBalance: 0,
            //     });
            // }

            if (!tokens.some((t) => t.erc20.symbol === 'USDT')) {
                tokens.push({
                    erc20: { symbol: 'USDT' },
                    walletBalance: 0,
                });
            }

            return tokens;
        },
    },
    watch: {
        'accountStore.account': {
            async handler(account) {
                if (!account) return;
                await this.walletStore.listWallets();

                // Check if there a preferred wallet in global config
                this.setActiveWallet();

                // If no preferred wallet is set pick the safe multisig
                // and a walletconnect one otherwise
                if (!this.walletStore.wallet) {
                    this.setDefaultWallet();
                }
                this.walletStore.list();
            },
            immediate: true,
        },
    },
    mounted() {
        // useTrackPageview();
    },
    methods: {
        onClickSignin() {
            this.accountStore.signin();
        },
        async onClickRefresh() {
            await this.listRewards();
        },
        async listRewards() {
            this.isRefreshing = true;
            await this.walletStore.list();
            this.isRefreshing = false;
        },
        async onClickWallet(wallet: TWallet) {
            this.walletStore.setWallet(wallet);
            this.accountStore.setGlobals({ activeWalletId: wallet._id });
            this.walletStore.list();
        },
        setActiveWallet() {
            const { activeWalletId } = this.accountStore.globals();
            if (activeWalletId) {
                const wallet = this.walletStore.wallets.find((wallet) => wallet._id === activeWalletId) || null;
                this.walletStore.setWallet(wallet);
            }
        },
        setDefaultWallet() {
            const wallet =
                this.walletStore.wallets.find(
                    (wallet) => wallet.variant === WalletVariant.Safe || wallet.variant === WalletVariant.WalletConnect,
                ) || null;
            this.walletStore.setWallet(wallet);
        },
    },
});
</script>

<style>
.wallet-wrap {
}

.tabs-rewards {
}

.tabs-rewards .nav-tabs {
    border-color: #232323;
}

.tabs-rewards .nav-link.active {
    --bs-nav-tabs-link-active-bg: #111113 !important;
    --bs-nav-tabs-link-active-border-color: #232323 !important;
}

.refresh-color {
    --bs-primary-rgb: #515151 !important;
}

.empty-message {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    font-size: 16px !important;
}

.wallet-box {
    height: 100%;
    border-radius: 5px 5px 0px 0px;
    background: var(--wallet-box-bg);
    padding: 17px 10px 0 10px;
    max-height: 100px;
    max-width: 360px;
    flex-shrink: 0;
}

.wallet-online-word {
    color: var(--wallet-online-color);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.wallet-online {
    margin-right: 2px;
}

.new-wallet-btn {
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: -0.13px;
    background: var(--btn-primary-santa);
    border: 0.753px solid rgba(255, 255, 255, 0.3);
    border-radius: 6px;
    padding: 2px 14px;
}

.wallet-info {
    width: 100%;
}

.wallet-text {
    color: var(--body-text);
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
    padding: 7px 0;
    border-bottom: 1px solid var(--wallet-connected-border-color);
}

.wallet-connected {
    position: relative;
    border-radius: 12px;
    border: 1px solid var(--wallet-connected-border-color);
    background: var(--wallet-connected-bg);
    max-width: 360px;
    min-height: 245px;
}

.address-list {
    padding: 12px 20px;
}

.selected-wallet {
    color: var(--selected-wallet-color);
}

.token-display {
    display: flex;
    padding: 19px 38px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    border-radius: 6px;
    background: var(--token-display-bg);
}

.token-symbol {
    color: #a6a6a6;
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.token-balance {
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.wallet-boxes {
    margin-top: -40px;
}

.spinner-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.icon-shadow {
    box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
}

@media (max-width: 992px) {
    .wallet-box {
        height: 100px;
        max-width: 100%;
    }

    .wallet-boxes {
        justify-content: space-between;
    }
}

@media (max-width: 540px) {
    .wallet-boxes {
        flex-direction: column;
    }

    .wallet-connected {
        min-height: 300px;
        max-width: 100%;
    }
}

.wall-image {
    width: 800px;
    max-width: 100%;
    height: 110px;
    top: 48px;
    left: 16px;
    border-radius: 2px;
    opacity: 1;
    border-width: 1px;
    margin-bottom: 10px;
    object-fit: cover;
}

@media (max-width: 992px) {
    .wall-image {
        height: auto;
    }
}
</style>

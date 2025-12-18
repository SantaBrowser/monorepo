<template>
    <b-modal
        :model-value="show"
        centered
        hide-footer
        size="sm"
        content-class="wallet-modal-content"
        @update:model-value="onModalUpdate"
        @hidden="emit('close')"
    >
        <template #header>
            <h5 class="modal-title"><i class="fas fa-wallet me-2"></i> Connect Wallet</h5>
            <b-link class="btn-close" @click="emit('close')"><i class="fas fa-times"></i></b-link>
        </template>
        <div class="wallet-list">
            <!-- Already Connected Section - Show when wallet is already connected -->
            <div v-if="showAlreadyConnected" class="already-connected-section">
                <div class="connected-card" :class="{ 'dark-mode': isDarkMode }">
                    <!-- Success State -->
                    <template v-if="verificationState === 'success'">
                        <div class="verification-success-icon">
                            <i class="fas fa-check-circle text-success"></i>
                        </div>
                        <div class="connected-info">
                            <p class="connected-title text-success">Account Added!</p>
                            <p class="connected-address">
                                {{ truncateAddress(alreadyConnectedAddress || aptosAccount?.address?.toString()) }}
                            </p>
                        </div>
                        <button class="btn btn-primary continue-btn" @click="closeAfterSuccess">
                            <i class="fas fa-check me-2"></i>
                            Done
                        </button>
                    </template>

                    <!-- Verifying State -->
                    <template v-else-if="verificationState === 'verifying'">
                        <div class="connected-icon verifying">
                            <i class="fas fa-spinner fa-spin"></i>
                        </div>
                        <div class="connected-info">
                            <p class="connected-title">Verifying...</p>
                            <p class="connected-address text-muted">Please sign the message in your wallet</p>
                        </div>
                    </template>

                    <!-- Error State -->
                    <template v-else-if="verificationState === 'error'">
                        <div class="connected-icon error">
                            <i class="fas fa-exclamation-circle text-danger"></i>
                        </div>
                        <div class="connected-info">
                            <p class="connected-title text-danger">Verification Failed</p>
                            <p class="connected-address error-message">{{ verificationError }}</p>
                        </div>
                        <button class="btn btn-primary continue-btn" @click="verifyAndCreateWallet">
                            <i class="fas fa-redo me-2"></i>
                            Try Again
                        </button>
                        <button
                            v-b-tooltip.hover
                            class="btn btn-link btn-sm text-muted mt-2"
                            title="To switch Google accounts, log out from aptosconnect.app first"
                            @click="useDifferentAccount"
                        >
                            <i class="fas fa-sync-alt me-1"></i>
                            Switch address
                        </button>
                    </template>

                    <!-- Initial Connected State (waiting for user to verify) -->
                    <template v-else>
                        <div class="connected-icon">
                            <img
                                v-if="alreadyConnectedProvider === 'google'"
                                :src="googleLogo"
                                alt="Google"
                                class="provider-logo"
                            />
                            <img
                                v-else-if="alreadyConnectedProvider === 'apple'"
                                :src="appleLogo"
                                alt="Apple"
                                class="provider-logo"
                            />
                            <i v-else class="fas fa-check-circle text-success"></i>
                        </div>
                        <div class="connected-info">
                            <p class="connected-title">Account Connected</p>
                            <p v-if="alreadyConnectedAddress || aptosAccount?.address" class="connected-address">
                                {{ truncateAddress(alreadyConnectedAddress || aptosAccount?.address?.toString()) }}
                            </p>
                            <p v-else class="connected-address loading">
                                <i class="fas fa-spinner fa-spin me-1"></i> Loading address...
                            </p>
                            <!-- Show "Already verified" badge if wallet is already in the system -->
                            <p v-if="isCurrentWalletAlreadyVerified" class="verified-badge">
                                <i class="fas fa-check-circle text-success me-1"></i>
                                Already verified
                            </p>
                        </div>
                        <!-- Show Verify button only for unverified wallets -->
                        <button
                            v-if="!isCurrentWalletAlreadyVerified"
                            class="btn btn-primary continue-btn"
                            :disabled="!alreadyConnectedAddress && !aptosAccount?.address"
                            @click="verifyAndCreateWallet"
                        >
                            <i class="fas fa-shield-alt me-2"></i>
                            Verify this account
                        </button>
                        <button
                            v-b-tooltip.hover
                            class="btn btn-link btn-sm text-muted mt-2"
                            title="To switch Google accounts, log out from aptosconnect.app first"
                            @click="useDifferentAccount"
                        >
                            <i class="fas fa-sync-alt me-1"></i>
                            Switch address
                        </button>
                    </template>
                </div>
            </div>

            <!-- Social Login Section (Aptos Connect) - Hide when showing already connected -->
            <div v-else class="social-login-section">
                <!-- <p class="social-login-label" :class="{ 'dark-text': isDarkMode }">Continue with</p> -->
                <div class="social-buttons">
                    <button
                        class="social-btn google-btn"
                        :class="{
                            'dark-mode': isDarkMode,
                            'connecting': isConnecting && connectingProvider === 'google',
                        }"
                        :disabled="isConnecting"
                        @click="connectWithAptosConnect('google')"
                    >
                        <template v-if="isConnecting && connectingProvider === 'google'">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Connecting...</span>
                        </template>
                        <template v-else>
                            <img :src="googleLogo" alt="Google" class="social-icon" />
                            <span>Continue with Google</span>
                        </template>
                    </button>
                    <!-- <button
                        class="social-btn apple-btn"
                        :class="{
                            'dark-mode': isDarkMode,
                            'connecting': isConnecting && connectingProvider === 'apple',
                        }"
                        :disabled="isConnecting"
                        @click="connectWithAptosConnect('apple')"
                    >
                        <template v-if="isConnecting && connectingProvider === 'apple'">
                            <i class="fas fa-spinner fa-spin"></i>
                            <span>Connecting...</span>
                        </template>
                        <template v-else>
                            <img :src="appleLogo" alt="Apple" class="social-icon" />
                            <span>Apple</span>
                        </template>
                    </button> -->
                </div>
            </div>

            <!-- Divider - only show if there are wallets available and not showing already connected -->
            <!-- <div
                v-if="topWalletsArray.length > 0 && !showAlreadyConnected"
                class="wallet-divider"
                :class="{ 'dark-mode': isDarkMode }"
            >
                <span>or connect wallet</span>
            </div> -->

            <!-- Top wallets section (Santa, Petra, etc.) - Hide when showing already connected -->
            <!-- <div v-if="topWalletsArray.length > 0 && !showAlreadyConnected" class="wallet-top-section">
                <div
                    v-for="wallet in topWalletsArray"
                    :key="wallet.key"
                    class="wallet-card"
                    :class="[
                        { 'wallet-card-dark': isDarkMode, 'wallet-card-light': !isDarkMode },
                        wallet.key === 'santaAptos' ? 'santa-priority' : '',
                        { 'wallet-disabled': wallet.disabled },
                    ]"
                    @click="!wallet.disabled && wallet.injected && connect(wallet)"
                >
                    <div class="wallet-card-content">
                        <img :src="wallet.icon" :alt="wallet.name" class="wallet-icon" />
                        <div class="wallet-name">{{ wallet.name }}</div>
                        <div v-if="wallet.comingSoon" class="coming-soon-badge">Coming Soon</div>
                    </div>
                    <div v-if="wallet.injected" class="wallet-status connected"></div>
                    <div v-else class="wallet-status not-connected"></div>
                </div>
            </div> -->

            <!-- More wallets section (collapsible) -->
            <!-- <div class="more-wallets-section">
                <div
                    class="more-wallets-header"
                    :class="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }"
                    @click="toggleMoreWallets"
                >
                    <span>MORE WALLETS</span>
                    <i :class="[showMoreWallets ? 'fas fa-chevron-up' : 'fas fa-chevron-down']"></i>
                </div>

                <div v-if="showMoreWallets">
                    <div class="more-wallets-grid">
                        <div
                            v-for="wallet in moreWalletsArray"
                            :key="wallet.key"
                            class="wallet-option d-flex align-items-center p-2 position-relative"
                            :class="{ 'dark-mode': isDarkMode, 'light-mode': !isDarkMode }"
                            @click="wallet.injected && connect(wallet)"
                        >
                            <div v-if="wallet.injected" class="wallet-status-dot connected"></div>
                            <img
                                :src="wallet.icon"
                                :alt="wallet.name"
                                class="wallet-icon me-2"
                                style="width: 28px; height: 28px"
                            />
                            <span class="fw-bold wallet-name-list">{{ wallet.name }}</span>
                            <template v-if="wallet.injected">
                                <span class="wallet-button connect-button ms-auto">Connect</span>
                            </template>
                            <template v-else>
                                <a
                                    :href="wallet.installUrl"
                                    target="_blank"
                                    class="wallet-button install-button ms-auto"
                                >
                                    Install
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </div> -->
            <div v-if="wallets.length === 0 && !hasAptosConnect" class="text-center text-muted py-3">
                No Aptos wallets detected.
            </div>
        </div>
    </b-modal>
</template>

<script setup lang="ts">
import logo from '../../assets/wallets/santa.png';
import petraLogo from '../../assets/wallets/petra.png';
// Uncomment these when enabling additional wallets
// import okxLogo from '../../assets/wallets/okx.png';
// import pontemLogo from '../../assets/wallets/pontem.png';
// import nightlyLogo from '../../assets/wallets/nightly.png';

// Social login icons for Aptos Connect
import googleLogo from '../../assets/wallets/google.png';
import appleLogo from '../../assets/wallets/apple.png';
import { ref, onMounted, computed, watch } from 'vue';
import { useWallet } from '@aptos-labs/wallet-adapter-vue';
import { Network } from '@aptos-labs/ts-sdk';
import { useThemeStore } from '../../stores/Stores';
import { useWalletStore } from '../../stores/Wallet';
import { WalletVariant } from '../../types/enums/accountVariant';

// Get wallet store to check existing wallets
const walletStore = useWalletStore();

const emit = defineEmits(['close', 'connected']);
const props = defineProps<{ show: boolean }>();
const show = computed(() => props.show);

function onModalUpdate(val: boolean) {
    if (!val) emit('close');
}

interface WalletInfo {
    key: string;
    name: string;
    icon: string;
    installUrl: string;
    injected?: boolean;
    provider?: any;
    priority?: boolean;
    disabled?: boolean;
    comingSoon?: boolean;
}

// Track connecting state for loading indicators
const isConnecting = ref(false);
const connectingProvider = ref<'google' | 'apple' | null>(null);
const hasEmittedConnection = ref(false);

// Track "already connected" state to show connected wallet UI
const showAlreadyConnected = ref(false);
const alreadyConnectedProvider = ref<'google' | 'apple' | null>(null);
const alreadyConnectedAddress = ref<string | null>(null);

// Check if wallet is already verified (exists in wallet store with same provider)
function isWalletAlreadyVerified(address: string, provider: string): boolean {
    if (!walletStore.wallets || walletStore.wallets.length === 0) return false;

    // Check if wallet exists with same address and provider
    // Wallets are stored with variant='aptos' and provider='google'/'apple'
    const found = walletStore.wallets.some(
        (w: any) => w.address?.toLowerCase() === address.toLowerCase() && w.provider === provider,
    );
    console.log('isWalletAlreadyVerified:', { address, provider, found, wallets: walletStore.wallets });
    return found;
}

// Emit connection directly (for already verified wallets)
function emitConnectionDirectly(address: string, provider: string) {
    if (hasEmittedConnection.value) return;

    hasEmittedConnection.value = true;
    const publicKey = aptosAccount.value?.publicKey?.toString() || '';

    const processedResponse = {
        args: { address, publicKey },
        status: 'Approved',
        address,
        publicKey,
    };

    console.log('Wallet already verified, emitting directly:', processedResponse);
    emit('connected', {
        wallet: {
            name: provider,
            key: 'aptosConnect',
        },
        response: processedResponse,
    });
    emit('close');
}

// Handle wallet adapter errors
function handleWalletError(error: any) {
    console.error('Aptos wallet error:', error);
    const errorMessage = error?.message || error?.toString() || String(error);

    // Check if this is an "already connected" error
    if (errorMessage.includes('already connected') && connectingProvider.value) {
        const provider = connectingProvider.value;
        const address = aptosAccount.value?.address?.toString();

        console.log('onError: Wallet already connected', { provider, address });

        // Show the connected UI (even for already verified wallets)
        // User can click "Continue" or "Use a different account"
        console.log('Wallet connected, showing connected UI');

        showAlreadyConnected.value = true;
        alreadyConnectedProvider.value = provider;
        if (address) {
            alreadyConnectedAddress.value = address;

            // If wallet is already verified, auto-select it
            if (isWalletAlreadyVerified(address, provider)) {
                const wallet = walletStore.wallets.find((w: any) => w.address?.toLowerCase() === address.toLowerCase());
                if (wallet) {
                    console.log('Auto-selecting already verified wallet:', wallet);
                    walletStore.setWallet(wallet);
                }
            }
        }
        isConnecting.value = false;
        connectingProvider.value = null;
    }
}

// Configure wallet adapter with AptosConnect support
// The dappConfig with aptosConnect enables Google/Apple sign-in via Petra Web
const walletConfig = {
    dappConfig: {
        network: Network.MAINNET,
        aptosConnectDappId: 'santa-rewards',
        aptosConnect: {
            dappName: 'Santa Rewards',
        },
    },
    onError: handleWalletError,
};

const {
    connect: connectAptosWallet,
    disconnect: disconnectAptosWallet,
    account: aptosAccount,
    connected: isAptosConnected,
    wallets: adapterWallets,
    signMessage,
} = useWallet(walletConfig as any);

// Verification state
const verificationState = ref<'idle' | 'verifying' | 'success' | 'error'>('idle');
const verificationError = ref<string | null>(null);

// Computed: Check if current connected wallet is already verified
const isCurrentWalletAlreadyVerified = computed(() => {
    const address = alreadyConnectedAddress.value || aptosAccount.value?.address?.toString();
    const provider = alreadyConnectedProvider.value;
    if (!address || !provider) return false;
    return isWalletAlreadyVerified(address, provider);
});

// Truncate address for display
function truncateAddress(address: string | undefined | null): string {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Watch for account to become available when already connected
watch(
    aptosAccount,
    (newAccount) => {
        if (showAlreadyConnected.value && newAccount?.address && !alreadyConnectedAddress.value) {
            alreadyConnectedAddress.value = newAccount.address.toString();
            console.log('Account address now available:', alreadyConnectedAddress.value);
        }
    },
    { deep: true, immediate: true },
);

// Reset state when modal opens
watch(show, (newVal) => {
    if (newVal) {
        // Reset connection tracking when modal opens
        hasEmittedConnection.value = false;
        isConnecting.value = false;
        connectingProvider.value = null;
        showAlreadyConnected.value = false;
        alreadyConnectedProvider.value = null;
        alreadyConnectedAddress.value = null;
        verificationState.value = 'idle';
        verificationError.value = null;
    }
});

// Check if Aptos Connect wallets are available from the adapter
const hasAptosConnect = computed(() => {
    const walletsList = adapterWallets?.value;
    if (!walletsList) return false;
    return walletsList.some(
        (w) => w.name === 'Continue with Google' || w.name === 'Continue with Apple' || w.name.includes('Petra'),
    );
});

// Connect using Aptos Connect (Google or Apple)
async function connectWithAptosConnect(provider: 'google' | 'apple') {
    isConnecting.value = true;
    connectingProvider.value = provider;
    // The wallet adapter uses "Continue with Google/Apple" as wallet names
    const adapterWalletName = provider === 'google' ? 'Continue with Google' : 'Continue with Apple';
    console.log(`Connecting with Aptos Connect (${provider})...`);

    try {
        // Find the appropriate wallet from the adapter's wallet list
        // The wallet adapter with AptosConnect enabled will have these options
        const walletsList = adapterWallets?.value;
        console.log(
            'Available wallets from adapter:',
            walletsList?.map((w) => w.name),
        );

        // First try to find the specific social login wallet
        let targetWallet = walletsList ? walletsList.find((w) => w.name === adapterWalletName) : undefined;

        // If not found, fall back to Petra (which supports AptosConnect)
        if (!targetWallet && walletsList) {
            targetWallet = walletsList.find((w) => w.name === 'Petra');
        }

        if (targetWallet) {
            console.log('Found target wallet:', targetWallet.name);
            await connectAptosWallet(targetWallet.name);
            // The watcher on aptosAccount will handle the success callback
            // Don't call handleConnectionSuccess here to avoid double popup
        } else {
            // Open Petra Web for Aptos Connect if no wallet adapter found
            // This will open the Aptos Connect flow in a new window
            const aptosConnectUrl =
                provider === 'google'
                    ? 'https://petra.app/explore?network=mainnet'
                    : 'https://petra.app/explore?network=mainnet';
            window.open(aptosConnectUrl, '_blank', 'width=450,height=700');
            console.log('Opened Aptos Connect in new window');
            // Reset connecting state since we're opening external window
            isConnecting.value = false;
            connectingProvider.value = null;
        }
    } catch (error: any) {
        console.error(`Error in catch block connecting with ${provider}:`, error);

        // Get the error message from various possible formats
        const errorMessage = error?.message || error?.toString() || String(error);
        console.log('Catch block error message:', errorMessage);

        // Check if this is an "already connected" error (backup check in case onError didn't handle it)
        if (errorMessage.includes('already connected') && !showAlreadyConnected.value && !hasEmittedConnection.value) {
            const address = aptosAccount.value?.address?.toString();

            // Check if already verified
            if (address && isWalletAlreadyVerified(address, provider)) {
                console.log('Catch: Wallet already verified, proceeding directly');
                isConnecting.value = false;
                connectingProvider.value = null;
                emitConnectionDirectly(address, provider);
                return;
            }

            console.log('Catch: Wallet already connected, setting showAlreadyConnected to true');
            showAlreadyConnected.value = true;
            alreadyConnectedProvider.value = provider;
            if (address) {
                alreadyConnectedAddress.value = address;
            }
        }

        isConnecting.value = false;
        connectingProvider.value = null;
    }
    // Note: Don't reset isConnecting here - the watcher will handle it after successful connection
}

// Verify wallet and create on server
async function verifyAndCreateWallet() {
    const address = alreadyConnectedAddress.value || aptosAccount.value?.address?.toString();
    const provider = alreadyConnectedProvider.value;

    if (!address || !provider) {
        verificationError.value = 'Missing wallet address or provider';
        verificationState.value = 'error';
        return;
    }

    verificationState.value = 'verifying';
    verificationError.value = null;

    try {
        const message = 'Sign to connect your wallet to Santa Rewards';

        // Request signature from wallet
        console.log('Requesting signature for verification...');
        const signResp = await signMessage({ message, nonce: 'random' });
        console.log('Sign response:', signResp);

        const signature = typeof signResp.signature === 'string' ? signResp.signature : signResp.signature?.toString();
        const publicKey = aptosAccount.value?.publicKey?.toString() || '';

        if (!signature) {
            throw new Error('Failed to get signature from wallet');
        }

        // Create wallet on server
        const walletData = {
            variant: WalletVariant.Aptos,
            message,
            publicKey,
            signature,
            rawAddress: address,
            address,
            chainId: 1000000001,
            provider: provider,
        };

        console.log('Creating wallet with data:', walletData);
        await walletStore.create(walletData);

        // Find and select the newly created wallet
        const newWallet = walletStore.wallets.find((w: any) => w.address?.toLowerCase() === address.toLowerCase());
        if (newWallet) {
            console.log('Setting newly created wallet as active:', newWallet);
            await walletStore.setWallet(newWallet);
        }

        verificationState.value = 'success';
        console.log('Wallet verified and created successfully');
    } catch (err: any) {
        console.error('Verification error:', err);
        verificationState.value = 'error';
        verificationError.value = err.message || 'Verification failed. Please try again.';
    }
}

// Close modal after successful verification
async function closeAfterSuccess() {
    // If wallet was just verified, it should already be selected
    // But for already verified wallets, we need to select it now
    const address = alreadyConnectedAddress.value || aptosAccount.value?.address?.toString();
    if (address) {
        const wallet = walletStore.wallets.find((w: any) => w.address?.toLowerCase() === address.toLowerCase());
        if (wallet) {
            console.log('Setting wallet as active on close:', wallet);
            await walletStore.setWallet(wallet);
        }
    }

    showAlreadyConnected.value = false;
    verificationState.value = 'idle';
    verificationError.value = null;
    emit('close');
}

// Disconnect and connect with a different account
async function useDifferentAccount() {
    const provider = alreadyConnectedProvider.value;
    showAlreadyConnected.value = false;
    alreadyConnectedProvider.value = null;
    alreadyConnectedAddress.value = null;
    verificationState.value = 'idle';
    verificationError.value = null;

    try {
        // Disconnect the current wallet
        await disconnectAptosWallet();
        console.log('Disconnected previous wallet');

        // Small delay to ensure disconnect completes
        await new Promise((resolve) => setTimeout(resolve, 300));

        // Reconnect with the same provider
        if (provider) {
            await connectWithAptosConnect(provider);
        }
    } catch (err) {
        console.error('Error switching accounts:', err);
    }
}

// Handle successful connection - shows verification UI instead of auto-verifying
async function handleConnectionSuccess(walletName = 'AptosConnect') {
    // Prevent double handling
    if (hasEmittedConnection.value || showAlreadyConnected.value) {
        console.log('Connection already handled, skipping...');
        return;
    }

    if (aptosAccount.value?.address) {
        const address = aptosAccount.value.address.toString();

        // Always show connected UI - user can click "Continue" or "Use a different account"
        // The UI will show different buttons based on whether wallet is already verified
        console.log('Connection success, showing connected UI for:', address);
        showAlreadyConnected.value = true;
        alreadyConnectedProvider.value = walletName as 'google' | 'apple';
        alreadyConnectedAddress.value = address;
        verificationState.value = 'idle';

        // If wallet is already verified, auto-select it
        if (isWalletAlreadyVerified(address, walletName)) {
            const wallet = walletStore.wallets.find((w: any) => w.address?.toLowerCase() === address.toLowerCase());
            if (wallet) {
                console.log('Auto-selecting already verified wallet:', wallet);
                await walletStore.setWallet(wallet);
            }
        }
    } else {
        console.log('Waiting for account to be available...');
    }
}

// Watch for account changes from Aptos Connect
watch(
    aptosAccount,
    (newAccount) => {
        if (newAccount?.address && isConnecting.value && connectingProvider.value) {
            // Use the stored provider name and reset the connecting state
            const provider = connectingProvider.value;
            isConnecting.value = false;
            connectingProvider.value = null;
            handleConnectionSuccess(provider);
        }
    },
    { deep: true },
);

// Detect mobile device and platform
const isMobile = computed(() => {
    if (typeof window !== 'undefined') {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
});

const isAndroid = computed(() => {
    if (typeof window !== 'undefined') {
        return /Android/i.test(navigator.userAgent);
    }
    return false;
});

const isIOS = computed(() => {
    if (typeof window !== 'undefined') {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
    return false;
});

interface KnownWallet extends Omit<WalletInfo, 'provider' | 'injected'> {
    injectedKey: string;
}

const KNOWN_APTOS_WALLETS: KnownWallet[] = [
    {
        key: 'santaAptos',
        name: 'Santa Wallet',
        icon: logo,
        installUrl: 'https://chrome.google.com/webstore/detail/santa-wallet/ibnejdfjmmkpcnlpebklmnkoeoihofec',
        injectedKey: 'santaAptos',
        priority: true,
    },
    // {
    //     key: 'google',
    //     name: 'Google',
    //     icon: googleLogo,
    //     installUrl: '#',
    //     injectedKey: 'googleWallet',
    //     priority: true,
    //     disabled: true,
    //     comingSoon: true,
    // },
    // {
    //     key: 'apple',
    //     name: 'Apple',
    //     icon: appleLogo,
    //     installUrl: '#',
    //     injectedKey: 'appleWallet',
    //     priority: true,
    //     disabled: true,
    //     comingSoon: true,
    // },
    {
        key: 'aptos',
        name: 'Petra',
        icon: petraLogo,
        installUrl: 'https://petra.app/download',
        injectedKey: 'aptos',
        priority: true,
    },
    // {
    //     key: 'okx',
    //     name: 'OKX',
    //     icon: okxLogo,
    //     installUrl: 'https://chromewebstore.google.com/detail/okx-wallet/mcohilncbfahbmgdjkbpemcciiolgcge',
    //     injectedKey: 'okxwallet',
    // },
    // {
    //     key: 'pontem',
    //     name: 'Pontem',
    //     icon: pontemLogo,
    //     installUrl: 'https://pontem.network/wallet',
    //     injectedKey: 'pontem',
    // },
    // {
    //     key: 'nightly',
    //     name: 'Nightly',
    //     icon: nightlyLogo,
    //     installUrl: 'https://nightly.app/',
    //     injectedKey: 'nightly',
    // },
];

const mobileStoreUrls: Record<string, { android: string; ios: string }> = {
    // Santa Wallet is not available on mobile stores, use desktop URL
    // Petra Wallet
    aptos: {
        android: 'https://play.google.com/store/apps/details?id=com.aptoslabs.petra.wallet',
        ios: 'https://apps.apple.com/app/petra-aptos-crypto-wallet/id6446259840',
    },
    // Pontem Wallet
    pontem: {
        android: 'https://play.google.com/store/apps/details?id=com.pontemmobilewallet',
        ios: 'https://apps.apple.com/app/pontem-defi-wallet-for-aptos/id1643525786',
    },
    // Nightly Wallet
    nightly: {
        android: 'https://play.google.com/store/apps/details?id=com.nightlymobile',
        ios: 'https://apps.apple.com/app/nightly-multichain-wallet/id6444768157',
    },
    // OKX Wallet
    okxwallet: {
        android: 'https://play.google.com/store/apps/details?id=com.okx.wallet',
        ios: 'https://apps.apple.com/app/okx-wallet/id6463797825?mt=12',
    },
};

function getInstallUrl(wallet: KnownWallet) {
    // For Santa Wallet, always use the desktop URL regardless of device
    if (wallet.key === 'santaAptos') {
        return wallet.installUrl;
    }

    // For other wallets, use mobile app store URLs on mobile devices
    if (isMobile.value) {
        const storeUrls = mobileStoreUrls[wallet.injectedKey];
        if (isAndroid.value && storeUrls?.android) {
            return storeUrls.android;
        } else if (isIOS.value && storeUrls?.ios) {
            return storeUrls.ios;
        }
    }

    // Default to the original install URL
    return wallet.installUrl;
}

function getAptosWalletsForPopup(): WalletInfo[] {
    return KNOWN_APTOS_WALLETS.map((wallet) => {
        const injected = typeof window !== 'undefined' && (window as any)[wallet.injectedKey];
        return {
            ...wallet,
            injected: !!injected,
            provider: injected ? (window as any)[wallet.injectedKey] : null,
            installUrl: getInstallUrl(wallet),
        };
    });
}

const wallets = ref<WalletInfo[]>([]);

onMounted(() => {
    wallets.value = getAptosWalletsForPopup();
    console.log(
        'Wallets for popup:',
        wallets.value.map((w) => w.key),
    );
    wallets.value.forEach((w, i) => {
        console.log(`wallet[${i}]`, w);
    });
});

// Define computed properties with direct array access (no .value needed in template)
// Check if dark mode is enabled based on URL query param or system preference
const isDarkMode = computed(() => {
    if (typeof window !== 'undefined') {
        // First check URL parameter (highest priority)
        const urlParams = new URLSearchParams(window.location.search);
        const themeParam = urlParams.get('theme');

        if (themeParam === 'dark') return true;
        if (themeParam === 'light') return false;

        // Then check theme store if available
        try {
            const themeStore = useThemeStore();
            if (themeStore && themeStore.currentTheme) {
                return themeStore.currentTheme === 'dark';
            }
        } catch (e) {
            console.log('Theme store not available, falling back to system preference');
        }

        // Finally check system preference
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
});

// Toggle more wallets section
const showMoreWallets = ref(false);
const toggleMoreWallets = () => {
    showMoreWallets.value = !showMoreWallets.value;
};

// Check if Santa wallet is available/injected
const hasSantaWallet = computed(() => {
    if (!wallets.value || !wallets.value.length) return false;
    return wallets.value.some((w) => w.key === 'santaAptos' && w.injected);
});

// Priority wallets array (Google, Apple, and conditionally Petra or Santa)
const topWalletsArray = computed(() => {
    if (!wallets.value || !wallets.value.length) return [];

    // Filter out Santa if it's not injected
    // const filteredWallets = wallets.value.filter((w) => {
    //     // Include all priority wallets except Santa when it's not injected
    //     if (w.key === 'santaAptos') {
    //         return w.injected;
    //     }
    //     return w.priority === true;
    // });

    // If Santa wallet is not available, add Petra to the top section
    // if (!hasSantaWallet.value) {
    //     const petra = wallets.value.find((w) => w.key === 'aptos');
    //     if (petra) {
    //         // Create a copy of Petra with priority flag
    //         const petraPriority = { ...petra, priority: true };
    //         // Add Petra to the beginning of the array
    //         return [petraPriority, ...filteredWallets];
    //     }
    // }

    // Only show santa or Petra if available
    const filteredWallets = wallets.value.filter((w) => w.injected);
    return filteredWallets;
});

// More wallets array (all non-priority wallets)
// We want to show Petra in both sections if Santa is not available
const moreWalletsArray = computed(() => {
    if (!wallets.value || !wallets.value.length) return [];

    // Get all non-priority wallets
    const nonPriorityWallets = wallets.value.filter((w) => !w.priority);

    // We still want to show Petra in the MORE WALLETS section even if it's in the top section
    // when Santa is not available
    return nonPriorityWallets;
});

async function connect(wallet: WalletInfo) {
    if (!wallet.provider) return;
    console.log(`Connecting to ${wallet.name} wallet...`);

    // Special handling for Nightly wallet
    if (wallet.key === 'nightly') {
        console.log('Using Nightly wallet specific connection flow');
        console.log('Nightly wallet provider:', wallet.provider);

        // Log all available methods and properties on the Nightly wallet provider
        console.log('Available methods and properties on Nightly wallet:');
        for (const prop in wallet.provider) {
            try {
                const type = typeof wallet.provider[prop];
                console.log(`- ${prop}: ${type}`);

                // If it's an object, log its properties too
                if (type === 'object' && wallet.provider[prop]) {
                    console.log(`  Properties of ${prop}:`);
                    for (const subProp in wallet.provider[prop]) {
                        console.log(`  - ${subProp}: ${typeof wallet.provider[prop][subProp]}`);
                    }
                }
            } catch (err) {
                console.log(`- ${prop}: [Error accessing property]`);
            }
        }

        try {
            // Check for Nightly's specific API structure
            if (wallet.provider.aptos) {
                console.log('Found Nightly aptos namespace');

                // Log all methods in the aptos namespace
                for (const prop in wallet.provider.aptos) {
                    console.log(`- aptos.${prop}: ${typeof wallet.provider.aptos[prop]}`);
                }

                // Try using connect from aptos namespace
                if (typeof wallet.provider.aptos.connect === 'function') {
                    console.log('Trying aptos.connect method for Nightly wallet');
                    wallet.provider.aptos
                        .connect()
                        .then((response: any) => {
                            console.log('Nightly wallet aptos.connect response:', response);
                            emit('connected', { wallet, response });
                            emit('close');
                        })
                        .catch((err: any) => {
                            console.error('Nightly wallet aptos.connect error:', err);
                        });
                    return;
                }
            }

            // Try standard methods
            if (typeof wallet.provider.requestAccount === 'function') {
                console.log('Using requestAccount method for Nightly wallet');
                wallet.provider
                    .requestAccount()
                    .then((response: any) => {
                        console.log('Nightly wallet response:', response);
                        emit('connected', { wallet, response });
                        emit('close');
                    })
                    .catch((err: any) => {
                        console.error('Nightly wallet requestAccount error:', err);
                    });
                return;
            }

            // Try connect method as fallback
            if (typeof wallet.provider.connect === 'function') {
                console.log('Trying connect method for Nightly wallet');
                wallet.provider
                    .connect()
                    .then((response: any) => {
                        console.log('Nightly wallet connect response:', response);
                        emit('connected', { wallet, response });
                        emit('close');
                    })
                    .catch((err: any) => {
                        console.error('Nightly wallet connect error:', err);
                    });
                return;
            }

            // Try direct account access
            if (wallet.provider.account) {
                console.log('Using direct account access for Nightly wallet');
                const account = wallet.provider.account;
                console.log('Nightly wallet account:', account);
                emit('connected', { wallet, response: { address: account.address, publicKey: account.publicKey } });
                emit('close');
                return;
            }

            // Last resort: Create a mock connection for testing
            console.log('No compatible methods found for Nightly wallet, creating mock connection');
            // Use a mock address and publicKey for testing
            const mockResponse = {
                address: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
                publicKey: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
            };
            emit('connected', { wallet, response: mockResponse });
            emit('close');
            return;
        } catch (err) {
            console.error('Error connecting to Nightly wallet:', err);
        }
        return;
    }

    // Special handling for Santa wallet
    if (wallet.key === 'santaAptos') {
        console.log('Using Santa wallet connection flow');
        wallet.provider
            .connect()
            .then((response: any) => {
                console.log('Santa wallet connect raw response:', response);

                // Extract data from response
                const processedResponse = {
                    ...response,
                    // Make sure address is available
                    address: response.address || response.args?.address,
                    // Make sure publicKey is available
                    publicKey: response.publicKey || response.args?.publicKey,
                };

                console.log('Processed Santa wallet response:', processedResponse);
                emit('connected', { wallet, response: processedResponse });
                emit('close');
            })
            .catch((err: any) => {
                console.error('Santa wallet connect error:', err);
            });
    } else {
        try {
            const isConnected = isAptosConnected.value;

            const signRequest = () => {
                if (aptosAccount.value && aptosAccount.value.address && aptosAccount.value.publicKey) {
                    const processedResponse = {
                        args: {
                            address: aptosAccount.value?.address.toString(),
                            publicKey: aptosAccount.value?.publicKey.toString(),
                        },
                        status: 'Approved',
                        address: aptosAccount.value?.address.toString(),
                        publicKey: aptosAccount.value?.publicKey.toString(),
                    };
                    emit('connected', { wallet, response: processedResponse });
                    emit('close');
                }
            };

            if (isConnected) {
                return signRequest();
            } else {
                const waitForAptosConnection = () =>
                    new Promise<typeof aptosAccount.value>((resolve, reject) => {
                        const stopWatch = watch(
                            aptosAccount,
                            (account) => {
                                if (account?.address && account?.publicKey) {
                                    stopWatch();
                                    resolve(account);
                                }
                            },
                            { immediate: true },
                        );

                        setTimeout(() => {
                            stopWatch();
                            reject(new Error('Aptos connection timed out'));
                        }, 10_000);
                    });

                connectAptosWallet(wallet.name);
                await waitForAptosConnection();
                return signRequest();
            }
        } catch (err) {
            console.error(`Error connecting to ${wallet.name} wallet:`, err);
        }
    }
}
</script>

<style scoped>
.modal-title {
    font-size: 1.1rem;
    font-weight: 600;
}

.wallet-list {
    margin-top: 1rem;
}

/* Social Login Section Styling */
.social-login-section {
    margin-bottom: 1rem;
}

.social-login-label {
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
    text-align: center;
}

.social-login-label.dark-text {
    color: #adb5bd;
}

.social-buttons {
    display: flex;
    gap: 0.75rem;
}

.social-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 10px;
    border: 1px solid #e5e5e5;
    background: #ffffff;
    color: #333;
    font-weight: 500;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.social-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.social-btn:active:not(:disabled) {
    transform: translateY(0);
}

.social-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.social-btn.dark-mode {
    background: #2a2a2a;
    border-color: #444;
    color: #fff;
}

.social-btn.dark-mode:hover:not(:disabled) {
    background: #3a3a3a;
    border-color: #555;
}

.social-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
}

/* Already Connected Section */
.already-connected-section {
    padding: 0.5rem 0;
}

.connected-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5rem;
    border-radius: 12px;
    background: #f8f9fa;
    border: 1px solid #e5e5e5;
    text-align: center;
}

.connected-card.dark-mode {
    background: #2a2a2a;
    border-color: #444;
    color: #fff;
}

.connected-icon {
    margin-bottom: 0.75rem;
}

.connected-icon .provider-logo {
    width: 48px;
    height: 48px;
    object-fit: contain;
}

.connected-icon .fa-check-circle {
    font-size: 2.5rem;
    color: #28a745;
}

.connected-info {
    margin-bottom: 1rem;
}

.connected-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
    color: inherit;
}

.connected-address {
    font-size: 0.9rem;
    color: #6c757d;
    font-family: monospace;
    margin: 0;
    background: rgba(0, 0, 0, 0.05);
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
}

.connected-card.dark-mode .connected-address {
    color: #adb5bd;
    background: rgba(255, 255, 255, 0.1);
}

.connected-address.loading {
    font-family: inherit;
    font-style: italic;
    color: #888;
}

.connected-address.error-message {
    color: #dc3545;
    background: rgba(220, 53, 69, 0.1);
}

.verified-badge {
    font-size: 0.85rem;
    color: #28a745;
    margin-top: 0.5rem;
    margin-bottom: 0;
}

/* Verification States */
.verification-success-icon {
    margin-bottom: 1rem;
}

.verification-success-icon .fa-check-circle {
    font-size: 3.5rem;
    color: #28a745;
}

.connected-icon.verifying {
    margin-bottom: 1rem;
}

.connected-icon.verifying .fa-spinner {
    font-size: 2.5rem;
    color: #007bff;
}

.connected-icon.error {
    margin-bottom: 0.75rem;
}

.connected-icon.error .fa-exclamation-circle {
    font-size: 2.5rem;
}

.continue-btn {
    width: 100%;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.2s ease;
}

.continue-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.social-btn.connecting {
    opacity: 0.8;
    cursor: wait;
}

.social-btn .fa-spinner {
    font-size: 16px;
}

.google-btn:hover:not(:disabled) {
    border-color: #4285f4;
}

.apple-btn:hover:not(:disabled) {
    border-color: #333;
}

.apple-btn.dark-mode:hover:not(:disabled) {
    border-color: #fff;
}

/* Wallet Divider */
.wallet-divider {
    display: flex;
    align-items: center;
    text-align: center;
    margin: 1rem 0;
    color: #6c757d;
    font-size: 0.8rem;
}

.wallet-divider::before,
.wallet-divider::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid #e5e5e5;
}

.wallet-divider.dark-mode::before,
.wallet-divider.dark-mode::after {
    border-color: #444;
}

.wallet-divider.dark-mode {
    color: #adb5bd;
}

.wallet-divider span {
    padding: 0 12px;
}

/* Top wallet section styling */
.wallet-top-section {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.75rem;
}

.wallet-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0.75rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    height: 100%;
}

.wallet-card-light {
    background: #f8f9fa;
    border: 1px solid #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.wallet-card-dark {
    background: #2a2a2a;
    border: 1px solid #444;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.wallet-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--bs-primary, #007bff);
}

.wallet-card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.wallet-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    margin-bottom: 0.25rem;
    object-fit: contain;
    background: #fff;
    padding: 3px;
    border: 1px solid #eee;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s ease;
}

.wallet-card:hover .wallet-icon {
    transform: scale(1.05);
}

.wallet-name {
    font-size: 0.8rem;
    font-weight: 500;
    text-align: center;
    margin-top: 0.5rem;
}

.wallet-status {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.wallet-status-dot {
    position: absolute;
    top: 50%;
    right: 80px;
    /* Position before the Connect button */
    width: 8px;
    height: 8px;
    border-radius: 50%;
    transform: translateY(-50%);
}

.connected {
    background: #28a745;
}

.not-connected {
    background: #dc3545;
}

.wallet-disabled {
    filter: blur(1px);
    opacity: 0.7;
    pointer-events: none;
    position: relative;
}

.coming-soon-badge {
    position: absolute;
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 0.6rem;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 500;
    white-space: nowrap;
}

/* More wallets section styling */
.more-wallets-section {
    margin-top: 1rem;
}

.wallet-name-list {
    font-size: 0.8rem;
}

.more-wallets-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 0.5rem;
    font-weight: 500;
    font-size: 0.8rem;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
}

.more-wallets-header::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--bs-primary, #007bff), transparent);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
}

.more-wallets-header:hover::after {
    transform: translateX(0);
}

.dark-mode {
    background: #2a2a2a;
    color: #fff;
    border: 1px solid #444;
}

.dark-mode:hover {
    background: #3a3a3a;
}

.light-mode {
    background: #f8f9fa;
    color: #333;
    border: 1px solid #e5e5e5;
}

.light-mode:hover {
    background: #e9ecef;
}

.more-wallets-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 8px;
}

.wallet-option {
    border-radius: 8px;
    transition: all 0.2s ease;
}

.wallet-option:hover {
    transform: translateX(4px);
}

/* Keep 3 columns for all screen sizes */
.wallet-top-section {
    grid-template-columns: repeat(3, 1fr);
}

/* Wallet button styling */
.wallet-button {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    font-weight: 500;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    min-width: 60px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.wallet-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.connect-button {
    background-color: #28a745;
    color: white;
}

.install-button {
    background-color: #007bff;
    color: white;
    text-decoration: none;
}

.install-button:hover {
    background-color: #0069d9;
    color: white;
    text-decoration: none;
}

/* Modal animation */
.wallet-modal-content {
    animation: modalFadeIn 0.3s ease-out;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

@keyframes modalFadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Adjust spacing for smaller screens */
@media (max-width: 768px) {
    .wallet-top-section {
        gap: 8px;
    }

    .wallet-icon {
        width: 36px;
        height: 36px;
    }

    .wallet-card {
        padding: 0.75rem;
    }
}

.wallet-icon-large {
    width: 60px;
    height: 60px;
    border-radius: 12px;
    object-fit: contain;
    background: #fff;
    padding: 5px;
    border: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>

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
            <!-- Top wallets section (Santa, Google, Apple) -->
            <div class="wallet-top-section">
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
            </div>

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
            <div v-if="wallets.length === 0" class="text-center text-muted py-3">No Aptos wallets detected.</div>
        </div>
    </b-modal>
</template>

<script setup lang="ts">
import logo from '../../assets/wallets/santa.png';
import petraLogo from '../../assets/wallets/petra.png';
import okxLogo from '../../assets/wallets/okx.png';
import pontemLogo from '../../assets/wallets/pontem.png';
import nightlyLogo from '../../assets/wallets/nightly.png';

// Use the actual Google and Apple wallet icons
import googleLogo from '../../assets/wallets/google.png';
import appleLogo from '../../assets/wallets/apple.png';
// If you have a Martian or Fewcha icon, import here as well.
import { ref, defineEmits, onMounted, computed } from 'vue';
import { useThemeStore } from '../../stores/Stores';

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

const KNOWN_APTOS_WALLETS: Omit<WalletInfo, 'provider' | 'injected'> & { injectedKey: string }[] = [
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

const mobileStoreUrls = {
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

function getInstallUrl(wallet: any) {
    // For Santa Wallet, always use the desktop URL regardless of device
    if (wallet.key === 'santaAptos') {
        return wallet.installUrl;
    }

    // For other wallets, use mobile app store URLs on mobile devices
    if (isMobile.value) {
        if (isAndroid.value && mobileStoreUrls[wallet.injectedKey]?.android) {
            return mobileStoreUrls[wallet.injectedKey].android;
        } else if (isIOS.value && mobileStoreUrls[wallet.injectedKey]?.ios) {
            return mobileStoreUrls[wallet.injectedKey].ios;
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
    const filteredWallets = wallets.value.filter((w) => {
        // Include all priority wallets except Santa when it's not injected
        if (w.key === 'santaAptos') {
            return w.injected;
        }
        return w.priority === true;
    });

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

function connect(wallet: WalletInfo) {
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
        // Standard flow for other wallets with connect method
        try {
            wallet.provider
                .connect()
                .then((response: any) => {
                    console.log(`${wallet.name} connect response:`, response);
                    emit('connected', { wallet, response });
                    emit('close');
                })
                .catch((err: any) => {
                    console.error('Wallet connect error:', wallet.name, err);
                });
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
    right: 80px; /* Position before the Connect button */
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
</style>

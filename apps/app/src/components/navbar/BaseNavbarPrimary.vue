<template>
    <b-navbar
        v-if="!accountStore.config.isQRCodeCampaign"
        :container="false"
        class="navbar-bottom shadow px-lg-3 order-lg-0 d-lg-none"
        :class="{ hidden: accountStore.isMobile && isHidden }"
    >
        <!-- <div
            v-if="accountStore.config"
            style="width: 120px"
            class="pl-3 py-2 text-decoration-none d-none d-lg-block me-auto"
        >
            <b-img
                v-b-tooltip.hover.bottom="{ title: decodeHTML(accountStore.config.title) }"
                :src="accountStore.config.logoUrl"
                class="navbar-logo"
            />
        </div> -->
        <!-- <router-link :to="`/c/${accountStore.config.slug}/quests`">
            <i class="fas fa-tasks me-lg-3" />
            <div>Quests</div>
        </router-link>
        <router-link :to="`/c/${accountStore.config.slug}/rewards`">
            <i class="fas fa-gift me-lg-3" />
            <div>Rewards</div>
        </router-link>
        <router-link :to="`/c/${accountStore.config.slug}/ranking`">
            <i class="fas fa-trophy mr-lg-3" />
            <div>Rank</div>
        </router-link>
        <router-link v-if="accountStore.isMobile" :to="`/c/${accountStore.config.slug}/wallets`">
            <i class="fas fa-wallet mr-lg-3" />
            <div>Wallet</div>
        </router-link> -->
        <a
            v-for="item in navbarItems"
            :key="item.key"
            :class="['navbar-item', { active: selectedPart === item.key }]"
            :style="{ width: item.key === 'transactions' ? '80px' : '' }"
            role="tab"
            :aria-selected="selectedPart === item.key"
            @click="selectNavItem(item.key)"
        >
            <span class="navbar-icon-wrap">
                <!-- Inline SVG icons with currentColor -->
                <svg
                    v-if="item.key === 'quests'"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M4 6h12M4 12h8M4 18h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <path d="M18 8l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <svg
                    v-else-if="item.key === 'rewards'"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M12 3l3 4-3 4-3-4 3-4z" stroke="currentColor" stroke-width="2" />
                    <path d="M5 9l7 12 7-12" stroke="currentColor" stroke-width="2" />
                </svg>
                <svg
                    v-else-if="item.key === 'wallet'"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" stroke-width="2" />
                    <circle cx="17" cy="12" r="1.5" fill="currentColor" />
                </svg>
                <svg
                    v-else-if="item.key === 'leaderboard'"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M8 21V11M12 21V3M16 21V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                </svg>
                <svg
                    v-else-if="item.key === 'transactions'"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7 7h10l-3-3"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                    <path
                        d="M17 17H7l3 3"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
                <svg
                    v-else-if="item.key === 'about'"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
                    <path d="M12 10v7" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    <circle cx="12" cy="7" r="1" fill="currentColor" />
                </svg>
                <!-- Badges -->
                <span v-if="item.key === 'rewards' && getRewardsBadge()" class="navbar-badge">{{
                    getRewardsBadge()
                }}</span>
                <span v-if="item.key === 'transactions' && getTransactionsBadge()" class="navbar-badge">{{
                    getTransactionsBadge()
                }}</span>
            </span>
            <div class="navbar-item-label">{{ item.label }}</div>
        </a>
        <!-- <BaseNavbarSecondary v-if="!accountStore.isMobile" class="ms-auto" /> -->
    </b-navbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../../stores/Account';
import { useQuestStore } from '../../stores/Quest';
import { useRewardStore } from '../../stores/Reward';
import { useWalletStore } from '../../stores/Wallet';
export default defineComponent({
    props: {
        selectedPart: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            lastScrollY: 0,
            isHidden: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        ...mapStores(useQuestStore),
        ...mapStores(useRewardStore),
        ...mapStores(useWalletStore),
        isQuestCampaign() {
            return this.questStore.quests.length || this.rewardStore.rewards.length;
        },
        navbarItems() {
            // Order: Quests, Rewards, Wallet, Rank, Transactions, About
            return [
                {
                    key: 'quests',
                    label: 'Quests',
                },
                {
                    key: 'rewards',
                    label: 'Rewards',
                },
                {
                    key: 'wallet',
                    label: 'Wallet',
                },
                {
                    key: 'leaderboard',
                    label: 'Rank',
                },
                {
                    key: 'transactions',
                    label: 'Transactions',
                },
                {
                    key: 'about',
                    label: 'About',
                },
            ];
        },
    },
    mounted() {
        this.lastScrollY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        window.addEventListener('scroll', this.onScroll, { passive: true });
    },
    unmounted() {
        window.removeEventListener('scroll', this.onScroll as any);
    },
    methods: {
        selectNavItem(item: string) {
            this.$emit('nav-clicked', item);
        },
        onScroll() {
            // Do not auto-hide on desktop to avoid blank container
            if (!this.accountStore.isMobile) {
                this.isHidden = false;
                this.lastScrollY =
                    window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
                return;
            }

            const currentY = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
            const doc = document.documentElement;
            const maxScrollable = (doc.scrollHeight || 0) - (window.innerHeight || 0);

            // If page isn't scrollable, never hide
            if (maxScrollable <= 0) {
                this.isHidden = false;
                this.lastScrollY = currentY;
                return;
            }

            // Always show when near top or bottom
            if (currentY < 8 || currentY > maxScrollable - 8) {
                this.isHidden = false;
                this.lastScrollY = currentY;
                return;
            }

            const delta = currentY - this.lastScrollY;
            // Ignore tiny scrolls to avoid jitter
            if (Math.abs(delta) > 6) {
                this.isHidden = delta > 0; // hide on scroll down, show on scroll up
                this.lastScrollY = currentY;
            }
        },
        getRewardsBadge(): number {
            const rewards = this.rewardStore.rewards || [];
            const promoted = rewards.filter((r: any) => r?.isPromoted);
            return promoted.length || 0;
        },
        getTransactionsBadge(): number {
            const w = this.walletStore.wallet as any;
            if (!w) return 0;
            const pending = Array.isArray(w.pendingTransactions) ? w.pendingTransactions.length : 0;
            return pending;
        },
    },
});
</script>

<style>
.navbar-bottom {
    width: 100%;
    position: fixed;
    bottom: -5px;
    z-index: 22;
    background: var(--navbar-bottom-bg);
    backdrop-filter: blur(27px);
    left: 0;
    padding: 1rem;
    padding-bottom: max(1rem, env(safe-area-inset-bottom)); /* iOS safe-area */
    gap: 10px;
    overflow-x: auto;
    overflow-y: hidden; /* avoid vertical scrollbar artifacts */
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    box-shadow: 0 -6px 20px rgba(0, 0, 0, 0.25);
    transition: transform 0.24s ease;
}

.navbar-bottom.hidden {
    transform: translateY(110%);
    pointer-events: none; /* avoid invisible overlay capturing clicks */
}
.navbar-bottom.hidden::before,
.navbar-bottom.hidden::after {
    opacity: 0; /* hide edge gradients when hidden */
}

/* Edge fades disabled to avoid GPU artifact on some devices */
.navbar-bottom::before,
.navbar-bottom::after {
    content: none;
}

.navbar-bottom a {
    height: 50px;
    padding: 5px;
    flex-shrink: 0;
}

/* Hide WebKit scrollbar to prevent vertical shadow/track artifacts on iOS/Chrome mobile */
.navbar-bottom::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
    background: transparent;
}

.navbar-item-label {
    text-align: center;
    /* leading-trim and text-edge are experimental; removing to fix lints */
    font-feature-settings: 'liga' off, 'clig' off;
    font-family: Poppins;
    font-size: 11px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px;
}

.nav-campaign .router-link-exact-active {
    background-color: rgba(229, 229, 229, 0.11) !important;
}
.navbar-icon {
    width: 24px;
    height: 24px;
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
}
.navbar-item.active {
    color: #ffffff !important;
    background: var(--navbar-bottom-selected-bg);
    transform: scale(1.04);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
}

/* Preserve active background on hover/focus to avoid grey override */
.navbar-item.active:hover,
.navbar-item.active:focus,
.navbar-item.active:focus-visible {
    background: var(--navbar-bottom-selected-bg);
    transform: scale(1.04);
}

.navbar-item {
    color: var(--navbar-bottom-color) !important;
    background: var(--navbar-bottom-default-bg);
    border-radius: 10px;
    min-width: 56px; /* ensure 44px touch width incl. padding */
    transition: background 0.16s ease, color 0.16s ease, transform 0.16s ease, box-shadow 0.16s ease;
}
.navbar-item.active .navbar-icon {
    filter: brightness(0) invert(1);
}

.navbar-item:hover,
.navbar-item:focus-visible {
    transform: translateY(-1px);
    background: color-mix(in srgb, var(--navbar-bottom-default-bg) 85%, #ffffff 15%);
    outline: none;
}

.navbar-icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.navbar-badge {
    position: absolute;
    top: -4px;
    right: -8px;
    min-width: 16px;
    height: 16px;
    padding: 0 4px;
    border-radius: 10px;
    background: #ff3b30; /* iOS red */
    color: #fff;
    font-size: 10px;
    line-height: 16px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}

.navbar-icon-quests {
    background-image: url('/src/assets/quest-light.png');
}
.navbar-icon-rewards {
    background-image: url('/src/assets/reward-light.png');
}
.navbar-icon-leaderboard {
    background-image: url('/src/assets/leader-light.png');
}
.navbar-icon-wallet {
    background-image: url('/src/assets/wallet-light.png');
}
.navbar-icon-transactions {
    background-image: url('/src/assets/transaction-light.png');
}
.navbar-icon-about {
    margin-left: 4px;
    background-image: url('/src/assets/about-light.png');
}

/* Dark Theme Icons */
[data-theme='dark'] .navbar-icon-quests {
    background-image: url('/src/assets/quest.png');
}
[data-theme='dark'] .navbar-icon-rewards {
    background-image: url('/src/assets/reward.png');
}
[data-theme='dark'] .navbar-icon-leaderboard {
    background-image: url('/src/assets/leader.png');
}
[data-theme='dark'] .navbar-icon-wallet {
    background-image: url('/src/assets/wallet.png');
}
[data-theme='dark'] .navbar-icon-transactions {
    background-image: url('/src/assets/transaction.png');
}
[data-theme='dark'] .navbar-icon-about {
    margin-left: 4px;
    background-image: url('/src/assets/about.png');
}
</style>

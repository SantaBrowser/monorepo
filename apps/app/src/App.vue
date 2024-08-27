<template>
    <b-alert v-if="isOffline" v-model="isOffline" class="m-3" variant="primary">
        <i class="fas fa-tools me-2" />
        We are running some maintenance and will be back shortly. See you soon! ❤️
    </b-alert>
    <!-- <div v-else id="main" :class="{ 'overflow-hidden': accountStore.isMobile }"> -->
    <div v-else id="main">
        <BaseNavbarTop />
        <div class="d-flex h-100">
            <router-view v-slot="{ Component }">
                <transition name="fade" mode="out-in">
                    <component :is="Component" class="router-view-app order-lg-0" />
                </transition>
            </router-view>
            <!-- <BaseSidebar /> -->
        </div>
        <BaseModalLogin />
        <BaseModalAccount size="lg" />
        <BaseModalWalletConnect />
        <BaseModalWalletCreate size="lg" />
        <BaseModalWalletRecovery size="lg" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AUTH_URL, GTM, MAINTENANCE } from './config/secrets';
import { initGTM } from './utils/ga';
import { mapStores } from 'pinia';
import { useAuthStore } from './stores/Auth';
import { useAccountStore } from './stores/Account';
import { useWalletStore } from './stores/Wallet';

export default defineComponent({
    data() {
        return {
            test: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore, useWalletStore),
        isOffline(): boolean {
            try {
                return this.$route.query.maintenance
                    ? !!JSON.parse(this.$route.query.maintenance)
                    : !!JSON.parse(MAINTENANCE);
            } catch (error) {
                return false;
            }
        },
        scrollHeight() {
            const { windowHeight, isMobile } = this.accountStore;
            // Return null to disable custom scroller
            if (isMobile) return null;
            const mobileOffset = 30;
            const height = windowHeight - mobileOffset;
            return { height: `${height}px` };
        },
    },
    watch: {
        'accountStore.isSidebarShown'() {
            document.body.classList[this.accountStore.isMobile ? 'add' : 'remove']('overflow-hidden');
        },
        'accountStore.account'(account: TAccount) {
            if (!account) return;

            // If an e-mail is set, but not verified then show the account modal
            // if (account.email && !account.isEmailVerified) {
            //     this.accountStore.isModalAccountShown = true;
            // }
        },
    },
    async created() {
        if (GTM) initGTM();
        // await this.authStore.restoreUser();
    },
    async mounted() {
        const urlParams = new URLSearchParams(window.location.search);
        let clid = urlParams.get('clid');

        if (!clid) {
            clid = this.getCookieReduce('clid');
        }

        const user = this.accountStore.isAuthenticated;
        if (clid && !user) {
            await this.authenticateUser(clid);
        }
    },
    methods: {
        getCookieReduce(name: string): string {
            return document.cookie.split('; ').reduce((r, v) => {
                const [n, ...val] = v.split('='); // cookie value can contain "="
                if (r) return r; // returns first found cookie
                return n === name ? decodeURIComponent(val.join('=')) : r; // returns last found cookie (overwrites)
            }, '');
        },
        async authenticateUser(clid: string) {
            try {
                await this.accountStore.signinWithClid(clid);
            } catch (error) {
                console.error('Authentication error:', error);
            }
        },
        async refreshUser() {
            // await this.authStore.requestOAuthShareRefresh();
            //     try {
            //         await this.authStore.waitForUser();
            //     } catch (error) {
            //         console.error('Authentication error:', error);
            //     }
        },
    },
});
</script>

<style lang="scss">
.router-view-app {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    // overflow-x: hidden;
    // overflow-y: auto;
    height: 100% !important;
}
</style>

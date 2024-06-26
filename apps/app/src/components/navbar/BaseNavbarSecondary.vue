<template>
    <b-navbar class="navbar-top pt-3 px-lg-3 p-lg-0">
        <div style="width: 120px" class="d-lg-none">
            <b-button variant="link" @click="onClickClose"> <i class="fas fa-times"></i></b-button>
        </div>
        <b-link
            v-if="accountStore.isAuthenticated && (questStore.quests.length || rewardStore.rewards.length)"
            class="pl-3 py-2 p-lg-0 m-lg-0 text-center text-decoration-none d-block d-lg-none"
            @click="onClickRefresh"
        >
            <div class="text-accent h1 m-0 d-flex align-items-center">
                <strong>{{ participant ? participant.balance : 0 }}</strong>
                <span class="ms-2 text-white" style="font-size: 16px !important">
                    <b-spinner v-if="isRefreshing" small />
                    <i v-else class="fas fa-sync-alt" style="font-size: 0.8rem"></i>
                </span>
            </div>
            <div class="points d-block d-lg-none">points</div>
        </b-link>
        <div v-else class="pl-3 py-2 text-center text-decoration-none d-lg-none">
            <b-img
                v-if="accountStore.config.config"
                v-b-tooltip.hover.bottom="{ title: decodeHTML(accountStore.config.title) }"
                :src="accountStore.config.config.logoUrl"
                class="navbar-logo"
            />
        </div>
        <div style="width: 120px; text-align: right">
            <BaseDropdownUserMenu />
        </div>
    </b-navbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../../stores/Account';
import { useAuthStore } from '../../stores/Auth';
import { useQuestStore } from '../../stores/Quest';
import { useWalletStore } from '../../stores/Wallet';
import { useRewardStore } from '../../stores/Reward';
import { decodeHTML } from '../../utils/decode-html';

export default defineComponent({
    name: 'BaseNavbarSecondary',
    data() {
        return {
            decodeHTML,
            error: '',
            isRefreshing: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore, useQuestStore, useRewardStore, useWalletStore),
        participant() {
            return this.accountStore.participants.find((p) => p.sub === this.accountStore.account?.sub);
        },
    },
    watch: {
        'accountStore.account': {
            handler(account: TAccount | null) {
                if (!account) return;
                this.accountStore.getParticipants();
                this.walletStore.listWallets();
            },
            immediate: true,
        },
    },
    methods: {
        onClickClose() {
            // If the widget is in an iframe, send a message to the parent window to close the widget
            if (this.accountStore.isIFrame) {
                window.top?.postMessage({ message: 'thx.widget.toggle' }, this.accountStore.config.origin);
            }
            // If the widget is not in an iframe and there are no quests or rewards, redirect to the origin
            else if (!this.questStore.quests.length && this.accountStore.config.domain) {
                window.open(this.accountStore.config.domain, '_self');
            }
            // If this page is opened by a script close the window
            else if (window.opener) {
                window.close();
            }
            // All other cases redirect to the app homepage
            else {
                this.$router.push('/');
            }
        },
        async onClickRefresh() {
            this.isRefreshing = true;
            await Promise.all([
                this.accountStore.getParticipants(),
                this.questStore.list(),
                this.rewardStore.list(),
                this.walletStore.list(),
            ]);
            this.isRefreshing = false;
        },
    },
});
</script>

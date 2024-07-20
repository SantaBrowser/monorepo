<template>
    <b-navbar
        v-if="!accountStore.config.isQRCodeCampaign"
        :container="false"
        class="navbar-bottom shadow px-lg-3 order-lg-0"
    >
        <div
            v-if="accountStore.config"
            style="width: 120px"
            class="pl-3 py-2 text-decoration-none d-none d-lg-block me-auto"
        >
            <b-img
                v-b-tooltip.hover.bottom="{ title: decodeHTML(accountStore.config.title) }"
                :src="accountStore.config.logoUrl"
                class="navbar-logo"
            />
        </div>
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
        <a @click="selectNavItem('Quests')">
            <i class="fas fa-tasks me-lg-3" />
            <div>Quests</div>
        </a>
        <a @click="selectNavItem('Rewards')">
            <i class="fas fa-gift me-lg-3" />
            <div>Rewards</div>
        </a>
        <a @click="selectNavItem('Leaderboard')">
            <i class="fas fa-trophy mr-lg-3" />
            <div>Rank</div>
        </a>
        <a @click="selectNavItem('Wallet')">
            <i class="fas fa-wallet mr-lg-3" />
            <div>Wallet</div>
        </a>
        <BaseNavbarSecondary v-if="!accountStore.isMobile" class="ms-auto" />
    </b-navbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../../stores/Account';
import { useQuestStore } from '../../stores/Quest';
import { useRewardStore } from '../../stores/Reward';
import { decodeHTML } from '../../utils/decode-html';

export default defineComponent({
    data() {
        return { decodeHTML };
    },
    computed: {
        ...mapStores(useAccountStore),
        ...mapStores(useQuestStore),
        ...mapStores(useRewardStore),
        isQuestCampaign() {
            return this.questStore.quests.length || this.rewardStore.rewards.length;
        },
    },
    methods: {
        selectNavItem(item: string) {
            this.$emit('nav-clicked', item);
        },
    },
});
</script>

<style>
.nav-campaign {
    background-color: #151515;
}

.navbar-bottom {
    width: 100%;
    position: fixed;
    bottom: 0px;
    z-index: 22;
    /* left: 1%; */
    /* border-radius: 36px; */
    box-shadow: rgb(251 250 250 / 81%) 0px 4px 4px 0px, rgb(255 255 255 / 0%) 0px 4px 4px 0px inset !important;
    background: rgb(1 1 1) !important;
    /* border-radius: 48px; */
    zoom: 0.75;
    border-top: 1px dotted #bbc11ddd;
}

.nav-campaign .router-link-exact-active {
    background-color: rgba(229, 229, 229, 0.11) !important;
}
</style>

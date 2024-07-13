<template>
    <b-container class="mt-4">
        <b-row>
            <b-col
                lg="7"
                xl="6"
                offset-xl="1"
                style="
                    background: rgba(44, 44, 44, 0.3);
                    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
                    backdrop-filter: blur(12.5px);
                    margin-right: 20px;
                    border-radius: 7px;
                "
            >
                <div v-if="!accountStore.isMobile" class="mb-2 ps-3 d-flex align-items-center bg-primary rounded p-2">
                    <div>
                        <strong>Quests</strong>
                        <div class="text-opaque">Earn points with tasks</div>
                    </div>
                    <i class="fas fa-tasks text-opaque ms-auto me-3" style="font-size: 1.2rem" />
                </div>
                <div v-if="questStore.isLoading" class="d-flex justify-content-center py-5">
                    <b-spinner variant="primary" small />
                </div>
                <b-tabs v-else content-class="mt-3" justified class="mt-3">
                    <b-tab active style="height: 500px; overflow: auto">
                        <template #title>
                            Available
                            <sup v-if="availableQuestCount">
                                <b-badge class="px-1 py-1 text-white" variant="danger">
                                    {{ availableQuestCount }}
                                </b-badge>
                            </sup>
                        </template>
                        <div v-for="(quest, key) of quests" :key="key" :class="{ 'd-none': !quest.isAvailable }">
                            <component
                                :is="questComponentMap[quest.variant]"
                                v-if="quest"
                                :quest="quest"
                                class="mb-2 mx-lg-0 my-lg-3"
                            />
                        </div>
                        <div v-if="!availableQuestCount" class="text-center mt-5">
                            <i class="h1 fas fa-trophy text-accent" />
                            <p class="lead text-accent">Well done!</p>
                            <p class="text-opaque">You have completed all available quests</p>
                        </div>
                    </b-tab>
                    <b-tab title="Completed">
                        <div v-for="(quest, key) of quests" :key="key" :class="{ 'd-none': quest.isAvailable }">
                            <component
                                :is="questComponentMap[quest.variant]"
                                :quest="quest"
                                class="mb-2 mx-lg-0 my-lg-3"
                            />
                        </div>
                    </b-tab>
                </b-tabs>
            </b-col>
            <b-col
                v-if="!accountStore.isMobile"
                lg="5"
                xl="4"
                class="h-100"
                style="background: rgba(44, 44, 44, 0.3); border-radius: 7px"
            >
                <div class="mb-2 ps-3 d-flex align-items-center bg-primary rounded p-2">
                    <div>
                        <strong>Rewards</strong>
                        <div class="text-opaque">Spend your points!</div>
                    </div>
                    <i class="fas fa-gift text-opaque ms-auto me-3" style="font-size: 1.2rem" />
                </div>
                <component
                    :is="componentMap[reward.variant]"
                    v-for="reward of rewardStore.rewards"
                    :reward="reward"
                    class="mb-2"
                />
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../../stores/Account';
import { useWalletStore } from '../../stores/Wallet';
import { useQuestStore } from '../../stores/Quest';
import { useRewardStore } from '../../stores/Reward';
import { RewardSortVariant } from '../../types/enums/rewards';
import { questComponentMap, sortMap } from '../../utils/quests';
import BaseCardQuestInvite from '../../components/card/BaseCardQuestInvite.vue';
import BaseCardQuestSocial from '../../components/card/BaseCardQuestSocial.vue';
import BaseCardQuestCustom from '../../components/card/BaseCardQuestCustom.vue';
import BaseCardQuestDaily from '../../components/card/BaseCardQuestDaily.vue';
import BaseCardQuestWeb3 from '../../components/card/BaseCardQuestWeb3.vue';
import BaseCardQuestGitcoin from '../../components/card/BaseCardQuestGitcoin.vue';
import BaseCardQuestWebhook from '../../components/card/BaseCardQuestWebhook.vue';
import { RewardVariant } from '../../types/enums/rewards';
import BaseCardRewardCoin from '../../components/card/BaseCardRewardCoin.vue';
import BaseCardRewardNFT from '../../components/card/BaseCardRewardNFT.vue';
import BaseCardRewardCustom from '../../components/card/BaseCardRewardCustom.vue';
import BaseCardRewardCoupon from '../../components/card/BaseCardRewardCoupon.vue';
import BaseCardRewardDiscordRole from '../../components/card/BaseCardRewardDiscordRole.vue';
import BaseCardRewardGalachain from '../../components/card/BaseCardRewardGalachain.vue';
import { SANTA_CAMPAIGN } from '@thxnetwork/app/config/secrets';

const componentMap: { [variant: string]: string } = {
    [RewardVariant.Coin]: 'BaseCardRewardCoin',
    [RewardVariant.NFT]: 'BaseCardRewardNFT',
    [RewardVariant.Custom]: 'BaseCardRewardCustom',
    [RewardVariant.Coupon]: 'BaseCardRewardCoupon',
    [RewardVariant.DiscordRole]: 'BaseCardRewardDiscordRole',
    [RewardVariant.Galachain]: 'BaseCardRewardGalachain',
};

export default defineComponent({
    name: 'Quests',
    components: {
        BaseCardQuestInvite,
        BaseCardQuestSocial,
        BaseCardQuestCustom,
        BaseCardQuestDaily,
        BaseCardQuestWeb3,
        BaseCardQuestGitcoin,
        BaseCardQuestWebhook,
        BaseCardRewardCoin,
        BaseCardRewardNFT,
        BaseCardRewardCustom,
        BaseCardRewardCoupon,
        BaseCardRewardDiscordRole,
        BaseCardRewardGalachain,
    },
    data() {
        return {
            componentMap,
            questComponentMap,
            isLgScreen: window.innerWidth > 1000,
            selectedSort: { label: 'Default', key: RewardSortVariant.Default },
            activeFilters: [],
            entry: null,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        ...mapStores(useQuestStore),
        ...mapStores(useRewardStore),
        ...mapStores(useWalletStore),
        isSubscribed() {
            const { subscription } = useAccountStore();
            return !!subscription;
        },
        isAlertSubscribeShown() {
            return !this.availableQuestCount;
        },
        availableQuestCount() {
            return this.questStore.quests.filter((q: TBaseQuest) => q.isAvailable).length;
        },
        quests() {
            const { quests } = this.questStore;
            return quests.sort(sortMap[this.selectedSort.key]).map((quest, index) => ({ ...quest, index }));
        },
    },
    watch: {
        'accountStore.isAuthenticated': {
            async handler(isAuthenticated: boolean) {
                if (!isAuthenticated) return;
                if (!this.accountStore.account) {
                    await this.accountStore.getAccount();
                }
                this.questStore.list(SANTA_CAMPAIGN);
                this.rewardStore.list(SANTA_CAMPAIGN);
                this.accountStore.getParticipants(SANTA_CAMPAIGN);
            },
            immediate: true,
        },
        'availableQuestCount': {
            handler(amount: number) {
                // Return if not in iframe
                if (window.top === window.self) return;
                // Send the amount of unclaimed rewards to the parent window and update the launcher
                window.top?.postMessage({ message: 'thx.reward.amount', amount }, this.accountStore.config.origin);
            },
            immediate: true,
        },
    },
});
</script>

<style>
.my-nav .nav-link.active {
    --bs-nav-tabs-link-active-color: rgba(255, 255, 255, 0.7) !important;
    background: linear-gradient(180deg, #202023 0%, #000 84%) !important;
    --bs-nav-tabs-link-active-border-color: #232323 !important;
    --bs-nav-tabs-link-active-bg: #232323 !important;
}

.my-nav .nav-tabs {
    --bs-nav-tabs-border-color: #232323 !important;
    width: 50%;
}

.tab-content {
    position: relative;
}

.my-nav .card {
    background-color: #000;
    border-radius: 5px;
    border: 1px solid #262424;
    background-image: url('../../assets/bg-mosaic.png');
    background-size: cover;
}

.my-nav .card-header {
    background: #0b0b0b;
    border-radius: 5px !important;
}

.my-nav .fa-calendar {
    color: #515151 !important;
}

.my-nav .btn {
    border-color: #af4545;
    background: linear-gradient(90deg, rgba(177, 70, 70, 0.75) 0%, rgba(114, 33, 33, 0.75) 100%);
}

.my-nav .badge.bg-primary {
    color: rgba(238, 238, 238, 0.7) !important;
    background: #000 !important;
}

.my-leader {
    background-color: #151515;
}

.my-leader .text-primary {
    color: #515151 !important;
}

.my-leader .list-group-item {
    background-color: #1c1b1b;
    border-color: #262424;
}

.my-nav .tab-pane {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
</style>

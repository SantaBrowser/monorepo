<template>
    <b-container
        v-if="!accountStore.isMobile || selectedPart === 'Quests' || selectedPart === 'Rewards'"
        class="mt-2 overflow-y-scroll quest-cont"
    >
        <b-row>
            <b-col lg="6" xl="7" offset-xl="0" class="quests-column">
                <div v-if="!accountStore.isMobile" class="mb-2 align-items-center bg-quests rounded">
                    <div class="quests-title d-flex p-2">
                        <div>
                            <strong class="title-q">Quests</strong>
                            <div class="text-opaque">Earn points with tasks</div>
                        </div>
                        <i class="fas fa-tasks text-opaque ms-auto me-3" style="font-size: 1.2rem" />
                    </div>
                </div>
                <div v-if="questStore.isLoading" class="d-flex justify-content-center py-5">
                    <b-spinner variant="primary" small />
                </div>
                <b-tabs
                    v-else-if="!accountStore.isMobile || selectedPart === 'Quests'"
                    content-class="mt-3"
                    justified
                    class="mt-3"
                >
                    <b-tab active>
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
                v-if="!accountStore.isMobile || selectedPart === 'Rewards'"
                lg="5"
                xl="5"
                xxl="4"
                class="h-100 rewards-column"
                offset-xl="0"
            >
                <div class="mb-2 bg-rewards rounded">
                    <div class="align-items-center p-2 quests-title d-flex" style="justify-content: space-between">
                        <div>
                            <strong class="title-q">Rewards</strong>
                            <div class="text-opaque">Spend your points to redeem</div>
                        </div>
                        <select v-model="selectedValue" class="rewards-select">
                            <option>All</option>
                            <option>Santa</option>
                            <option>Playwall</option>
                        </select>
                    </div>
                </div>
                <div v-if="mergedRewards.length > 0" class="rewards-container flex-1">
                    <div
                        v-for="(reward, index) in mergedRewards"
                        :key="index"
                        class="reward-item mb-2 gr-2"
                        :style="reward.isPromoted ? 'width: 100%' : 'width: 48% !important'"
                    >
                        <component :is="componentMap[reward.variant]" :reward="reward" />
                    </div>
                </div>
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
import { useReward2Store } from '../../stores/Reward';
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
import { CP_CAMPAIGN, SANTA_CAMPAIGN } from '@thxnetwork/app/config/secrets';
import { ref } from 'vue';

const selectedValue = ref<string>('All');
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
    props: {
        selectedPart: {
            type: String,
            default: 'Quests',
        },
    },
    data() {
        return {
            selectedValue,
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
        ...mapStores(useReward2Store),
        ...mapStores(useWalletStore),
        isSubscribed() {
            const { subscription } = useAccountStore();
            return !!subscription;
        },
        isAlertSubscribeShown() {
            return !this.availableQuestCount;
        },
        availableQuestCount() {
            console.log('availableQuestCount', this.questStore);
            return this.questStore.quests.filter((q: TBaseQuest) => q.isAvailable).length;
        },
        quests() {
            const { quests } = this.questStore;
            return quests.sort(sortMap[this.selectedSort.key]).map((quest, index) => ({ ...quest, index }));
        },
        mergedRewards() {
            if (this.selectedValue === 'All') {
                return [...this.reward2Store.rewards, ...this.rewardStore.rewards];
            } else if (this.selectedValue === 'Santa') {
                return this.reward2Store.rewards;
            } else if (this.selectedValue === 'Playwall') {
                return this.rewardStore.rewards;
            }
            return [];
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
                this.rewardStore.list(CP_CAMPAIGN);
                this.reward2Store.list(SANTA_CAMPAIGN);
                // this.accountStore.getParticipants(SANTA_CAMPAIGN);
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

<style lang="scss">
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

.rewards-select {
    background-color: rgb(200 74 16 / 17%);
    padding: 4px 16px;
    border-radius: 20px;
    border: 0px solid black;
    border-right-width: 10px;
    border-color: transparent;
    outline: solid 2px #dcc528ab;
}

.bg-quests {
    background-image: url('/src/assets/bg-quests.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 15px !important;
    border: 1px dotted #f3d40760;
    margin: 6px;
}
.nav-tabs .nav-item {
    margin-left: 10px;
}

.bg-rewards {
    background-image: url('/src/assets/bg-rewards.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    border: 1px dotted #f31a0760;
    border-radius: 15px !important;
    overflow: hidden;
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

.gr-2 {
    width: 100% !important;
    box-shadow: inset rgb(115 59 74 / 42%) 0px -7px 20px 8px;
    zoom: 0.75;
}

.gr-2 .card-body {
    height: 205px;
    min-height: 205px !important;
    max-height: 205px !important;
}

.quests-column {
    box-shadow: inset rgb(182 9 153 / 15%) 0px -7px 20px 8px;
    margin-right: 20px;
    border-radius: 7px;
    //background: #0e0f19;
    border-radius: 15px;
    border: 1px dotted #865c5c85;
    padding: 0px;
    margin-left: 12px;
}

.quests-column .nav-item .nav-link.active {
    background-color: #0e0f19 !important;
}

.quests-column .tab-content {
    padding: 10px;
}

.quests-column .tab-content .card {
    border-radius: 10px;
    border: 1px dotted #f39696a1;
    overflow: hidden;
    margin-bottom: 15px !important;
}

.rewards-column {
    background: rgba(44, 44, 44, 0.3);
    box-shadow: inset rgb(80 7 7 / 42%) 0px -7px 20px 8px;
    border-radius: 7px;
    background: rgb(54 1 83 / 20%);
    border-radius: 15px;
    border: 1px dotted #865c5c85;
    padding: 6px;
}

.quests-title {
    backdrop-filter: brightness(0.5);
    overflow: hidden;
}

.quests-title i {
    line-height: 2;
}

.rewards-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    padding: 0px;
    gap: 15px;
    margin-bottom: 10px;
}
.title-q {
    font-size: 23px;
    line-height: 23px;
    color: #feff00;
    font-weight: 400;
    font-family: 'Kode Mono', monospace;
}

.card-title {
    font-family: 'Kode Mono', monospace;
    font-size: 1rem;
}

.quests-title .text-opaque {
    font-size: 11px;
}
@media (max-width: 992px) {
    .quest-cont .row > * {
        flex-shrink: unset;
    }
    .quests-column {
        margin-right: 12px;
    }
}
</style>

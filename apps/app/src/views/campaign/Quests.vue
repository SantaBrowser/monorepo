<template>
    <b-container
        v-if="!accountStore.isMobile || selectedPart === 'Quests' || selectedPart === 'Rewards'"
        class="mt-2 quest-cont"
    >
        <b-row>
            <b-col
                v-if="!accountStore.isMobile || selectedPart === 'Quests'"
                lg="6"
                xl="7"
                offset-xl="0"
                class="quests-column flex-grow-1 my-col-xl-7"
            >
                <div class="mb-2 align-items-center bg-quests rounded">
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
                <b-tabs v-else content-class="mt-3" justified class="mt-3">
                    <b-tab active>
                        <template #title>
                            Available
                            <sup v-if="availableQuestCount">
                                <b-badge class="px-1 py-1 text-white" variant="danger" style="font-size: 8px">
                                    {{ availableQuestCount }}
                                </b-badge>
                            </sup>
                        </template>
                        <div class="quests-box">
                            <div
                                v-for="(item, index) in mergedQuestsAndOffers"
                                :key="index"
                                :class="{
                                    'w-100': item.isDaily || item.isOfferRow || item.isAlone,
                                    'regular-quest': !item.isDaily && !item.isOfferRow && !item.isAlone,
                                }"
                            >
                                <div v-if="item.isOfferRow" class="offers-box">
                                    <h3>Top performing offers</h3>
                                    <div class="d-flex flex-wrap offer-row">
                                        <div
                                            v-for="offer in item.offers"
                                            :key="offer.id"
                                            class="offer-item"
                                            :style="{
                                                width:
                                                    item.offers.length === 1
                                                        ? '100%'
                                                        : offersPerRow === 3
                                                        ? '30%'
                                                        : '49%',
                                                maxWidth:
                                                    item.offers.length === 1
                                                        ? '100%'
                                                        : offersPerRow === 3
                                                        ? '30%'
                                                        : '49%',
                                            }"
                                        >
                                            <OfferCard :offer="offer" class="mb-2" />
                                        </div>
                                    </div>
                                </div>
                                <!-- <div v-else :class="{ 'd-none': !item.quest?.isAvailable }"> -->
                                <component
                                    :is="questComponentMap[item.quest.variant]"
                                    v-else
                                    :quest="item.quest"
                                    :available-quest="item.quest?.isAvailable"
                                />
                                <!-- </div> -->
                            </div>
                            <div v-if="!availableQuestCount" class="text-center mt-5">
                                <i class="h1 fas fa-trophy text-accent" />
                                <p class="lead text-accent">Well done!</p>
                                <p class="text-opaque">You have completed all available quests</p>
                            </div>
                        </div>
                    </b-tab>
                    <b-tab title="Completed">
                        <div v-for="(quest, key) of quests" :key="key" :class="{ 'd-none': quest.isAvailable }">
                            <component
                                :is="questComponentMap[quest.variant]"
                                :quest="quest"
                                class="mb-2 mx-lg-0 my-lg-3"
                                :available-quest="!quest?.isAvailable"
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
                class="rewards-column flex-grow-1"
                offset-xl="0"
            >
                <div class="mb-2 bg-rewards">
                    <div class="align-items-center p-3 overflow-hidden d-flex" style="justify-content: space-between">
                        <div>
                            <strong class="title-q">Rewards</strong>
                            <div class="text-opaque m-0 mt-1">Spend points to redeem</div>
                        </div>
                        <div class="custom-select-wrapper">
                            <select v-model="selectedValue" class="rewards-select">
                                <option>All</option>
                                <option>Santa</option>
                                <option>Playwall & Cashback</option>
                            </select>
                            <i class="fas fa-chevron-down custom-select-icon"></i>
                        </div>
                    </div>
                </div>
                <div v-if="mergedRewards.length > 0" class="rewards-container flex-1">
                    <div
                        v-for="(reward, index) in mergedRewards"
                        :key="index"
                        class="reward-item gr-2 mb-2"
                        :style="reward?.isPromoted ? 'width: 100%' : 'width: 49% !important'"
                    >
                        <component :is="componentMap[reward?.variant]" :reward="reward" />
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
import { QuestVariant, RewardSortVariant } from '../../types/enums/rewards';
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
import { CP_CAMPAIGN, SANTA_CAMPAIGN } from '@thxnetwork/app/config/secrets';
import { ref } from 'vue';
import { useAuthStore } from '@thxnetwork/app/stores/Auth';
import axios from 'axios';
import OfferCard from '@thxnetwork/app/components/OfferCard.vue';

const selectedValue = ref<string>('All');
const componentMap: { [variant: string]: string } = {
    [RewardVariant.Coin]: 'BaseCardRewardCoin',
    [RewardVariant.NFT]: 'BaseCardRewardNFT',
    [RewardVariant.Custom]: 'BaseCardRewardCustom',
    [RewardVariant.Coupon]: 'BaseCardRewardCoupon',
    [RewardVariant.DiscordRole]: 'BaseCardRewardDiscordRole',
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
        OfferCard,
    },
    props: {
        selectedPart: {
            type: String,
            default: 'Quests',
        },
        isSecondDivVisible: {
            type: Boolean,
            default: false,
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
            offers: [],
            offersPerRow: window.innerWidth > 1350 ? 3 : 2,
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
            return this.questStore.quests.filter((q: TBaseQuest) => q.isAvailable).length;
        },
        quests() {
            const { quests } = this.questStore;
            return quests
                .sort(sortMap[this.selectedSort.key])
                .map((quest: any, index: number) => ({ ...quest, index }));
        },
        mergedRewards() {
            if (this.selectedValue === 'All') {
                return [...this.rewardStore.rewards, ...this.reward2Store.rewards];
            } else if (this.selectedValue === 'Santa') {
                return this.reward2Store.rewards;
            } else if (this.selectedValue === 'Playwall & Cashback') {
                return this.rewardStore.rewards;
            }
            return [];
        },
        userManager() {
            return useAuthStore().userManager;
        },
        mergedQuestsAndOffers() {
            let merged = [];
            let offerIndex = 0;
            const questBatchSize = 4;
            let rowQuests = [];

            for (let i = 0; i < this.quests.length; i++) {
                const quest = this.quests[i];
                const isEndOfBatch = (i + 1) % questBatchSize === 0;
                rowQuests.push(quest);

                if (quest.variant === QuestVariant.Daily || isEndOfBatch) {
                    merged.push(...this.formatQuests(rowQuests));
                    rowQuests = [];
                    merged.push({
                        isOfferRow: true,
                        offers: this.offers.slice(offerIndex, offerIndex + this.offersPerRow).filter(Boolean),
                    });
                    offerIndex += this.offersPerRow;
                }
            }

            if (rowQuests.length > 0) {
                merged.push(...this.formatQuests(rowQuests));
            }

            while (offerIndex < this.offers.length) {
                merged.push({
                    isOfferRow: true,
                    offers: this.offers.slice(offerIndex, offerIndex + this.offersPerRow).filter(Boolean),
                });
                offerIndex += this.offersPerRow;
            }

            return merged;
        },
    },
    watch: {
        'accountStore.isAuthenticated': {
            async handler(isAuthenticated: boolean) {
                if (!isAuthenticated) return;
                if (!this.accountStore.account) {
                    await this.accountStore.getAccount();
                }
                await Promise.all([
                    this.questStore.list(SANTA_CAMPAIGN),
                    this.rewardStore.list(CP_CAMPAIGN),
                    this.reward2Store.list(SANTA_CAMPAIGN),
                    this.accountStore.getParticipants(SANTA_CAMPAIGN),
                ]);
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
    mounted() {
        this.fetchOffers();
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        async fetchOffers() {
            try {
                // const user = await this.userManager.getUser();
                const clid = this.accountStore.account?.providerUserId;
                const response = await axios.get(
                    `https://offers-api.santabrowser.com/offers/list?pageSize=10&pageNo=0&clid=${clid}`,
                );
                this.offers = response.data.trending;
            } catch (error) {
                console.error('Failed to fetch offers', error);
            }
        },
        handleResize() {
            this.offersPerRow = window.innerWidth > 1350 ? 3 : 2;
        },
        formatQuests(quests: any) {
            return quests.map((quest: TBaseQuest, index: number) => {
                const isLastInRow = index === quests.length - 1;
                return {
                    quest,
                    isAlone: quests.length % 2 !== 0 && isLastInRow,
                    isDaily: false,
                };
            });
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
.custom-select-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}
.rewards-select {
    appearance: none;
    width: 100px;
    border-radius: 4px;
    border: 1px solid rgba(77, 77, 77, 0.25);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    outline: none;
    padding: 8px 11px;
    text-overflow: ellipsis;
    padding-right: 30px;
    cursor: pointer;
}
.custom-select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #fff;
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
    //border: 1px dotted #f31a0760;
    border-top-left-radius: 13px !important;
    border-top-right-radius: 13px !important;
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

.btn-primary {
    box-shadow: rgba(0, 0, 0, 0.15) 0px 4px 4px 0px, rgba(255, 255, 255, 0.12) 0px 4px 4px 0px inset;
    background: rgb(212, 70, 70) !important;
    border-radius: 20px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    overflow: hidden;
}

.btn-primary::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300%;
    height: 300%;
    background: rgba(255, 255, 255, 0.15);
    transition: all 0.3s ease;
    border-radius: 50%;
    transform: translate(-50%, -50%) scale(0);
    z-index: -1;
}

.btn-primary:hover {
    box-shadow: rgba(0, 0, 0, 0.25) 0px 8px 16px 0px, rgba(255, 255, 255, 0.2) 0px 8px 16px 0px inset;
    background: rgb(248, 69, 69) !important;
    color: white;
}

.btn-primary:hover::before {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0;
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
    //zoom: 0.75;
}

.gr-2 .card-body {
    height: 205px;
    min-height: 205px !important;
    max-height: 205px !important;
}

.quests-column {
    min-height: 100vh;
    box-shadow: inset rgb(182 9 153 / 15%) 0px -7px 20px 8px;
    margin-right: 20px;
    border-radius: 7px;
    //background: #0e0f19;
    border-radius: 15px;
    border: 1px dotted #865c5c85;
    padding: 0px !important;
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
    margin-bottom: 15px;
}

.rewards-column {
    max-width: 380px;
    height: calc(100vh - 70px);
    position: sticky;
    top: 70px;
    background: radial-gradient(
            57.91% 58.02% at 50% 50%,
            rgba(0, 0, 0, 0) 0%,
            rgba(62, 0, 0, 0.05) 80.65%,
            rgba(112, 5, 5, 0.11) 100%
        ),
        rgba(0, 0, 0, 0.2);

    box-shadow: 0px 0px 49px 0px rgba(0, 7, 72, 0.12);
    border-radius: 15px;
    border: 1.5px solid rgba(166, 111, 111, 0.3);
    padding: 0 !important;
    margin-right: 20px;
}

.quests-title {
    backdrop-filter: brightness(0.3);
    overflow: hidden;
}

.quests-title i {
    line-height: 2;
}

.rewards-container {
    height: calc(100vh - 160px);
    overflow: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: flex-start;
    padding: 15px;
    column-gap: 2%;
    margin-bottom: 8px;
}
.title-q {
    font-size: 25px;
    line-height: 25px;
    color: #fff;
    //color: #feff00;
    font-weight: 600;
    font-family: 'Poppins';
    font-style: italic;
}

.card-title {
    font-family: 'Kode Mono', monospace;
    font-size: 1rem;
}

.text-opaque {
    color: #fff;
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    margin: 7px 0 7px 7px;
}

.quests-title .text-opaque {
    font-size: 11px;
}

.offer-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 100%;
    margin-left: 0;
    margin-right: 0;
    gap: 1%;
}

.offer-item {
    flex: 1 0 45%;
    //margin: 1%;
    max-width: 45%;
    box-sizing: border-box;
    background: #130301 !important;
    border-radius: 20px;

    .card {
        border: 0 !important;
        border-radius: 20px !important;
        img {
            border-radius: 20px;
            background: aliceblue;
            max-height: 130px;
            overflow: hidden;
            border: 0.5px solid rgba(13, 92, 226, 0.2705882353);
        }
    }
}
.regular-quest {
    width: 100%;
    margin-bottom: 15px;
}
.regular-quest > .card {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
}

.quests-box {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    column-gap: 2%;
}

.offers-box {
    background: linear-gradient(129deg, #572985, #3a0202e6);
    border-radius: 20px;
    padding: 2%;
    margin-bottom: 15px;
    h3 {
        font-family: 'Kode Mono', monospace;
        font-size: 1rem;
    }
}
@media (max-width: 992px) {
    .quest-cont .row > * {
        flex-shrink: unset;
    }
    .quests-column {
        margin-right: 12px !important;
    }
    .quest-cont {
        max-width: 100%;
    }
    .rewards-column {
        width: 100% !important;
        margin: 0 12px;
        max-width: 100%;
    }
    .quest-cont .row {
        height: 100%;
    }
    .rewards-column {
        position: relative;
        height: calc(100vh - 140px);
    }
    .rewards-container {
        height: calc(100vh - 205px);
    }
}

@media (max-width: 1400px) {
    .my-col-xl-7 {
        flex: 0 0 auto;
        width: 50%;
    }
}

@media (max-width: 1025px) {
    .quests-column {
        margin-right: 5px;
    }
}

@media (min-width: 1350px) {
    .offer-item {
        flex: 1 0 30%;
        //max-width: 30%;
    }

    .regular-quest {
        width: 49%;
        flex: 1 1 49%;
    }
}
</style>

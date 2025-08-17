<template>
    <b-container v-if="selectedPart === 'quests' || selectedPart === 'rewards'" class="quest-cont">
        <b-row>
            <b-col
                v-if="selectedPart === 'quests'"
                lg="6"
                xl="7"
                offset-xl="0"
                class="quests-column flex-grow-1 my-col-xl-7"
            >
                <!-- <div class="mb-2 align-items-center bg-quests rounded">
                    <div class="quests-title d-flex p-2">
                        <div>
                            <strong class="title-q">Quests</strong>
                            <div class="text-opaque m-0 mt-1">Earn points with tasks</div>
                        </div>
                        <i class="fas fa-tasks text-opaque ms-auto me-3" style="font-size: 1.2rem" />
                    </div>
                </div> -->
                <div class="d-flex gap-2 sticky-tabs">
                    <div
                        v-if="[0, 1].includes(activeTab)"
                        ref="filterDropdown"
                        class="filter-wrapper"
                        @click="toggleDropdown"
                    >
                        <div class="custom-dropdown" role="button" :aria-expanded="showDropdown ? 'true' : 'false'">
                            <span class="selected-option">{{ selectedQuestFilterLabel }}</span>
                            <img :src="dropdownIcon" alt="dropdown" height="3.91" width="6.76" />
                        </div>
                        <transition name="fade">
                            <ul v-if="showDropdown" class="custom-dropdown-options" @click.stop @mousedown.stop>
                                <li
                                    v-for="filter in questFilters"
                                    :key="filter.value"
                                    @click="selectFilter(filter.value)"
                                >
                                    {{ filter.label }}
                                </li>
                            </ul>
                        </transition>
                    </div>
                    <div ref="tabDropdown" class="filter-wrapper" @click.stop.prevent="toggleTabDropdown">
                        <div
                            class="custom-dropdown tabs-wrapper"
                            role="button"
                            :aria-expanded="showTabDropdown ? 'true' : 'false'"
                        >
                            <span class="selected-option">{{ currentTabLabel }}</span>
                            <img
                                :src="dropdownIcon"
                                alt="dropdown"
                                height="3.91"
                                width="6.76"
                                style="filter: var(--invert-img)"
                            />
                        </div>
                        <transition name="fade">
                            <ul v-if="showTabDropdown" class="custom-dropdown-options" @click.stop @mousedown.stop>
                                <li v-for="tab in tabs" :key="tab.index" @click="setActiveTab(tab.index)">
                                    {{ tab.label }}
                                </li>
                            </ul>
                        </transition>
                    </div>
                    <!-- Mobile-only Filters toggle to reveal search/sort -->
                    <b-button
                        v-if="accountStore.isMobile"
                        size="sm"
                        variant="dark"
                        class="ms-auto px-2 d-flex align-items-center"
                        aria-expanded="showFiltersMobile ? 'true' : 'false'"
                        @click.stop="showFiltersMobile = !showFiltersMobile"
                    >
                        <i class="fas fa-sliders-h me-1" aria-hidden="true"></i>
                        <span>Filters</span>
                        <span
                            v-if="activeFilterCountMobile"
                            class="filters-badge ms-2"
                            aria-label="Active filters count"
                        >
                            {{ activeFilterCountMobile }}
                        </span>
                    </b-button>
                </div>
                <!-- New row for search + sort (Desktop: always visible) -->
                <div class="d-none d-md-flex gap-2 sticky-tabs mt-2 align-items-center filters-row">
                    <div class="flex-grow-1 position-relative search-wrap">
                        <span class="search-icon" aria-hidden="true">
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M21 21L16.65 16.65"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                />
                                <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
                            </svg>
                        </span>
                        <b-form-input
                            ref="searchInput"
                            v-model.trim="qInput"
                            type="search"
                            size="sm"
                            placeholder="Search quests…"
                            class="search-input ps-5"
                            aria-label="Search quests"
                        />
                        <button
                            v-if="qInput"
                            class="clear-btn"
                            type="button"
                            aria-label="Clear search"
                            @click="
                                qInput = '';
                                $refs.searchInput &&
                                    ($refs.searchInput as any).focus &&
                                    ($refs.searchInput as any).focus();
                            "
                        >
                            &times;
                        </button>
                    </div>
                    <div ref="sortDropdown" class="filter-wrapper" @click.stop="toggleSortDropdown">
                        <div
                            class="custom-dropdown tabs-wrapper"
                            role="button"
                            :aria-expanded="showSortDropdown ? 'true' : 'false'"
                        >
                            <span class="selected-option">{{ selectedSort.label }}</span>
                            <img
                                :src="dropdownIcon"
                                alt="dropdown"
                                height="3.91"
                                width="6.76"
                                style="filter: var(--invert-img)"
                            />
                        </div>
                        <transition name="fade">
                            <ul v-if="showSortDropdown" class="custom-dropdown-options" @click.stop @mousedown.stop>
                                <li v-for="opt in sortOptions" :key="opt.key" @click="selectSort(opt)">
                                    {{ opt.label }}
                                </li>
                            </ul>
                        </transition>
                    </div>
                </div>
                <!-- New row for search + sort (Mobile: toggled) -->
                <transition name="filters-slide">
                    <div
                        :class="[
                            'd-md-none',
                            'gap-2',
                            'sticky-tabs',
                            'mt-2',
                            'align-items-center',
                            'filters-row',
                            showFiltersMobile ? 'd-flex' : 'd-none',
                        ]"
                    >
                        <div class="flex-grow-1 position-relative search-wrap">
                            <span class="search-icon" aria-hidden="true">
                                <svg
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M21 21L16.65 16.65"
                                        stroke="currentColor"
                                        stroke-width="2"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    />
                                    <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2" />
                                </svg>
                            </span>
                            <b-form-input
                                ref="searchInputMobile"
                                v-model.trim="qInput"
                                type="search"
                                size="sm"
                                placeholder="Search quests…"
                                class="search-input ps-5"
                                aria-label="Search quests"
                            />
                            <button
                                v-if="qInput"
                                class="clear-btn"
                                type="button"
                                aria-label="Clear search"
                                @click="
                                    qInput = '';
                                    $refs.searchInputMobile &&
                                        ($refs.searchInputMobile as any).focus &&
                                        ($refs.searchInputMobile as any).focus();
                                "
                            >
                                &times;
                            </button>
                        </div>
                        <div ref="sortDropdown" class="filter-wrapper" @click.stop="toggleSortDropdown">
                            <div
                                class="custom-dropdown tabs-wrapper"
                                role="button"
                                :aria-expanded="showSortDropdown ? 'true' : 'false'"
                            >
                                <span class="selected-option">{{ selectedSort.label }}</span>
                                <img
                                    :src="dropdownIcon"
                                    alt="dropdown"
                                    height="3.91"
                                    width="6.76"
                                    style="filter: var(--invert-img)"
                                />
                            </div>
                            <transition name="fade">
                                <ul v-if="showSortDropdown" class="custom-dropdown-options" @click.stop @mousedown.stop>
                                    <li v-for="opt in sortOptions" :key="opt.key" @click="selectSort(opt)">
                                        {{ opt.label }}
                                    </li>
                                </ul>
                            </transition>
                        </div>
                    </div>
                </transition>
                <!-- One-time hero welcome (below search bar) -->
                <section v-if="showHero" class="hero-welcome my-2" role="region" aria-label="Welcome message">
                    <div class="hero-inner d-flex flex-column flex-md-row align-items-md-center gap-3">
                        <div class="flex-grow-1">
                            <h2 class="m-0 hero-title">Welcome to Santa Quests</h2>
                            <p class="m-0 mt-2 text-opaque hero-sub">
                                Complete tasks, earn points, and unlock rewards.
                            </p>
                        </div>
                        <div class="d-flex gap-2">
                            <b-button
                                size="lg"
                                variant="primary"
                                class="px-3 py-2"
                                aria-label="Dismiss welcome"
                                @click="dismissHero"
                            >
                                Got it
                            </b-button>
                        </div>
                    </div>
                </section>
                <div v-if="activeTab === 0">
                    <!-- Available content -->
                    <div class="quests-box">
                        <div v-if="questStore.isLoading || isLoadingOffers">
                            <div v-if="!accountStore.isMobile">
                                <SkeletonLoader :count="10" size="regular" />
                            </div>
                            <div v-else>
                                <SkeletonLoader :count="10" size="regular" />
                                <SkeletonLoader :count="8" size="small" />
                                <SkeletonLoader :count="10" size="regular" />
                                <SkeletonLoader :count="8" size="small" />
                            </div>
                        </div>
                        <div v-else class="d-flex flex-column gap-5">
                            <div
                                v-for="group in filteredQuests"
                                :key="group.title"
                                :class="{
                            'd-none': group.quests && group.quests.every((quest: TBaseQuest) => {
                                if (quest.variant === 0) {
                                    return quest.isCompleted;
                                } else {
                                    return !quest.isAvailable;
                                }
                            }), 
                            }"
                            >
                                <div v-if="!group.isOfferRow">
                                    <h3 class="quest-group-title">{{ group.title }}</h3>
                                    <div class="quest-group">
                                        <div
                                            v-for="quest in group.quests"
                                            :key="quest._id"
                                            :class="{
                                                'd-none': quest.variant === 0 ? quest.isCompleted : !quest.isAvailable,
                                                'quest-item': true,
                                            }"
                                            class="quest-group-item"
                                        >
                                            <component
                                                :is="questComponentMap[quest.variant]"
                                                :quest="quest"
                                                :group-title="group.title"
                                            />
                                        </div>
                                        <div
                                            v-if="group.title === 'Santa\'s Quests' && !referralClaimed"
                                            class="quest-item quest-group-item"
                                        >
                                            <BaseCardQuestReferral
                                                :referral="
                                                    'https://santabrowser.com/download?install_referrer=' + hashedCode
                                                "
                                                :imageurl="'https://thx-public.s3.ap-south-1.amazonaws.com/newreferral-neGnhMMfjymfApS8jx7BaJ.jpg'"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="offers-box">
                                    <h3 class="quest-group-title">{{ group.title }}</h3>
                                    <div class="offer-row">
                                        <div v-for="offer in group.offers" :key="offer.id" class="offer-item">
                                            <OfferCard :offer="offer" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="!availableQuestCount" class="text-center mt-5">
                                <i class="h1 fas fa-trophy text-accent" />
                                <p class="lead text-accent">Well done!</p>
                                <p class="text-opaque">You have completed all available quests</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="activeTab === 1">
                    <div class="quests-box">
                        <div v-if="questStore.isLoading">
                            <SkeletonLoader :count="10" size="regular" />
                            <SkeletonLoader :count="10" size="regular" />
                        </div>
                        <div v-else class="d-flex flex-column gap-5">
                            <div
                                v-for="group in filteredCompletedQuests"
                                :key="group.title"
                                :class="{
                                'd-none': 
                                    group.quests &&
                                    group.quests.every((quest: TBaseQuest) =>
                                        quest.variant === 0 ? !quest.isCompleted : quest.isAvailable
                                    ) &&
                                    !group.isOfferRow &&
                                    (group.title === 'Santa\'s Quests' ? !referralClaimed : true)
                                }"
                            >
                                <h3 class="quest-group-title">{{ group.title }}</h3>
                                <div class="quest-group">
                                    <div
                                        v-if="group.title === 'Santa\'s Quests' && referralClaimed"
                                        class="quest-item quest-group-item"
                                    >
                                        <BaseCardQuestReferral
                                            v-if="referralClaimed"
                                            :completed="true"
                                            :referral="
                                                'https://santabrowser.com/download?install_referrer=' + hashedCode
                                            "
                                            :imageurl="'https://thx-public.s3.ap-south-1.amazonaws.com/newreferral-neGnhMMfjymfApS8jx7BaJ.jpg'"
                                        />
                                    </div>
                                    <div
                                        v-for="quest in group.quests"
                                        :key="quest._id"
                                        :class="{
                                            'd-none': quest.isAvailable === true,
                                            'quest-item': true,
                                        }"
                                        class="quest-group-item"
                                    >
                                        <component :is="questComponentMap[quest.variant]" :quest="quest" />
                                    </div>
                                </div>
                            </div>
                            <div
                                v-if="
                                    referralClaimed
                                        ? filteredCompletedQuests.length === 0 ||
                                          (filteredCompletedQuests.every((group) =>
                                              group.quests.every((quest) => quest.isAvailable),
                                          ) &&
                                              !referralClaimed)
                                        : filteredCompletedQuests.length === 0 ||
                                          filteredCompletedQuests.every((group) =>
                                              group.quests.every((quest) => quest.isAvailable),
                                          )
                                "
                                class="text-center text-muted mt-3 text-opaque empty-message"
                            >
                                You haven't completed any quests yet.
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Mobile-only bottom spacer to clear fixed bottom navbar -->
                <div class="mobile-bottom-spacer d-md-none" aria-hidden="true"></div>
            </b-col>
            <b-col
                v-if="selectedPart === 'rewards'"
                lg="5"
                xl="5"
                xxl="4"
                class="quests-column flex-grow-1"
                offset-xl="0"
            >
                <!-- Rewards Tabs Dropdown (mimicking quests design) -->
                <div class="d-flex gap-2 sticky-tabs">
                    <div ref="rewardTabDropdown" class="filter-wrapper" @click="toggleRewardTabDropdown">
                        <div class="custom-dropdown tabs-wrapper">
                            <span class="selected-option">{{ rewardCurrentTabLabel }}</span>
                            <img
                                :src="dropdownIcon"
                                alt="dropdown"
                                height="3.91"
                                width="6.76"
                                style="filter: var(--invert-img)"
                            />
                        </div>
                        <transition name="fade">
                            <ul v-if="showRewardTabDropdown" class="custom-dropdown-options" @click.stop>
                                <li v-for="tab in rewardTabs" :key="tab.index" @click="setActiveRewardTab(tab.index)">
                                    {{ tab.label }}
                                </li>
                            </ul>
                        </transition>
                    </div>
                </div>

                <!-- Rewards Content -->
                <div v-if="activeRewardTab === 0">
                    <!-- Available Rewards -->
                    <div class="quests-box">
                        <div
                            v-if="rewardStore.isLoading || reward2Store.isLoading"
                            class="d-flex justify-content-center"
                        >
                            <div class="w-100">
                                <SkeletonLoader :count="10" size="rewards" />
                            </div>
                        </div>
                        <div v-else class="reward-group">
                            <div
                                v-for="reward in availableRewards"
                                :key="reward._id"
                                :class="[reward.isPromoted ? 'reward-item-promoted' : 'reward-item']"
                            >
                                <component :is="componentMap[reward.variant]" :reward="reward" />
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="activeRewardTab === 1">
                    <!-- Completed Rewards -->
                    <div class="quests-box">
                        <div
                            v-if="rewardStore.isLoading || reward2Store.isLoading"
                            class="d-flex justify-content-center"
                        >
                            <div class="w-100">
                                <SkeletonLoader :count="10" size="rewards" />
                            </div>
                        </div>
                        <div v-else class="reward-group">
                            <div
                                v-for="reward in completedRewards"
                                :key="reward._id"
                                :class="{ 'reward-item-promoted': reward.isPromoted }"
                                class="reward-item"
                            >
                                <component :is="componentMap[reward.variant]" :reward="reward" />
                            </div>
                            <div
                                v-if="!completedRewards.length"
                                class="text-center text-muted mt-3 text-opaque empty-message"
                            >
                                You haven't completed any rewards yet.
                            </div>
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '@thxnetwork/app/stores/Account';
import { useWalletStore } from '@thxnetwork/app/stores/Wallet';
import { useQuestStore } from '@thxnetwork/app/stores/Quest';
import { useRewardStore } from '@thxnetwork/app/stores/Reward';
import { useReward2Store } from '@thxnetwork/app/stores/Reward';
import { QuestVariant, RewardSortVariant } from '@thxnetwork/app/types/enums/rewards';
import { questComponentMap, sortMap } from '@thxnetwork/app/utils/quests';
import BaseCardQuestInvite from '@thxnetwork/app/components/card/BaseCardQuestInvite.vue';
import BaseCardQuestSocial from '@thxnetwork/app/components/card/BaseCardQuestSocial.vue';
import BaseCardQuestCustom from '@thxnetwork/app/components/card/BaseCardQuestCustom.vue';
import BaseCardQuestDaily from '@thxnetwork/app/components/card/BaseCardQuestDaily.vue';
import BaseCardQuestWeb3 from '@thxnetwork/app/components/card/BaseCardQuestWeb3.vue';
import BaseCardQuestGitcoin from '@thxnetwork/app/components/card/BaseCardQuestGitcoin.vue';
import BaseCardQuestWebhook from '@thxnetwork/app/components/card/BaseCardQuestWebhook.vue';
import { RewardVariant } from '@thxnetwork/app/types/enums/rewards';
import BaseCardRewardCoin from '@thxnetwork/app/components/card/BaseCardRewardCoin.vue';
import BaseCardRewardNFT from '@thxnetwork/app/components/card/BaseCardRewardNFT.vue';
import BaseCardRewardCustom from '@thxnetwork/app/components/card/BaseCardRewardCustom.vue';
import BaseCardRewardCoupon from '@thxnetwork/app/components/card/BaseCardRewardCoupon.vue';
import BaseCardRewardDiscordRole from '@thxnetwork/app/components/card/BaseCardRewardDiscordRole.vue';
import { CP_CAMPAIGN, SANTA_CAMPAIGN } from '@thxnetwork/app/config/secrets';
import { ref } from 'vue';
import { useAuthStore } from '@thxnetwork/app/stores/Auth';
import axios from 'axios';
import OfferCard from '@thxnetwork/app/components/OfferCard.vue';
import { useTrackPageview } from '../utils/snowplowTracker';
import BaseCardQuestReferral from './card/BaseCardQuestReferral.vue';
import * as crypto from 'crypto';
import dropdownIcon from '@thxnetwork/app/assets/dropdown.png';
import { detectDevice, isCompatibleWithOffer } from '@thxnetwork/app/utils/device';

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
        BaseCardQuestReferral,
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
            sortOptions: [
                { label: 'Default', key: RewardSortVariant.Default },
                { label: 'Points', key: RewardSortVariant.Amount },
                { label: 'Newest', key: RewardSortVariant.Created },
            ],
            activeFilters: [],
            entry: null,
            offers: [] as any[],
            offersPerRow: this.calculateOffersPerRow(),
            isLoadingOffers: false,
            qInput: '',
            qDebounced: '',
            qDebounceId: null as any,
            selectedQuestFilter: 'all', // initial selection
            questFilters: [
                { label: 'All Quests', value: 'all' },
                { label: 'Santa', value: 'santa' },
                { label: 'X', value: 'x' },
                { label: 'Discord', value: 'discord' },
                // { label: 'Youtube Quest', value: 'youtube' },
            ],
            showDropdown: false,
            activeTab: 0,
            hashedCode: '',
            tabs: [
                { label: 'Available', index: 0 },
                { label: 'Completed', index: 1 },
            ],
            showTabDropdown: false,
            dropdownIcon,
            showSortDropdown: false,
            showFiltersMobile: false,
            activeRewardTab: 0,
            rewardTabs: [
                { label: 'Available', index: 0 },
                { label: 'Completed', index: 1 },
            ],
            showRewardTabDropdown: false,
            deviceInfo: detectDevice(),
            showHero: false,
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
            } else if (this.selectedValue === 'Cash Rewards') {
                return this.rewardStore.rewards;
            }
            return [];
        },
        userManager() {
            return useAuthStore().userManager;
        },
        referralClaimed() {
            return !!this.accountStore.inviter;
        },
        filteredOffers() {
            return this.offers.filter((offer) => isCompatibleWithOffer(offer, this.deviceInfo));
        },
        heroStorageKey(): string {
            // Keyed per campaign so users see it once per pool
            const pid = this.accountStore.poolId || 'default';
            return `snt:${pid}:welcome_shown:v1`;
        },
        filteredCompletedQuests() {
            let completedQuests = this.mergedQuestsAndOffers('completed');
            completedQuests = completedQuests.filter((group) => !group.isOfferRow);

            if (this.selectedQuestFilter !== 'all') {
                completedQuests = completedQuests.filter((group) => {
                    switch (this.selectedQuestFilter) {
                        case 'santa':
                            return group.title === "Santa's Quests";
                        case 'x':
                            return group.title === 'X Quests';
                        case 'discord':
                            return group.title === 'Discord Quests';
                        case 'youtube':
                            return group.title === 'YouTube Quests';
                        default:
                            return true;
                    }
                });
            }

            // Apply search filter
            if (this.qDebounced && this.qDebounced.trim().length) {
                const qq = this.qDebounced.trim().toLowerCase();
                completedQuests = completedQuests
                    .map((group: any) => ({
                        ...group,
                        quests: (group.quests || []).filter((quest: any) => this.matchesSearch(quest, qq)),
                    }))
                    .filter((g: any) => g.quests && g.quests.length > 0);
            }

            return completedQuests;
        },
        filteredQuests() {
            let filterQuests = this.mergedQuestsAndOffers('available');

            // When searching, hide offers and filter quests within groups
            if (this.qDebounced && this.qDebounced.trim().length) {
                const qq = this.qDebounced.trim().toLowerCase();
                filterQuests = filterQuests
                    .filter((group: any) => !group.isOfferRow)
                    .map((group: any) => ({
                        ...group,
                        quests: (group.quests || []).filter((quest: any) => this.matchesSearch(quest, qq)),
                    }))
                    .filter((g: any) => g.quests && g.quests.length > 0);
            }

            if (this.selectedQuestFilter === 'all') return filterQuests;

            return filterQuests.filter((group) => {
                if (group.isOfferRow) return false;

                switch (this.selectedQuestFilter) {
                    case 'santa':
                        return group.title === "Santa's Quests";
                    case 'x':
                        return group.title === 'X Quests';
                    case 'discord':
                        return group.title === 'Discord Quests';
                    case 'youtube':
                        return group.title === 'YouTube Quests';
                    default:
                        return true;
                }
            });
        },
        selectedQuestFilterLabel() {
            const f = this.questFilters.find((f) => f.value === this.selectedQuestFilter);
            return f ? f.label : 'All Quests';
        },
        currentTabLabel() {
            return this.tabs[this.activeTab].label;
        },
        otherTabs(): Array<{ label: string; index: number }> {
            return this.tabs.filter((tab) => tab.index !== this.activeTab);
        },
        rewardCurrentTabLabel(): string {
            return this.rewardTabs[this.activeRewardTab].label;
        },
        availableRewards() {
            return this.mergedRewards.filter((reward) => reward.isAvailable && !reward.isLimitReached);
        },
        completedRewards() {
            return this.mergedRewards.filter((reward) => !reward.isAvailable || reward.isLimitReached);
        },
        activeFilterCountMobile(): number {
            let c = 0;
            if (this.qDebounced && this.qDebounced.trim().length) c += 1;
            if (this.selectedSort?.key !== RewardSortVariant.Default) c += 1;
            if (this.selectedQuestFilter && this.selectedQuestFilter !== 'all') c += 1;
            return c;
        },
    },
    watch: {
        'qInput': {
            handler(v: string) {
                if (this.qDebounceId) clearTimeout(this.qDebounceId);
                this.qDebounceId = window.setTimeout(() => {
                    this.qDebounced = v || '';
                }, 250);
            },
            immediate: true,
        },
        'showFiltersMobile'(val: boolean) {
            if (val) {
                this.$nextTick(() => {
                    const el = this.$refs.searchInputMobile as any;
                    if (el && typeof el.focus === 'function') el.focus();
                });
            }
        },
        'accountStore.isAuthenticated': {
            async handler(isAuthenticated: boolean) {
                if (!isAuthenticated) return;
                if (!this.accountStore.account) {
                    await this.accountStore.getAccount();
                    this.fetchOffers();
                }

                await Promise.all([
                    this.questStore.list(SANTA_CAMPAIGN),
                    this.rewardStore.list(CP_CAMPAIGN),
                    this.reward2Store.list(SANTA_CAMPAIGN),
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
        useTrackPageview();
        document.addEventListener('click', this.handleClickOutside);
        // Show hero if not yet dismissed
        try {
            const stored = window.localStorage.getItem(this.heroStorageKey);
            this.showHero = !stored;
        } catch (e) {
            this.showHero = true;
        }
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        matchesSearch(quest: any, qq: string) {
            try {
                const fields = [quest?.title, quest?.description, quest?.name];
                return fields.some((v) => typeof v === 'string' && v.toLowerCase().includes(qq));
            } catch (e) {
                return false;
            }
        },
        async fetchOffers() {
            this.isLoadingOffers = true;
            try {
                const clid = this.accountStore.account?.providerUserId;
                this.hashedCode = this.hashClid(clid);
                const response = await axios.get(
                    `https://offers-api.santabrowser.com/offers/list?&pageNo=0&clid=${clid}`,
                );
                const trendingOffers = response.data.trending.slice(0, 10);
                const dataOffers = response.data.data.slice(0, 10);

                this.offers = [...trendingOffers, ...dataOffers];
            } catch (error) {
                console.error('Failed to fetch offers', error);
            } finally {
                this.isLoadingOffers = false;
            }
        },
        hashClid(clientId: any) {
            // Create a SHA1 hash of the clid
            const sha1Hash = crypto.createHash('sha1').update(Buffer.from(clientId, 'utf-8')).digest('hex');
            // Take the substring from position 6 to 20
            const substring = sha1Hash.substring(6, 20);
            return substring;
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
        toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },
        selectFilter(value: string) {
            this.selectedQuestFilter = value;
            // Close after selection for reliability
            this.showDropdown = false;
        },
        handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            const closeIfOutside = (refName: string, setter: () => void) => {
                const refVal = (this.$refs as any)[refName] as HTMLElement | HTMLElement[] | undefined;
                if (!refVal) return;
                // Normalize to array to support duplicate refs (e.g., desktop + mobile)
                const refEls: HTMLElement[] = Array.isArray(refVal) ? refVal : [refVal];
                // If click target is not inside any of the ref elements, close it
                const isInside = refEls.some((el) => el && el.contains(target));
                if (!isInside) setter();
            };

            closeIfOutside('filterDropdown', () => (this.showDropdown = false));
            closeIfOutside('tabDropdown', () => (this.showTabDropdown = false));
            closeIfOutside('sortDropdown', () => (this.showSortDropdown = false));
            closeIfOutside('rewardTabDropdown', () => (this.showRewardTabDropdown = false));
        },
        setActiveTab(index: number) {
            this.activeTab = index;
            this.showTabDropdown = false;
        },
        toggleTabDropdown() {
            this.showTabDropdown = !this.showTabDropdown;
        },
        toggleSortDropdown() {
            this.showSortDropdown = !this.showSortDropdown;
        },
        toggleRewardTabDropdown() {
            this.showRewardTabDropdown = !this.showRewardTabDropdown;
        },
        setActiveRewardTab(index: number) {
            this.activeRewardTab = index;
            this.showRewardTabDropdown = false;
        },
        dismissHero() {
            try {
                window.localStorage.setItem(this.heroStorageKey, String(Date.now()));
            } catch (e) {
                // noop
            }
            this.showHero = false;
        },
        selectSort(opt: { label: string; key: number }) {
            this.selectedSort = opt;
            this.showSortDropdown = false;
        },

        calculateOffersPerRow() {
            const containerWidth = window.innerWidth;
            if (containerWidth > 1560) return 8;
            if (containerWidth > 1400) return 7;
            if (containerWidth > 1240) return 6;
            if (containerWidth > 1080) return 5;
            if (containerWidth > 992) return 4;
            if (containerWidth < 992) return 10;
        },

        mergedQuestsAndOffers(filterType: 'completed' | 'available' = 'available') {
            const santaQuests: TBaseQuest[] = [];
            const xQuests: TBaseQuest[] = [];
            const discordQuests: TBaseQuest[] = [];
            const youtubeQuests: TBaseQuest[] = [];
            const otherQuests: TBaseQuest[] = [];

            this.quests.forEach((quest: TBaseQuest) => {
                switch (quest.variant) {
                    case QuestVariant.Daily:
                    case QuestVariant.Invite:
                    case QuestVariant.Custom:
                    case QuestVariant.Web3:
                    case QuestVariant.Gitcoin:
                    case QuestVariant.Webhook:
                        santaQuests.push(quest);
                        break;
                    case QuestVariant.Twitter:
                        xQuests.push(quest);
                        break;
                    case QuestVariant.Discord:
                        discordQuests.push(quest);
                        break;
                    case QuestVariant.YouTube:
                        youtubeQuests.push(quest);
                        break;
                    default:
                        otherQuests.push(quest);
                }
            });

            santaQuests.sort((a, b) => {
                if (a.variant === QuestVariant.Daily && b.variant !== QuestVariant.Daily) {
                    return -1;
                } else if (a.variant !== QuestVariant.Daily && b.variant === QuestVariant.Daily) {
                    return 1;
                }
                return 0;
            });

            xQuests.sort((a: any, b: any) => a.amount - b.amount);

            const groupedQuests = [
                { title: "Santa's Quests", quests: santaQuests, refQuest: this.referralClaimed },
                { title: 'X Quests', quests: xQuests },
                { title: 'Discord Quests', quests: discordQuests },
                { title: 'YouTube Quests', quests: youtubeQuests },
                { title: 'Other Quests', quests: otherQuests },
            ];
            if (filterType === 'completed') {
                return groupedQuests;
            }

            const merged = [] as any[];
            let offerIndex = 0;
            const totalGroups = groupedQuests.length;

            groupedQuests.forEach((group, index) => {
                merged.push(group);

                const isVisible = group.quests && group.quests.some((quest: TBaseQuest) => quest.isAvailable);

                if (isVisible && offerIndex < this.filteredOffers.length) {
                    let offersForGroup;
                    if (index < totalGroups - 1) {
                        offersForGroup = this.filteredOffers.slice(offerIndex, offerIndex + this.offersPerRow);
                        offerIndex += this.offersPerRow;
                    } else {
                        offersForGroup = this.filteredOffers.slice(offerIndex);
                    }
                    merged.push({
                        title: 'Top Performing Offers',
                        isOfferRow: true,
                        offers: offersForGroup,
                    });
                }
            });

            return merged;
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
    position: relative;
    border-radius: 5px;
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
    overflow: hidden;
    background: var(--btn-primary-santa) !important;
    border: 1px solid transparent;
    color: #ffffff;
    transition: background 0.15s ease-in-out, border-color 0.3s ease;
    z-index: 0;
    padding: 7px 2px;
    min-height: 36px;
}
.btn-primary::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    background: transparent;
    transition: opacity 0.3s ease;
    opacity: 1;
}

.btn-primary:hover::before {
    background: var(--btn-primary-santa-hover);
    opacity: 1;
}

.btn-primary:hover,
.btn-primary:active,
.btn-primary:disabled,
.btn-primary:focus-visible {
    background: var(--btn-primary-santa);
    border-color: transparent !important;
    box-shadow: inherit;
}
.btn-primary:disabled {
    background: var(--btn-disabled-bg) !important;
    border: 1px solid var(--btn-disabled-border);
    opacity: 0.55;
    color: var(--btn-disabled-color);
    font-weight: 500;
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
    min-height: 180px !important;
    max-height: 205px !important;
}

.quests-column {
    height: calc(100vh - 70px);
    margin-right: 20px;
    overflow: visible;
    padding: 0;
}

.quests-column .tab-content .card {
    overflow: hidden;
    border-radius: 0px;
}

.rewards-column {
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

.hero-welcome {
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0) 100%), var(--tabs-bg);
    border: 1px solid var(--dropdown-border-color);
    border-radius: 14px;
    padding: 18px 16px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.hero-inner {
    align-items: center;
}
.hero-title {
    font-family: 'Poppins', sans-serif;
    font-size: clamp(26px, 4vw, 40px);
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--title-color);
}
.hero-sub {
    font-size: clamp(15px, 2.2vw, 20px);
    line-height: 1.4;
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
    color: var(--body-text);
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 100%;
    margin: 7px 0 7px 7px;
}

.offer-row {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 140px;
    gap: 20px;
    scrollbar-width: none;
    padding: 5px 0;
}

.offer-item {
    //flex: 1 0 45%;
    //margin: 1%;
    //max-width: 45%;
    box-sizing: border-box;
    background: var(--quest-item-bg);
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    //margin-bottom: 15px;
    transition: transform 0.3s ease-in-out;

    &:hover {
        transform: scale(1.02);
    }
    .card {
        border: 0 !important;
        border-radius: 10px !important;
        img {
            border-radius: 4px;
            overflow: hidden;
            width: 100%;
            height: 96px;
            object-fit: cover;
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
    height: calc(100vh - 200px);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    gap: 25px;
    margin-top: 24px;

    scrollbar-width: none;
    -ms-overflow-style: none;
}

.offers-box {
    // background: var(--quest-item-bg);
    border-radius: 20px;
    // padding: 15px 20px;
    padding-bottom: 0;
    h3 {
        font-family: 'Poppins', sans-serif;
        color: var(--title-color);
        font-feature-settings: 'liga' off, 'clig' off;
        text-shadow: 0px 1px 9px rgba(255, 255, 255, 0.3);
        font-size: 18px;
        font-style: normal;
        font-weight: 500;
        line-height: 18px;
    }
}

.quests-column .nav-item {
    flex-grow: 0;
}
.nav-link {
    background: var(--nav-link-bg);
    color: #8e8e8e !important;
}
.quests-column .nav-link {
    width: 158px !important;
    display: flex;
    justify-content: center;

    border-bottom-color: transparent;
    border-bottom-width: 0px;
    color: #8e8e8e;
    font-size: 12px;
    line-height: 16px;
    font-weight: 400;
}

.quests-column .nav-link.active {
    border-color: var(--nav-border-color) !important;
    border-bottom-color: var(--border-as-nav-color) !important;
    border-bottom-width: 1px;
    font-weight: 600;
}
.nav-link.active {
    background-color: var(--nav-link-active-bg) !important;
    border-color: var(--nav-border-color) !important;
    color: var(--body-text) !important;
    font-weight: 600;
}

.quests-column .nav {
    position: relative;
    border-bottom-color: var(--nav-border-color);
}

.quests-column .nav-item .nav-link.active::after {
    display: none;
}

.quests-column .nav-item .nav-link.active::before {
    display: none;
    left: 319px;
    width: 60%;
}
/* removed: nth-child underline adjustments for pseudo elements */

.quest-group,
.reward-group {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.quest-item {
    // min-height: 265px;
    overflow: hidden;
    // background-color: var(--quest-item-bg);
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    min-height: 280px;
}
.quest-item-daily {
    background-color: var(--quest-item-bg);
    padding: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
.quest-item-daily {
    grid-column: span 2;
}
.reward-item-promoted {
    grid-column: span 3;
}
.quest-group-title {
    color: var(--title-color);
    font-feature-settings: 'liga' off, 'clig' off;
    text-shadow: 0px 1px 9px rgba(255, 255, 255, 0.3);
    font-family: Poppins;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
    margin-bottom: 10px;
}

.reward-group {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
}

.text-muted {
    color: var(--body-text) !important;
}

.quest-modal-title {
    color: var(--modal-text-color);
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
}

.quest-modal-text {
    color: var(--modal-text-color);
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 17px;
    margin-bottom: 10px;
}

.filter-wrapper {
    display: flex;
    position: relative;
}

.custom-dropdown {
    display: flex;
    align-items: center;
    background: var(--btn-primary-santa);
    padding: 0px 12px;
    border-radius: 5px;
    position: relative;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    padding: 8px 12px;
    border: 1px solid var(--dropdown-border-color);
    color: #fff;
    min-width: 100px;
}

.selected-option {
    margin-right: 20px;
    font-size: 12px;
    white-space: nowrap;
}

.custom-dropdown-options {
    list-style: none;
    margin: 0;
    padding: 0;
    position: absolute;
    border-radius: 5px;
    top: 100%;
    left: 0;
    width: 100%;
    z-index: 999;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--dropdown-border-color);
    background: var(--dropdown-background);
    li {
        padding: 8px 12px;
        font-size: 12px;
        color: var(--body-text);
        &:hover {
            background: var(--dropdown-border-color);
        }
        cursor: pointer;
    }
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
    opacity: 0;
}
.reward-item {
    grid-column: span 2;
}
.tabs-wrapper {
    background: var(--tabs-bg);
    color: var(--body-text);
    box-shadow: var(--balance-box-shadow);
}
.quest-cont {
    margin: 0;
}

@media (max-width: 992px) {
    .quest-cont .row > * {
        flex-shrink: unset;
        display: flex;
        flex: 1;
        // overflow: hidden;
        flex-direction: column;
        height: 100%;
        padding-bottom: 10px !important;
        margin: 0;
        padding-top: 10px;
        padding: 0 0 10px 0;
    }
    .quest-cont {
        max-width: 100%;
        flex: 1;
        display: flex;
        // overflow: hidden;
        flex-direction: column;
    }
    .rewards-column {
        width: 100% !important;
        margin: 0 12px;
        max-width: 100%;
    }
    .quest-cont .row {
        height: 100%;
        display: flex;
        flex: 1;
        // overflow: hidden;
        flex-wrap: nowrap;
    }
    .rewards-column {
        position: relative;
        height: calc(100vh - 140px);
    }
    .rewards-container {
        height: calc(100vh - 205px);
    }
    .quests-box {
        height: auto;
        /* let the page scroll; do not clip children */
        overflow: visible;
        margin: 0;
        margin-top: 22px;
    }
    .reward-group {
        gap: 0;
        column-gap: 10px;
        row-gap: 10px;
    }
    .quests-column .nav-item {
        flex: 1 1 20%;
        box-sizing: border-box;
    }
    .quests-column .nav-link {
        width: 100% !important;
        padding: 12px 16px;
    }
    .quest-item {
        grid-column: span 1;
        min-width: 235px;
    }
    .quest-item-daily {
        grid-column: span 2;
    }
    .quests-column .tabs {
        flex: 1;
        display: flex;
        flex-direction: column;
        // overflow: hidden;
    }
    .quests-column .tabs > div:first-child {
        padding-top: 15px;
        position: sticky;
        top: -5px;
        z-index: 22;
        background-color: var(--sticky-header-bg);
        padding-bottom: 10px;
    }
    .quests-column .tabs .tab-content {
        flex: 1;
        margin-top: 10px;
        scrollbar-width: none;
        -ms-overflow-style: none;
        padding: 0 10px;
    }
    .nav-link.active::before,
    .nav-link.active::after {
        display: none;
    }
    .quests-column .nav {
        //border-bottom: 1px solid var(--nav-border-color);
        align-items: center;
    }

    .filter-wrapper {
        position: relative;
        margin: 0;
        top: 0;
        left: 0;
    }
    .quest-group {
        grid-auto-flow: column;
        grid-auto-columns: 260px;
        overflow-x: auto;
        grid-template-columns: none;
    }
    .offer-row {
        gap: 20px;
        display: grid !important;
        grid-auto-flow: column;
        grid-auto-columns: 140px;
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        grid-template-columns: none;
    }

    .reward-item-promoted {
        grid-column: 1/-1;
    }
    .quests-column {
        overflow: unset;
    }
    .sticky-tabs {
        position: sticky;
        top: -17px;
        padding: 15px 0;
        background: var(--body-rewards-bg);
        z-index: 111;
    }
}
@media (max-width: 774px) {
    .reward-group {
        grid-template-columns: repeat(2, 1fr);
        gap: 10px;
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
@media (max-width: 576px) {
    .reward-group {
        grid-template-columns: repeat(1, 1fr);
        gap: 10px;
    }
    .reward-item-promoted {
        grid-column: span 2;
    }
    .offer-item {
        flex: 1 0 100%;
        max-width: 100% !important;
        width: 100% !important;
    }
}
@media (max-width: 340px) {
    .quests-column .nav-link {
        padding: 10px;
        font-size: 10px;
    }
}
@media (min-width: 1400px) {
    .quest-cont {
        max-width: 100%;
    }
}
@media (max-width: 476px) {
    .quests-column .nav-link {
        padding: 12px 12px;
    }
    .quests-column .nav-item {
        flex: 1 1 0;
    }
}
@media (max-width: 447px) {
    .quests-column .nav-link {
        padding: 12px 5px;
    }
}
@media (max-width: 388px) {
    .quests-column .nav-link {
        font-size: 10px;
    }
    .quests-column .nav {
        border: none;
    }

    .quests-column .nav {
        overflow-x: auto;
        width: 100%;
        flex-wrap: nowrap;
        scrollbar-width: none;
    }
}

/* Search input with leading icon */
.search-wrap {
    position: relative;
}
.search-wrap .search-icon {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    color: var(--text-opaque, rgba(255, 255, 255, 0.6));
    pointer-events: none;
}

/* Slide down/up transition for filters row */
.filters-slide-enter-active,
.filters-slide-leave-active {
    transition: all 180ms ease;
}
.filters-slide-enter-from,
.filters-slide-leave-to {
    opacity: 0;
    transform: translateY(-6px);
}
/* Clear search button */
.clear-btn {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    border: 0;
    background: transparent;
    color: var(--text-opaque, rgba(255, 255, 255, 0.6));
    font-size: 18px;
    line-height: 1;
    padding: 0 2px;
    cursor: pointer;
}
.clear-btn:hover {
    color: var(--text, #fff);
}

/* Filters badge */
.filters-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--primary, #0d6efd);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    line-height: 1;
}

/* Ensure search input and dropdown have the same height */
.filters-row .search-input.form-control {
    height: 36px;
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 14px;
}
.filters-row .custom-dropdown.tabs-wrapper {
    height: 36px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 12px;
    border-radius: 6px;
}

/* Light theme overrides for search bar visibility */
:root[data-theme='light'] .search-wrap .search-icon,
[data-bs-theme='light'] .search-wrap .search-icon,
body.light .search-wrap .search-icon,
html.light .search-wrap .search-icon {
    color: var(--text-muted, #475569);
}

:root[data-theme='light'] .filters-row .search-input.form-control,
[data-bs-theme='light'] .filters-row .search-input.form-control,
body.light .filters-row .search-input.form-control,
html.light .filters-row .search-input.form-control {
    background: var(--surface, #ffffff);
    color: var(--text, #0f172a);
    border: 1px solid var(--border-subtle, rgba(2, 6, 23, 0.06));
    box-shadow: none;
}

:root[data-theme='light'] .filters-row .search-input.form-control::placeholder,
[data-bs-theme='light'] .filters-row .search-input.form-control::placeholder,
body.light .filters-row .search-input.form-control::placeholder,
html.light .filters-row .search-input.form-control::placeholder {
    color: var(--text-muted, #475569);
    opacity: 0.8;
}

:root[data-theme='light'] .clear-btn,
[data-bs-theme='light'] .clear-btn,
body.light .clear-btn,
html.light .clear-btn {
    color: var(--text-muted, #475569);
}
:root[data-theme='light'] .clear-btn:hover,
[data-bs-theme='light'] .clear-btn:hover,
body.light .clear-btn:hover,
html.light .clear-btn:hover {
    color: var(--text, #0f172a);
}

/* Section dividers between quest groups */
.quests-box .quest-group-title {
    position: relative;
    border-top: 1px dashed var(--card-border, var(--border-subtle, rgba(2, 6, 23, 0.08)));
    padding-top: var(--space-4, 16px);
    margin-top: var(--space-5, 20px);
}
/* Remove divider for the first section only */
.quests-box > div:first-of-type .quest-group-title {
    border-top: none;
    padding-top: 0;
    margin-top: 0;
}
/* One-time hero welcome styles */
.hero-welcome {
    background: var(--tabs-bg);
    border: 1px solid var(--dropdown-border-color);
    border-radius: 12px;
    padding: 16px;
}
.hero-inner {
    align-items: center;
}
.hero-title {
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    letter-spacing: -0.01em;
    font-size: clamp(18px, 2.6vw, 24px);
    line-height: 1.2;
}
.hero-sub {
    font-size: 14px;
    color: var(--about-nav-item-color);
}
/* Ensure page bottom has space above fixed bottom nav */
.quest-cont {
    padding-bottom: 72px;
}
/* Spacer element for extra safety on mobile */
.mobile-bottom-spacer {
    height: 96px; /* approx navbar height + safe area */
}
@media (min-width: 992px) {
    .hero-welcome {
        padding: 18px 20px;
    }
    .quest-cont {
        padding-bottom: 56px;
    }
}
</style>

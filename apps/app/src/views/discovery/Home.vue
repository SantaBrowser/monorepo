<template>
    <div style="height: 100vh" class="landing-page w-100">
        <div
            :style="{
                opacity: isLoadingSearch || isLoadingPage ? 0.5 : 1,
                margin: 0,
            }"
            class="d-flex justify-content-center align-items-center flex-column h-100"
        >
            <div class="d-flex flex-column gap-4 landing-top">
                <h1>Santa <span>Rewards</span></h1>
                <p>Browse, Earn, Enjoy: Your Rewards Dashboard Awaits!</p>
            </div>
            <div class="d-flex gap-4">
                <div v-for="campaign in filteredCampaigns" :key="campaign._id">
                    <CampaignCard :campaign="campaign" />
                </div>
            </div>

            <div class="d-flex flex-wrap">
                <QuestsCarousel :quest-lists="questLists" />
            </div>

            <!-- <BaseCardCampaign :campaign="campaign" /> -->
        </div>
    </div>
</template>
<!-- <BaseCardHeaderHome /> -->
<!--        <b-row class="mt-5 mb-3">-->
<!--            <b-col xs="12" md="6">-->
<!--                <h2>Earnings Dashboard</h2>-->
<!--            </b-col>-->
<!--            <b-col xs="12" md="4" offset-md="2" class="d-flex align-items-center justify-content-end">-->
<!--                <b-input-group class="mb-3 mb-md-0">-->
<!--                    <template #prepend>-->
<!--                        <b-input-group-text class="bg-primary">-->
<!--                            <b-spinner v-if="isLoadingSearch" small variant="white" />-->
<!--                            <i v-else class="fas fa-search"></i>-->
<!--                        </b-input-group-text>-->
<!--                    </template>-->
<!--                    <b-form-input v-model="search" placeholder="Search..." @input="onInputSearch" />-->
<!--                </b-input-group>-->
<!--            </b-col>-->
<!--        </b-row>-->

<!-- <b-link to="/" style="text-decoration: none" class="d-flex align-items-center">
                    <img :src="earningsIcon" alt="Earnings Icon" class="me-2" height="40" />
                    <span class="earnings-link">Earnings</span>
                </b-link> -->
<!-- <div v-if="isLoading" class="justify-content-center d-flex">
                        <b-spinner small variant="primary" />
                    </div>
                    <p v-if="!isLoading && !filteredCampaigns.length" class="text-opaque">
                        Could not find a campaign with that name...
                    </p> -->

<!-- <div class="mb-4 mt-4">
                        <b-col xs="12" md="6">
                            <h2 class="trending-title">Trending Quests</h2>
                        </b-col>
                    </div> -->

<!--        <b-pagination v-model="page" :per-page="limit" :total-rows="campaigns.total" align="center" class="mt-3 mb-0" />-->
<!-- </b-row>
    </b-container> -->
<!--    <BaseCardHeader row-class="py-md-0" class="my-5">-->
<!--        <template #primary>-->
<!--            <b-img :src="imgHeader" fluid />-->
<!--        </template>-->
<!--        <template #secondary>-->
<!--            <div class="py-lg-5 pe-lg-5">-->
<!--                <h1 class="mt-lg-3">-->
<!--                    Quest<br />-->
<!--                    Campaigns-->
<!--                </h1>-->
<!--                <p class="lead mb-4">-->
<!--                    Give back to your community while increasing engagement with effective Quest Campaigns.-->
<!--                </p>-->
<!--                <b-button :href="`${publicURL}/pricing`" variant="primary" class="me-3 px-5" target="_blank">-->
<!--                    Campaign Pricing-->
<!--                </b-button>-->
<!--                <b-button-->
<!--                    href="https://discord.com/invite/TzbbSmkE7Y"-->
<!--                    target="_blank"-->
<!--                    variant="link"-->
<!--                    class="text-white"-->
<!--                >-->
<!--                    Reach out! We don't bite😉-->
<!--                </b-button>-->
<!--            </div>-->
<!--        </template>-->
<!--    </BaseCardHeader>-->

<!-- <div class="mb-4 mt-4">
                        <b-col xs="12" md="6">
                            <h2 class="trending-title">Top Brands</h2>
                        </b-col>
                    </div>
                    <TopBrands :brands="brands" /> -->

<script lang="ts">
import { defineComponent } from 'vue';
import { API_URL, CP_CAMPAIGN, DASHBOARD_URL, PUBLIC_URL, SANTA_CAMPAIGN } from '../../config/secrets';
import { useAccountStore } from '../../stores/Account';
import { useAuthStore } from '../../stores/Auth';
import { mapStores } from 'pinia';
import { decodeHTML } from '../../utils/decode-html';
import imgJumbotron from '../../assets/thx_token_governance.png';
import imgLogo from '../../assets/logo.png';
import imgHeader from '../../assets/thx_token_governance.png';
import earningsIcon from '../../assets/earnings-logo.png';
import * as html from 'html-entities';
import CampaignCard from '@thxnetwork/app/components/CampaignCard.vue';
import QuestsCarousel from '@thxnetwork/app/components/homepage/QuestsCarousel.vue';

const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7;

export default defineComponent({
    name: 'Home',
    components: {
        QuestsCarousel,
        CampaignCard,
    },
    data(): any {
        return {
            imgHeader,
            decodeHTML,
            publicURL: PUBLIC_URL,
            dashboardURL: DASHBOARD_URL,
            questLists: [],
            isLoadingSearch: false,
            isLoadingPage: false,
            isAlertShown: true,
            imgJumbotron,
            imgLogo,
            isLoading: true,
            page: 1,
            limit: 20,
            search: '',
            debouncedSearch: null as any,
            screenWidth: window.innerWidth,
            campaigns: { results: [], total: 0 },
            isModalCampaignDomainShown: false,
            filteredCampaigns: [],
            brands: [],
            earningsIcon,
            currentIndex: 0,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore),
    },
    watch: {
        async 'page'(page) {
            this.page = page;
            this.isLoadingPage = true;
            await this.getCampaigns();
            this.isLoadingPage = false;
        },
        'accountStore.isAuthenticated': {
            handler(isAuthenticated) {
                if (!isAuthenticated) return;
                this.getParticipants();
            },
            immediate: true,
        },
    },
    async mounted() {
        await this.getCampaigns();
        await this.getQuests();
        await this.getStoreLogos();
        this.isLoading = false;
    },
    methods: {
        async getParticipants() {
            if (this.accountStore.isAuthenticated) {
                await this.accountStore.getParticipants();
            }
        },
        async getCampaigns() {
            const url = new URL(API_URL);
            url.pathname = '/v1/leaderboards';
            url.searchParams.append('page', this.page.toString());
            url.searchParams.append('limit', this.limit.toString());
            if (this.search) {
                url.searchParams.append('search', this.search);
            }
            const res = await fetch(url);
            const campaigns = await res.json();

            // this.campaigns = campaigns;
            // this.campaigns.results = this.campaigns.results.map((campaign: any) => ({
            //     ...campaign,
            //     title: html.decode(campaign.title),
            //     description: html.decode(campaign.description),
            // }));
            this.filteredCampaigns = campaigns.results.filter((campaign: any) =>
                [SANTA_CAMPAIGN, CP_CAMPAIGN].includes(campaign._id),
            );

            // Decode HTML entities
            this.filteredCampaigns = this.filteredCampaigns.map((campaign: any) => ({
                ...campaign,
                title: html.decode(campaign.title),
                description: html.decode(campaign.description),
            }));
        },
        async getQuests() {
            const url = new URL(API_URL);
            url.pathname = '/v1/quests/public';
            const res = await fetch(url);
            const questLists = await res.json();

            this.questLists = questLists.map((quest: TBaseQuest) => ({
                ...quest,
                title: quest.title && html.decode(quest.title),
                description: quest.description && html.decode(quest.description),
            }));
        },
        async getStoreLogos() {
            const cachedData = localStorage.getItem('storeBrands');
            const cachedTime = localStorage.getItem('storeBrands_timestamp');
            const now = Date.now();

            if (cachedData && cachedTime && now - parseInt(cachedTime) < CACHE_EXPIRY) {
                const brands = JSON.parse(cachedData);
                this.brands = brands;
            } else {
                const res = await fetch('https://cbapi.santabrowser.com/home/stores');
                const data = await res.json();

                const brands = data.data[0].stores.map((store: any) => ({
                    name: store.name,
                    logo: store.logo,
                    cashback_amount: store.cashback_amount,
                }));
                localStorage.setItem('storeBrands', JSON.stringify(brands));
                localStorage.setItem('storeBrands_timestamp', now.toString());

                this.brands = this.shuffleArray(brands).slice(0, 8);
            }
        },
        shuffleArray(array: any[]) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        },
        onInputSearch() {
            this.isLoadingSearch = true;
            clearTimeout(this.debouncedSearch);
            this.debouncedSearch = setTimeout(async () => {
                await this.getCampaigns();
                this.isLoadingSearch = false;
            }, 1000);
        },
    },
});
</script>

<style lang="scss" scoped>
.landing-page {
    background-image: url('/src/assets/bg-landing.png');
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.landing-top h1 {
    color: #fff;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 61px;
    font-style: italic;
    font-weight: 600;
    line-height: 16px;
    span {
        font-weight: 300;
    }
}

.landing-top p {
    color: rgba(255, 255, 255, 0.75);
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    text-align: center;
}
.pagination {
    --bs-pagination-focus-bg: var(--bs-purple-dark);
    --bs-pagination-focus-color: rgba(255, 255, 255, 0.5);
    --bs-pagination-focus-border-color: var(--bs-purple-dark);

    --bs-pagination-hover-color: white;
    --bs-pagination-hover-bg: var(--bs-purple);
    --bs-pagination-hover-border-color: var(--bs-purple);

    --bs-pagination-color: rgba(255, 255, 255, 0.5);
    --bs-pagination-bg: #37277b;
    --bs-pagination-border-color: #37277b;

    --bs-pagination-disabled-color: rgba(255, 255, 255, 0.25);
    --bs-pagination-disabled-bg: #37277b;
    --bs-pagination-disabled-border-color: #37277b;
}
.form-control {
    border-color: var(--bs-primary);
}
.nav-pills .nav-link {
    text-transform: capitalize;
    color: rgba(255, 255, 255, 0.5);
}
#table-campaigns th:nth-child(1) {
    width: 50px;
}
#table-campaigns th:nth-child(2) {
    width: 120px;
}
#table-campaigns td:nth-child(2) {
    padding: 0px !important;
    text-align: center;
}
#table-campaigns th:nth-child(3) {
    width: auto;
}
#table-campaigns th:nth-child(4) {
    width: 150px;
}
#table-campaigns th:nth-child(5) {
    width: 120px;
}
#table-campaigns th:nth-child(6) {
    width: 100px;
}
#table-campaigns th:nth-child(7) {
    width: 100px;
}
#table-campaigns tr td {
    cursor: pointer;
}
.carousel-inner > div > img,
.carousel-inner > img {
    display: none !important;
}

.carousel-caption {
    position: relative;
    right: 0;
    left: 0;
    bottom: auto;
    padding: 0;
    text-align: left;
}

.carousel-indicators {
    position: absolute;
    top: 0;
    bottom: auto;
    margin: 0;
    margin-top: -2rem;
    justify-content: flex-end;
    width: auto;

    [data-bs-target] {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
}
.trending-title {
    display: flex;
    flex-direction: column;
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    background: linear-gradient(90deg, #fff 0%, #d7d7d7 26.5%, #dedede 55.5%, #fff 76.5%, #b4b1b1 88%, #999 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
}

.trending-grad {
    color: #f5f5f5;
    font-size: 30px;
    font-style: italic;
    font-weight: 700;
    text-transform: uppercase;
    line-height: 28px;
}

.rare-quest-title {
    text-align: left;
    font-size: 30px;
    padding: 5px;
    text-transform: uppercase;
    font-weight: 800;
    line-height: 120%;
    background: linear-gradient(90deg, #fff 1.29%, #f3bcbc 99.94%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.containers {
    max-width: 98% !important;
    padding: 10px 28px;
}

.brand-logo {
    width: 110px;
    border-radius: 5px;
}

.earnings-link {
    font-size: 1.5rem;
    text-decoration: none;
    color: #fff !important;
    font-weight: 600;
    line-height: 1.25rem;
}

#left-sidebar {
    background-image: url('/src/assets/bg-mosaic.png');
    background-size: cover;
    background-repeat: no-repeat;
    padding: 0;
    margin: 0;
}
</style>

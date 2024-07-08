<template>
    <!-- <BaseCardHeaderHome /> -->
    <b-container class="containers">
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
        <b-row :style="{ opacity: isLoadingSearch || isLoadingPage ? 0.5 : 1 }">
            <b-col>
                <div v-if="isLoading" class="justify-content-center d-flex">
                    <b-spinner small variant="primary" />
                </div>
                <p v-if="!isLoading && !filteredCampaigns.length" class="text-opaque">
                    Could not find a campaign with that name...
                </p>
                <div v-for="(campaign, index) in filteredCampaigns" :key="campaign.id">
                    <BaseCardCampaign :campaign="campaign" />
                    <!-- Show a custom div after the first BaseCardCampaign -->
                    <div v-if="index === 0" class="d-flex gap-2" style="margin: 35px 0">
                        <BaseReferral />
                        <div
                            :style="{
                                backgroundImage: 'url(src/assets/bg-rare-quest.png)',
                                backgroundSize: 'cover',
                                borderRadius: '15px',
                                paddingLeft: '15px',
                            }"
                            class="w-50 d-flex align-items-center justify-content-start"
                        >
                            <span class="rare-quest-title">Purchase from top brands and get rewarded in crypto</span>
                            <b-row class="d-flex flex-wrap justify-content-center">
                                <b-col v-for="logo in logos" :key="logo" class="p-2">
                                    <img :src="logo" alt="Brand Logo" class="brand-logo" />
                                </b-col>
                            </b-row>
                        </div>
                    </div>
                </div>
            </b-col>
        </b-row>
        <!--        <b-pagination v-model="page" :per-page="limit" :total-rows="campaigns.total" align="center" class="mt-3 mb-0" />-->
    </b-container>
    <b-container class="mb-5 containers" style="margin-top: 35px">
        <div class="mb-3">
            <b-col xs="12" md="6">
                <h2 class="trending-title">Trending</h2>
            </b-col>
            <span class="trending-grad">Quests</span>
        </div>
        <b-row class="d-flex flex-wrap">
            <div v-for="quest of questLists" :quest="quest" :style="{ width: 'unset' }">
                <BaseCardQuestSpotlight :quest="quest" />
            </div>
        </b-row>
    </b-container>
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
</template>

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
import * as html from 'html-entities';

const CACHE_EXPIRY = 1000 * 60 * 60 * 24 * 7;

export default defineComponent({
    name: 'Home',
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
            logos: [],
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
            const cachedData = localStorage.getItem('storeLogos');
            const cachedTime = localStorage.getItem('storeLogos_timestamp');
            const now = Date.now();

            if (cachedData && cachedTime && now - parseInt(cachedTime) < CACHE_EXPIRY) {
                const logos = JSON.parse(cachedData);
                this.logos = logos;
            } else {
                const res = await fetch('https://cbapi.santabrowser.com/home/stores');
                const data = await res.json();
                const logos = data.data[0].stores.map((store: any) => store.logo);

                localStorage.setItem('storeLogos', JSON.stringify(logos));
                localStorage.setItem('storeLogos_timestamp', now.toString());

                this.logos = this.shuffleArray(logos).slice(0, 8);
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

<style lang="scss">
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
    color: #e9e3e3;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 28px;
    margin-bottom: 0;
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
    font-size: 18px;
    padding: 5px;
    font-style: italic;
    text-transform: uppercase;
    width: 35% !important;
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
</style>

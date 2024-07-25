<template>
    <b-card
        no-body
        class="cursor-pointer gradient-shadow card-campaign"
        :class="isLoading ? 'cursor-disabled' : 'auto'"
        :style="{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }"
        @click="goTo(`/c/${campaign.slug}`)"
    >
        <b-spinner
            v-if="isLoading"
            small
            variant="light"
            class="position-absolute"
            style="top: 50%; left: 50%; margin-left: -8px; margin-top: -8px"
        />
        <div class="bd-filter">
            <b-row>
                <b-col md="2">
                    <b-row class="h-100">
                        <!--                    <b-col md="2">-->
                        <!--                        <div-->
                        <!--                            class="d-flex bg-dark rounded justify-content-center align-items-center"-->
                        <!--                            :style="{-->
                        <!--                                height: '90px',-->
                        <!--                                width: '100%',-->
                        <!--                                backgroundImage: `url(${backgroundImage})`,-->
                        <!--                                backgroundSize: 'cover',-->
                        <!--                                backgroundPosition: 'center center',-->
                        <!--                            }"-->
                        <!--                        >-->
                        <!--                            <BImg-->
                        <!--                                lazy-->
                        <!--                                :src="logoImage"-->
                        <!--                                class="m-3 rounded"-->
                        <!--                                style="width: auto; height: auto; max-width: 150px; max-height: 60px"-->
                        <!--                            />-->
                        <!--                        </div>-->
                        <!--                    </b-col>-->
                        <b-col md="12">
                            <div class="p-2 pt-1 p-md-0 h-100">
                                <div class="d-flex w-100 mb-2 h-100">
                                    <div class="d-flex flex-column justify-content-between">
                                        <div class="text-white text-decoration-none lead">
                                            <h5 class="camp-title">{{ campaign.title }}</h5>
                                            <h2 class="camp-title-grad">
                                                {{ campaign._id === CP_CAMPAIGN ? 'Rewards' : 'Quests' }}
                                            </h2>
                                            <div v-if="score !== 0 && !Number.isNaN(score)">
                                                <h8 class="balance">Total earnings:</h8>
                                                <h6 class="score">{{ formattedScore }}</h6>
                                            </div>
                                        </div>
                                        <div class="d-flex flex-column">
                                            <!-- <h5 class="balance">Balance</h5> -->
                                            <div
                                                class="d-flex align-items-center text-white text-decoration-none lead coins"
                                            >
                                                <h3>
                                                    {{ formattedBalance }}
                                                </h3>
                                                <img
                                                    v-if="campaign._id === SANTA_CAMPAIGN"
                                                    :src="StarCoin"
                                                    alt="star coin"
                                                    height="24"
                                                />
                                            </div>
                                            <div
                                                v-if="campaign._id === SANTA_CAMPAIGN"
                                                class="cursor-pointer quest-btn d-flex align-items-center justify-content-center"
                                                @click="goTo(`/c/${campaign.slug}`)"
                                            >
                                                <h6>Browse Quests</h6>
                                            </div>
                                        </div>
                                        <!--                                    <b-button-->
                                        <!--                                        :disabled="!accountStore.isAuthenticated"-->
                                        <!--                                        size="sm"-->
                                        <!--                                        variant="link"-->
                                        <!--                                        class="px-0 ms-1"-->
                                        <!--                                        @click.stop="onClickSubscribe"-->
                                        <!--                                    >-->
                                        <!--                                        <i-->
                                        <!--                                            class="fa-star text-opaque text-white"-->
                                        <!--                                            :class="{ fas: isSubscribed, far: !isSubscribed }"-->
                                        <!--                                        />-->
                                        <!--                                    </b-button>-->
                                    </div>
                                    <!--                                <div class="ms-auto p-2 text-opaque me-md-3">-->
                                    <!--                                    <i class="fas fa-hashtag me-1" />-->
                                    <!--                                    {{ campaign.rank }}-->
                                    <!--                                </div>-->
                                </div>
                            </div>
                        </b-col>
                    </b-row>
                </b-col>
                <b-col md="10" class="d-flex flex-column">
                    <div class="d-flex w-100 align-items-center h-100" style="flex: 1">
                        <RewardsSmall :message="campaign._id" :score="score"></RewardsSmall>
                        <!--                                <b-button-->
                        <!--                                    size="sm"-->
                        <!--                                    variant="primary"-->
                        <!--                                    class="me-2"-->
                        <!--                                    @click.stop="goTo(`/c/${campaign.slug}/quests`)"-->
                        <!--                                >-->
                        <!--                                    <i class="fas fa-tasks text-opaque me-2" />-->
                        <!--                                    <span>{{ campaign.questCount }}</span>-->
                        <!--                                </b-button>-->
                        <!--                                <b-button-->
                        <!--                                    size="sm"-->
                        <!--                                    variant="primary"-->
                        <!--                                    class="me-2"-->
                        <!--                                    @click.stop="goTo(`/c/${campaign.slug}/rewards`)"-->
                        <!--                                >-->
                        <!--                                    <i class="fas fa-gift text-opaque me-2" />-->
                        <!--                                    <span>{{ campaign.rewardCount }}</span>-->
                        <!--                                </b-button>-->
                        <!--                                <b-button-->
                        <!--                                    size="sm"-->
                        <!--                                    variant="primary"-->
                        <!--                                    class="me-2"-->
                        <!--                                    @click.stop="goTo(`/c/${campaign.slug}/ranking`)"-->
                        <!--                                >-->
                        <!--                                    <i class="fas fa-users text-opaque me-2" />-->
                        <!--                                    <span>{{ campaign.participantCount }}</span>-->
                        <!--                                </b-button>-->
                        <!--                                <b-button-->
                        <!--                                    v-if="campaignDomain"-->
                        <!--                                    size="sm"-->
                        <!--                                    variant="primary"-->
                        <!--                                    class="ms-auto me-md-3"-->
                        <!--                                    @click.stop="isModalExternalURLShown = true"-->
                        <!--                                >-->
                        <!--                                    <i class="fas fa-external-link-alt text-opaque me-1" />-->
                        <!--                                    {{ campaignDomain }}-->
                        <!--                                </b-button>-->
                        <!--                                <BaseModalExternalURL-->
                        <!--                                    :show="isModalExternalURLShown"-->
                        <!--                                    :url="campaign.domain"-->
                        <!--                                    @hidden="isModalExternalURLShown = false"-->
                        <!--                                />-->
                    </div>
                </b-col>
            </b-row>
        </div>
    </b-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { decodeHTML } from '../../utils/decode-html';
import { mapStores } from 'pinia';
import { useAccountStore } from '@thxnetwork/app/stores/Account';
import { useRewardStore } from '../../stores/Reward';
import RewardsSmall from '@thxnetwork/app/views/campaign/RewardSmall.vue';
import StarCoin from '../../assets/star-coin.png';
import { SANTA_CAMPAIGN, CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';
type TCampaignProps = {
    _id: string;
    title: string;
    rank: number;
    slug: string;
    domain: string;
    questCount: number;
    rewardCount: number;
    participantCount: number;
    logoImgUrl: string;
    backgroundImgUrl: string;
    createdAt: Date;
};

export default defineComponent({
    name: 'BaseCardCampaign',
    components: { RewardsSmall },
    props: {
        campaign: {
            type: Object as PropType<TCampaignProps>,
            required: true,
        },
    },
    data() {
        return {
            decodeHTML,
            isLoading: false,
            isModalExternalURLShown: false,
            rewardList: {},
            StarCoin,
            SANTA_CAMPAIGN,
            CP_CAMPAIGN,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useRewardStore),
        participant() {
            return this.accountStore.participants.find(
                (p) => p.sub === this.accountStore.account?.sub && p.poolId === this.campaign._id,
            );
        },
        balance() {
            if (!this.participant) return 0;
            return Number(this.participant.balance);
        },
        score() {
            if (!this.participant) return 0;
            return Number(this.participant.score);
        },
        formattedScore() {
            if (this.campaign._id === CP_CAMPAIGN) {
                const score = this.score / 100;
                return Number.isInteger(score) ? `$${score}` : `$${score.toFixed(2)}`;
            }
            return this.score;
        },
        formattedBalance() {
            if (this.campaign._id === CP_CAMPAIGN) {
                const balance = this.balance / 100;
                return Number.isInteger(balance) ? `$${balance}` : `$${balance.toFixed(2)}`;
            }
            return this.balance;
        },
        backgroundImage() {
            if (this.campaign._id === SANTA_CAMPAIGN) {
                return 'src/assets/bg_campaign_1.png';
            } else if (this.campaign._id === CP_CAMPAIGN) {
                return 'src/assets/bg_campaign_2.png';
            } else {
                return 'src/assets/bg_campaign_1.png'; // Default background image if no match
            }
        },
        logoImage() {
            return this.campaign.logoImgUrl;
        },
        campaignDomain() {
            return this.campaign.domain && new URL(this.campaign.domain).hostname;
        },
    },
    mounted() {
        // this.rewardList = rewardsList();
    },
    methods: {
        goTo(path: string) {
            this.isLoading = true;
            this.$router.push(path);
        },
    },
});
</script>

<style lang="scss">
.balance {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
    margin-top: 35px;
    margin-bottom: 0;
}
.score {
    color: #fff;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1rem;
    margin-top: 0;
    margin-bottom: 0;
}
.coins {
    height: 40px;
    margin: 1rem 0;
}
.coins h3 {
    color: #f5f5f5;
    font-size: 2rem;
    font-weight: 600;
    line-height: 1rem;
    margin-bottom: 0;
}
.bd-filter {
    // background: #ff000024;
    padding: 15px;
}
.card-campaign {
    height: 100%;
    position: relative;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 12px;
    border: 1px solid #3e2c2c9e;

    /* Glass Morph Button */
    box-shadow: 10px 14px 47.7px 0px rgba(103, 103, 103, 0.05) inset, 11px 11px 29.4px 0px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(2.5px);
    //padding: 10px;
    //min-height: 200px;
    &:before {
        transition: opacity 0.2s;
        opacity: 0;
    }
    //&:hover:before {
    //  opacity: 0.15;
    //}
    overflow: hidden;
    background-position: center;
}
.btn .fa-star:hover {
    color: var(--bs-warning) !important;
}
.camp-title {
    color: #f5f5f5;
    font-size: 20px;
    font-style: italic;
    font-weight: 700;
    line-height: 20px;
    text-transform: uppercase;
    margin-bottom: 0;
    display: inline;
    background: #000;
}
.camp-title-grad {
    color: #f5f5f5;
    font-size: 35px;
    font-style: italic;
    font-weight: 700;
    line-height: 35px;
    text-transform: uppercase;
    margin-bottom: 0;
}
.quest-btn {
    width: 170px;
    background: linear-gradient(180deg, #2f0707 0%, #300b0b 54.94%);
    border: 1px solid #4f0000;
    border-radius: 1rem;
    padding: 1rem 2rem;
    margin-bottom: 15px;
}
.quest-btn h6 {
    margin-bottom: 0;
    color: #ffdcdc;
    font-size: 14px;
    font-weight: 400;
    line-height: 0px;
}
.notif {
    position: absolute;
    top: 0;
    width: 30%;
    right: 0;
}
</style>

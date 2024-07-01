<template>
    <b-card
        no-body
        class="cursor-pointer gradient-shadow card-campaign"
        :style="{ opacity: isLoading ? 0.5 : 1 }"
        @click="goTo(`/c/${campaign.slug}`)"
    >
        <img :src="Ellipse" alt="Ellipse" class="ellipse" height="300" width="300" />
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
                                            <h2 class="camp-title-grad">Quests</h2>
                                            <h8 class="balance">Total earnings:</h8>
                                            <h6 class="score">{{ score }}</h6>
                                        </div>
                                        <div class="d-flex flex-column">
                                            <!-- <h5 class="balance">Balance</h5> -->
                                            <div
                                                class="d-flex align-items-center text-white text-decoration-none lead coins"
                                            >
                                                <h3>
                                                    {{ balance }}
                                                </h3>
                                                <img :src="StarCoin" alt="star coin" height="24" />
                                            </div>
                                            <div class="quest-btn d-flex align-items-center justify-content-center">
                                                <h6>More Quests</h6>
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
                <b-col md="10">
                    <div class="d-flex w-100 align-items-center">
                        <RewardsSmall :message="campaign._id"></RewardsSmall>
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
import Ellipse from '../../assets/ellipse.png';
import StarCoin from '../../assets/star-coin.png';
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
            Ellipse,
            StarCoin,
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
        backgroundImage() {
            return this.campaign.backgroundImgUrl;
        },
        logoImage() {
            return this.campaign.logoImgUrl;
        },
        campaignDomain() {
            return this.campaign.domain && new URL(this.campaign.domain).hostname;
        },
        isSubscribed() {
            return this.accountStore.isAuthenticated && this.accountStore.isSubscribed(this.campaign._id);
        },

        rewardsList() {
            // return this.rewardStore.list(this.campaign.slug);
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
        async onClickSubscribe() {
            try {
                this.isLoading = true;
                await this.accountStore.api.request.patch(`/v1/participants/${this.participant?._id}`, {
                    data: {
                        isSubscribed: !this.participant?.isSubscribed,
                        email: this.accountStore.account ? this.accountStore.account.email : null,
                    },
                });
                await this.accountStore.getParticipants(this.campaign._id);
            } catch (error) {
                console.error(error);
            } finally {
                this.isLoading = false;
            }
        },
    },
});
</script>

<style lang="scss">
.balance {
    color: rgba(200, 200, 200, 0.5);
    font-size: 0.75rem;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
    margin-top: 35px;
    margin-bottom: 0;
}
.score {
    color: #c8c8c8;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1rem;
    margin-top: 0;
    margin-bottom: 0;
}
.coins {
    height: 40px;
    margin: 1.5rem 0;
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
    position: relative;
    // background: url('src/assets/thx_header_learn.jpg');
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.47);
    background: linear-gradient(216deg, rgba(30, 30, 30, 0.58) 59.53%, rgba(24, 24, 24, 0.65) 79.11%);

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
}
.ellipse {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(-50%);
    z-index: -1;
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.btn .fa-star:hover {
    color: var(--bs-warning) !important;
}
.camp-title {
    font-size: 1rem !important;
    font-weight: 400 !important;
    line-height: 1.75rem;
    margin-bottom: 0;
    line-height: 1;
}
.camp-title-grad {
    background: linear-gradient(90deg, #4365ff 8.09%, #fe8888 42.46%, #c64343 50%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 0;
}
.quest-btn {
    background-color: rgba(0, 0, 0, 0.48);
    border: 1px solid #5a76f3;
    border-radius: 6px;
    padding: 15px 25px;
}
.quest-btn h6 {
    margin-bottom: 0;
    color: #f5f5f5;
    font-size: 14px;
    font-weight: 400;
    line-height: 0px;
}
</style>

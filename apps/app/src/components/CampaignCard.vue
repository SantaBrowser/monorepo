<template>
    <div class="campaign-card cursor-pointer" @click="goToSecondDiv">
        <div class="d-flex flex-column justify-content-between h-100">
            <div class="cp-card-header d-flex align-items-center justify-content-between">
                <h3>{{ campaign.title }}</h3>

                <img v-if="campaign._id === SANTA_CAMPAIGN" :src="imgSantaHat" alt="Santa Hat" loading="lazy" width="40" />
                <img v-if="campaign._id === CP_CAMPAIGN" :src="imgDiamond" alt="Santa Hat" loading="lazy" width="40" />
            </div>
            <div class="cp-card-body d-flex align-items-center justify-content-between">
                <h4 class="d-flex align-items-center">
                    {{ formattedBalance }}
                    <img v-if="campaign._id === SANTA_CAMPAIGN" :src="imgStarCoin" alt="Star Coin" loading="lazy" width="24" />
                </h4>
                <p v-if="campaign._id === SANTA_CAMPAIGN && score !== 0 && !Number.isNaN(score)">
                    {{ formattedScore }} <span>Total Earnings</span>
                </p>
                <!-- <button @click="goToSecondDiv">Browse Quests</button> -->
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { PropType } from 'vue';
import { useAccountStore } from '../stores/Account';
import { useRewardStore } from '../stores/Reward';
import { decodeHTML } from '../utils/decode-html';
import { mapStores } from 'pinia';
import { CP_CAMPAIGN, SANTA_CAMPAIGN } from '../config/secrets';
import imgStarCoin from '../assets/star-coin.png';
import { useQuestStore } from '../stores/Quest';
import imgSantaHat from '../assets/santa-hat.png';
import imgDiamond from '../assets/diamond.png';
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
export default {
    name: 'CampaignCard',
    props: {
        campaign: {
            type: Object as PropType<TCampaignProps>,
            required: true,
        },
    },
    data() {
        return {
            decodeHTML,
            SANTA_CAMPAIGN,
            CP_CAMPAIGN,
            isLoading: false,
            imgStarCoin,
            imgSantaHat,
            imgDiamond,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useRewardStore, useQuestStore),
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
    },
    methods: {
        async goToSecondDiv() {
            this.$emit('scrollToSecondDiv');
            // await this.questStore.list(this.campaign._id);
            // await this.rewardStore.list(this.campaign._id);
            // await this.accountStore.getParticipants(this.campaign._id);
        },
    },
};
</script>

<style scoped>
.campaign-card {
    flex: 1;
    width: 100%;
    height: 200px;
    border-radius: 12px;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.26) 0%, rgba(0, 0, 0, 0.4) 100%);
    backdrop-filter: blur(6px);
    padding: 50px 20px 20px;
}

.cp-card-header h3 {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 23px;
    font-style: italic;
    font-weight: 700;
    line-height: 32px;
    text-transform: uppercase;
}

.cp-card-body h4 {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    margin: 0;
}

.cp-card-body p {
    text-align: right;
    color: #fff;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
    margin: 0;
}

.cp-card-body span {
    text-align: right;
    display: block;
    color: rgba(255, 255, 255, 0.5);
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 16px;
}

.cp-card-body button {
    color: rgba(255, 239, 239, 0.5);
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 0px;
    background: none;
    outline: none;
    border: none;
}

@media (max-width: 845px) {
    .campaign-card {
        width: 260px;
    }
}

@media (max-width: 600px) {
    .campaign-card {
        width: 180px;
    }
}

@media (max-width: 424px) {
    .campaign-card {
        width: 100%;
        padding: 20px;
        height: 100%;
    }

    .cp-card-header {
        margin-bottom: 15px;
    }
}
</style>

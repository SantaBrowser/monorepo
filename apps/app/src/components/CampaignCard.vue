<template>
    <div class="campaign-card">
        <div class="d-flex justify-content-between h-100">
            <div class="card-header">
                <h3>{{ campaign.title }}</h3>

                <p v-if="campaign._id === SANTA_CAMPAIGN && score !== 0 && !Number.isNaN(score)">
                    Total Earnings: {{ formattedScore }}
                </p>
            </div>
            <div class="card-body d-flex flex-column align-items-end justify-content-between">
                <p class="d-flex align-items-center">
                    {{ formattedBalance }}
                    <img v-if="campaign._id === SANTA_CAMPAIGN" :src="imgStarCoin" alt="Star Coin" width="24" />
                </p>

                <button @click="goTo(`/c/${campaign.slug}`)">Browse Quests</button>
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
            isLoading: false,
            imgStarCoin,
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
    },
    methods: {
        goTo(path: string) {
            this.isLoading = true;
            this.$router.push(path);
        },
    },
};
</script>

<style scoped>
.campaign-card {
    width: 373px;
    height: 200px;
    border-radius: 12px;
    border: 1px solid rgba(96, 165, 250, 0.25);
    background: rgba(0, 0, 0, 0.32);
    backdrop-filter: blur(6px);
    padding: 50px 20px 20px;
}

.card-header h3 {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 23px;
    font-style: italic;
    font-weight: 700;
    line-height: 32px;
    text-transform: uppercase;
}

.card-body p {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 30px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
}

.card-body button {
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
</style>

<template>
    <!-- <nav v-if="isVisible" class="header-nav"> -->
    <nav v-if="isVisible" class="header-nav d-flex justify-content-between w-100">
        <!-- Your header content -->
        <!-- <h1>Header Navigation</h1> -->
        <div class="d-flex gap-2" style="width: 500px">
            <div v-if="participantSanta" class="d-flex align-items-center justify-content-between equal-divs">
                <h2>Santa <span style="display: block">Quests</span></h2>
                <div class="d-flex align-items-center">
                    <p>{{ formattedBalance(participantSanta, SANTA_CAMPAIGN) }}</p>
                    <img :src="imgStarCoin" alt="Star Coin" width="24" />
                </div>
            </div>
            <div v-if="participantCP" class="d-flex align-items-center justify-content-between equal-divs">
                <h2>Cashback &<span style="display: block">Playwall</span></h2>
                <p>{{ formattedBalance(participantCP, CP_CAMPAIGN) }}</p>
            </div>
        </div>
        <div class="d-flex gap-2"></div>
        <div class="d-flex gap-2">
            <BaseDropdownWallets />
            <div
                class="d-flex align-items-center justify-content-between equal-divs name-avatar"
                @click="accountStore.isModalAccountShown = true"
            >
                <h2>
                    <span style="display: block">{{ accountStore?.account?.username }}</span>
                </h2>
                <b-avatar class="b-avatar-header" size="40" :src="accountStore?.account?.profileImg" variant="dark" />
            </div>
        </div>
    </nav>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useAccountStore } from '../stores/Account';
import { mapStores } from 'pinia';
import { SANTA_CAMPAIGN, CP_CAMPAIGN } from '../config/secrets';
import imgStarCoin from '../assets/star-coin.png';
export default defineComponent({
    name: 'HeaderNav',
    props: {
        isVisible: {
            type: Boolean as PropType<boolean>,
            required: true,
        },
    },
    data() {
        return {
            SANTA_CAMPAIGN,
            CP_CAMPAIGN,
            imgStarCoin,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        participantSanta() {
            return this.accountStore.participants.find((p) => p.sub === this.accountStore.account?.sub);
        },
        participantCP() {
            return this.accountStore.participants.find((p) => p.sub === this.accountStore.account?.sub);
        },
    },
    methods: {
        balance(participant: TParticipant) {
            if (!participant) return 0;
            return Number(participant.balance);
        },
        score(participant: TParticipant) {
            if (!participant) return 0;
            return Number(participant.score);
        },
        formattedScore(participant: TParticipant, campaignId: string) {
            if (campaignId === CP_CAMPAIGN) {
                const score = this.score(participant) / 100;
                return Number.isInteger(score) ? `$${score}` : `$${score.toFixed(2)}`;
            }
            return this.score(participant);
        },
        formattedBalance(participant: TParticipant, campaignId: string) {
            if (campaignId === CP_CAMPAIGN) {
                const balance = this.balance(participant) / 100;
                return Number.isInteger(balance) ? `$${balance}` : `$${balance.toFixed(2)}`;
            }
            return this.balance(participant);
        },
    },
});
</script>

<style scoped>
.header-nav {
    position: fixed;
    top: 0;
    width: 100%;
    background-color: rgba(37, 37, 37, 0.5);
    z-index: 1000;
    box-shadow: inset 0 2px 13px 12px rgb(223 18 18 / 10%);
    padding: 8px;
    border-bottom: 1px dotted #dd1e1e66;
}

.header-nav h2 {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0;
}

.header-nav p {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 16px;
    margin: 0;
}

.equal-divs {
    background: rgb(179 2 2 / 14%);
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: 7px 20px;
    border-radius: 22px;
    border: 1px dotted #a4a4da;
}
.b-avatar-header {
    border: 2px dotted #064f17;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 14px;
}

.name-avatar h2 {
    margin-right: 50px;
}
.name-avatar:hover h2 {
    text-decoration: underline;
    cursor: pointer;
}
.name-avatar {
    padding-right: 2px !important;
}
</style>

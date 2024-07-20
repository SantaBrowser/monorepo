<template>
    <!-- <nav v-if="isVisible" class="header-nav"> -->

    <nav v-if="isVisible" class="header-nav d-flex justify-content-between w-100">
        <!-- Your header content -->
        <!-- <h1>Header Navigation</h1> -->
        <div class="d-flex gap-2 balance-wrap" style="width: 500px">
            <div
                ref="santaDiv"
                class="d-flex align-items-center justify-content-between equal-divs"
                @click="toggleSantaDropdown"
            >
                <h2>Santa <span style="display: block">Quests</span></h2>
                <div class="d-flex align-items-center">
                    <p>{{ numberWithCommas(formattedBalance(participantSanta, SANTA_CAMPAIGN)) }}</p>
                    <img :src="imgStarCoin" alt="Star Coin" width="24" />
                </div>
                <div v-if="showSantaDropdown" class="dropdown-content">
                    <div class="d-flex justify-content-between">
                        <p>Total Eearnings:</p>
                        <div class="d-flex align-items-center">
                            <p>{{ numberWithCommas(formattedScore(participantSanta, SANTA_CAMPAIGN)) }}</p>
                            <img :src="imgStarCoin" alt="Star Coin" width="12" height="12" />
                        </div>
                    </div>
                    <p>
                        Latest Completed Quest: <span>{{ latestCompletedQuest?.title }}</span>
                    </p>
                </div>
            </div>
            <div
                ref="cpDiv"
                class="d-flex align-items-center justify-content-between equal-divs"
                @click="toggleCPDropdown"
            >
                <h2>Cashback &<span style="display: block">Playwall</span></h2>
                <p>${{ numberWithCommas(formattedBalance(participantCP, CP_CAMPAIGN)) }}</p>
                <div v-if="showCPDropdown" class="dropdown-content">
                    <p>Total Eearnings: ${{ numberWithCommas(formattedScore(participantCP, CP_CAMPAIGN)) }}</p>
                </div>
            </div>
        </div>
        <div class="d-flex gap-2"></div>
        <div class="d-flex gap-2 wallet-wrap">
            <BaseCardWalletInfo v-if="!accountStore.isMobile" />
            <BaseDropdownWallets />
            <div
                class="d-flex align-items-center justify-content-between equal-divs name-avatar"
                @click="accountStore.isModalAccountShown = true"
            >
                <h2 v-if="!accountStore.isMobile" class="username">{{ accountStore?.account?.username }}</h2>
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
import { useQuestStore } from '../stores/Quest';
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
            showSantaDropdown: false,
            showCPDropdown: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useQuestStore),
        participantSanta() {
            console.log('this.accountStore.participants', this.accountStore.participants);
            return this.accountStore.participants.find(
                (p) => p.sub === this.accountStore.account?.sub && p.poolId === SANTA_CAMPAIGN,
            );
        },
        participantCP() {
            return this.accountStore.participants.find(
                (p) => p.sub === this.accountStore.account?.sub && p.poolId === CP_CAMPAIGN,
            );
        },
        latestCompletedQuest() {
            const { quests } = this.questStore;
            return quests.find((quest) => !quest.isAvailable);
        },
    },
    watch: {
        'accountStore.participants': function (newVal, oldVal) {
            console.log('Participants changed:', newVal);
        },
    },
    async created() {
        // await this.accountStore.getParticipants();
    },
    mounted() {
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        toggleSantaDropdown() {
            this.showSantaDropdown = !this.showSantaDropdown;
            this.showCPDropdown = false;
            event.stopPropagation();
        },
        toggleCPDropdown() {
            this.showCPDropdown = !this.showCPDropdown;
            this.showSantaDropdown = false;
            event.stopPropagation();
        },
        handleClickOutside(event: Event) {
            const santaDiv = this.$refs.santaDiv as HTMLElement;
            const cpDiv = this.$refs.cpDiv as HTMLElement;

            if (
                santaDiv &&
                !santaDiv.contains(event.target as Node) &&
                cpDiv &&
                !cpDiv.contains(event.target as Node)
            ) {
                this.showSantaDropdown = false;
                this.showCPDropdown = false;
            }
        },
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
                return Number.isInteger(score) ? score : score.toFixed(2);
            }
            return this.score(participant);
        },
        formattedBalance(participant: TParticipant, campaignId: string) {
            if (campaignId === CP_CAMPAIGN) {
                const balance = this.balance(participant) / 100;
                return Number.isInteger(balance) ? balance : balance.toFixed(2);
            }
            return this.balance(participant);
        },
        numberWithCommas(x: number | string) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
    },
});
</script>

<style scoped>
.header-nav {
    position: fixed;
    top: 3px;
    left: 0.5%;
    width: 99% !important;
    background-color: rgba(37, 37, 37, 0.5);
    z-index: 1000;
    box-shadow: 0 2px 10px 3px rgb(24 17 17 / 44%);
    padding: 8px;
    /*border-bottom: 1px dotted #dd1e1e66;*/
    border-radius: 15px;
    background: #000;
    margin: 0.1% 0.5% 0.1% 0;
    border: 1px dotted #ad8b0bab;
    padding-right: 60px;
}

.header-nav h2 {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 12px;
    font-style: italic;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0;
    white-space: nowrap;
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
    flex: auto;
    min-width: 0;
    min-height: 0;
    padding: 7px 10px;
    border-radius: 22px;
    border: 1px dotted #ffcd06;
}
.b-avatar-header {
    border: 2px dotted #064f17;
    width: 40px;
    height: 40px;
    position: absolute;
    right: 64px;
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
.username {
    max-width: 150px; /* Adjust this value as needed */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.dropdown-content {
    position: absolute;
    background-color: #000;
    min-width: 160px;
    box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 20px;
    transform: translate(-10px, 43px);
    padding: 1em;
    border: 1px dotted #ffcd06;
}

.dropdown-content p {
    font-size: 12px;
}
.dropdown-content p span {
    color: #c1c1c1;
}
@media (max-width: 992px) {
    .header-nav {
        padding-right: 0;
    }
    .b-avatar-header {
        right: 0;
    }
    .name-avatar {
        position: relative;
        padding-right: 10px !important;
        width: 40px;
        height: 40px;
        border: none;
    }
    .wallet-wrap {
        align-items: center;
        margin-right: 8px;
    }
}

@media (max-width: 490px) {
    .header-nav h2 {
        display: none;
    }
    .balance-wrap {
        width: auto !important;
    }
}
</style>

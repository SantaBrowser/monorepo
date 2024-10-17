<template>
    <div
        v-if="!accountStore.isMobile || selectedPart === 'Leaderboard'"
        header-class="p-0"
        body-class="d-flex flex-column pt-0"
        class="leaderboard-wrapper mt-3"
    >
        <b-card-title class="d-flex m-0 align-items-center bg-leaderboard">
            <div class="d-flex align-items-center justify-content-center" style="">
                <!-- <i class="fa fa-trophy me-2 text-opaque" /> -->
                <img :src="trophyImage" alt="trophy" loading="lazy" width="17" height="17" class="me-2" />
            </div>
            <div class="flex-grow-1 pe-2">Leaderboard<span class="flex-grow-1 pe-2 fa-xs"> Monthly</span></div>
            <!-- <b-button class="text-primary refresh-color" variant="link" @click="onClickRefresh">
                <b-spinner v-if="isLoading" small />
                <i v-else class="fas fa-sync-alt" />
            </b-button> -->
        </b-card-title>
        <b-list-group class="my-list d-flex flex-column">
            <b-list-group-item
                v-for="(entry, key) of accountStore.leaderboardPrimary"
                :key="key"
                class="d-flex px-0 pe-3 align-items-center"
            >
                <span class="list-item-field-rank">{{ entry.rank }}</span>
                <span class="list-item-field-address flex-grow-1 ps-2 d-flex align-items-center">
                    <b-avatar
                        size="sm"
                        variant="primary"
                        :src="entry.account.profileImg"
                        :alt="`Profile picture of ${entry.account.username}`"
                        class="me-1"
                    />
                    <span class="username-text" :title="entry.account.username">{{ entry.account.username }}</span>
                </span>
                <span class="list-item-field-questcount flex-grow-1 text-opaque pe-3">
                    {{ entry.questEntryCount }}
                    <i class="fas fa-tasks ms-1" />
                </span>
                <strong class="list-item-field-score">{{ formatScore(entry.score) }}</strong>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../stores/Account';
import { useQuestStore } from '../stores/Quest';
import { SANTA_CAMPAIGN, CP_CAMPAIGN } from '../config/secrets';
import trophyImage from '../assets/trophy.png';
export default defineComponent({
    name: 'BaseQuestLeaderboardSmall',
    props: {
        selectedPart: {
            type: String,
            default: 'Quests',
        },
    },
    data() {
        return {
            isLoading: false,
            trophyImage,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        ...mapStores(useQuestStore),
    },
    watch: {
        // '$route'(to, from) {
        //     this.updateLeaderboard();
        // },
        // 'accountStore.participants': {
        //     handler(newVal) {
        //         this.updateLeaderboard();
        //     },
        //     immediate: true,
        // },
    },
    mounted() {
        this.updateLeaderboard();
    },
    methods: {
        async updateLeaderboard() {
            // const url = window.location.href;
            // const poolIdMatch = url.match(/\/c\/([a-f0-9]{24})\//);
            await this.accountStore.getLeaderboard(SANTA_CAMPAIGN);
            // if (poolIdMatch) {
            //     await this.accountStore.getLeaderboard(poolIdMatch[1]);
            // } else {
            //     await this.accountStore.getLeaderboard(SANTA_CAMPAIGN);
            // }
        },
        // async onClickRefresh() {
        //     this.isLoading = true;
        //     await this.accountStore.getLeaderboard(SANTA_CAMPAIGN);
        //     this.isLoading = false;
        // },
        formatScore(score: number) {
            if (this.accountStore.poolId === CP_CAMPAIGN) {
                const dollars = score / 100;
                return `$${dollars.toFixed(dollars % 1 === 0 ? 0 : 2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`;
            }
            return score.toLocaleString();
        },
    },
});
</script>
<style lang="scss" scoped>
.bg-leaderboard {
    background-image: url('/src/assets/bg_leaderboard.png');
}
.card-header {
    border-bottom: var(--bs-card-border-width) solid var(--bs-card-border-color);
}
.list-group-item {
    position: relative;
    padding-left: 40px !important;
}
.list-item-field-rank {
    position: absolute;
    top: 1px;
    left: 1px;
    bottom: 1px;
    width: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.list-item-field-user {
    flex-grow: 1;
    display: flex;
    align-items: center;
}
.list-item-field-questcount {
    width: 50px;
    text-align: right;
    white-space: nowrap;
}
.list-item-field-score {
    width: 50px;
    text-align: right;
}
.refresh-color {
    --bs-primary-rgb: #515151 !important;
}
.leaderboard-wrapper {
    background: transparent;
    background-color: #06020d;
    margin: 0 15px;
    border-radius: 10px;
    border: 0.5px solid rgba(76, 46, 115, 0.4);
}
.my-list {
    //max-height: 320px;
    gap: 0.5rem;
    //overflow-y: scroll;
    //overflow-x: hidden;
}

.my-list .list-group-item {
    border-radius: 5px;
    border: 0.2px solid rgba(255, 255, 255, 0.1);
    background: rgba($color: #000000, $alpha: 0.5);

    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.05);
}

.username-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 110px;
}

.leaderboard-wrapper .card-title {
    border-radius: 10px 10px 0 0;
    padding-top: 19px;
    padding-left: 15px;
    padding-bottom: 18px;
}

.leaderboard-wrapper .list-group {
    padding: 13.5px 7.5px;
}

@media (max-width: 992px) {
    .leaderboard-wrapper {
        height: 100%;
        margin: 0;
    }
    .my-list {
        max-height: calc(100vh - 220px);
    }
}
//@media (max-height: 894px) {
//.my-list {
//    max-height: 200px;
//  }
//}
</style>

<template>
    <div
        v-if="selectedPart === 'leaderboard'"
        header-class="p-0"
        body-class="d-flex flex-column pt-0"
        class="leaderboard-wrapper"
    >
        <b-card-title class="d-flex m-0 align-items-center leaderboard-head">
            <!-- <div class="d-flex align-items-center justify-content-center" style=""> -->
            <!-- <i class="fa fa-trophy me-2 text-opaque" /> -->
            <!-- <img :src="trophyImage" alt="trophy" loading="lazy" width="17" height="17" class="me-2" /> -->
            <!-- </div> -->
            <div class="flex-grow-1 pe-2 quest-group-title-wrapper">
                <h3 class="quest-group-title">
                    Leaderboard
                    <span class="reward-info-wrap">
                        <i class="fas fa-info-circle fs-6" style="opacity: 0.35"></i>
                        <span class="tooltip-text"
                            ><b>The Stars Atop Our Tree!</b> Monthly ranking of highest earning Santa users.</span
                        >
                    </span>
                </h3>
                <p
                    class="d-block flex-grow-1 pe-2 fa-xs mt-2"
                    style="color: var(--body-color); opacity: 0.6; font-family: Poppins"
                >
                    (Monthly)
                </p>
            </div>
            <!-- <b-button class="text-primary refresh-color" variant="link" @click="onClickRefresh">
                <b-spinner v-if="isLoading" small />
                <i v-else class="fas fa-sync-alt" />
            </b-button> -->
        </b-card-title>

        <img class="leaderboard-image" src="../assets/leaderboard.png" alt="leaderboard" />

        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Quests Completed</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <div class="table-separator"></div>
                <tbody v-if="isLoading">
                    <tr v-for="n in 10" :key="n" class="skeleton-item">
                        <td>
                            <div class="skeleton-rank">{{ n }}</div>
                        </td>
                        <td>
                            <div class="d-flex align-items-center gap-3">
                                <div class="skeleton-avatar"></div>
                                <div class="skeleton-username"></div>
                            </div>
                        </td>
                        <td>
                            <div class="d-flex align-items-center gap-2">
                                <div class="skeleton-quests"></div>
                                <i class="fas fa-tasks ms-1"></i>
                            </div>
                        </td>
                        <td>
                            <div class="skeleton-points"></div>
                        </td>
                    </tr>
                </tbody>

                <tbody v-else>
                    <tr v-for="(entry, key) of accountStore.leaderboardPrimary" :key="key" class="skeleton-item">
                        <td>
                            <div class="list-item-field-rank">{{ entry.rank }}</div>
                        </td>
                        <td>
                            <span class="list-item-field-address flex-grow-1 d-flex align-items-center gap-3">
                                <b-avatar
                                    size="md"
                                    variant="primary"
                                    :src="entry.account.profileImg"
                                    :alt="`Profile picture of ${entry.account.username}`"
                                    class="me-1"
                                />
                                <span class="username-text" :title="entry.account.username">{{
                                    entry.account.username
                                }}</span>
                            </span>
                        </td>
                        <td>
                            <div class="list-item-field-questcount flex-grow-1 gap-2">
                                <span>{{ entry.questEntryCount }}</span>
                                <i class="fas fa-tasks ms-1" />
                            </div>
                        </td>
                        <td>
                            <strong class="list-item-field-score">{{ formatScore(entry.score) }}</strong>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../stores/Account';
import { useQuestStore } from '../stores/Quest';
import { SANTA_CAMPAIGN, CP_CAMPAIGN } from '../config/secrets';
import trophyImage from '../assets/trophy.png';
import { useTrackPageview } from '../utils/snowplowTracker';
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
        useTrackPageview();
        this.updateLeaderboard();
    },
    methods: {
        async updateLeaderboard() {
            // const url = window.location.href;
            // const poolIdMatch = url.match(/\/c\/([a-f0-9]{24})\//);
            if (this.isLoading) return;
            this.isLoading = true;
            await this.accountStore.getLeaderboard(SANTA_CAMPAIGN);
            this.isLoading = false;
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
.card-header {
    border-bottom: var(--bs-card-border-width) solid var(--bs-card-border-color);
}

.list-group-item {
    position: relative;
    padding-left: 40px !important;
}

.list-item-field-rank {
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.list-item-field-user {
    flex-grow: 1;
    display: flex;
    align-items: center;
}

.list-item-field-questcount {
    display: flex;
    align-items: center;
    //text-align: right;
    white-space: nowrap;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px;
}

.list-item-field-questcount i {
    color: #888888;
}

.list-item-field-score {
    width: 50px;
    text-align: right;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 175%;
    letter-spacing: 0.48px;
}

.refresh-color {
    --bs-primary-rgb: #515151 !important;
}

.leaderboard-wrapper {
    background: transparent;
    width: 100%;
    max-width: 800px;
    height: calc(100vh - 160px);
    overflow: auto;
    overflow-x: hidden;
}

.leaderboard-head {
    position: sticky;
    top: 0;
    padding: 15px 0 !important;
    background: var(--body-rewards-bg);
    z-index: 111;
}

.my-list {
    margin-top: 0 !important;
}

.my-list .list-group-item {
    border: none;
    border-radius: 0;
    padding: 4px 0;

    &:nth-child(odd) {
        background-color: var(--quest-item-bg);
    }

    &:nth-child(even) {
        background-color: var(--main-content-bg);
    }
}

.username-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 160px;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.leaderboard-wrapper .card-title {
    padding-bottom: 18px;
}

.leaderboard-wrapper .list-group {
    margin: 13.5px 0;
}

.skeleton-loader {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.skeleton-item {
    &:nth-child(odd) {
        background-color: var(--quest-item-bg);
    }

    &:nth-child(even) {
        background-color: var(--main-content-bg);
    }
}

.skeleton-avatar,
.skeleton-username,
.skeleton-quests,
.skeleton-points {
    background-color: #c0c0c0;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
}

.skeleton-quests {
    width: 20px;
}

.skeleton-points {
    width: 60px;
}

.skeleton-username {
    width: 100px;
}

.skeleton-rank {
    width: unset;
    text-align: left;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}

.skeleton-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin: 0;
}

.skeleton-username,
.skeleton-quests,
.skeleton-points {
    height: 20px;
}

.leaderboard-title {
    font-feature-settings: 'liga' off, 'clig' off;
    text-shadow: 0px 1px 9px rgba(255, 255, 255, 0.3);
    font-family: Poppins;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 18px;
}

.list-item-field-address .b-avatar {
    width: 32px;
    height: 32px;
}

.my-list,
.skeleton-loader {
    border: 1px solid var(--btn-sidebar-border-color);
    border-radius: 3px;
}

.reward-info-wrap {
    position: relative;
    display: inline-block;

    .tooltip-text {
        visibility: hidden;
        width: 200px;
        background: var(--home-background);
        color: var(--modal-text-color);
        text-align: center;
        padding: 10px;
        border-radius: 8px;
        position: absolute;
        top: 125%;
        transform: translateX(-50%);
        opacity: 0;
        transition: opacity 0.3s;
        font-size: 12px;
        z-index: 10;
        border: 1px solid var(--dropdown-border-color);
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.2);
        text-shadow: none;

        &::after {
            content: '';
            position: absolute;
            top: -12px;
            left: 47%;
            transform: translateX(-53%);
            border-width: 6px;
            border-style: solid;
            border-color: transparent transparent var(--dropdown-border-color) transparent;
        }
    }

    &:hover .tooltip-text {
        visibility: visible;
        opacity: 1;
    }
}

@keyframes pulse {
    0% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }

    100% {
        opacity: 1;
    }
}

@media (max-width: 992px) {
    .leaderboard-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        margin: 0;
        width: 100%;
        height: unset;
        overflow: unset;
    }

    .username-text {
        padding-left: 5px;
    }

    .leaderboard-wrapper .list-group {
        flex: 1;
        overflow-y: auto;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
        margin: 13.5px 0;
    }

    .list-group-item {
        padding-left: 30px !important;
    }

    .leaderboard-wrapper .card-title {
        padding-left: 0;
    }
}

@media (max-width: 360px) {
    .username-text {
        width: 110px;
    }
}

//@media (max-height: 894px) {
//.my-list {
//    max-height: 200px;
//  }
//}

.quest-group-title-wrapper p {
    margin-bottom: 0.5rem !important;
}

.table-wrapper {
    overflow-x: scroll;
}

table {
    width: 100%;
    border-collapse: collapse;
    min-width: 560px;
}

th:first-child,
td:first-child {
    width: 86px;
}

th:nth-child(3),
td:nth-child(3) {
    min-width: 180px;
}

th:nth-child(4),
td:nth-child(4) {
    width: 140px;
}

thead {
    height: 28px;
    background-color: var(--lb-table-head-bg);
    border: 0.5px solid var(--lb-table-head-border-color);
}

tbody {
    border: 1px solid var(--btn-sidebar-border-color);
}

thead th {
    color: var(--lb-table-head-color);
    font-weight: normal;
    font-size: 13px;
    padding: 0 16px;
}

tbody tr {
    height: 40px;
}

tbody tr td {
    padding: 0 16px;
}

.table-separator {
    height: 10px;
}

.leaderboard-image {
    width: 800px;
    max-width: 100%;
    height: 110px;
    top: 48px;
    left: 16px;
    border-radius: 2px;
    opacity: 1;
    border-width: 1px;
    margin-bottom: 10px;
    object-fit: cover;
}

@media (max-width: 992px) {
    .leaderboard-image {
        height: auto;
    }
}

@media (max-width: 992px) {
    table {
        min-width: 400px;
    }

    th:first-child,
    td:first-child {
        width: 40px;
    }

    th:nth-child(2),
    td:nth-child(2) {
        min-width: 120px;
    }

    th:nth-child(3),
    td:nth-child(3) {
        min-width: 100px;
    }

    th:nth-child(4),
    td:nth-child(4) {
        width: 80px;
    }

    thead th {
        font-size: 13px;
        padding: 0 8px;
    }

    tbody tr td {
        padding: 0 8px;
        font-size: 14px;
    }

    .username-text {
        width: 100px;
        font-size: 14px;
    }

    .list-item-field-questcount {
        font-size: 14px;
    }

    .list-item-field-score {
        font-size: 14px;
    }

    .list-item-field-rank {
        font-size: 14px;
    }
}

@media (max-width: 480px) {
    table {
        min-width: 320px;
    }

    th:first-child,
    td:first-child {
        width: 30px;
    }

    th:nth-child(2),
    td:nth-child(2) {
        min-width: 100px;
    }

    th:nth-child(3),
    td:nth-child(3) {
        min-width: 80px;
    }

    th:nth-child(4),
    td:nth-child(4) {
        width: 60px;
    }

    thead th {
        font-size: 12px;
        padding: 0 4px;
    }

    tbody tr td {
        padding: 0 4px;
        font-size: 13px;
    }

    .username-text {
        width: 80px;
        font-size: 13px;
    }

    .list-item-field-questcount {
        font-size: 13px;
    }

    .list-item-field-score {
        font-size: 13px;
    }

    .list-item-field-rank {
        font-size: 13px;
    }

    .list-item-field-address .b-avatar {
        width: 24px;
        height: 24px;
    }
}

@media (max-width: 360px) {
    table {
        min-width: 280px;
    }

    th:nth-child(3),
    td:nth-child(3) {
        display: none;
    }

    th:nth-child(2),
    td:nth-child(2) {
        min-width: 150px;
    }

    .username-text {
        width: 130px;
    }
}
</style>

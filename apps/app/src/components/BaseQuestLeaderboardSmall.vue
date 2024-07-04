<template>
    <div header-class="p-0" body-class="d-flex flex-column p-2 pt-0" class="leaderboard-wrapper">
        <b-card-title class="d-flex px-1 py-1 m-0 align-items-center">
            <div class="d-flex align-items-center justify-content-center" style="width: 25px">
                <i class="fa fa-trophy me-2 text-opaque" />
            </div>
            <div class="flex-grow-1 pe-2">Leaderboard</div>
            <b-button class="text-primary refresh-color" variant="link" @click="onClickRefresh">
                <b-spinner v-if="isLoading" small />
                <i v-else class="fas fa-sync-alt" />
            </b-button>
        </b-card-title>
        <b-list-group class="my-list d-flex flex-column">
            <b-list-group-item
                v-for="(entry, key) of accountStore.leaderboardPrimary"
                :key="key"
                class="d-flex px-0 pe-3"
            >
                <span class="list-item-field-rank">{{ entry.rank }}</span>
                <span class="list-item-field-address flex-grow-1 ps-2">
                    <b-avatar
                        size="sm"
                        variant="primary"
                        :src="entry.account.profileImg"
                        :alt="`Profile picture of ${entry.account.username}`"
                        class="me-1"
                    />
                    {{ entry.account.username }}
                </span>
                <span class="list-item-field-questcount flex-grow-1 text-opaque pe-3">
                    {{ entry.questEntryCount }}
                    <i class="fas fa-tasks ms-1" />
                </span>
                <strong class="list-item-field-score">{{ entry.score }}</strong>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useAccountStore } from '../stores/Account';
import { useQuestStore } from '../stores/Quest';
import { SANTA_CAMPAIGN } from '../config/secrets';

export default defineComponent({
    name: 'BaseQuestLeaderboardSmall',
    data() {
        return {
            isLoading: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        ...mapStores(useQuestStore),
    },
    mounted() {
        this.accountStore.getLeaderboard(SANTA_CAMPAIGN);
    },
    methods: {
        async onClickRefresh() {
            this.isLoading = true;
            await this.accountStore.getLeaderboard(SANTA_CAMPAIGN);
            this.isLoading = false;
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
    position: absolute;
    top: 1px;
    left: 1px;
    bottom: 1px;
    width: 40px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}
.list-item-field-user {
    flex-grow: 1;
    display: flex;
    align-items: center;
}
.list-item-field-questcount {
    width: 50px;
    text-align: right;
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
    padding: 0 16px !important;
}
.my-list {
    gap: 0.5rem;
}

.my-list .list-group-item {
    border-radius: 5px;
    border: 0.2px solid rgba(255, 255, 255, 0.1);
    background: linear-gradient(155deg, rgba(255, 255, 255, 0) -2.13%, rgba(0, 0, 0, 0.15) 136.58%);

    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.05);
}
</style>

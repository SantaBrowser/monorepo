<template>
    <aside v-if="isShown" class="sidebar" :style="{ backgroundImage: `url(src/assets/bg-mosaic.png)` }">
        <div class="sidebar-panel h-100">
            <BaseCardAccount />
            <BaseCardRewards v-if="isShown" />
            <BaseQuestLeaderboardSmall v-if="isShown" class="mt-auto" />
            <BaseCardDiscord v-if="isShown" />
        </div>
    </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAccountStore } from '../stores/Account';
import { mapStores } from 'pinia';
export default defineComponent({
    data() {
        return {
            screenWidth: window.innerWidth,
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        isShown() {
            if (!this.accountStore.isAuthenticated) return false;
            if (!this.accountStore.isMobile) return true;
            return this.accountStore.isSidebarShown;
        },
        scrollHeight() {
            const { windowHeight, isMobile } = this.accountStore;
            // Return null to disable custom scroller
            if (isMobile) return null;
            const mobileOffset = 30;
            const height = windowHeight - mobileOffset;
            return { height: `${height}px` };
        },
    },
});
</script>
<style lang="scss">
.sidebar {
    background-color: transparent;
    .sidebar-panel {
        display: flex;
        flex-direction: column;
        width: 350px;
        max-width: 350px;
        border-radius: 8px;
        //background-color: red;
        box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
        backdrop-filter: blur(5px);
        border-left: 3px solid #232323;
        overflow-x: hidden;
        overflow-y: auto;

        @media (max-width: 991px) {
            border: 0;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.75);
            width: 90%;
        }
    }
}
</style>

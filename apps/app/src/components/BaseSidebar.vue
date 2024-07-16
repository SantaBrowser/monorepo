<template>
    <aside v-if="isShown" class="sidebar">
        <div class="sidebar-panel h-100">
            <BaseReferral />
            <!-- <hr class="mt-2 mb-0" style="opacity: 0.1" /> -->
            <!-- <BaseCardRewards /> -->
            <BaseQuestLeaderboardSmall />
            <div style="height: 10px"></div>
            <BaseCardDiscord class="mt-auto" />
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
    background: rgba(44, 44, 44, 0.3);
    .sidebar-panel {
        width: 350px;
        max-width: 350px;
        border-radius: 0;
        box-shadow: -9px -5px 20px 20px rgb(63 77 202 / 12%);
        backdrop-filter: blur(5px);
        border-left: 1px dotted #20af104d;
        overflow-x: hidden;
        overflow-y: auto;

        @media (max-width: 991px) {
            border: 0;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.75);
            width: 90%;
        }
    }
}

.sidebar .bg-splash {
    background-color: transparent;
    border-radius: 0;
}

.bg-referral {
    background-color: #cdc40c;
    color: black;
    margin: 15px;
    border-radius: 10px;
    border: 0.5px solid rgba(76, 46, 115, 0.4);
}
</style>

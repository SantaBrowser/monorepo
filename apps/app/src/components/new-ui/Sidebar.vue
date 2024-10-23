<template>
    <aside class="d-flex flex-column justify-content-between p-3 h-100">
        <nav class="d-flex flex-column gap-3 fs-6 fw-normal">
            <a
                v-for="item in navItems"
                :key="item.name"
                href="#"
                class="text-decoration-none d-flex align-items-center gap-3 rounded-3 px-3 py-2 side-nav-item"
                :class="{ active: activeNavItem === item.name }"
                @click.prevent="selectNavItem(item.name)"
            >
                <img :src="item.icon" alt="" width="16" height="16" />
                {{ item.label }}
            </a>
        </nav>
        <BaseCardDiscord />
    </aside>
</template>

<script>
import { defineComponent } from 'vue';
import imgQuests from '../../assets/quest.png';
import imgRewards from '../../assets/reward.png';
import imgLeaderboard from '../../assets/leader.png';
import imgWallet from '../../assets/wallet.png';
import imgTransactions from '../../assets/transaction.png';

export default defineComponent({
    name: 'Sidebar',
    data() {
        return {
            activeNavItem: 'quests',
            navItems: [
                { name: 'quests', label: 'Quests', icon: imgQuests },
                { name: 'rewards', label: 'Rewards', icon: imgRewards },
                { name: 'leaderboard', label: 'Leaderboard', icon: imgLeaderboard },
                { name: 'wallet', label: 'Wallet', icon: imgWallet },
                { name: 'transactions', label: 'Transactions', icon: imgTransactions },
            ],
        };
    },
    methods: {
        selectNavItem(itemName) {
            this.activeNavItem = itemName;
            this.$emit('nav-clicked', itemName);
        },
    },
});
</script>

<style scoped>
.side-nav-item {
    width: 167px;
    border: 0.5px solid #1d1d1d;
    background: rgba(27, 27, 27, 0.4);
    color: #cacaca;
    font-size: 12px;
}
.active {
    background-color: #d44646;
    font-weight: 600;
    border-color: transparent;
    color: #ffffff;
}
</style>

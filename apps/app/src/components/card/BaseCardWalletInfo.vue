<template>
    <div
        v-if="list.length"
        class="d-flex gap-2 dropdown-menu wal-dropdown align-items-center justify-content-between equal-divs m-0 white-btn"
        @mouseover="mouseover"
        @mouseleave="mouseleave"
    >
        <div class="fst-italic">WALLET</div>
        <div class="flex-icons">
            <div v-for="(token, key) of list">
                <img :key="key" :src="token.erc20.logoImgUrl" alt="ERC20" class="img-circle" />
            </div>
        </div>
        <ul class="dropdown" :class="{ isOpen }">
            <li v-for="(token, key) of list">
                <div :key="key">
                    <component :is="token.component" :token="token" />
                </div>
            </li>
        </ul>
    </div>
    <!-- <div variant="outline-dark" class="d-flex gap-2" style="width: 300px" size="sm" no-caret>
        <template #button-content>
            <div class="d-flex align-items-center justify-content-between equal-divs m-0 white-btn">
                <div class="flex-grow-1 pe-2">WALLET</div>
            </div>
        </template>
        <b-dropdown-item-button v-for="(token, key) of list" :key="key" class="mb-1">
            <component :is="token.component" :token="token" />
        </b-dropdown-item-button>
    </> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useWalletStore } from '../../stores/Wallet';
import { useAuthStore } from '../../stores/Auth';
import { RewardVariant } from '@thxnetwork/common/enums';
import { useAccountStore } from '../../stores/Account';
import BaseCardERC20 from '../../components/card/BaseCardERC20.vue';
import BaseCardERC721 from '../../components/card/BaseCardERC721.vue';
import BaseCardCouponCode from '../../components/card/BaseCardCouponCode.vue';
import BaseCardDiscordRole from '../../components/card/BaseCardDiscordRole.vue';
import BaseCardGalachain from '../../components/card/BaseCardGalachain.vue';

export default defineComponent({
    name: 'BaseCardWalletInfo',
    components: {
        BaseCardERC20,
        BaseCardERC721,
        BaseCardCouponCode,
        BaseCardDiscordRole,
        BaseCardGalachain,
    },
    data() {
        return {
            error: '',
            isOpen: false,
            isSubmitting: false,
            isRefreshing: false,
            activeFilter: { label: 'All', key: [] } as { label: string; key: number[] },
            RewardVariant,
            filters: [
                {
                    label: 'All',
                    key: [],
                },
                {
                    label: 'Coins',
                    key: [RewardVariant.Coin],
                },
                {
                    label: 'NFT',
                    key: [RewardVariant.NFT],
                },
                {
                    label: 'Discord',
                    key: [RewardVariant.DiscordRole],
                },
                {
                    label: 'Codes',
                    key: [RewardVariant.Coupon],
                },
                {
                    label: 'Galachain',
                    key: [RewardVariant.Galachain],
                },
            ] as { label: string; key: number[] }[],
        };
    },
    computed: {
        ...mapStores(useAuthStore, useAccountStore, useWalletStore),
        list() {
            console.log(
                [
                    ...this.walletStore.erc20,
                    ...this.walletStore.erc721,
                    ...this.walletStore.erc1155,
                    ...this.walletStore.couponCodes,
                    ...this.walletStore.discordRoles,
                    ...this.walletStore.galachain,
                ].filter((item) => {
                    if (!this.activeFilter.key.length) return true;
                    return this.activeFilter.key.includes(item.rewardVariant);
                }),
            );
            return [
                ...this.walletStore.erc20,
                ...this.walletStore.erc721,
                ...this.walletStore.erc1155,
                ...this.walletStore.couponCodes,
                ...this.walletStore.discordRoles,
                ...this.walletStore.galachain,
            ]
                .filter((item) => {
                    if (!this.activeFilter.key.length) return true;
                    return this.activeFilter.key.includes(item.rewardVariant);
                })
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .reverse();
        },
    },
    mounted() {
        this.listRewards();
    },
    methods: {
        mouseover: function () {
            console.log(this.isOpen);
            this.isOpen = true;
        },
        mouseleave: function () {
            console.log(this.isOpen);
            this.isOpen = false;
        },
        onClickSignin() {
            this.accountStore.signin();
        },
        async onClickRefresh() {
            await this.listRewards();
        },
        async listRewards() {
            this.isRefreshing = true;
            await this.walletStore.list();
            this.isRefreshing = false;
        },
    },
});
</script>

<style>
.tabs-rewards .nav-tabs {
    border-color: #232323;
}

.tabs-rewards .nav-link.active {
    --bs-nav-tabs-link-active-bg: #111113 !important;
    --bs-nav-tabs-link-active-border-color: #232323 !important;
}

.refresh-color {
    --bs-primary-rgb: #515151 !important;
}

.equal-divs {
    background: rgba(255, 255, 255, 0.03);
    flex: 1;
    min-width: 0;
    min-height: 0;
    padding: 7px 20px;
    border-radius: 22px;
    border: 1px dotted #4b4bc0;
}

.white-btn {
    padding: 12px;
    font-feature-settings: 'clig' off, 'liga' off;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
}

.isOpen {
    display: block !important;
}

.dropdown {
    position: absolute;
    top: 110%;
    left: 0;
    display: none;
    padding: 0;
    list-style-type: none;
    background: #000;
    border: 1px dotted #ffcd06;
    border-radius: 20px;
    margin-top: -4px;
    overflow: hidden;
}

.dropdown li {
    width: 250px;
}

.dropdown li a {
    display: block;
    padding: 10px;
    color: #fff;
    text-decoration: none;
}

.dropdown-menu {
    position: relative;
    display: block;
    height: auto;
    /* padding: 20px; */
    color: #fff;
    text-decoration: none;
    cursor: pointer;
    background: #000;
    border-radius: 20px;
    border: 1px dotted #ffcd06;
}

.dropdown-box {
    background-color: #111113;
}

.flex-icons {
    display: flex;
    flex-direction: row;
    gap: 10px;
}

.wal-dropdown {
    font-size: 11px;
}
.wal-dropdown .btn-group {
    display: none;
}

.img-circle {
    width: 24px;
    border-radius: 50%;
}
</style>

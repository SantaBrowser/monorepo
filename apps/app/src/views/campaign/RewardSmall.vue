<template>
    <b-container>
        <b-row>
            <b-col lg="10" offset-lg="1">
                <div v-if="rewardStore.isLoading" class="d-flex justify-content-center py-5">
                    <b-spinner variant="primary" small />
                </div>
                <b-row v-else>
                    <b-col v-for="(reward, key) of rewardsList" :key="key" lg="4" :style="{ width: '240px' }">
                        <component :is="componentMap[reward.variant]" :reward="reward" class="mb-2" />
                    </b-col>
                </b-row>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useRewardStore } from '../../stores/Reward';
import { RewardVariant } from '../../types/enums/rewards';
import BaseCardRewardCoin from '../../components/card/BaseCardRewardCoin.vue';
import BaseCardRewardNFT from '../../components/card/BaseCardRewardNFT.vue';
import BaseCardRewardCustom from '../../components/card/BaseCardRewardCustom.vue';
import BaseCardRewardCoupon from '../../components/card/BaseCardRewardCoupon.vue';
import BaseCardRewardDiscordRole from '../../components/card/BaseCardRewardDiscordRole.vue';
import BaseCardRewardGalachain from '../../components/card/BaseCardRewardGalachain.vue';

const componentMap: { [variant: string]: string } = {
    [RewardVariant.Coin]: 'BaseCardRewardCoin',
    [RewardVariant.NFT]: 'BaseCardRewardNFT',
    [RewardVariant.Custom]: 'BaseCardRewardCustom',
    [RewardVariant.Coupon]: 'BaseCardRewardCoupon',
    [RewardVariant.DiscordRole]: 'BaseCardRewardDiscordRole',
    [RewardVariant.Galachain]: 'BaseCardRewardGalachain',
};

export default defineComponent({
    name: 'RewardsSmall',
    components: {
        BaseCardRewardCoin,
        BaseCardRewardNFT,
        BaseCardRewardCustom,
        BaseCardRewardCoupon,
        BaseCardRewardDiscordRole,
        BaseCardRewardGalachain,
    },
    variants: [],

    props: ['message'],
    data() {
        return {
            componentMap,
            rewardsList: [],
        };
    },
    computed: {
        ...mapStores(useRewardStore),
        // rewardsList() {
        //     return this.rewardStore.listReturn(this.message);
        // },
    },
    async mounted() {
        console.log('The props are also available in JS:', this.message);
        await this.getRewards(this.message);
    },
    methods: {
        async getRewards(poolId: string) {
            try {
                this.rewardsList = await this.rewardStore.listReturn(poolId);
                console.log(this.rewardsList);
            } catch (error) {
                console.error('rewards fetch error:', error);
            }
        },
    },
});
</script>

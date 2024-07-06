<template>
    <b-container>
        <b-row>
            <b-col lg="12" offset-lg="1">
                <div v-if="rewardStore.isLoading" class="d-flex justify-content-center py-5">
                    <b-spinner variant="primary" small />
                </div>

                <b-row v-else>
                    <b-col
                        v-if="score !== 0 && message !== CP_CAMPAIGN"
                        lg="4"
                        :style="{ width: '200px' }"
                        class="my-reward"
                    >
                        <div class="justify-content-center py-2">
                            <h2>
                                Start completing SANTA QUESTS and you can buy crypto and coupons using those santa
                                coins!
                            </h2>
                            <button class="w-100 my-btn" variant="primary">Browse <strong>Quests</strong></button>
                        </div>
                    </b-col>
                    <b-col
                        v-if="score === 0 && message === CP_CAMPAIGN"
                        lg="4"
                        :style="{ width: '200px' }"
                        class="my-reward"
                    >
                        <div class="justify-content-center py-2">
                            <h2>
                                Start completing tasks on SANTA PLAYWALL and you can buy crypto and coupons using those
                                coins!
                            </h2>
                            <button class="w-100 my-btn" variant="primary">Browse <strong>Tasks</strong></button>
                        </div>
                    </b-col>
                    <b-col
                        v-if="score === 0 && message === CP_CAMPAIGN"
                        lg="4"
                        :style="{ width: '200px' }"
                        class="my-reward"
                    >
                        <div class="justify-content-center py-2">
                            <h2>
                                Start purchasing using the offers available from our cashback system and get rewarded!
                            </h2>
                            <button class="w-100 my-btn" variant="primary">Browse <strong>Stores</strong></button>
                        </div>
                    </b-col>
                    <b-col v-for="(reward, key) of rewardsList" :key="key" lg="4" :style="{ width: '220px' }">
                        <component :is="componentMap[reward.variant]" :reward="reward" class="mb-2" />
                    </b-col>
                    <b-col lg="4" :style="{ width: '200px' }" class="my-reward">
                        <div v-if="score !== 0" class="justify-content-center py-2">
                            <h2>Set SANTA default for a month and earn more coins!</h2>
                            <button class="w-100 my-btn" variant="primary">Set as <strong>Default</strong></button>
                        </div>
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
import { SANTA_CAMPAIGN, CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';

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

    props: ['message', 'score'],
    data() {
        return {
            componentMap,
            rewardsList: [],
            SANTA_CAMPAIGN,
            CP_CAMPAIGN,
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
<style lang="scss">
.my-reward {
    background: #a52a2ad9;
    border-radius: 10px;
    margin: 0px 15px;
    h2 {
        font-size: 1rem;
        font-weight: 300;
        line-height: 25px;
    }
    font-size: 12px;
}
</style>

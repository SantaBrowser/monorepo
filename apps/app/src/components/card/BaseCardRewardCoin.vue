<template>
    <BaseCardReward :reward="reward" :image="reward.image">
        <template #title>
            <div class="flex-grow-1">{{ reward.title }}</div>
            <!-- <div class="fw-bold bg-opacity">{{ reward.amount }} {{ reward.erc20 && reward.erc20.symbol }}</div> -->
        </template>
    </BaseCardReward>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
    name: 'BaseCardRewardCoin',
    props: {
        reward: {
            type: Object as PropType<TRewardCoin>,
            required: true,
        },
    },
});
</script>

<style>
.bg-opacity {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.3);
    padding: 5px 10px;
    white-space: nowrap;
}
</style>

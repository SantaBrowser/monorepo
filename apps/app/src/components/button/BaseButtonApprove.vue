<template>
    <b-button :disabled="isDisabled" variant="primary" :size="size" class="w-100" @click="onClickApprove">
        <b-spinner v-if="isPolling" small />
        <template v-else> <slot /> </template>
    </b-button>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { BigNumber } from 'ethers/lib/ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { useWalletStore } from '@thxnetwork/app/stores/Wallet';
import { useVeStore } from '@thxnetwork/app/stores/VE';
import { useAccountStore } from '@thxnetwork/app/stores/Account';
import { mapStores } from 'pinia';
import { contractNetworks } from '@thxnetwork/app/config/constants';
import { ChainId } from '@thxnetwork/common/enums';
import { track } from '@thxnetwork/common/mixpanel';
import poll from 'promise-poller';

export default defineComponent({
    name: 'BaseButtonApprove',
    props: {
        size: { type: String as PropType<'sm'> | null, default: null },
        amount: { type: String, required: true },
        token: { type: Object as PropType<{ address: string; decimals: number }>, required: true },
        spender: { type: String, required: true },
        disabled: { type: Boolean, default: false },
    },
    data() {
        return {
            isPolling: false,
        };
    },
    computed: {
        ...mapStores(useVeStore, useWalletStore, useAccountStore),
        address() {
            if (!this.walletStore.wallet) return contractNetworks[ChainId.Polygon];
            return contractNetworks[this.walletStore.wallet.chainId];
        },
        amountInWei() {
            return parseUnits(this.amount, this.token.decimals);
        },
        allowanceInWei() {
            if (!this.walletStore.allowances[this.token.address]) return '0';
            if (!this.walletStore.allowances[this.token.address][this.spender]) return '0';
            return this.walletStore.allowances[this.token.address][this.spender];
        },
        currentAllowance() {
            return Number(formatUnits(this.allowanceInWei, this.token.decimals));
        },
        isSufficientAllowance() {
            return BigNumber.from(this.allowanceInWei).gte(this.amountInWei);
        },
        isDisabled() {
            return this.isPolling || !this.amountInWei.gt(0) || this.disabled;
        },
    },
    methods: {
        waitForApproval() {
            const taskFn = async () => {
                await this.walletStore.getApproval({
                    tokenAddress: this.token.address,
                    spender: this.spender,
                });
                return this.isSufficientAllowance ? Promise.resolve() : Promise.reject('Approve');
            };
            return poll({ taskFn, interval: 3000, retries: 20 });
        },
        async onClickApprove() {
            try {
                this.isPolling = true;

                const data = {
                    tokenAddress: this.token.address,
                    spender: this.spender,
                    amountInWei: this.amountInWei.toString(),
                };
                await this.walletStore.approve(data);

                await this.waitForApproval();

                this.trackEvent(data);
                this.$emit('success');
            } catch (error) {
                this.$emit('error', error);
            } finally {
                this.isPolling = false;
            }
        },
        trackEvent(data: any) {
            const { poolId, account } = this.accountStore;
            const { wallet } = this.walletStore;
            track('UserCreates', [account?.sub, 'allowance', { poolId, address: wallet?.address, ...data }]);
        },
    },
});
</script>

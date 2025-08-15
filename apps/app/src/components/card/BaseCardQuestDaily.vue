<template>
    <BaseCardQuest
        :id="quest._id"
        :quest="quest"
        :visible="!!accountStore.isAuthenticated && quest.isAvailable"
        :loading="isSubmitting"
        :completing="isModalQuestEntryShown"
        :error="error"
        @modal-close="isModalQuestEntryShown = false"
    >
        <div class="d-flex justify-content-start mb-2 gap-2 overflow-auto daily-box">
            <b-badge
                v-for="(amount, key) of quest.amounts"
                class="d-flex flex-column align-items-center justify-content-center"
                :variant="key < quest.entries.length ? 'success' : 'primary'"
                :class="
                    key < quest.entries.length ? 'bg-success text-white bg-daily-completed' : 'bg-primary text-white'
                "
                :style="{ color: '#fff' }"
            >
                <small>Day {{ key + 1 }}</small>
                <strong class="h5 mb-0">{{ formatAmount(amount) }} </strong>
            </b-badge>
        </div>
        <template #button>
            <button
                block
                :class="
                    quest.isLocked || !quest.isAvailable || isSubmitting
                        ? 'w-100 locked-btn pe-none'
                        : 'w-100 btn-primary'
                "
                :disabled="isSubmitting"
                @click="quest.isAvailable ? onClickClaim() : null"
            >
                <b-spinner v-if="isSubmitting" small />
                <template v-else-if="quest.isAvailable"> Claim </template>
                <template v-else-if="!quest.isAvailable">
                    You can claim again in
                    <span v-if="waitDuration"
                        ><strong>{{ waitDuration.hours }}</strong
                        >:<strong>{{ waitDuration.minutes }}</strong
                        >:<strong>{{ waitDuration.seconds }}</strong></span
                    >
                </template>
            </button>
        </template>
    </BaseCardQuest>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent, PropType } from 'vue';
import { useAccountStore } from '../../stores/Account';
import { useQuestStore } from '../../stores/Quest';
import { useAuthStore } from '../../stores/Auth';
import { intervalToDuration, sub } from 'date-fns';
import { CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';
export default defineComponent({
    name: 'BaseCardQuestDaily',
    props: {
        visible: {
            type: Boolean,
        },
        quest: {
            type: Object as PropType<TQuestDaily>,
            required: true,
        },
        groupTitle: {
            type: String,
            required: false,
        },
    },
    data(): {
        interval: any;
        error: string;
        isSubmitting: boolean;
        secondsToSubtract: number;
        now: number;
        isModalQuestEntryShown: boolean;
        CP_CAMPAIGN: string;
    } {
        return {
            interval: null,
            error: '',
            isSubmitting: false,
            secondsToSubtract: 0,
            now: Math.floor(Date.now() / 1000),
            isModalQuestEntryShown: false,
            CP_CAMPAIGN,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore, useQuestStore),
        isAlertWaitDurationShown() {
            return !!this.waitDuration;
        },
        waitDuration: function () {
            if (!this.quest.claimAgainDuration) return;

            const end = Date.now() + this.quest.claimAgainDuration * 1000;
            const { hours, minutes, seconds } = intervalToDuration({
                start: Math.floor(Date.now() / 1000) * 1000, // Convert to s, round down and convert back to ms
                end: sub(end, { seconds: this.secondsToSubtract }),
            });

            return {
                hours: String(hours).padStart(2, '0'),
                minutes: String(minutes).padStart(2, '0'),
                seconds: String(seconds).padStart(2, '0'),
            };
        },
    },
    created() {
        this.interval = setInterval(() => {
            this.secondsToSubtract = this.secondsToSubtract + 1;
        }, 1000);
    },
    beforeUnmount() {
        clearInterval(this.interval);
    },
    methods: {
        formatAmount(amount: number): string {
            if (this.quest.poolId === CP_CAMPAIGN) {
                const formattedAmount = (amount / 100).toFixed(2);
                return `$${formattedAmount}`;
            }
            return `${amount}`;
        },
        onClickSignin: function () {
            this.accountStore.signin();
        },
        onClickClaim: async function () {
            try {
                this.error = '';
                this.isSubmitting = true;
                await this.questStore.completeQuest(this.quest);
                this.isModalQuestEntryShown = true;
                // Confetti on success
                this.fireConfetti();
            } catch (error) {
                this.error = String(error);
            } finally {
                this.isSubmitting = false;
            }
        },
        async loadConfettiScript() {
            if ((window as any).confetti) return;
            await new Promise<void>((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js';
                s.async = true;
                s.onload = () => resolve();
                s.onerror = () => reject(new Error('Confetti failed to load'));
                document.head.appendChild(s);
            });
        },
        async fireConfetti() {
            try {
                await this.loadConfettiScript();
                const confetti = (window as any).confetti;
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { y: 0.25 },
                    scalar: 0.8,
                    colors: ['#00C8FF', '#6EE7FF', '#FFFFFF', '#99F6E4'],
                });
            } catch (e) {
                // no-op if script fails
            }
        },
    },
});
</script>

<style>
.bg-daily-completed {
    background: var(--btn-primary-santa) !important;
}
.badge {
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    flex: 0 0 44px;
    border-radius: 5px;
}
.badge.text-bg-primary {
    color: #7a7a7a !important;
}
.badge.text-bg-success {
    color: #f6ebff !important;
}
.daily-box::-webkit-scrollbar {
    display: flex !important;
}
@media (max-width: 992px) {
    .daily-box::-webkit-scrollbar {
        display: none !important;
    }
}
</style>

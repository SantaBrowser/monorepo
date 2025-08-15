<template>
    <b-card
        class="w-100 d-flex flex-column h-100 card-3d"
        header-class="p-0"
        body-class="d-flex flex-column p-0"
        :class="{ 'card-collapsed': isVisible, 'card-promoted': quest.isPromoted }"
    >
        <!-- <template #header>
            <b-card-title
                class="d-flex p-3 m-0 align-items-center"
                style="cursor: pointer; background-color: #0e0f19"
                @click="isVisible = !isVisible"
            >
                <div class="d-flex align-items-center justify-content-center" style="width: 25px">
                    <i class="me-2 text-primary" :class="iconMap[quest.variant]"></i>
                </div>
                <div
                    class="flex-grow-1 pe-2"
                    style="
                        overflow: hidden;
                        text-overflow: ellipsis;
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                    "
                >
                    {{ decodeHTML(quest.title) }}

/* Progress ring */
.quest-progress-ring {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
}
.quest-progress-ring .ring-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.14);
    stroke-width: 4;
}
.quest-progress-ring .ring-fg {
    fill: none;
    stroke: #00c8ff;
    stroke-opacity: 0.95;
    stroke-width: 4;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke-dasharray: 113.097; /* 2πr for r=18 */
    transition: stroke-dashoffset 300ms ease;
    filter: drop-shadow(0 0 6px rgba(0, 200, 255, 0.6));
}

/* One-time shimmer for points chip */
.quest-points-wrap.shimmer-once {
    position: relative;
    overflow: hidden;
}
.quest-points-wrap.shimmer-once::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    animation: shimmer-once 0.9s ease forwards;
}
@keyframes shimmer-once {
    to {
        transform: translateX(100%);
    }
}

/* Aptos chain badge */
.quest-chain-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 999px;
    color: #d7f9ff;
    background: linear-gradient(180deg, rgba(0, 167, 255, 0.18), rgba(0, 167, 255, 0.06));
    border: 1px solid rgba(0, 200, 255, 0.35);
    text-shadow: 0 0 6px rgba(0, 200, 255, 0.6);
    box-shadow: 0 0 14px rgba(0, 200, 255, 0.35), inset 0 0 12px rgba(0, 140, 255, 0.18);
    backdrop-filter: blur(6px);
}
.quest-chain-badge .label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.6px;
}
.quest-chain-badge .aptos-logo {
    height: 14px;
    width: auto;
    display: inline-block;
    filter: drop-shadow(0 0 4px rgba(255, 255, 255, 0.6));
}

/* Progress ring */
.quest-progress-ring {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
}
.quest-progress-ring .ring-bg {
    fill: none;
    stroke: rgba(255, 255, 255, 0.14);
    stroke-width: 4;
}
.quest-progress-ring .ring-fg {
    fill: none;
    stroke: #00c8ff;
    stroke-opacity: 0.95;
    stroke-width: 4;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    stroke-dasharray: 113.097; /* 2πr for r=18 */
    transition: stroke-dashoffset 300ms ease;
    filter: drop-shadow(0 0 6px rgba(0, 200, 255, 0.6));
}

/* One-time shimmer for points chip */
.quest-points-wrap.shimmer-once {
    position: relative;
    overflow: hidden;
}
.quest-points-wrap.shimmer-once::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
    animation: shimmer-once 0.9s ease forwards;
}
@keyframes shimmer-once {
    to { transform: translateX(100%); }
}

.quest-chain-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    border-radius: 999px;
    color: #d7f9ff;
    background: linear-gradient(180deg, rgba(0, 167, 255, 0.18), rgba(0, 167, 255, 0.06));
    border: 1px solid rgba(0, 200, 255, 0.35);
    text-shadow: 0 0 6px rgba(0, 200, 255, 0.6);
    box-shadow: 0 0 14px rgba(0, 200, 255, 0.35), inset 0 0 12px rgba(0, 140, 255, 0.18);
    backdrop-filter: blur(6px);
}
.quest-chain-badge .label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.6px;
}
.quest-chain-badge .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: radial-gradient(circle at 40% 40%, #86f2ff, #00c8ff 60%, #0076ff 100%);
    box-shadow: 0 0 8px rgba(0, 200, 255, 0.9), 0 0 16px rgba(0, 140, 255, 0.5);
}
                </div>
                <div v-if="quest.amount" class="text-primary fw-bold">{{ quest.amount }}</div>
            </b-card-title>
        </template> -->

        <b-collapse v-model="isVisible" class="h-100 d-flex flex-column position-relative z-1">
            <div class="quest-img-wrap">
                <!-- Skeleton for image -->
                <div v-if="loading" class="skeleton skeleton-img" />
                <img
                    v-else-if="quest.image"
                    class="w-100 quest-img"
                    :src="quest.image"
                    sizes="(min-width: 1200px) 280px, (min-width: 768px) 33vw, 90vw"
                    alt="header image"
                    loading="lazy"
                    style="border-radius: 4px"
                    height="173"
                />
                <!-- Status badge overlay -->
                <div v-if="statusBadgeText" class="quest-status-badge">{{ statusBadgeText }}</div>
                <!-- Chain badge overlay (Aptos) -->
                <div class="quest-chain-badge" aria-label="Aptos chain">
                    <span class="dot" aria-hidden="true"></span>
                    <span class="label">APTOS</span>
                </div>
                <!-- Progress ring (visible when quest.progress is provided) -->
                <svg
                    v-if="progressRatio !== null"
                    class="quest-progress-ring"
                    width="42"
                    height="42"
                    viewBox="0 0 42 42"
                    aria-label="Progress"
                    role="img"
                >
                    <circle class="ring-bg" cx="21" cy="21" r="18" />
                    <circle class="ring-fg" cx="21" cy="21" r="18" :style="{ strokeDashoffset: progressDashOffset }" />
                </svg>
            </div>

            <div class="d-flex flex-column flex-grow-1 quest-info-wrap">
                <!-- <b-alert v-model="hasExpiry" variant="primary" class="px-2 py-1 flex-grow-1 mb-2">
                    <i class="fas fa-clock me-1" />
                    Quest ends in <strong>{{ expiryDate }} </strong>!
                </b-alert>
                <b-alert v-model="isAlertMinFollowersShown" variant="primary" class="px-2 py-1">
                    <i class="fab fa-x-twitter me-1" />
                    A minimum of
                    <strong>{{
                        quest.contentMetadata.minFollowersCount === '1'
                            ? '1 follower'
                            : quest.contentMetadata.minFollowersCount + ' followers'
                    }}</strong>
                    is required.
                </b-alert>
                <b-alert v-model="isAlertDangerShown" variant="primary" class="p-2">
                    <i class="fas fa-exclamation-circle me-1"></i> {{ error }}
                </b-alert>
                <b-alert v-model="isAlertEntriesPendingReviewShown" variant="primary" class="p-2">
                    <i class="fas fa-info-circle me-1"></i> You have
                    <strong>{{ quest.entriesPendingReview.length }}</strong> entries pending a review.
                </b-alert> -->

                <!-- Skeleton or content -->
                <template v-if="loading">
                    <div class="skeleton skeleton-title mb-2" />
                    <div class="skeleton skeleton-points" />
                    <div class="skeleton skeleton-text mt-3" />
                    <div class="skeleton skeleton-text" />
                    <div class="skeleton skeleton-text w-50" />
                    <div class="quest-card-btns mt-3">
                        <div class="skeleton skeleton-button" />
                    </div>
                </template>
                <template v-else>
                    <!-- eslint-disable-next-line vue/no-v-html -- Using sanitizedTitle (DOMPurify allowlist) to preserve minimal formatting safely -->
                    <b-card-text
                        v-if="quest.title"
                        ref="titleEl"
                        class="quest-title-main"
                        :style="titleStyle"
                        v-html="sanitizedTitle"
                    />
                    <div ref="pointsEl" class="quest-points-wrap" :class="{ 'shimmer-once': shimmerOnce }">
                        {{ quest.pendingCount ? `${pendingCount} x ${formattedAmount}` : quest.amount
                        }}<span class="points-label">pts</span>
                    </div>
                    <div class="flex-grow-1">
                        <div class="quest-desc-wrap">{{ quest.description }}</div>
                        <slot></slot>
                    </div>

                    <div class="quest-card-btns">
                        <!-- Unified CTA styles applied via CSS -->
                        <b-button
                            v-if="!accountStore.isAuthenticated"
                            variant="primary"
                            block
                            class="w-100"
                            @click="authStore.isModalLoginShown = true"
                        >
                            <template v-if="quest.amount">
                                Earn <strong>{{ quest.amount }} Pts</strong>
                            </template>
                            <strong v-else> Complete! </strong>
                        </b-button>

                        <b-button
                            v-else-if="
                                (!quest.isAvailable && quest.variant !== QuestVariant.Daily) || quest.isCompleted
                            "
                            variant="primary"
                            block
                            class="w-100"
                            disabled
                        >
                            Quest Completed
                        </b-button>

                        <BaseButtonQuestLocked
                            v-else-if="quest.isLocked"
                            :id="quest._id"
                            :locks="quest.locks"
                            :amount="quest.amount"
                        />
                        <slot v-else name="button"></slot>
                        <!-- <b-dropdown
                            v-if="quest.infoLinks.length"
                            variant="primary"
                            size="sm"
                            no-caret
                            toggle-class="py-1 ms-2 "
                            style="float: right"
                            end
                        >
                            <template #button-content>
                                <i class="fas fa-ellipsis-v ml-0 text-muted"></i>
                            </template>
                            <b-dropdown-item
                                v-for="(link, key) of quest.infoLinks"
                                :key="key"
                                link-class="d-flex align-items-center justify-content-between"
                                @click="onClickLink(link.url)"
                            >
                                <div>
                                    {{ link.label }}
                                </div>
                                <i class="fas fa-caret-right text-opaque ms-3"></i>
                            </b-dropdown-item>
                        </b-dropdown> -->
                    </div>
                </template>
            </div>
            <!-- <div v-if="quest.variant !== QuestVariant.Daily" class="d-flex justify-content-center mb-1">
                <img :src="hrDivider" alt="hr divider" width="72" height="2" />
            </div> -->
        </b-collapse>
    </b-card>
    <BaseModalQuestEntry
        :id="id"
        :quest="quest"
        :loading="loading"
        :show="completing"
        :amount="quest.amount"
        :error="error"
        @hidden="$emit('modal-close')"
    />
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { format, formatDistance } from 'date-fns';
import { mapStores } from 'pinia';
import { useAccountStore } from '../../stores/Account';
import { useQuestStore } from '../../stores/Quest';
import { useAuthStore } from '../../stores/Auth';
import { decodeHTML } from '@thxnetwork/app/utils/decode-html';
import { QuestVariant } from '@thxnetwork/sdk/types/enums';
import hrDivider from '../../assets/hr-line.png';
import { CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';
import { sanitizeHtmlSync } from '../../utils/sanitize';
export default defineComponent({
    name: 'BaseCardQuest',
    props: {
        id: String,
        visible: Boolean,
        loading: Boolean,
        completing: Boolean,
        error: String,
        quest: { required: true, type: Object as PropType<TBaseQuest & any> },
    },
    data() {
        return {
            format,
            decodeHTML,
            isVisible: true,
            shimmerOnce: false,
            iconMap: {
                [QuestVariant.Daily]: 'fas fa-calendar',
                [QuestVariant.Invite]: 'fas fa-comments',
                [QuestVariant.Discord]: 'fab fa-discord',
                [QuestVariant.Twitter]: 'fab fa-x-twitter',
                [QuestVariant.YouTube]: 'fab fa-youtube',
                [QuestVariant.Custom]: 'fas fa-flag',
                [QuestVariant.Web3]: 'fab fa-ethereum',
                [QuestVariant.Gitcoin]: 'fas fa-fingerprint',
                [QuestVariant.Webhook]: 'fas fa-globe',
            } as { [variant: string]: string },
            hrDivider,
            QuestVariant,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore, useQuestStore),
        expiryDate() {
            if (!this.quest.expiryDate) return '';
            return formatDistance(new Date(this.quest.expiryDate), new Date(), {
                addSuffix: false,
            });
        },
        // Badge helpers
        isNewQuest(): boolean {
            const created = (this.quest as any)?.createdAt;
            if (!created) return false;
            const ageMs = Date.now() - new Date(created).getTime();
            const twoDaysMs = 48 * 60 * 60 * 1000;
            return ageMs < twoDaysMs;
        },
        statusBadgeText(): string | null {
            if (this.quest?.isCompleted) return 'Completed';
            if (this.quest?.isLocked) return 'Locked';
            if (this.expiryDate) return `Ends in ${this.expiryDate}`;
            if (this.isNewQuest) return 'New';
            return null;
        },
        // Progress ring helpers (expects quest.progress as 0..1 or 0..100)
        progressRatio(): number | null {
            const p = (this.quest as any)?.progress;
            if (p === undefined || p === null) return null;
            const v = Number(p);
            if (Number.isNaN(v)) return null;
            return v > 1 ? Math.max(0, Math.min(1, v / 100)) : Math.max(0, Math.min(1, v));
        },
        progressDashOffset(): string {
            const circumference = 2 * Math.PI * 18; // r=18
            const ratio = this.progressRatio ?? 0;
            return `${circumference * (1 - ratio)}`;
        },
        isAlertMinFollowersShown() {
            return this.quest.contentMetadata && !!Number(this.quest.contentMetadata.minFollowersCount);
        },
        hasExpiry() {
            return !!this.expiryDate;
        },
        isAlertDangerShown() {
            return !!this.error;
        },
        isAlertEntriesPendingReviewShown() {
            return this.quest.entriesPendingReview.length > 0;
        },
        titleStyle() {
            // const titleLength = this.quest.title.length;
            // if (titleLength <= 20) {
            //     return { width: '100%' };
            // } else if (titleLength <= 25) {
            //     return { width: '130px' };
            // } else if (titleLength <= 30) {
            //     return { width: '170px' };
            // } else {
            //     return { width: '100%' };
            // }
        },
        pendingCount() {
            // If there is a limit subtract the amount of entries from the amount of events
            if (this.quest.limit > 0) return this.quest.events.length - this.quest.entries.length;
            // Else return the amount of events
            const pending = this.quest.events.length - this.quest.entries.length;
            // In case it's less than 0 return 0
            return pending < 0 ? 0 : pending;
        },
        formattedAmount() {
            if (this.quest.poolId === CP_CAMPAIGN) {
                const amount = this.quest.amount / 100;
                return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
            }
            return `${this.quest.amount}`;
        },
        sanitizedTitle(): string {
            try {
                const raw: string = this.quest?.title ? decodeHTML(this.quest.title) || '' : '';
                return sanitizeHtmlSync(raw || '');
            } catch (e) {
                return this.quest?.title || '';
            }
        },
    },
    watch: {
        visible(value: boolean) {
            this.isVisible = value;
        },
    },
    mounted() {
        // Set initial visibility and trigger one-time shimmer on mount
        this.isVisible = this.accountStore.isAuthenticated ? true : false;
        this.$nextTick(() => {
            this.shimmerOnce = true;
            window.setTimeout(() => (this.shimmerOnce = false), 900);
        });
    },
    methods: {
        onClickLink(url: string) {
            window.open(url, '_blank');
        },
    },
});
</script>

<style lang="scss">
.card.card-3d,
.card-3d {
    position: relative;
    z-index: 0;
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 12px;
    background: var(--card-bg, rgba(14, 15, 25, 0.6));
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.42), 0 3px 8px rgba(0, 0, 0, 0.22), inset 0 1px 0 rgba(255, 255, 255, 0.03);
    /* Add filter drop-shadow to enhance contrast on dark backgrounds */
    filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.35));
    transition: transform 220ms ease, box-shadow 220ms ease, filter 220ms ease;
    will-change: transform, box-shadow;
    backdrop-filter: blur(6px);
    overflow: hidden;
}
.card.card-3d:hover,
.card-3d:hover {
    z-index: 3;
    transform: translateY(-6px) scale(1.01);
    box-shadow: 0 22px 46px rgba(0, 0, 0, 0.55), 0 10px 22px rgba(0, 0, 0, 0.34);
    filter: drop-shadow(0 12px 28px rgba(0, 0, 0, 0.5));
}
.card-3d:active {
    transform: translateY(-1px);
}
.card-3d:focus-within {
    outline: 2px solid rgba(13, 110, 253, 0.45);
    outline-offset: 0;
}
.card-3d.card-promoted {
    box-shadow: 0 22px 48px rgba(13, 110, 253, 0.28), 0 10px 22px rgba(0, 0, 0, 0.38);
}

/* Ensure visible elevation on touch devices without hover */
@media (hover: none) {
    .card.card-3d,
    .card-3d {
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.5), 0 8px 20px rgba(0, 0, 0, 0.3);
    }
}

.quest-status-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 2;
    background: var(--chip-bg, rgba(0, 0, 0, 0.6));
    color: var(--chip-text, #fff);
    border: 1px solid var(--chip-border, rgba(255, 255, 255, 0.2));
    box-shadow: var(--quest-chip-shadow, 0 2px 8px rgba(17, 24, 39, 0.06));
    padding: 2px 8px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    backdrop-filter: blur(4px);
}

/* Skeleton styles */
.skeleton {
    position: relative;
    overflow: hidden;
    background: #1e1f2a;
    border-radius: 8px;
}
.skeleton::after {
    content: '';
    position: absolute;
    inset: 0;
    transform: translateX(-100%);
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
    animation: shimmer 1.2s infinite;
}
@keyframes shimmer {
    100% {
        transform: translateX(100%);
    }
}
.skeleton-img {
    height: 173px;
    border-radius: 4px;
}
.skeleton-title {
    height: 20px;
    width: 70%;
}
.skeleton-points {
    height: 22px;
    width: 110px;
    margin-top: -12px;
    margin-left: auto;
}
.skeleton-text {
    height: 12px;
    width: 100%;
    margin-bottom: 8px;
}
.skeleton-button {
    height: 36px;
    width: 100%;
    border-radius: 6px;
}

.quest-card-btns .btn {
    bottom: 0;
    border-radius: var(--radius-6, 6px);
    background: var(--btn-primary-bg, var(--primary));
    color: var(--btn-primary-text, #fff);
    padding: var(--space-2, 8px) 0;
    box-shadow: var(--btn-primary-shadow, var(--card-shadow));
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
}
.quest-card-btns .btn:focus-visible {
    outline: 2px solid var(--focus-ring-color, rgba(37, 99, 235, 0.35));
    outline-offset: 2px;
}
.quest-card-btns .btn:hover {
    transform: translateY(-1px);
    box-shadow: var(--btn-primary-shadow-hover, var(--card-shadow-hover));
    filter: brightness(1.03);
}
.quest-title-main {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--text, #0f172a);
    text-align: left;
    line-height: calc(var(--font-lg, 16px) * var(--lh-tight, 1.2));
    font-size: var(--font-lg, 16px);
    opacity: 1;
    font-style: normal;
    font-weight: 600;
    margin-bottom: var(--space-2, 8px);
}
.quest-info-wrap {
    position: relative;
    margin-top: -28px;
    background: var(--quest-info-wrap-bg, rgba(18, 19, 28, 0.72));
    backdrop-filter: blur(4px);
    justify-content: space-between;
    border-radius: var(--radius-12, 12px);
    z-index: 2;
    padding: var(--space-5, 20px) var(--space-4, 16px) var(--space-4, 16px) var(--space-4, 16px);
    filter: var(--quest-info-wrap-shadow);
}

/* Light theme adjustments */
@media (prefers-color-scheme: light) {
}

.quest-img-wrap::before {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    height: 70px;
    background: rgba(0, 0, 0, 0.8);
    filter: blur(15px);
    z-index: 0; /* Lowered z-index to ensure overlay is behind info wrap */
    pointer-events: none;
}

/* Light theme: header overlay gradient to improve readability over artwork */
:root[data-theme='light'] .quest-img-wrap::after,
[data-bs-theme='light'] .quest-img-wrap::after,
body.light .quest-img-wrap::after,
html.light .quest-img-wrap::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: linear-gradient(180deg, rgba(2, 6, 23, 0.24) 0%, rgba(2, 6, 23, 0.12) 32%, transparent 60%);
    z-index: 1;
    pointer-events: none;
}

.quest-points-wrap {
    position: absolute;
    right: 10px;
    top: -15px;
    border-radius: var(--radius-8, 8px);
    padding: 2.5px var(--space-4, 16px) 4.5px var(--space-4, 16px);
    background: var(--quest-points-wrap-bg, var(--chip-bg));
    box-shadow: var(--quest-points-wrap-shadow, var(--quest-chip-shadow));
    color: var(--quest-points-wrap-color, var(--chip-text));
    font-size: var(--font-base, 14px);
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    letter-spacing: 0.91px;
    span {
        color: var(--quest-points-wrap-span-color, var(--text-muted));
        font-size: var(--font-xs, 11px);
        font-style: normal;
        font-weight: 500;
        line-height: 24px;
        letter-spacing: 0.77px;
        padding-left: 1px;
    }
}
.quest-desc-wrap {
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--text-muted, #475569);
    font-size: var(--font-sm, 12px);
    font-style: normal;
    font-weight: 400;
    line-height: calc(var(--font-sm, 12px) * var(--lh-normal, 1.45));
    margin-bottom: var(--space-3, 12px);
}
</style>

<template>
    <b-card no-body class="gr-2 x-lg-0 card-wrapper h-100" :class="{ 'card-promoted': reward.isPromoted }">
        <!-- <header v-if="image" class="card-img" :style="{ backgroundImage: image && `url(${image})`, height: '240px' }">
            <b-badge
                v-if="reward.expiry && reward.expiry.date"
                v-b-tooltip.hover.left
                :title="format(new Date(reward.expiry.date), 'MMMM do yyyy hh:mm:ss')"
                variant="primary"
                class="badge-expiry p-1 bg-primary"
            >
                <i v-if="!reward.isExpired" class="fas fa-clock card-text"></i>
                <span :class="{ 'text-accent': !reward.isExpired, 'card-text': reward.isExpired }">{{
                    expiryDate
                }}</span>
            </b-badge>
            <b-img v-if="!image" class="card-img-logo" :src="accountStore.config.logoUrl" widht="auto" height="100" />
        </header> -->
        <b-card-body
            v-if="reward.poolId === SANTA_CAMPAIGN"
            class="d-flex flex-column justify-content-between h-100"
            :style="{ padding: '10px' }"
        >
            <b-card-title class="d-flex align-items-center c-quest-title">
                <i class="me-2 text-opaque small" :class="iconMap[reward.variant]" />
                <slot name="title" />
            </b-card-title>
            <div class="d-flex justify-content-center" :style="{ marginBottom: '5px' }">
                <img v-if="!image" :src="randomPlaceholderImage" class="" :style="{ width: '72px', height: '72px' }" />
                <img v-else :src="image" alt="Image" height="92" width="92" style="object-fit: contain" />
            </div>
            <!-- <b-card-text class="card-description" v-html="reward.description" /> -->
            <div>
                <!-- <div class="d-flex">
                    <div v-if="reward.pointPrice" class="d-flex align-items-center me-auto pb-3">
                        <span class="card-text me-1"> Price: </span>
                        <span variant="primary" class="ms-1 p-1">
                            <span class="">
                                {{ '$' + (reward.pointPrice / 100).toFixed(2) }}
                            </span>
                        </span>
                    </div>
                    <div v-if="reward.limitSupplyProgress.max" class="d-flex align-items-center pb-3">
                        <span class="card-text me-1"> Supply: </span>
                        <b-badge variant="primary" class="ms-1 p-1 px-2 bg-primary">
                            <span :class="limitSupplyVariant">
                                {{ reward.limitSupplyProgress.max - reward.limitSupplyProgress.count }}
                            </span>
                            <span class="card-text">/{{ reward.limitSupplyProgress.max }}</span>
                        </b-badge>
                    </div>
                </div> -->
                <button
                    v-if="!accountStore.isAuthenticated"
                    class="w-100 my-btn s"
                    variant="primary"
                    @click="authStore.isModalLoginShown = !authStore.isModalLoginShown"
                >
                    <template v-if="reward.pointPrice">
                        Pay
                        <strong>{{ formattedPrice }} <span v-if="reward.poolId !== CP_CAMPAIGN">points</span></strong>
                    </template>
                    <strong v-else> Free! </strong>
                </button>
                <span v-else id="disabled-wrapper" class="d-block" tabindex="0">
                    <!-- <BaseButtonQuestLocked
                        v-if="reward.isLocked"
                        :id="`modalQuestLock${reward._id}`"
                        :locks="reward.locks"
                    /> -->
                    <button
                        v-b-modal="`modalRewardPayment${reward._id}`"
                        variant="primary"
                        block
                        :class="`w-100 position-relative mb-0 bg-red ${isInsufficientPoints ? 'locked' : 'my-btn'}`"
                        :disabled="isDisabled"
                    >
                        <div v-if="isInsufficientPoints">Locked</div>
                        <div
                            v-if="reward.pointPrice && !isInsufficientPoints"
                            class="d-flex align-items-center justify-content-center"
                        >
                            <!-- <span class="reward-text">
                                {{ reward.poolId === CP_CAMPAIGN ? 'Claim' : 'Get Reward' }}
                            </span> -->
                            <!-- <div class="pipe"></div> -->
                            <span class="point me-1">{{ formattedPrice }}</span>
                            <img
                                v-if="reward.poolId === SANTA_CAMPAIGN"
                                :src="StarCoin"
                                alt="star"
                                height="13"
                                class="me-1"
                            />
                            <span v-if="reward.poolId === SANTA_CAMPAIGN" class="coins-text">Coins</span>
                        </div>
                        <b-progress
                            v-if="reward.limitProgress.max"
                            v-b-tooltip.bottom
                            :variant="limitVariant"
                            :title="`You can purchase this reward ${reward.limitProgress.max} times.`"
                            :value="reward.limitProgress.count"
                            :max="reward.limitProgress.max"
                            style="height: 6px"
                        />
                    </button>
                </span>
                <!--            <div class="d-flex align-items-center justify-content-between pb-2 mt-2" style="opacity: 0.5">-->
                <!--                <div class="d-flex align-items-center text-opaque small">-->
                <!--                    <span v-if="reward.author" class="text-white me-1"> {{ reward.author.username }} &CenterDot; </span>-->
                <!--                    <span v-if="reward.createdAt">{{ format(new Date(reward.createdAt), 'MMMM do') }} </span>-->
                <!--                </div>-->
                <!--                <div v-if="reward.paymentCount" class="d-flex align-items-center text-opaque small">-->
                <!--                    <i class="fas fa-users me-1" />-->
                <!--                    {{ reward.paymentCount }}-->
                <!--                </div>-->
                <!--            </div>-->
            </div>
        </b-card-body>

        <b-card-body
            v-if="reward.poolId === CP_CAMPAIGN"
            class="d-flex flex-column justify-content-between cp-campaign-card"
            :style="{ padding: '0', height: 'auto' }"
        >
            <div class="d-flex justify-content-center" style="padding: 3px">
                <img
                    v-if="!image"
                    :src="randomPlaywallPlaceholderImage"
                    class=""
                    :style="{ width: '100%', height: '120px', borderRadius: '4px', objectFit: 'cover' }"
                />
                <img
                    v-else
                    :src="image"
                    alt="Image"
                    :style="{ width: '100%', height: '120px', borderRadius: '4px', objectFit: 'cover' }"
                />
            </div>
            <b-card-title class="d-flex align-items-center c-quest-title">
                <!-- <i class="me-2 text-opaque small" :class="iconMap[reward.variant]" /> -->
                <slot name="title" />
            </b-card-title>
            <div>
                <button
                    v-if="!accountStore.isAuthenticated"
                    class="w-100 my-btn"
                    variant="primary"
                    @click="authStore.isModalLoginShown = !authStore.isModalLoginShown"
                >
                    <template v-if="reward.pointPrice">
                        Pay <strong>{{ reward.pointPrice }} points</strong>
                    </template>
                    <strong v-else> Free! </strong>
                </button>
                <span
                    v-else
                    id="disabled-wrapper"
                    class="d-block"
                    tabindex="0"
                    :style="{ margin: '0px 26px 10px 26px' }"
                >
                    <!-- <BaseButtonQuestLocked
                        v-if="reward.isLocked || isInsufficientPoints"
                        :id="`modalQuestLock${reward._id}`"
                        :locks="reward.locks"
                    /> -->
                    <button
                        v-b-modal="`modalRewardPayment${reward._id}`"
                        variant="primary"
                        block
                        :class="`w-100 position-relative mb-0 bg-red ${isInsufficientPoints ? 'locked' : 'my-btn'}`"
                        :disabled="isDisabled"
                    >
                        <div v-if="isInsufficientPoints">Locked</div>
                        <div
                            v-if="reward.pointPrice && !isInsufficientPoints"
                            class="d-flex align-items-center justify-content-center"
                        >
                            <!-- <span class="reward-text">
                                {{ reward.poolId === CP_CAMPAIGN ? 'Claim' : 'Get Reward' }}
                            </span>
                            <div class="pipe"></div> -->
                            <span class="point me-1">{{ formattedPrice }}</span>
                            <img
                                v-if="reward.poolId === SANTA_CAMPAIGN"
                                :src="StarCoin"
                                alt="star"
                                height="13"
                                class="me-1"
                            />
                            <span v-if="reward.poolId === SANTA_CAMPAIGN" class="coins-text">Coins</span>
                        </div>
                        <b-progress
                            v-if="reward.limitProgress.max"
                            v-b-tooltip.bottom
                            :variant="limitVariant"
                            :title="`You can purchase this reward ${reward.limitProgress.max} times.`"
                            :value="reward.limitProgress.count"
                            :max="reward.limitProgress.max"
                            style="height: 6px"
                        />
                    </button>
                </span>
            </div>
        </b-card-body>
    </b-card>
    <BaseModalRewardPayment :id="`modalRewardPayment${reward._id}`" :reward="reward" />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { format, formatDistance } from 'date-fns';
import { useAccountStore } from '../../stores/Account';
import { mapStores } from 'pinia';
import { RewardVariant } from '../../types/enums/rewards';
import { useAuthStore } from '@thxnetwork/app/stores/Auth';
import StarCoin from '../../assets/star-coin.png';
import { SANTA_CAMPAIGN, CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';
import { getApprovalBasedPaymasterInput } from 'viem/zksync';
import { is } from 'date-fns/locale';
export const iconMap = {
    [RewardVariant.Coin]: 'fas fa-coins',
    [RewardVariant.NFT]: 'fas fa-palette',
    [RewardVariant.Coupon]: 'fas fa-tags',
    [RewardVariant.Custom]: 'fas fa-gift',
    [RewardVariant.DiscordRole]: 'fab fa-discord',
} as { [variant: string]: string };

export default defineComponent({
    name: 'BaseCardReward',
    props: {
        image: String,
        reward: {
            type: Object as PropType<TReward & { isExpired: boolean; isStocked: boolean }>,
            required: true,
        },
    },
    data() {
        return {
            format,
            iconMap: {
                [RewardVariant.Coin]: 'fas fa-coins',
                [RewardVariant.NFT]: 'fas fa-palette',
                [RewardVariant.Coupon]: 'fas fa-tags',
                [RewardVariant.Custom]: 'fas fa-gift',
                [RewardVariant.DiscordRole]: 'fab fa-discord',
            } as { [variant: string]: string },
            StarCoin,
            SANTA_CAMPAIGN,
            CP_CAMPAIGN,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore),
        randomPlaceholderImage(): string {
            const images = ['src/assets/logo-coin-1.png', 'src/assets/logo-coin-2.png', 'src/assets/logo-coin-3.png'];
            return images[Math.floor(Math.random() * images.length)];
        },
        randomPlaywallPlaceholderImage(): string {
            const images = ['src/assets/playwall_1.png', 'src/assets/playwall_1.png', 'src/assets/playwall_3.png'];
            return images[Math.floor(Math.random() * images.length)];
        },
        participantBalance() {
            const participant = this.accountStore.participants.find((p) => p.sub === this.accountStore.account?.sub);
            if (!participant) return 0;
            return participant.balance;
        },
        isInsufficientPoints() {
            return this.participantBalance < this.reward.pointPrice;
        },
        limitSupplyVariant() {
            if (this.limitSupplyPerct >= 0.9) return 'text-danger';
            if (this.limitSupplyPerct > 0.75 && this.limitSupplyPerct < 0.9) return 'text-warning';
            if (this.limitSupplyPerct >= 0 && this.limitSupplyPerct <= 0.75) return 'text-success';
        },
        limitVariant() {
            if (this.limitPerct >= 0.75) return 'danger';
            if (this.limitPerct > 0.5 && this.limitPerct < 0.75) return 'warning';
            if (this.limitPerct >= 0 && this.limitPerct <= 0.5) return 'success';
        },
        btnLabel() {
            if (this.reward.isLimitSupplyReached) {
                return 'Sold out';
            } else if (this.reward.isLimitReached) {
                return 'Limit reached';
            } else if (this.reward.isExpired) {
                return 'Expired';
            } else if (this.reward.isDisabled) {
                return 'Not available';
            } else if (this.reward.pointPrice) {
                // return `${this.reward.pointPrice} point${
                //     this.reward.pointPrice && this.reward.pointPrice > 1 ? 's' : ''
                // }`;
                return '';
            } else {
                return 'Free!';
            }
        },
        isDisabled() {
            return !this.reward.isAvailable;
        },
        limitSupplyPerct: function () {
            if (!this.reward.limitSupplyProgress.max) return 1;
            return this.reward.limitSupplyProgress.count / this.reward.limitSupplyProgress.max;
        },
        limitPerct: function () {
            if (!this.reward.limitProgress.max) return 1;
            return this.reward.limitProgress.count / this.reward.limitProgress.max;
        },
        expiryDate: function () {
            return !this.reward.isExpired && this.reward.expiry
                ? formatDistance(new Date(this.reward.expiry.date), new Date(this.reward.expiry.now), {
                      addSuffix: false,
                  })
                : 'expired';
        },
        formattedPrice() {
            if (this.reward.poolId === CP_CAMPAIGN) {
                const price = this.reward.pointPrice / 100;
                return Number.isInteger(price) ? `${price} $` : `${price.toFixed(2)} $`;
            } else {
                return this.reward.pointPrice;
            }
        },
    },
});
</script>
<style lang="scss">
.card-img-overlay {
    bottom: auto !important;
}
.card-img {
    width: 100%;
    background: radial-gradient(transparent, var(--bs-primary));
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top-left-radius: var(--bs-border-radius) !important;
    border-top-right-radius: var(--bs-border-radius) !important;

    .badge-expiry {
        position: absolute;
        top: 1rem;
        left: 1rem;
    }
}
.card-description {
    white-space: pre-line;
    display: block;
}
.btn {
    position: relative;

    .progress {
        bottom: 0;
        border-radius: 0;
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
        position: absolute;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.25);
    }
}

.my-btn,
.locked {
    height: 32px;
    position: relative;
    border-radius: 15px;
    border: 1px solid rgba(78, 78, 78, 0.2);
    //background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
    padding: 5px 0;
    transition: background 0.3s ease;
    z-index: 0;
}
.my-btn::before {
    content: '';
    position: absolute;
    border-radius: 15px;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #b14646 0%, #722121 100%);
    opacity: 0;
    transition: opacity 0.6s ease;
    z-index: -1;
}
.h-200 {
    height: 200px;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
}
.pipe {
    border-left: 1px solid rgba(255, 255, 255, 0.1);
    height: 20px;
    margin: 0 8px;
}
.reward-text {
    color: #bababa;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    white-space: nowrap;
}
.point {
    color: #f5f5f5;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
}
.coins-text {
    color: rgba(200, 200, 200, 0.5);
    text-align: right;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 1rem;
}
.placeholder {
    background-color: #ccc;
    width: 75px;
    height: 75px;
    border-radius: 50%;
}
.card-wrapper {
    background: transparent !important;
}
.card-wrapper:hover .my-btn::before {
    opacity: 1;
}

.card-wrapper:hover .my-btn:not(.locked) {
    box-shadow: 0px 7px 12px 0px rgba(173, 40, 40, 0.14);
    border-color: #722121;
}

.card-wrapper:hover .reward-text {
    color: #fff;
    transition: color 0.6s ease;
}

.card-wrapper:hover .coins-text {
    color: #c8c8c8;
    transition: color 0.6s ease;
}
.card-wrapper .card-body {
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);

    background: transparent !important;

    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
    backdrop-filter: blur(12.5px);
}

.c-quest-title div {
    margin-left: 10px;
    background: linear-gradient(90deg, #f5f5f5 0%, #8f8f8f 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    //font-size: 14px !important;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    // height: 60px;
    white-space: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
}
.c-quest-title .fas {
    color: rgba(217, 217, 217, 0.2);
}

.locked {
    background: #4444444f;
    color: #ff6b6b;
}

.gr-2 {
    width: 100% !important;
    display: inline-block !important;
}

.bg-red {
    background-color: #972e2e !important;
}

.gr-2 .card-body.cp-campaign-card {
    height: auto;
    max-height: initial !important;
}
</style>

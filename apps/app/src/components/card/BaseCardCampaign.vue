<template>
    <b-col md="12">
        <b-card
            no-body
            class="cursor-pointer gradient-shadow card-campaign"
            :style="{ opacity: isLoading ? 0.5 : 1 }"
            @click="goTo(`/c/${campaign.slug}`)"
        >
            <b-spinner
                v-if="isLoading"
                small
                variant="light"
                class="position-absolute"
                style="top: 50%; left: 50%; margin-left: -8px; margin-top: -8px"
            />
            <b-row>
                <b-col md="2">
                    <div
                        class="d-flex bg-dark rounded justify-content-center align-items-center"
                        :style="{
                            height: '90px',
                            width: '100%',
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center center',
                        }"
                    >
                        <BImg
                            lazy
                            :src="logoImage"
                            class="m-3 rounded"
                            style="width: auto; height: auto; max-width: 150px; max-height: 60px"
                        />
                    </div>
                </b-col>
                <b-col md="10">
                    <b-row>
                        <div class="p-2 pt-1 p-md-0">
                            <div class="d-flex w-100 mb-2">
                                <div class="d-flex align-items-center">
                                    <div class="text-white text-decoration-none lead">{{ campaign.title }}</div>
                                    <b-button size="sm" variant="link" class="px-0 ms-1" @click.stop="onClickSubscribe">
                                        <i
                                            class="fa-star text-opaque text-white"
                                            :class="{ fas: isSubscribed, far: !isSubscribed }"
                                        />
                                    </b-button>
                                </div>
                                <div class="ms-auto p-2 text-opaque me-md-3">
                                    {{ balance }}
                                </div>
                            </div>

                            <div class="d-flex w-100 align-items-center">
                                <!--                            <b-button-->
                                <!--                                size="sm"-->
                                <!--                                variant="primary"-->
                                <!--                                class="me-2"-->
                                <!--                                @click.stop="goTo(`/c/${campaign.slug}/quests`)"-->
                                <!--                            >-->
                                <!--                                <i class="fas fa-tasks text-opaque me-2" />-->
                                <!--                                <span>{{ campaign.questCount }}</span>-->
                                <!--                            </b-button>-->
                                <!--                            <b-button-->
                                <!--                                size="sm"-->
                                <!--                                variant="primary"-->
                                <!--                                class="me-2"-->
                                <!--                                @click.stop="goTo(`/c/${campaign.slug}/rewards`)"-->
                                <!--                            >-->
                                <!--                                <i class="fas fa-gift text-opaque me-2" />-->
                                <!--                                <span>{{ campaign.rewardCount }}</span>-->
                                <!--                            </b-button>-->
                                <!--                            <b-button-->
                                <!--                                size="sm"-->
                                <!--                                variant="primary"-->
                                <!--                                class="me-2"-->
                                <!--                                @click.stop="goTo(`/c/${campaign.slug}/ranking`)"-->
                                <!--                            >-->
                                <!--                                <i class="fas fa-users text-opaque me-2" />-->
                                <!--                                <span>{{ campaign.participantCount }}</span>-->
                                <!--                            </b-button>-->
                                <!--                            <b-button-->
                                <!--                                v-if="campaignDomain"-->
                                <!--                                size="sm"-->
                                <!--                                variant="primary"-->
                                <!--                                class="ms-auto me-md-3"-->
                                <!--                                @click.stop="isModalExternalURLShown = true"-->
                                <!--                            >-->
                                <!--                                <i class="fas fa-external-link-alt text-opaque me-1" />-->
                                <!--                                {{ campaignDomain }}-->
                                <!--                            </b-button>-->
                                <!--                            <BaseModalExternalURL-->
                                <!--                                :show="isModalExternalURLShown"-->
                                <!--                                :url="campaign.domain"-->
                                <!--                                @hidden="isModalExternalURLShown = false"-->
                                <!--                            />-->
                            </div>
                        </div>
                    </b-row>
                    <b-row>
                        <rewards></rewards>
                    </b-row>
                </b-col>
            </b-row>
        </b-card>
    </b-col>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { decodeHTML } from '../../utils/decode-html';
import { mapStores } from 'pinia';
import { useAccountStore } from '@thxnetwork/app/stores/Account';
import { useRewardStore } from '../../stores/Reward';
import Rewards from '@thxnetwork/app/views/campaign/Rewards.vue';

type TCampaignProps = {
    id: string;
    title: string;
    rank: number;
    slug: string;
    domain: string;
    questCount: number;
    rewardCount: number;
    participantCount: number;
    logoImgUrl: string;
    backgroundImgUrl: string;
    createdAt: Date;
};

export default defineComponent({
    name: 'BaseCardCampaign',
    components: { Rewards },
    props: {
        campaign: {
            type: Object as PropType<TCampaignProps>,
            required: true,
        },
        // rewardList: {
        //     type: Object,
        // },
    },
    data() {
        return {
            decodeHTML,
            isLoading: false,
            isModalExternalURLShown: false,
            rewardList: {},
        };
    },
    computed: {
        ...mapStores(useAccountStore, useRewardStore),
        participant() {
            return this.accountStore.participants.find(
                (p) => p.sub === this.accountStore.account?.sub && p.poolId === this.campaign.slug,
            );
        },
        balance() {
            if (!this.participant) return 0;
            return Number(this.participant.balance);
        },
        backgroundImage() {
            return this.campaign.backgroundImgUrl;
        },
        logoImage() {
            return this.campaign.logoImgUrl;
        },
        campaignDomain() {
            return this.campaign.domain && new URL(this.campaign.domain).hostname;
        },
        isSubscribed() {
            return this.accountStore.isAuthenticated && this.accountStore.isSubscribed(this.campaign.id);
        },

        // rewardsList() {
        //     return this.rewardStore.list(this.campaign.slug);
        // },
    },
    mounted() {
        this.rewardList = this.rewardStore.list(this.campaign.slug);
    },
    // watch: {
    //     'accountStore.account': {
    //         handler(account: TAccount | null) {
    //             if (!account) return;
    //             this.accountStore.getParticipants();
    //         },
    //         immediate: true,
    //     },
    // },
    methods: {
        goTo(path: string) {
            this.isLoading = true;
            this.$router.push(path);
        },
        onClickSubscribe() {
            debugger;
        },
    },
});
</script>

<style lang="scss">
.card-campaign {
    min-height: 200px;
    &:before {
        transition: opacity 0.2s;
        opacity: 0;
    }
    &:hover:before {
        opacity: 0.15;
    }
}
</style>

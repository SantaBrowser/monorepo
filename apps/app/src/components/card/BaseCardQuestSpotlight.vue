<template>
    <div
        v-if="quest"
        header-class="p-0"
        body-class="justify-content-start"
        class="w-100 my-card d-flex flex-column justify-content-between align-items-center"
    >
        <div class="w-100">
            <div
                class="d-flex bg-dark rounded"
                :class="{
                    'justify-content-end align-items-end': !!backgroundImage,
                    'justify-content-center align-items-center': !backgroundImage,
                }"
                :style="{
                    width: '100%',
                    height: '140px',
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center center',
                }"
            >
                <b-img
                    lazy
                    :src="logoImage"
                    class="m-3 rounded"
                    style="width: auto; height: auto; max-width: 150px; max-height: 50px"
                />
            </div>

            <div class="d-flex justify-content-end mt-1">
                <div class="flex-shrink-0">
                    <b-badge
                        v-b-tooltip
                        variant="primary"
                        class="p-2"
                        :title="`Created: ${quest.createdAt && format(new Date(quest.createdAt), 'dd-MM-yyyy HH:mm')}`"
                    >
                        <i class="fas fa-clock text-opaque me-0" />
                    </b-badge>
                    <b-badge v-b-tooltip variant="primary" class="p-2 ms-1" title="Twitter Quest">
                        <i class="fab fa-twitter text-opaque me-0" />
                    </b-badge>
                    <b-badge v-b-tooltip variant="primary" class="p-2 ms-1" :title="`Visit ${quest.domain}`">
                        <b-link class="text-white" @click.stop="isModalCampaignDomainShown = true">
                            <i class="fas fa-external-link-alt text-opaque me-0" />
                        </b-link>
                    </b-badge>
                </div>
            </div>
            <!-- <p class="pt-2 mb-0 d-block" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">
            {{ quest.description }}
        </p> -->
            <strong class="quest-title mt-1">{{ quest.title }} </strong>
        </div>
        <div class="w-100 d-flex justify-content-center align-items-center">
            <b-button
                class="w-100 my-earn-btn d-flex align-items-center justify-content-center"
                :to="`/c/${quest.poolId}`"
                variant="primary"
            >
                <p>Earn</p>
                <div class="earn-pipe"></div>
                <strong>{{ formattedAmount }} </strong> <span v-if="quest.poolId !== CP_CAMPAIGN">points!</span>
            </b-button>
            <BaseModalExternalURL
                :show="isModalCampaignDomainShown"
                :url="quest ? quest.domain : ''"
                @hidden="isModalCampaignDomainShown = false"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { format } from 'date-fns';
import { CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';
export default defineComponent({
    name: 'BaseCardQuestSpotlight',
    props: {
        quest: {
            type: Object as PropType<TBaseQuest & { domain: string; amount: number; brand: any }>,
            required: true,
        },
    },
    data() {
        return { format, isModalCampaignDomainShown: false, CP_CAMPAIGN };
    },
    computed: {
        backgroundImage() {
            return (
                (this.quest && this.quest.image) ||
                (this.quest && this.quest.brand && this.quest.brand.backgroundImgUrl) ||
                'src/assets/santa.png'
            );
        },
        logoImage() {
            return this.quest && this.quest.brand && this.quest.brand.logoImgUrl;
        },
        formattedAmount() {
            if (this.quest.poolId === CP_CAMPAIGN) {
                const amount = this.quest.amount / 100;
                return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
            }
            return `${this.quest.amount}`;
        },
    },
});
</script>
<style>
.my-card {
    border-radius: 8px;
    border: 1.5px solid rgba(255, 255, 255, 0.15);
    background: linear-gradient(155deg, rgba(255, 255, 255, 0) -2.13%, rgba(0, 0, 0, 0.15) 136.58%) !important;
    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
    backdrop-filter: blur(12.5px);
    width: 220px !important;
    height: 280px !important;
    padding: 10px;
}
.card-quest-header {
    background-size: cover;
    background-repeat: no-repeat;
}
.desc-cont {
    background: transparent;
}
.quest-title {
    color: #eee;
    font-size: 1rem;
    font-weight: 500;
    line-height: 22px;
    text-align: center;
    margin-top: 0.5rem;
}

.my-earn-btn {
    position: relative;
    height: 32px;
    padding: 6px 12px;
    border-radius: 15px;
    border: 1px solid rgba(78, 78, 78, 0.2);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%);
    box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.05), 0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px 0px rgba(0, 0, 0, 0);
    overflow: hidden;
}

.my-earn-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #b14646 0%, #722121 100%);

    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
}

.my-earn-btn:hover::before {
    opacity: 1;
}

.my-earn-btn:hover {
    box-shadow: 0px 7px 12px 0px rgba(173, 40, 40, 0.14);
}
.my-earn-btn * {
    position: relative;
    z-index: 1;
}
.earn-pipe {
    width: 1px;
    height: 20px;
    background: rgba(255, 255, 255, 0.1);
    margin: 0 10px;
}

.my-earn-btn strong {
    margin-right: 6px;
}

.my-earn-btn span {
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 0px;
    text-transform: capitalize;
}

.my-earn-btn p {
    padding: 0;
    margin: 0;
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 0px;
}

.my-card .badge {
    background-color: #2d2d2d !important;
}
</style>

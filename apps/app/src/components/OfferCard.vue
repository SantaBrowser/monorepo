<template>
    <b-card
        class="mb-1 w-100"
        header-class="p-0"
        body-class="d-flex flex-column p-0"
        :class="{ 'card-collapsed': isVisible, 'card-promoted': offer.isPromoted }"
        style="background: transparent"
    >
        <template #header>
            <b-card-title
                class="d-flex p-3 m-0 align-items-center"
                style="cursor: pointer; background-color: #0e0f19"
                @click="isVisible = !isVisible"
            >
                <div class="d-flex align-items-center justify-content-center" style="width: 25px">
                    <i class="me-2 text-primary fas fa-gift"></i>
                </div>
                <div class="flex-grow-1 pe-2">{{ decodeHTML(offer.title) }}</div>
                <div v-if="offer.payout" class="text-primary fw-bold" style="white-space: nowrap">
                    {{ offer.payout }} {{ offer.currency }}
                </div>
            </b-card-title>
        </template>

        <b-collapse
            v-model="isVisible"
            style="
                background: linear-gradient(
                    155deg,
                    rgba(255, 255, 255, 0.02) -2.13%,
                    rgba(42, 42, 42, 0.11) 136.58%
                ) !important;
            "
        >
            <div class="d-flex justify-content-center w-100" style="height: 200px">
                <img v-if="offer.imageUrl" class="img-fluid" :src="offer.imageUrl" alt="header image" />
            </div>

            <div class="px-3 mt-3">
                <div class="d-flex align-items-start justify-content-between">
                    <b-card-text
                        v-if="offer.description"
                        class="flex-grow-1 mb-3"
                        style="white-space: pre-line"
                        v-html="decodeHTML(offer.description)"
                    />
                </div>

                <b-button variant="primary" block class="w-100" :href="offer.santaClickUrl" target="_blank">
                    Claim <strong>${{ offer.payout }}</strong>
                </b-button>

                <!-- <div class="d-flex align-items-center justify-content-between mt-2 pb-2" style="opacity: 0.5">
                    <div class="d-flex align-items-center text-opaque small">
                        <span v-if="offer.provider" class="text-white me-1"> {{ offer.provider }} &CenterDot; </span>
                        <span>{{ offer.epc }} </span>
                    </div>
                </div> -->
            </div>
        </b-collapse>
    </b-card>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { decodeHTML } from '@thxnetwork/app/utils/decode-html';

export default defineComponent({
    name: 'OfferCard',
    props: {
        offer: { required: true, type: Object as PropType<any> },
    },
    data() {
        return {
            decodeHTML,
            isVisible: false,
            iconMap: {
                Lootably: 'fas fa-gift',
                Adgate: 'fas fa-tags',
                // Add more mappings as needed
            } as { [provider: string]: string },
        };
    },
    mounted() {
        this.isVisible = window.innerWidth > 768;
    },
});
</script>

<style scoped>
/* Add any necessary styles here */
</style>

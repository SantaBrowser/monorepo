<template>
    <div class="brand-container">
        <b-row class="d-flex flex-nowrap justify-content-start gap-3">
            <b-col
                v-for="(brand, index) in brands"
                :key="index"
                class="p-2 text-center d-flex brand-card gap-3 align-items-center"
            >
                <img :src="brand.logo" alt="Brand Logo" class="brand-logo" />
                <div class="w-100 d-flex flex-column align-items-start">
                    <p class="brand-name">{{ brand.name }}</p>
                    <p class="brand-percentage">{{ brand.cashback_amount }}%</p>
                </div>
            </b-col>
        </b-row>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'TopBrands',
    props: {
        brands: {
            type: Array<any>,
            required: true,
        },
    },
});
</script>

<style scoped>
.brand-container {
    width: 100%;
    overflow-x: auto;
    white-space: nowrap;
    padding: 0 15px;
}

.brand-card {
    border-radius: 7px;
    border: 1px solid rgba(215, 215, 215, 0.2);
    background: linear-gradient(90deg, #000 0%, rgba(25, 25, 25, 0.05) 100%);
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
    min-width: 300px;
}

.brand-card:hover {
    background: linear-gradient(90deg, #151515 0%, #121212 100%);
}
.brand-logo {
    width: 115px;
    height: 65px;
    border-radius: 5px;
    object-fit: contain;
}
.brand-percentage {
    color: #de5947;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px;
}
.brand-name {
    color: #ededed;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
}
</style>

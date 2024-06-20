<template>
    <div class="top-brands">
        <div v-for="brand in brands" :key="brand.id" class="brand-wrapper">
            <div class="brand-card">
                <img :src="brand.img" alt="Brand Logo" class="brand-logo" />
                <div class="brand-details">
                    <p class="brand-name">{{ brand.name }}</p>
                    <p class="brand-percentage">{{ brand.percentage }}%</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import brand_wolf from '../../assets/brand_wolf.png';
import brand_gala from '../../assets/brand_gala.png';
import brand_acko from '../../assets/brand_acko.png';
export default {
    data() {
        return {
            brands: [
                { id: 1, name: 'Abcdi fefeqn svsv..', percentage: 15, img: brand_wolf },
                { id: 2, name: 'Abcdi fefeqn svsv..', percentage: 20, img: brand_gala },
                { id: 3, name: 'Abcdi fefeqn svsv..', percentage: 30, img: brand_acko },
            ],
        };
    },
};
</script>

<style scoped>
.top-brands {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'Poppins';
}

.brand-wrapper {
    position: relative;
    padding: 1px;
    border-radius: 5px;
    overflow: hidden;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
}
.brand-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(
        90deg,
        rgba(215, 215, 215, 0.95) 0%,
        #bababa 25%,
        rgba(116, 116, 116, 0.9) 50%,
        rgba(228, 223, 209, 0.8583) 75%,
        #3e3e3e 100%
    );
    opacity: 0.3;
    z-index: -1; /* Ensure the background is behind the content */
}

.brand-card {
    border-radius: 5px;
    background: #0a0909;
    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
    backdrop-filter: blur(12.5px);
    display: flex;
    align-items: center;
    padding: 10px;
    gap: 5px;
}

.brand-card:hover {
    background: linear-gradient(90deg, #151515 0%, #121212 100%);
}

.brand-logo {
    width: 115px;
    height: 65px;
    object-fit: cover;
}

.brand-details {
    text-align: center;
}

.brand-name {
    color: #fff;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px; /* 150% */
    margin: 5px 0;
}

.brand-percentage {
    color: #de5947;
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 20px; /* 111.111% */
}
</style>

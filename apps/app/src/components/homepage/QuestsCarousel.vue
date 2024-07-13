<!-- Carousel.vue -->
<template>
    <div class="carousel-container">
        <div v-if="questLists.length <= 4" class="quest-list">
            <router-link
                v-for="(quest, index) in questLists"
                :key="index"
                :to="`/c/${quest.poolId}`"
                class="list-card quest-card"
                style="height: 240px; width: 180px"
            >
                <img :src="getQuestImage(quest)" class="quest-image" />
                <h3 class="quest-title">{{ quest.title }}</h3>
                <div class="quest-info">
                    <span class="quest-description">{{ formattedAmount(quest) }}</span>
                </div>
            </router-link>
        </div>
        <div v-else>
            <transition-group name="carousel" tag="div" class="carousel">
                <div
                    v-for="(quest, index) in visibleQuests"
                    :key="quest._id"
                    :class="['carousel-slide', getSlideClass(index)]"
                >
                    <div class="quest-card" @click="goToSecondDiv(quest)">
                        <img :src="getQuestImage(quest)" class="quest-image" />
                        <h3 class="quest-title">{{ quest.title }}</h3>
                        <div class="quest-info">
                            <span class="quest-description">{{ formattedAmount(quest) }}</span>
                        </div>
                    </div>
                </div>
            </transition-group>
            <img src="../../assets/leftBtn.png" class="carousel-control prev" @click="prevSlide" />
            <img src="../../assets/rightBtn.png" class="carousel-control next" @click="nextSlide" />
        </div>
    </div>
</template>

<script lang="ts">
import { PropType, computed, defineComponent, ref } from 'vue';
import * as html from 'html-entities';
import { mockQuests } from './mock-quests';
import { CP_CAMPAIGN } from '@thxnetwork/app/config/secrets';

export default defineComponent({
    name: 'QuestsCarousel',
    props: {
        questLists: {
            type: Array as PropType<Array<TBaseQuest & { domain: string; amount: number; brand: any }>>,
            required: true,
        },
    },
    setup(props, { emit }) {
        // const questLists = ref(mockQuests);
        const currentIndex = ref(2); // Centering the carousel initially at the third item

        const getQuestImage = (quest: any) => {
            return quest.image || (quest.brand && quest.brand.backgroundImgUrl) || 'src/assets/santa.png';
        };

        const visibleQuests = computed(() => {
            const totalQuests = props.questLists.length;
            let visible = [];

            for (let i = -2; i <= 2; i++) {
                const index = (currentIndex.value + i + totalQuests) % totalQuests;
                visible.push(props.questLists[index]);
            }

            return visible;
        });

        const getSlideClass = (index: number) => {
            if (index === 2) {
                return 'active-slide';
            } else if (index === 1 || index === 3) {
                return 'normal-slide';
            } else if (index === 0 || index === 4) {
                return 'blurred-slide';
            } else {
                return 'none-slide';
            }
        };

        const prevSlide = () => {
            currentIndex.value = (currentIndex.value - 1 + props.questLists.length) % props.questLists.length;
        };

        const nextSlide = () => {
            currentIndex.value = (currentIndex.value + 1) % props.questLists.length;
        };

        const formattedAmount = (quest: TBaseQuest) => {
            if (quest.poolId === CP_CAMPAIGN) {
                const amount = quest.amount / 100;
                return amount % 1 === 0 ? `$${amount.toFixed(0)}` : `$${amount.toFixed(2)}`;
            }
            return `${quest.amount} points`;
        };
        const goToSecondDiv = async (quest: TBaseQuest) => {
            emit('scrollToSecondDiv');
        };
        return {
            currentIndex,
            visibleQuests,
            getQuestImage,
            getSlideClass,
            prevSlide,
            nextSlide,
            formattedAmount,
            goToSecondDiv,
        };
    },
});
</script>

<style scoped>
.carousel-container {
    position: relative;
}
.carousel {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
}
.quest-list {
    display: flex;
    flex-wrap: wrap;
}
.carousel-slide,
.list-card {
    height: 240px;
    width: 180px;
    margin: 0 10px;
    transition: transform 0.3s ease, opacity 0.3s ease, transform 0.3s ease-in-out;
}
.quest-card {
    height: 100%;
    color: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.quest-image {
    width: 155px;
    height: 140px;
    margin-bottom: 10px;
    border-radius: 8px;
    object-fit: cover;
}
.quest-title {
    width: 100%;
    color: #fff;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 27px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    margin: 0;
}
.quest-info {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.quest-description {
    font-size: 14px;
    color: #ededed;
    text-shadow: 0px 2px 8px rgba(255, 255, 255, 0.58);
}
.active-slide {
    transform: scale(1.1);
    z-index: 3;
    border-radius: 20px;
    backdrop-filter: blur(12.5px);
    border: 1.5px solid rgba(255, 255, 255, 0.2);
}
.active-slide .quest-title {
    font-size: 18px;
}
.active-slide .carousel-slide {
    width: 200px;
}
.active-slide .quest-card {
    background-color: unset;
}
.list-card {
    display: flex;
    text-decoration: none;
}
.normal-slide,
.list-card {
    transform: scale(1);
    opacity: 1;
    z-index: 1;
    border-radius: 20px;
    border: 1.5px solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(155deg, rgba(255, 255, 255, 0) -2.13%, rgba(0, 0, 0, 0.15) 136.58%);
    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
    backdrop-filter: blur(12.5px);
}
.list-card:hover {
    transform: scale(1.1);
    z-index: 3;
    border-radius: 20px;
    backdrop-filter: blur(12.5px);
}
.carousel-control {
    width: 28px;
    height: 28px;
    position: absolute;
    top: 50%;
    transform: translateY(-20%);
    background: none;
    border: none;
    color: white;
    font-size: 2em;
    cursor: pointer;
    z-index: 10;
}
.carousel-control.prev {
    left: 20%;
    transform: translateX(-20%);
}
.carousel-control.next {
    right: 20%;
    transform: translateX(20%);
}
.blurred-slide {
    filter: blur(5px);
    opacity: 0.5;
    z-index: 1;
}
.none-slide {
    display: none;
}
</style>

<template>
    <div class="carousel-container mb-5">
        <transition-group name="carousel" tag="div" class="carousel">
            <div v-for="(quest, index) in quests" :key="quest.title" :class="['carousel-slide', getSlideClass(index)]">
                <div class="quest-card">
                    <img :src="quest.image" class="quest-image" />
                    <h3 class="quest-title">{{ quest.title }}</h3>
                    <div class="quest-info">
                        <span class="quest-description">{{ quest.description }}</span>
                        <!-- <span class="quest-points">{{ quest.points }}pts</span> -->
                    </div>
                </div>
            </div>
        </transition-group>
        <img src="../../assets/leftBtn.png" class="carousel-control prev" @click="prevSlide" />
        <img src="../../assets/rightBtn.png" class="carousel-control next" @click="nextSlide" />
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import slide1 from '../../assets/slide1.png';
import slide2 from '../../assets/slide2.png';
import slide3 from '../../assets/slide3.png';
import slide4 from '../../assets/slide4.png';
import slide5 from '../../assets/slide5.png';
export default defineComponent({
    name: 'QuestCarousel',
    data() {
        return {
            currentIndex: 2, // Start with the third item as active
            quests: [
                {
                    image: slide1,
                    title: 'Make as Default',
                    description: '',
                    points: 100,
                },
                {
                    image: slide2,
                    title: 'Link Discord account',
                    description: '',
                    points: 100,
                },
                {
                    image: slide3,
                    title: 'Use For One Hour',
                    description: '',
                    points: 50,
                },
                {
                    image: slide4,
                    title: 'Link Twitter account',
                    description: '',
                    points: 50,
                },
                {
                    image: slide5,
                    title: 'Link Telegram account',
                    description: '',
                    points: 50,
                },
            ],
        };
    },
    methods: {
        getSlideClass(index) {
            const totalSlides = this.quests.length;
            const activeIndex = 2;
            const leftIndex = (activeIndex - 1 + totalSlides) % totalSlides;
            const rightIndex = (activeIndex + 1) % totalSlides;

            if (index === activeIndex) {
                return 'active-slide';
            }
            // else if (index === leftIndex) {
            //     return 'left-slide';
            // } else if (index === rightIndex) {
            //     return 'right-slide';
            // }
            else if (index === 0 || index === totalSlides - 1) {
                return 'blurred-slide';
            } else {
                return 'normal-slide';
            }
        },
        prevSlide() {
            this.currentIndex = (this.currentIndex - 1 + this.quests.length) % this.quests.length;
            const lastQuest = this.quests.pop();
            this.quests.unshift(lastQuest);
        },
        nextSlide() {
            this.currentIndex = (this.currentIndex + 1) % this.quests.length;
            const firstQuest = this.quests.shift();
            this.quests.push(firstQuest);
        },
    },
});
</script>

<style scoped>
.carousel-container {
    font-family: 'Poppins';
    position: relative;
    width: 100%;
}

.carousel {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: transform 0.3s ease;
}

.carousel-slide {
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
    color: #fff;
    font-size: 15px;
    font-style: normal;
    font-weight: 600;
    line-height: 27px;
    text-align: left;
}

.quest-info {
    width: 100%;
    display: flex;
    justify-content: space-between; /* Adjusts space between the items */
    align-items: center; /* Aligns items vertically */
}

.quest-description {
    font-size: 14px;
    color: #cccccc;
}

.quest-points {
    font-size: 14px;
    font-weight: bold;
    color: #ffffff;
}

.active-slide {
    transform: scale(1.1);
    /*box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);*/
    z-index: 3;
    border-radius: 20px;
    border: 1px solid #a33d3d;
    background: linear-gradient(155deg, #000 -2.13%, #6a2c2c 136.58%);
    box-shadow: 0px 4px 53px 0px rgba(212, 70, 70, 0.47);
    backdrop-filter: blur(12.5px);
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

.normal-slide {
    transform: scale(1);
    opacity: 1;
    z-index: 1;
    border-radius: 20px;
    border: 1.5px solid #333;
    background: linear-gradient(155deg, rgba(255, 255, 255, 0) -2.13%, rgba(0, 0, 0, 0.15) 136.58%);
    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
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
    left: 10px;
    transform: translateX(-80%);
}

.carousel-control.next {
    right: 10px;
    transform: translateX(80%);
}
.blurred-slide {
    filter: blur(5px);
    opacity: 0.5;
    z-index: 1;
}
/*.carousel::before,
.carousel::after {
    content: '';
    position: absolute;
    top: 0;
    width: 100px;
    height: 100%;
    z-index: 5;
    pointer-events: none;
}
.carousel::before {
    left: 0;
    background: linear-gradient(to right, #0a0909, rgba(10, 9, 9, 0));
}

.carousel::after {
    right: 0;
    background: linear-gradient(to left, #0a0909, rgba(10, 9, 9, 0));
}*/
</style>

<template>
    <div class="active-activities">
        <ActivityCard
            v-for="(activity, index) in activities"
            :key="index"
            :background-image="activity.backgroundImage"
            :title="activity.title"
            :subtitle="activity.subtitle"
            :points="activity.points"
            :button-text="activity.buttonText"
            :link-text="activity.linkText"
        />
    </div>
</template>

<script>
import ActivityCard from './ActivityCard.vue';
import activityBg1 from '../../assets/activity_bg1.png';
import activityBg2 from '../../assets/activity_bg2.png';
export default {
    name: 'ActiveActivities',
    components: {
        ActivityCard,
    },
    data() {
        return {
            activities: [
                {
                    backgroundImage: activityBg1,
                    title: 'Daily Check In',
                    subtitle: 'Get your daily dose of points.',
                    points: [
                        { value: 25, done: true },
                        { value: 35, done: false }, // This day is marked as done
                        { value: 45, done: false },
                        { value: 55, done: false },
                        { value: 62, done: false },
                    ],
                    buttonText: '',
                    linkText: '',
                },
                {
                    backgroundImage: activityBg2,
                    title: 'Daily Browsing',
                    subtitle: 'Get your daily dose of points.',
                    points: [
                        { value: 25, done: false },
                        { value: 35, done: false },
                        { value: 45, done: false },
                        { value: 55, done: false },
                        { value: 62, done: false },
                    ],
                    buttonText: '',
                    linkText: '',
                },
                {
                    backgroundImage: activityBg2,
                    title: 'Join our Gala Games Discord',
                    subtitle: 'Click the invite link and join our Discord community.',
                    points: [],
                    buttonText: 'Sign in & claim 100 points',
                    linkText: 'Join Discord Server',
                },
                {
                    backgroundImage: activityBg1,
                    title: 'Join our Gala Games Discord',
                    subtitle: 'Click the invite link and join our Discord community.',
                    points: [],
                    buttonText: 'Sign in & claim 100 points',
                    linkText: 'Join Discord Server',
                },
            ],
        };
    },
};
</script>

<style scoped>
.active-activities {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
</style>

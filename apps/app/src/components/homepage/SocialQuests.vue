<template>
    <div class="social-activities mt-5">
        <div
            v-for="activity in activities"
            :key="activity.id"
            class="activity"
            :style="{ backgroundImage: `url(${activity.background})` }"
        >
            <div :class="['activity-header', activity.platform.toLowerCase()]">
                <img
                    :src="activity.icon"
                    :alt="activity.platform"
                    loading="lazy"
                    :class="['activity-icon', activity.platform.toLowerCase()]"
                />
                <!-- <i :class="['fa', activity.icon]"></i>
                <span>{{ activity.platform }}</span> -->
            </div>
            <div class="activity-body">
                <p>
                    {{ activity.action }} <strong>{{ activity.channel }}</strong>
                </p>
                <div class="activity-bottom">
                    <div class="bottom-left">
                        <div class="time-remaining">
                            <div>
                                <i class="fa fa-hourglass-half"></i> <span>{{ activity.timeRemaining }}</span>
                            </div>

                            <p>Time Remaining</p>
                        </div>
                        <div class="points">{{ activity.points }} <span>Points</span></div>
                    </div>
                    <button :class="[activity.buttonClass, 'btn-text']">{{ activity.buttonText }}</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            activities: [
                {
                    id: 1,
                    platform: 'Youtube',
                    icon: '',
                    action: 'Subscribe',
                    channel: 'Santa Browser Channel',
                    timeRemaining: '18h : 17m : 29s',
                    points: 50,
                    buttonClass: 'subscribe',
                    buttonText: 'Subscribe',
                    background: '',
                },
                {
                    id: 2,
                    platform: 'Discord',
                    icon: '',
                    action: 'Join',
                    channel: 'Santa Browser Channel',
                    timeRemaining: '18h : 17m : 29s',
                    points: 50,
                    buttonClass: 'join-now',
                    buttonText: 'Join Now',
                    background: '',
                },
            ],
        };
    },
};
</script>
<style scoped>
.social-activities {
    display: flex;
    justify-content: space-between;
    gap: 10px;
}

.activity {
    height: 190px;
    font-family: 'Poppins';
    background: #1c1c1e;
    color: #fff;
    position: relative;
    background-size: cover;
    background-position: center;
    width: 50%;
}

.activity-header {
    display: flex;
    align-items: center;
}

.activity-header i {
    margin-right: 10px;
}

.activity-icon {
    position: absolute;
    width: 200px;
    z-index: -1;
}
.activity-icon.youtube {
    left: -43px;
}
.activity-icon.discord {
    left: -43px;
}
.activity-body {
    position: relative;
    padding: 20px;
    z-index: 2;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.activity-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.bottom-left {
    display: flex;
    gap: 15px;
}
.activity-body p {
    color: #fff;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px; /* 128.571% */
    margin-bottom: 10px;
    text-align: right;
}

.activity-body strong {
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    display: block;
}

.time-remaining {
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    background: rgba(217, 217, 217, 0.05);
    padding: 5px;
    height: 62px;
    justify-content: center;
}

.time-remaining p {
    margin: 0;
    display: block;
    color: #fff;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
.time-remaining i {
    margin-right: 5px;
}

.points {
    background: rgba(217, 217, 217, 0.05);
    font-size: 18px;
    font-style: normal;
    font-weight: 700;
    line-height: 28px; /* 155.556% */
    text-align: center;
    padding: 7px;
    height: 62px;
    border-radius: 5px;
}

.points span {
    display: block;
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
.btn-text {
    color: #ffc3c3;
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 20px; /* 142.857% */
}
.subscribe,
.join-now {
    color: #fff;
    padding: 5px 15px;
    cursor: pointer;
    border-radius: 5px;
    border: 0.5px solid #641010;
    background: #bd4a4a;
}

.join-now {
    border: 0.5px solid #5b70d1;
    background: #6c86ff;
}
</style>

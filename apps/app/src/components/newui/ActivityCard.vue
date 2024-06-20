<template>
    <div class="activity-card" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
        <div class="content">
            <div class="activity-text">
                <h3>{{ title }}</h3>
            </div>
            <div class="card-bottom">
                <div v-if="subtitle" class="card-subtitle">{{ subtitle }}</div>
                <div v-if="points.length" class="points-grid">
                    <div v-for="(point, index) in points" :key="index" :class="{ done: point.done }" class="point">
                        Day {{ index + 1 }}<br /><span>{{ point.value }}</span>
                    </div>
                </div>
                <div v-if="linkText" class="link-container">
                    <a href="#" class="link">{{ linkText }}</a>
                </div>
                <div v-if="buttonText" class="button-container">
                    <a href="#" class="button">{{ buttonText }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ActivityCard',
    props: {
        backgroundImage: String,
        title: String,
        subtitle: String,
        points: Array,
        buttonText: String,
        linkText: String,
    },
};
</script>

<style scoped>
.activity-card {
    height: 333px;
    position: relative;
    background-size: cover;
    color: white;
    border-radius: 10px;
    overflow: hidden;
}
.activity-card .content {
    height: 100%;
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}
.activity-text {
    padding: 10px;
}
.activity-text h3 {
    color: #ffffff;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
.activity-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 120px;
    background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    z-index: 1;
    filter: blur(10);
}
.card-bottom {
    height: 115px;
    display: flex;
    flex-direction: column;
    background-color: #161515;
    padding: 10px;
}
.card-subtitle {
    color: #ffffff;
    font-family: Poppins;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
.points-grid {
    margin-top: 5px;
    display: flex;
    gap: 10px;
}
.point {
    background: rgba(0, 0, 0, 0.7);
    padding: 3px 10px;
    border-radius: 12px;
    text-align: center;
    color: rgba(255, 255, 255, 0.7);
    font-family: Poppins;
    font-size: 10px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    border: 1px solid #1a1a1a;
}
.point.done {
    background-color: rgba(14, 255, 53, 5%); /* Different background color for done points */
    color: #00ff29; /* Different text color for done points */
    border-color: rgba(28, 255, 37, 22%);
    opacity: 0.7;
}
.point span {
    font-size: 16px;
}
.button-container {
    display: flex;
    justify-content: center;
}
.button {
    width: 100%;
    display: inline-block;
    padding: 10px 20px;
    text-decoration: none;
    border-radius: 5px;
    background: linear-gradient(90deg, #163b6d 0%, #2c73d3 100%);
    color: #ffffff;
    font-family: Poppins;
    font-size: 17px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    text-align: center;
}
.link-container {
    margin-bottom: 5px;
}
.link {
    text-decoration: none;
    color: rgba(255, 255, 255, 0.5);
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
</style>

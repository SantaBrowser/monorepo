<template>
    <div class="quests-component">
        <b-row class="align-items-center justify-content-between mb-3">
            <b-col class="text-white">
                <h2 class="quests-title">Quests</h2>
                <span>Earnings</span>
            </b-col>
            <b-col class="points-summary">
                <h2 class="points-amount">5000</h2>
                <span class="santa-points">Santa Points</span>
            </b-col>
        </b-row>
        <div class="reward-card-row">
            <div class="reward-card-wrapper">
                <div class="reward-card">
                    <div class="reward-points">100pts</div>
                    <span class="reward-content">Get 50 MATIC for 500 points</span>
                    <button class="custom-button">Buy</button>
                </div>
            </div>
            <div class="reward-card-wrapper">
                <div class="reward-card">
                    <div class="reward-points">500pts</div>
                    <span class="reward-content">Get 10% Discount Coupon on NIKE for 500 points</span>
                    <button class="custom-button">Buy</button>
                </div>
            </div>
            <div class="reward-card-wrapper">
                <div class="reward-card">
                    <div class="reward-points">1000pts</div>
                    <span class="reward-content">Get 15% Discount Coupon on AMANOZ for 1000 points</span>
                    <button class="custom-button">Buy</button>
                </div>
            </div>
        </div>

        <!-- <div class="footer-text text-center">
            <p>*Lorem ipsum dummy text comes here</p>
        </div> -->
    </div>
</template>

<script>
export default {
    name: 'QuestsBuy',
};
</script>

<style scoped>
.quests-component {
    font-family: 'Poppins';
    padding: 20px;
    border-radius: 10px;
    background: url('../../assets/hero1.png') no-repeat center center;
    background-size: cover;
}
.quests-title {
    margin: 0;
    color: #e3e3e3;
    font-family: 'Poppins';
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
.earnings-title {
    color: #e3e3e3;
    font-family: 'Poppins';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
.reward-card-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 25px;
}
.reward-card-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.3) 100%);
    border-radius: 11px;
    box-sizing: border-box;
}
.reward-card-wrapper:hover {
    background: linear-gradient(0deg, #a33d3d 0%, #000000 11%, #ffc0c0 76%, #d44646 100%);
}
.reward-card {
    width: 160px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    background: #333;
    padding: 10px;
    position: relative;
    border-radius: 11px;
    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
    box-sizing: border-box;
    background: rgba(0, 0, 0, 0.8); /* Adjust the background color and opacity as needed */
    transition: background 0.3s ease;
}
.reward-card:hover {
    background: linear-gradient(-43deg, #370000 0%, #460d0d 29%, #6a2c2c 100%);
}
.reward-points {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 25px;
    position: absolute;
    top: 5px;
    right: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    box-shadow: 0px 1px 7px 0px rgba(255, 255, 255, 0.13);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    padding: 5px 10px;
    border-radius: 5px;
}
.reward-content {
    color: #fff;
    text-align: center;
    font-family: 'Poppins';
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
}
.points-amount {
    margin: 0;
    padding: 0;
    font-family: Poppins;
    font-size: 40px;
    font-style: normal;
    font-weight: 600;
    line-height: 34px;
    background: linear-gradient(-90deg, #fff 0%, #b8b8b8 30.5%, #fff 52%, #a2a2a2 61.5%, #cacaca 100%);
    -webkit-background-clip: text;
    color: transparent;
    text-shadow: 0px 3px 30px rgba(255, 255, 255, 0.4);
}
.santa-points {
    color: rgba(212, 212, 212, 0.5);
    -webkit-text-stroke-width: 2;
    -webkit-text-stroke-color: rgba(0, 0, 0, 0.3);
    font-family: 'Poppins';
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 0px;
}
.custom-button {
    position: absolute;
    width: 100%;
    display: flex;
    padding: 0 20px;
    justify-content: center;
    align-items: center;
    border-radius: 11px;
    border: 0.5px solid #ffffff30;
    background: rgba(0, 0, 0, 0.61);
    box-shadow: 0px 4px 49px 0px rgba(0, 7, 72, 0.12);
    backdrop-filter: blur(12.5px);
    box-sizing: border-box;
    bottom: 5px;
    width: 100px;
}

.footer-text {
    color: #777;
}

.points-summary {
    text-align: right;
}
</style>

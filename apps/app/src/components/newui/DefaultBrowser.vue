<template>
    <b-card class="default-browser-card">
        <b-row class="align-items-center">
            <b-col cols="auto">
                <img src="../../assets/bulb.png" alt="Lightbulb Icon" class="lightbulb-icon" />
            </b-col>
            <b-col>
                <p class="notification-text">
                    Hey! it seems that Santa is not a default browser on your systems.<br />
                    Set as default browser and earn <strong>30 pts</strong> now!
                </p>
            </b-col>
            <b-col cols="auto">
                <button class="custom-btn" @click="setAsDefault">Set as Default</button>
            </b-col>
        </b-row>
    </b-card>
</template>

<script>
export default {
    methods: {
        setAsDefault() {
            // Logic to set Santa as the default browser
            // this.$bvToast.toast('Santa browser set as default!', {
            //     title: 'Success',
            //     variant: 'success',
            //     solid: true,
            // });
        },
    },
};
</script>

<style scoped>
.default-browser-card {
    background: url('../../assets/defaultBg.png') no-repeat center center;
    background-size: cover;
    color: #fff;
}

.notification-text {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 153.846% */
    margin-bottom: 0; /* to align text in the center */
}

.custom-btn {
    display: inline-flex;
    padding: 10px 15px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    background: #4b4444;
    color: #fff;
    border: none;
}

.lightbulb-icon {
    width: 2rem; /* adjust size as needed */
    height: 2rem; /* adjust size as needed */
}
</style>

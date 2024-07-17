<template>
    <b-card class="bg-referral">
        <b-row class="align-items-center">
            <b-col>
                <div class="referral-text">
                    <h4>Refer Friends And Earn Credit</h4>
                    <span
                        >Share referral link with friends and <strong>earn 100 points</strong> for each referral.</span
                    >
                </div>
            </b-col>
            <b-col class="ref-btn">
                <div class="link-container">
                    <div readonly class="no-outline">{{ referralLink }}</div>
                    <button class="copy-button" @click="copyLink">Copy Link</button>
                </div>
            </b-col>
        </b-row>
    </b-card>
</template>
<script>
export default {
    data() {
        return {
            referralLink: 'rtyuihg456789',
        };
    },
    methods: {
        copyLink() {
            navigator.clipboard.writeText(this.referralLink);
            // this.$bvToast.toast('Referral link copied!', {
            //     title: 'Success',
            //     variant: 'success',
            //     solid: true,
            // });
        },
    },
};
</script>

<style scoped>
.card {
    flex: 1 1 50%;
    /* background: url('../assets/bg-referral.png') no-repeat center center; */
    /* background-size: cover; */
    color: black;
    border-radius: 15px;
}
.referral-text h4 {
    color: black;
    font-style: normal;
    font-weight: bold;
    line-height: normal;
    font-family: 'Kode Mono', monospace;
}

.referral-text span {
    color: black;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
.link-container {
    background: rgba(3, 3, 3, 0.6);
    display: flex;
    align-items: center;
    padding: 3px;
    color: #ccc;
    border-radius: 5px;
}
.no-outline {
    flex-grow: 1;
    padding-left: 10px;
    color: #fff;
    display: flex;
    align-items: center;
    pointer-events: none;
    padding: 5px 15px;
}
.copy-button {
    width: 85px;
    padding: 5px 0;
    white-space: nowrap;
    border-radius: 5px;
    border: 1px solid rgba(210, 179, 89, 0.4);
    background: linear-gradient(
        94deg,
        rgba(221, 174, 65, 0.9) 0%,
        rgba(255, 195, 90, 0.9) 13.29%,
        rgba(255, 205, 56, 0.9) 30.34%,
        rgba(255, 207, 112, 0.9) 73.17%,
        rgba(255, 206, 120, 0.9) 83.8%,
        rgba(255, 205, 56, 0.9) 96.43%,
        rgba(221, 147, 26, 0.9) 100.4%
    );

    color: #1a1a1a;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    line-height: 14.683px;
}

.ref-btn {
    flex: 0;
}

.bg-referral {
    background-color: #cdc40c;
    color: black;
    margin: 15px;
    border-radius: 10px;
    border: 0.5px solid rgba(76, 46, 115, 0.4);
    display: block;
}
</style>

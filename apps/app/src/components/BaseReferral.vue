<template>
    <b-card class="mb-3 mt-3">
        <b-row class="align-items-center">
            <b-col>
                <div class="referral-text">
                    <h4>Refer Friends And Earn Credit</h4>
                    <span
                        >Share referral link with friends and <strong>earn 100 points</strong> for each referral.</span
                    >
                </div>
            </b-col>
            <b-col>
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
    background: url('../assets/bg-referral.png') no-repeat center center;
    background-size: cover;
    color: #fff;
}
.referral-text h4 {
    color: #fff;
    font-size: 20px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}

.referral-text span {
    color: #ffc041;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
}
.link-container {
    display: flex;
    align-items: center;
    border-radius: 8px;
    padding: 3px;
    color: #ccc;
    border-radius: 12px;
    border: 1px solid #685489;
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
    padding: 8.973px 19.577px;
    margin: 3px;
    border-radius: 12px;
    border: 0.5px solid #3f1d74;
    background: #2b0966;
}
</style>

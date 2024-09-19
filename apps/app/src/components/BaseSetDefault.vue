<template>
    <b-card class="bg-default">
        <div class="align-items-center">
            <div>
                <div class="default-text">
                    <h4>Set as Default</h4>
                    <span>
                        Hey it seems that Santa is not a default browser on your systems.
                        <strong>set as default browser and earn 30 pts now ! </strong>
                    </span>
                </div>
            </div>
            <div class="d-flex justify-content-end mt-2">
                <button class="set-button">Set as Default</button>
            </div>
        </div>
    </b-card>
</template>

<style scoped>
.card {
    flex: 1 1 50%;
    color: #ffffff;
    border-radius: 15px;
}
.default-text h4 {
    color: #fff;
    font-size: 15px;
    font-style: italic;
    font-weight: 700;
    line-height: normal;
}

.default-text span {
    color: #ccffed;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 17px;
}
.set-button {
    width: fit-content;
    white-space: nowrap;
    color: #ffffff;
    text-align: center;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    border-radius: 3px;
    background: #002934;
    border: none;
    padding: 5px 15px;
}

.bg-default {
    border-radius: 5px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: linear-gradient(142deg, rgba(3, 129, 84, 0.85) 19.63%, rgba(3, 73, 112, 0.85) 83.01%);
    box-shadow: 0px 5px 20px 0px rgba(20, 127, 89, 0.38);
    backdrop-filter: blur(30px);
    margin: 15px;
}
</style>

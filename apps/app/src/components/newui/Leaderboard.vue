<!-- LeaderboardComponent.vue -->
<template>
    <div class="leaderboard">
        <h2>Leaderboard</h2>
        <p>Lets compete and earn more rewards</p>
        <div class="leaderboard-grid">
            <div
                v-for="(player, index) in players"
                :key="player.id"
                class="leaderboard-item"
                :class="`rank-${index + 1}`"
                :style="{ gridArea: gridAreas[index] }"
            >
                <div class="player-info">
                    <img :src="player.image" alt="Player Image" class="player-image" />
                    <div class="player-details">
                        <span class="player-id">{{ player.id }}</span>
                        <span class="player-points">{{ player.points }} <span>pts</span></span>
                    </div>
                </div>
                <span class="player-rank">#{{ index + 1 }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import slide1 from '../../assets/slide1.png';
export default {
    name: 'LeaderboardComponent',
    data() {
        return {
            players: [
                { id: 'xxxxxxxx1234', points: 11002, image: slide1 },
                { id: 'xxxxxxxx1984', points: 11002, image: slide1 },
                { id: 'xxxxxxxx6547', points: 11002, image: slide1 },
                { id: 'xxxxxxxx7563', points: 11002, image: slide1 },
                { id: 'xxxxxxxx7563', points: 11002, image: slide1 },
                { id: 'xxxxxxxx7563', points: 11002, image: slide1 },
            ],
            gridAreas: ['item1', 'item2', 'item3', 'item4', 'item5', 'item6'],
        };
    },
};
</script>

<style scoped>
.leaderboard {
    width: 100%;
    margin: auto;
    padding: 20px;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}
.leaderboard h2 {
    margin: 0;
    color: #e3e3e3;
    font-family: 'Poppins';
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
}
.leaderboard p {
    color: rgba(255, 255, 255, 0.5);
    font-feature-settings: 'clig' off, 'liga' off;
    -webkit-text-stroke-width: 2;
    -webkit-text-stroke-color: rgba(0, 0, 0, 0.3);
    font-family: Poppins;
    font-size: 12px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
}
.leaderboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 10px;
    grid-template-areas:
        'item1 item4'
        'item2 item5'
        'item3 item6';
}
.leaderboard-item {
    background-color: transparent;
    border-radius: 5px;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    border: 1px solid #404040;
}
.player-info {
    display: flex;
    align-items: center;
}
.player-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
}
.player-details {
    display: flex;
    flex-direction: column;
}
.player-id {
    color: #f5f5f5;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 21px; /* 140% */
}
.player-points {
    color: #f5f5f5;
    leading-trim: both;
    text-edge: cap;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Poppins;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
    line-height: 14px; /* 100% */
}
.player-points span {
    color: #d44646;
    leading-trim: both;
    text-edge: cap;
    font-feature-settings: 'clig' off, 'liga' off;
    font-family: Poppins;
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    line-height: 14px;
}
.player-rank {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 1.2em;
}
.rank-1 {
    border: 1px solid #d4a437;
}
.rank-2 {
    border: 1px solid silver;
}
.rank-3 {
    border: 1px solid #cd7f32; /* Bronze */
}
</style>

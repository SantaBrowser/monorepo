<template>
    <div class="about-page">
        <section class="about-hero" role="banner" aria-label="About">
            <div class="about-hero-bg" :style="{ backgroundImage: heroBgStyle }" />
            <div class="about-hero-overlay" />
            <b-container>
                <div class="about-hero-content d-flex align-items-center justify-content-between gap-3">
                    <div class="about-hero-left flex-grow-1">
                        <h1 class="about-hero-title">{{ decodeHTML(accountStore.config.title) }}</h1>
                        <!-- eslint-disable-next-line vue/no-v-html -->
                    <div class="about-hero-desc" v-html="safeDescription" />
                        <div class="about-hero-ctas">
                            <b-button
                                v-if="accountStore.isAuthenticated && accountStore.config.isQRCodeCampaign"
                                :to="`/c/${accountStore.config.slug}/wallets`"
                                variant="primary"
                                size="lg"
                                class="px-4"
                            >
                                Wallet <i class="fas fa-chevron-right ms-2" />
                            </b-button>
                            <b-button
                                v-if="!accountStore.isAuthenticated && accountStore.config.isQRCodeCampaign"
                                variant="primary"
                                size="lg"
                                class="px-4"
                                @click="authStore.isModalLoginShown = true"
                            >
                                Sign in <i class="fas fa-sign-in-alt ms-2" />
                            </b-button>
                        </div>
                    </div>
                    <img class="about-hero-illustration" :src="heroIllustration" alt="About illustration" />
                </div>
                <div class="about-hero-stats">
                    <div class="about-stat">
                        <i class="fas fa-users about-stat-icon" aria-hidden="true"></i>
                        <div class="about-stat-meta">
                            <div class="about-stat-value">{{ stats.users || '—' }}</div>
                            <div class="about-stat-label">Active Users</div>
                        </div>
                    </div>
                    <div class="about-stat">
                        <i class="fas fa-gift about-stat-icon" aria-hidden="true"></i>
                        <div class="about-stat-meta">
                            <div class="about-stat-value">{{ stats.rewards || '—' }}</div>
                            <div class="about-stat-label">Rewards Claimed</div>
                        </div>
                    </div>
                    <div class="about-stat">
                        <i class="fas fa-check-circle about-stat-icon" aria-hidden="true"></i>
                        <div class="about-stat-meta">
                            <div class="about-stat-value">{{ stats.quests || '—' }}</div>
                            <div class="about-stat-label">Quests Completed</div>
                        </div>
                    </div>
                </div>
            </b-container>
        </section>

        <b-container class="mt-4">
            <AboutQuests :active-tab="2" @scroll-to-top="onScrollToTop" />
        </b-container>
    </div>
</template>

<script lang="ts">
import { mapStores } from 'pinia';
import { defineComponent } from 'vue';
import { useAccountStore } from '../../stores/Account';
import { useRewardStore } from '../../stores/Reward';
import { useQuestStore } from '../../stores/Quest';
import { useAuthStore } from '../../stores/Auth';
import { decodeHTML } from '../../utils/decode-html';
import { sanitizeHtml } from '../../utils/sanitize';
import heroIllustration from '../../assets/about.png';
import AboutQuests from '../../components/new-ui/AboutQuests.vue';

export default defineComponent({
    name: 'Identities',
    components: { AboutQuests },
    data() {
        return {
            uuid: '',
            error: '',
            isLoading: false,
            decodeHTML,
            onScrollToTop: () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            },
            stats: {
                users: '',
                rewards: '',
                quests: '',
            },
            safeDescription: '',
        };
    },
    computed: {
        ...mapStores(useAccountStore),
        ...mapStores(useAuthStore),
        ...mapStores(useQuestStore),
        ...mapStores(useRewardStore),
        heroBgStyle(): string {
            const url = this.accountStore.config.backgroundUrl || '';
            return url ? `url("${url}")` : 'none';
        },
        heroIllustration(): string {
            return heroIllustration;
        },
    },
    watch: {
        'accountStore.config.description': {
            immediate: true,
            async handler(newVal: string) {
                const raw = this.decodeHTML(newVal || '');
                this.safeDescription = await sanitizeHtml(raw);
            },
        },
    },
});
</script>

<style scoped>
.about-hero {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    min-height: 320px;
    display: flex;
    align-items: center;
}
.about-hero-bg {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    filter: brightness(0.7);
}
.about-hero-overlay {
    position: absolute;
    inset: 0;
    background: radial-gradient(120% 80% at 20% 20%, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 60%),
        linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, 0.35) 100%);
}
.about-hero-content {
    position: relative;
    padding: 40px 0;
    color: var(--title-color);
}
.about-hero-title {
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    letter-spacing: -0.02em;
    font-size: clamp(28px, 4.2vw, 44px);
    margin: 0;
}
.about-hero-title::after {
    content: '';
    display: block;
    width: 84px;
    height: 4px;
    margin-top: 10px;
    border-radius: 2px;
    background: linear-gradient(90deg, #de5947 0%, rgba(222, 89, 71, 0) 100%);
}
.about-hero-desc {
    margin-top: 12px;
    font-size: clamp(15px, 2vw, 20px);
    line-height: 1.6;
    color: var(--about-nav-item-color);
}
.about-hero-ctas {
    margin-top: 20px;
    display: flex;
    gap: 12px;
}
.about-hero-illustration {
    width: clamp(120px, 22vw, 220px);
    height: auto;
    user-select: none;
}
.about-hero-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
    margin-top: 18px;
}
.about-stat {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--tabs-bg);
    border: 1px solid var(--dropdown-border-color);
    border-radius: 10px;
    padding: 10px 12px;
}
.about-stat-icon {
    color: var(--about-subtitle-color);
    font-size: 18px;
}
.about-stat-value {
    color: var(--title-color);
    font-weight: 700;
    line-height: 1;
}
.about-stat-label {
    color: var(--about-nav-item-color);
    font-size: 12px;
}

@media (max-width: 992px) {
    .about-hero {
        min-height: 260px;
    }
    .about-hero-content {
        flex-direction: column;
        align-items: flex-start !important;
    }
    .about-hero-illustration {
        display: none;
    }
    .about-hero-stats {
        grid-template-columns: 1fr;
    }
}
</style>

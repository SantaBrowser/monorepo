import { BootstrapVueNext, vBTooltip } from 'bootstrap-vue-next';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { GCLOUD_RECAPTCHA_SITE_KEY, SNOWPLOW_URL } from './config/secrets';
import App from './App.vue';
import VueClipboard from 'vue3-clipboard';
import Vue3Toastify from 'vue3-toastify';
import router from './router';
import './scss/main.scss';
import './styles/theme.css';
import { initializeTracker } from './utils/snowplowTracker';
import { useThemeStore } from './stores/Stores';

declare global {
    interface Window {
        ethereum: any;
    }
}
// Snowplow
if (SNOWPLOW_URL) {
    console.log(`Initializing Snowplow with endpoint: ${SNOWPLOW_URL}`);
    initializeTracker(SNOWPLOW_URL);
} else {
    console.log('Snowplow tracking disabled - no URL provided');
}

const pinia = createPinia();
const app = createApp(App);

// Create the Mixpanel instance (disabled)

// Create the ReCaptcha script tag for the environments site key and append it to the head
const script = document.createElement('script');
script.src = `https://www.google.com/recaptcha/enterprise.js?render=${GCLOUD_RECAPTCHA_SITE_KEY}`;
document.head.appendChild(script);

// Directives and plugins
app.directive('b-tooltip', vBTooltip);
app.use(pinia);
app.use(router);
app.use(BootstrapVueNext);
app.use(Vue3Toastify, {
    limit: 2,
});
app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
});
app.config.warnHandler = () => {
    //
};
// Initialize theme with priority: URL override > system (with listener)
(() => {
    const themeStore = useThemeStore(pinia);
    const params = new URLSearchParams(window.location.search);
    const override = params.get('theme');
    const isValid = override === 'dark' || override === 'light';

    if (isValid) {
        // URL override wins; do not attach system listener
        themeStore.applyTheme(override as 'dark' | 'light');
        return;
    }

    // Follow system
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    themeStore.applyTheme(mq.matches ? 'dark' : 'light');
    const handler = (e: MediaQueryListEvent) => themeStore.applyTheme(e.matches ? 'dark' : 'light');
    if (typeof mq.addEventListener === 'function') {
        mq.addEventListener('change', handler);
    } else {
        // Safari < 14
        (mq as any).addListener(handler);
    }
})();
app.mount('#app');

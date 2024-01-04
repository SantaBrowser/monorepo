import { useAccountStore } from '../stores/Account';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

async function beforeEnter(to: any, from: any, next: any) {
    const { poolId, init } = useAccountStore();
    if (!poolId) {
        await init(to.params.slug, to.query.origin);
    }
    next();
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '',
        beforeEnter: (to, from, next) => {
            beforeEnter(to, from, next);
            useAccountStore().reset();
        },
        component: () => import(/* webpackChunkName: "discovery" */ '../views/Discovery.vue'),
        children: [
            {
                path: '/',
                name: 'home',
                component: () => import(/* webpackChunkName: "home" */ '../views/discovery/Home.vue'),
            },
            {
                path: '/learn',
                name: 'learn',
                component: () => import(/* webpackChunkName: "learn" */ '../views/discovery/Learn.vue'),
            },
            {
                path: '/earn',
                name: 'earn',
                component: () => import(/* webpackChunkName: "earn" */ '../views/discovery/Earn.vue'),
            },
        ],
    },
    {
        path: '/maintenance',
        name: 'maintenance',
        component: () => import(/* webpackChunkName: "maintenance" */ '../views/Maintenance.vue'),
    },
    {
        path: '/c/:slug',
        name: 'campaign',
        component: () => import(/* webpackChunkName: "campaign" */ '../views/Campaign.vue'),
        redirect: (route) => {
            return `/c/${route.params.slug}/quests`;
        },
        children: [
            {
                path: '/c/:slug/signin',
                name: 'signin',
                beforeEnter,
                component: () => import(/* webpackChunkName: "signin" */ '../views/campaign/Signin.vue'),
            },
            {
                path: '/c/:slug/quests',
                name: 'quests',
                beforeEnter,
                component: () => import(/* webpackChunkName: "quests" */ '../views/campaign/Quests.vue'),
            },
            {
                path: '/c/:slug/ranking',
                name: 'ranking',
                beforeEnter,
                component: () => import(/* webpackChunkName: "ranking" */ '../views/campaign/Ranking.vue'),
            },
            {
                path: '/c/:slug/rewards',
                name: 'rewards',
                beforeEnter,
                component: () => import(/* webpackChunkName: "rewards" */ '../views/campaign/Rewards.vue'),
            },
            {
                path: '/c/:slug/wallet',
                name: 'wallet',
                beforeEnter,
                component: () => import(/* webpackChunkName: "wallet" */ '../views/campaign/Wallet.vue'),
            },
            {
                path: '/c/:slug/c/:uuid',
                name: 'collect',
                beforeEnter,
                component: () => import(/* webpackChunkName: "collect" */ '../views/campaign/Collect.vue'),
            },
            {
                path: '/c/:slug/w/:uuid',
                name: 'ConnectWallet',
                beforeEnter,
                component: () => import(/* webpackChunkName: "connectwallet" */ '../views/campaign/ConnectWallet.vue'),
            },
            {
                path: '/c/:slug/checkout/:uuid',
                name: 'checkout',
                beforeEnter,
                component: () => import(/* webpackChunkName: "checkout" */ '../views/campaign/Checkout.vue'),
            },
            {
                path: '/c/:slug/checkout/:uuid/complete',
                name: 'checkout_complete',
                beforeEnter,
                component: () =>
                    import(/* webpackChunkName: "checkoutcomplete" */ '../views/campaign/CheckoutComplete.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;

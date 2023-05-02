import { useAccountStore } from '../stores/Account';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

function beforeEnter(to: any, from: any, next: any) {
    const { poolId, init, getConfig } = useAccountStore();
    if (poolId) {
        next();
    } else {
        // If there is no poolId we need to init and grab data either from query or storage
        const { id, origin, chainId, theme, expired, logoUrl, title } = to.query;
        if (id && origin && chainId && theme && expired && logoUrl) {
            init({ poolId: id, origin, chainId, theme, logoUrl, title, expired: JSON.parse(expired as string) });
        } else {
            const { poolId, origin, chainId, theme, expired, logoUrl, title } = getConfig(to.params.poolId);
            init({ poolId, origin, chainId, theme, logoUrl, expired, title });
        }

        next();
    }
}

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        beforeEnter,
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    },
    {
        path: '/:poolId/earn',
        name: 'Earn',
        beforeEnter,
        component: () => import(/* webpackChunkName: "home" */ '../views/Home.vue'),
    },
    {
        path: '/:poolId/store',
        name: 'store',
        beforeEnter,
        component: () => import(/* webpackChunkName: "perks" */ '../views/Perks.vue'),
    },
    {
        path: '/:poolId/wallet',
        name: 'wallet',
        beforeEnter,
        component: () => import(/* webpackChunkName: "wallet" */ '../views/Wallet.vue'),
    },
    {
        path: '/:poolId/c/:uuid',
        name: 'collect',
        beforeEnter,
        component: () => import(/* webpackChunkName: "collect" */ '../views/Collect.vue'),
    },
    {
        path: '/:poolId/checkout/:uuid',
        name: 'checkout',
        beforeEnter,
        component: () => import(/* webpackChunkName: "checkout" */ '../views/Checkout.vue'),
    },
    {
        path: '/:poolId/checkout/:uuid/complete',
        name: 'checkout_complete',
        beforeEnter,
        component: () => import(/* webpackChunkName: "checkoutcomplete" */ '../views/CheckoutComplete.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
});

export default router;

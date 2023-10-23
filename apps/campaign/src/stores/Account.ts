import { THXClient } from '@thxnetwork/sdk';
import { defineStore } from 'pinia';
import { API_URL } from '../config/secrets';
import { usePerkStore } from './Perk';
import { useRewardStore } from './Reward';
import { useWalletStore } from './Wallet';
import { track } from '@thxnetwork/mixpanel';
import { getStyles } from '../utils/theme';
import { useAuthStore } from './Auth';
import { getAccessTokenKindForPlatform, getConnectionStatus } from '../utils/social';
import { RewardConditionPlatform } from '../types/enums/rewards';
import { User } from 'oidc-client-ts';
import { AccountVariant } from '../types/enums/accountVariant';
import poll from 'promise-poller';

export const useAccountStore = defineStore('account', {
    state: (): TAccountState => ({
        poolId: '',
        isPreview: false,
        api: null,
        account: null,
        balance: 0,
        migration: null,
        subscription: null,
        isAuthenticated: null,
        isRewardsLoaded: false,
        isEthereumBrowser: window.ethereum && window.matchMedia('(pointer:coarse)').matches, // Feature only available on mobile devices
    }),
    actions: {
        getConfig: (poolId: string): TWidgetConfig => {
            const data = localStorage.getItem(`thx:widget:${poolId}:config`);
            if (!data) return {} as TWidgetConfig;
            return JSON.parse(data);
        },
        setConfig(poolId: string, config: TWidgetConfig) {
            const data = { ...this.getConfig(poolId), ...config };
            localStorage.setItem(`thx:widget:${poolId}:config`, JSON.stringify(data));
            this.poolId = poolId;
        },
        setTheme(config: TWidgetConfig) {
            const { title, theme } = config;
            const { elements, colors } = JSON.parse(theme);
            const sheet = getStyles(elements, colors);

            document.title = title;
            document.head.appendChild(sheet);
        },
        getTheme() {
            const { theme } = this.getConfig(this.poolId);
            return JSON.parse(theme);
        },
        async init(poolId: string, origin: string, isPreview: boolean) {
            this.api = new THXClient({ url: API_URL, accessToken: '', poolId });
            this.addEventListeners();
            this.setStatus(false);
            if (!poolId) return;

            this.poolId = poolId;
            this.isPreview = isPreview;

            const config = await this.api.request.get('/v1/widget/' + poolId);

            this.setConfig(this.poolId, { ...config, origin });
            this.setTheme(config);
            this.getUserData();

            track('UserVisits', [
                this.account?.sub || '',
                'page with widget',
                { origin: this.getConfig(poolId).origin, poolId },
            ]);

            if (window.top === window.self) {
                const { origin } = this.getConfig(this.poolId);
                track('UserOpens', [this.account?.sub || '', `widget iframe`, { origin, poolId, isShown: true }]);
            }
        },
        onLoad() {
            // debugger;
        },
        addEventListeners() {
            const authStore = useAuthStore();

            authStore.userManager.events.addUserLoaded(this.onUserLoaded);
            authStore.userManager.events.addUserUnloaded(this.onUserUnloaded);
            authStore.userManager.events.load(this.onLoad);
            authStore
                .getUser()
                .then(() => {
                    if (!authStore.user) {
                        this.setStatus(null);
                    }
                })
                .catch((error) => {
                    this.setStatus(null);
                    console.log(error);
                });
        },
        async onUserLoaded(user: User) {
            const authStore = useAuthStore();
            await authStore.onUserLoadedCallback(user);

            this.api.setAccessToken(user.access_token);
            if (this.poolId) {
                this.getUserData();
            } else {
                await this.getAccount();
                useWalletStore().getWallet();
            }
        },
        onUserUnloaded() {
            return useAuthStore().onUserUnloadedCallback();
        },
        async getAccount() {
            this.account = await this.api.request.get('/v1/account');
        },
        async getBalance() {
            const { balance } = await this.api.pointBalance.list();
            this.balance = balance;
        },
        async subscribe(email: string) {
            this.subscription = await this.api.pools.subscription.post({ poolId: this.poolId, email });

            const { origin } = this.getConfig(this.poolId);
            track('UserCreates', [this.account?.sub, 'pool subscription', { poolId: this.poolId, origin }]);
        },
        async unsubscribe() {
            await this.api.pools.subscription.delete(this.poolId);
            this.subscription = null;

            const { origin } = this.getConfig(this.poolId);
            track('UserCreates', [this.account?.sub, 'pool unsubscription', { poolId: this.poolId, origin }]);
        },
        async getSubscription() {
            this.subscription = await this.api.pools.subscription.get(this.poolId);
        },
        connect(platform: RewardConditionPlatform) {
            return useAuthStore().requestOAuthShare({
                prompt: 'connect',
                channel: String(platform),
                access_token_kind: String(getAccessTokenKindForPlatform(platform)),
            });
        },
        waitForConnectionStatus(platform: RewardConditionPlatform) {
            const taskFn = async () => {
                if (!this.account) return;
                await this.getAccount();

                return getConnectionStatus(this.account as unknown as { [accessKey: string]: boolean }, platform)
                    ? Promise.resolve()
                    : Promise.reject('Could no validate connection status...');
            };
            return poll({
                taskFn,
                interval: 3000,
                retries: 20, // 3s * 20 = 60s
            });
        },
        signin(extraQueryParams?: { [key: string]: string }) {
            this.setStatus(false);
            return useAuthStore().requestOAuthShare(extraQueryParams);
        },
        async signout() {
            const { signout } = useAuthStore();
            await signout();
            this.setStatus(null);
            this.account = null;
        },
        async migrate(body: { erc20Id?: string; erc721Id?: string; erc721TokenId?: string }) {
            await this.api.request.post('/v1/account/wallet/migrate', { body: JSON.stringify(body) });
        },
        async getUserData() {
            const rewardsStore = useRewardStore();
            const perksStore = usePerkStore();
            const walletStore = useWalletStore();
            const authStore = useAuthStore();

            rewardsStore.list().then(() => {
                const amount = rewardsStore.quests.filter((r: any) => !r.isClaimed).length;

                this.isRewardsLoaded = true;

                // Send the amount of unclaimed rewards to the parent window and update the launcher
                this.postMessage({ message: 'thx.reward.amount', amount });
            });
            perksStore.list();

            // Guard HTTP requests that do require auth
            if (!authStore.oAuthShare) return;

            await this.getAccount();

            if (this.account && this.account.variant !== AccountVariant.Metamask) {
                authStore.getPrivateKey();
            }

            await Promise.all([this.getBalance(), this.getSubscription(), walletStore.getWallet()]);

            walletStore.list();

            this.setStatus(true);
        },
        setStatus(isAuthenticated: boolean | null) {
            this.isAuthenticated = isAuthenticated;
            this.postMessage({ message: 'thx.auth.status', isAuthenticated });

            if (isAuthenticated) {
                track('UserSignsIn', [this.account, { origin, poolId: this.poolId }]);
            }
        },
        postMessage(payload: any) {
            const { origin } = this.getConfig(this.poolId);
            if (origin && window.self !== window.top) {
                window.top?.postMessage(payload, origin);
            }
        },
        async updateAccountAddress() {
            const hasPrivateKey = useAuthStore().privateKey;
            if (!hasPrivateKey) return;

            // Patch the account with the MPC address
            const authRequestMessage = 'validate_account_address_ownership';
            const authRequestSignature = await useAuthStore().sign(authRequestMessage);
            await this.api.account.patch({ authRequestMessage, authRequestSignature });
            if (this.account) this.account.address = useAuthStore().wallet.address;
        },
    },
});

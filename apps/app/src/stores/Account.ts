import { API_URL, AUTH_URL, SUPABASE_PUBLIC_KEY, SUPABASE_URL } from '../config/secrets';
import { DEFAULT_COLORS, DEFAULT_ELEMENTS, getStyles } from '../utils/theme';
import { defineStore } from 'pinia';
import { track } from '@thxnetwork/common/mixpanel';
import { THXBrowserClient } from '@thxnetwork/sdk/clients';
import { BREAKPOINT_LG } from '../config/constants';
import { useAuthStore } from './Auth';
import { OAuthScopes } from '../utils/social';
import { AccessTokenKind } from '../types/enums/accessTokenKind';
import { decodeHTML } from '../utils/decode-html';
import { useWalletStore } from './Wallet';
import { createClient, Provider, Session } from '@supabase/supabase-js';
import poll from 'promise-poller';

// Feature only available on mobile devices
const isMobileDevice = !!window.matchMedia('(pointer:coarse)').matches;

// Create Supabase client for authentication
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);

export const useAccountStore = defineStore('account', {
    state: (): TAccountState => ({
        session: null,
        poolId: '',
        isPreview: false,
        api: null,
        account: null,
        invite: null,
        balance: 0,
        config: {},
        css: null,
        subscription: null,
        leaderboard: [],
        participants: [],
        windowHeight: 0,
        isSidebarShown: false,
        isAuthenticated: null,
        isModalAccountShown: false,
        isModalWalletShown: false,
        isIFrame: window.top !== window.self,
        isMobile: window.innerWidth < BREAKPOINT_LG,
        isMobileDevice: isMobileDevice,
        isMobileIFrame: window.top !== window.self && isMobileDevice,
        isMobileEthereumBrowser: window.ethereum && isMobileDevice,
    }),
    actions: {
        setGlobals(config: { activeWalletId: string }) {
            config = { ...this.globals(), ...config };
            const storageString = JSON.stringify(config);
            localStorage.setItem('thx:app:config', storageString);
        },
        globals(): Partial<TAccountGlobals> {
            const storedString = localStorage.getItem('thx:app:config');
            if (!storedString) return {};
            return JSON.parse(storedString);
        },
        setConfig(poolId: string, config: TWidgetConfig) {
            this.poolId = poolId;
            this.config = { ...this.config, ...config };
        },
        setTheme(config: TWidgetConfig) {
            const { title, theme } = config;
            const { elements, colors } = JSON.parse(theme);
            const css = getStyles(elements, colors);
            document.title = decodeHTML(title) as string;
            this.css = document.head.appendChild(css);
        },
        async getInvite(code: string) {
            if (this.invite && this.invite.code.code === code) return;
            this.invite = await this.api.request.get(`/v1/invites/${code}`);
        },
        reset() {
            this.poolId = '';
            this.participants = [];
            this.api.setCampaignId('');
            this.setTheme({
                title: 'THX Network',
                theme: JSON.stringify({ elements: DEFAULT_ELEMENTS, colors: DEFAULT_COLORS }),
            } as TWidgetConfig);
            this.config = {};
        },
        getTheme() {
            return JSON.parse(this.config.theme);
        },
        async init(slug: string, origin: string) {
            if (!this.api) {
                this.api = new THXBrowserClient({
                    apiUrl: API_URL,
                    authUrl: AUTH_URL,
                } as any);
                this.setAuthListener();
                this.setStatus(false);
                this.getUserData();
            }

            if (!slug) return;

            const config = await this.api.request.get('/v1/widget/' + slug);
            this.poolId = config.poolId;
            this.api.setCampaignId(this.poolId);

            this.setConfig(config.poolId, { ...config, origin });
            this.setTheme(config);
        },
        setAuthListener() {
            supabase.auth.onAuthStateChange((event, session) => {
                console.log(event, session);
                if (event === 'INITIAL_SESSION') {
                    // handle initial session
                    if (session) this.setSession(session);
                } else if (event === 'SIGNED_IN') {
                    // handle sign in event
                    if (session) this.setSession(session);
                } else if (event === 'SIGNED_OUT') {
                    // handle sign out event
                } else if (event === 'PASSWORD_RECOVERY') {
                    // handle password recovery event
                } else if (event === 'TOKEN_REFRESHED') {
                    // handle token refreshed event
                } else if (event === 'USER_UPDATED') {
                    // handle user updated event
                }
            });
        },
        setSession(session: Session) {
            this.isAuthenticated = true;
            this.api.request.setUser(session);
        },
        onResize() {
            this.isMobile = window.innerWidth < BREAKPOINT_LG;
            this.windowHeight = window.innerHeight;
        },
        isSubscribed(id: string) {
            return this.participants.find((p) => p.poolId === id)?.isSubscribed;
        },
        async getAccount() {
            this.account = await this.api.request.get('/v1/account');
            if (
                this.account &&
                (!this.account.username || this.account.profileImg.startsWith('https://api.dicebear.com'))
            ) {
                this.isModalAccountShown = true;
            }
        },
        async getParticipants(poolId?: string) {
            const params: { poolId?: string } = {};
            if (poolId) params['poolId'] = poolId;
            if (this.poolId) params['poolId'] = this.poolId;

            this.participants = await this.api.request.get('/v1/participants', { params });
        },
        async updateParticipant({ email, isSubscribed }: Partial<TParticipant> & { email: string }) {
            const participant = this.participants.find((p) => p.poolId === this.poolId);
            if (!participant) return;

            await this.api.request.patch(`/v1/participants/${participant._id}`, {
                data: { isSubscribed, email },
            });

            this.getParticipants();

            // If isSubscribed is a boolean, then track the event
            if (typeof isSubscribed === 'boolean') {
                track('UserCreates', [
                    this.account?.sub,
                    isSubscribed ? 'pool subscription' : 'pool unsubscription',
                    { poolId: this.poolId },
                ]);
            }
        },
        connect(kind: AccessTokenKind, scopes: TOAuthScope[]) {
            return useAuthStore().signin({
                prompt: 'connect',
                access_token_kind: kind,
                provider_scope: scopes.join(' '),
            });
        },
        disconnect(kind: AccessTokenKind) {
            return this.api.request.post('/v1/account/disconnect', { data: { kind } });
        },
        async verifyOtp({ email, token }: { email: string; token: string }) {
            await supabase.auth.verifyOtp({
                email,
                token,
                type: 'email',
            });
        },
        async getSession() {
            const { data, error } = await supabase.auth.getSession();
        },
        async signInWithOtp({ email }: { email: string }) {
            this.setStatus(false);
            await supabase.auth.signInWithOtp({
                email,
                options: {
                    shouldCreateUser: false,
                    // emailRedirectTo: window.location.href, // User for magic links
                },
            });
        },
        async signInWithOAuth({ provider }: { provider: string }) {
            this.setStatus(false);
            await supabase.auth.signInWithOAuth({
                provider: provider as Provider,
                options: {
                    scopes: OAuthScopes[provider].join(' '),
                    redirectTo: window.location.href,
                    // skipBrowserRedirect?: boolean; // Use this to create a popup for a URL from in case called from an iframe
                },
            });
        },
        async signout() {
            const walletStore = useWalletStore();
            walletStore.wallet = null;
            await walletStore.disconnect();

            await supabase.auth.signOut();
            this.setStatus(null);
            this.account = null;
        },
        async getUserData() {
            const { user } = useAuthStore();
            this.setStatus(!!user);
        },
        setStatus(isAuthenticated: boolean | null) {
            this.isAuthenticated = isAuthenticated;
            this.postMessage({ message: 'thx.auth.status', isAuthenticated });

            if (isAuthenticated) {
                track('UserSignsIn', [this.account, { origin, poolId: this.poolId }]);
            }
        },
        postMessage(payload: any) {
            if (this.config.origin && window.self !== window.top) {
                window.top?.postMessage(payload, this.config.origin);
            }
        },
        async update(
            payload: Partial<{
                username: string;
                email: string;
                profileImg: string;
                authRequestMessage: string;
                authRequestSignature: string;
            }>,
        ) {
            await this.api.account.patch(payload);
            this.account = { ...this.account, ...(payload as any) };
        },
        async upload(file: File) {
            const body = new FormData();
            body.append('file', file);

            const { publicUrl } = await this.api.request.put('/v1/upload', {
                headers: {
                    'Content-Type': undefined,
                },
                data: body,
            });
            return publicUrl;
        },
        async connectIdentity() {
            const identity = this.getIdentity();
            if (!identity) return;

            try {
                await this.api.request.patch(`/v1/identity/${identity}`);
                window.sessionStorage.removeItem(`thx:${this.poolId}:id`);
            } catch (error) {
                console.error(error);
            }
        },
        storeIdentity(identity: string) {
            window.sessionStorage.setItem(`thx:${this.poolId}:id`, identity);
        },
        getIdentity() {
            return window.sessionStorage.getItem(`thx:${this.poolId}:id`);
        },
        async getLeaderboard() {
            if (!this.poolId) return;
            this.leaderboard = await this.api.request.get(`/v1/leaderboards/${this.poolId}`);
        },
        async waitForJob(jobId: string) {
            const taskFn = async () => {
                const job = await this.api.request.get(`/v1/jobs/${jobId}`);
                return job && !!job.lastFinishedAt ? Promise.resolve() : Promise.reject('Job not finished');
            };

            // Poll for job to finish
            await poll({ taskFn, interval: 1000, retries: 60 });
        },
    },
});

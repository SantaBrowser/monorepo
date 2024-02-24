declare module 'color';

type TSubscription = {
    sub: string;
    poolId: string;
};

type TAccount = {
    username: string;
    sub: string;
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    plan: number;
    variant: AccountVariant;
    profileImg: string;
    rank: number;
    isEmailVerified?: boolean;
    tokens: { kind: AccessTokenKind; userId: string; scopes: string[] }[];
};

type TAuthState = {
    wallet: Wallet;
    isModalLoginShown: boolean;
    isDeviceShareAvailable: boolean | null;
    isSecurityQuestionAvailable: boolean | null;
    userManager: UserManager;
    user: Partial<User> | null;
    privateKey: string;
    oAuthShare: string;
    securityQuestion: string;
};

type TParticipant = {
    sub: string;
    balance: number;
    rank: number;
    score: number;
    questEntriesCompleted: number;
};

type TAccountGlobals = {
    activeWalletId: string;
};

type TAccountState = {
    css: HTMLStyleElement | null;
    isAuthenticated: boolean | null;
    isIFrame: boolean;
    isMobile: boolean;
    isMobileDevice: boolean;
    isMobileIFrame: boolean;
    isMobileEthereumBrowser: boolean;
    isPreview: boolean;
    isSidebarShown: boolean;
    isModalAccountShown: boolean;
    isModalWalletShown: boolean;
    windowHeight: number;
    config: any;
    api: THXClient | null;
    poolId: string;
    balance: number;
    account: TAccount | null;
    subscription: TSubscription | null;
    participants: TParticipant[];
    leaderboard: { score: number; wallet: TWallet; questsCompleted: number; account: TAccount }[];
};

type TWidgetTheme = {
    elements: { [key]: { color: string; label: string } };
    colors: { [key]: { color: string; label: string } };
};

type TWidgetConfig = {
    poolId: string;
    origin: string;
    chainId: number;
    theme: string;
    title: string;
    logoUrl: string;
    returnUrl: string;
    backgroundUrl: string;
    ref?: string;
};

type TOAuthScope = OAuthGoogleScope | OAuthTwitterScope | OAuthDiscordScope | OAuthTwitchScope | OAuthGithubScope;

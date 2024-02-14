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
    isDeviceShareAvailable: boolean | null;
    isSecurityQuestionAvailable: boolean | null;
    userManager: UserManager;
    user: Partial<User> | null;
    privateKey: string;
    oAuthShare: string;
    securityQuestion: string;
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
    api: THXClient | null;
    poolId: string;
    migration: {
        wallet: TWallet;
        erc20Tokens: TERC20Token[];
        erc721Tokens: TERC721Token[];
    } | null;
    balance: number;
    account: TAccount | null;
    subscription: TSubscription | null;
    config: any;
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
    expired: boolean;
};

type TOAuthScope = OAuthGoogleScope | OAuthTwitterScope | OAuthDiscordScope | OAuthTwitchScope | OAuthGithubScope;

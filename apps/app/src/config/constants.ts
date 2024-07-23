export const BALANCER_POOL_ID = '0xb204bf10bc3a5435017d3db247f56da601dfe08a0002000000000000000000fe';
export const MAX_LOCK_TIME = 7776000;
export const BREAKPOINT_LG = 992;
export const contractNetworks = {
    '31337': {
        // Safe
        simulateTxAccessorAddress: '0x278Ff6d33826D906070eE938CDc9788003749e93',
        safeProxyFactoryAddress: '0xEAB9a65eB0F098f822033192802B53EE159De5F0',
        fallbackHandlerAddress: '0x055cBfeD6df4AFE2452b18fd3D2592D1795592b4',
        createCallAddress: '0xb63564A81D5d4004F4f22E9aB074cE25540B0C26',
        multiSendAddress: '0x50aF0922d65D04D87d810048Dc640E2474eBfbd9',
        multiSendCallOnlyAddress: '0x15FC0878406CcF4d2963235A5B1EF68C67F17Ee5',
        signMessageLibAddress: '0xa4E84979c95cD4f12C53E73d63E0A8634A1f44Ae',
        safeMasterCopyAddress: '0xd916a690676e925Ac9Faf2d01869c13Fd9757ef2',

        // Tokens
        THX: '0xB952d9b5de7804691e7936E88915A669B15822ef',
        USDC: '0x7150A3CC09429583471020A6CE5228A57736180a',
        BAL: '0xe1c01805a21ee0DC535afa93172a5F21CE160649',
        BPT: '0xf228ADAa4c3D07C8285C1025421afe2c4F320C59',
        BPTGauge: '0x8613B8E442219e4349fa5602C69431131a7ED114',
        BalancerVault: '0x8B219D3d1FC64e03F6cF3491E7C7A732bF253EC8',

        // veTHX
        VotingEscrow: '0x1280809d06C42E68063305235813e52c8Bb03a58',
        RewardDistributor: '0xd0507c5363AeCfe8231FF4110e05AFf611d7F7B6',
        RewardFaucet: '0x33599eaec2752DB3242323483A7313bA3b1111cd',
        SmartWalletWhitelist: '0xb3B2b0fc5ce12aE58EEb13E19547Eb2Dd61A79D5',
        LensReward: '0x774442713f32fa98bf27bEc78c96fb7186f7C223',

        // Company
        THXRegistry: '0x0Bb5Cb54566cEEf9dF1F60d8D7d2Fd01eA88279e',
        THXPaymentSplitter: '0x58C0e64cBB7E5C7D0201A3a5c2D899cC70B0dc4c',

        CompanyMultiSig: '0xaf9d56684466fcFcEA0a2B7fC137AB864d642946',
    },
    '11155111': {
        // Safe
        safeSingletonAddress: '0x69f4D1788e39c87893C980c06EdF4b7f686e2938',
        simulateTxAccessorAddress: '0x727a77a074D1E6c4530e814F89E618a3298FC044',
        safeProxyFactoryAddress: '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
        fallbackHandlerAddress: '0x017062a1dE2FE6b99BE3d9d37841FeD19F573804',
        createCallAddress: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
        multiSendAddress: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
        multiSendCallOnlyAddress: '0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B',
        signMessageLibAddress: '0x98FFBBF51bb33A056B08ddf711f289936AafF717',
        // Tokens
        BPT: '0xDE13D18a351a535cB04503FbFaf8c37EB1581567',
        BPTGauge: '0x5b48cdd1C5e029DdC63861698a203c7764e03a2e',
        BalancerVault: '0x1FaD7443F9668e49f01bA90E3Ae959625A139fC6',
        BAL: '0x2829557Bf26525D690457497f0d2F19960ab2f99',
        USDC: '0x026af5D52D0fB1B5A1FF41BE7e59A45c7D3dF9d7',
        THX: '0x90Ac3DBe1F3df817d43a8De3a685a7512EDE3a77',

        // veTHX
        VotingEscrow: '0x4E937771Ba4bb93014e3B162E6b935bE205B1f41',
        RewardDistributor: '0xD39f51cdeab23D9aC2121925292863e1D1C8dE92',
        RewardFaucet: '0xf5582f4EA07348f4c35Fb00f12BDefDe2207477E',
        SmartWalletWhitelist: '0x876625a92cEAa7f1Bddd40908B8eb5C6080cB83C',
        LensReward: '0xE8D9624E0B7f839540E7c13577550E3Eff3FC8aA',

        // Company
        THXRegistry: '',
        THXPaymentSplitter: '',
        CompanyMultiSig: '0x0b8e0aAF940cc99EDA5DA5Ab0a8d6Ed798eDc08A',
    },
    '137': {
        // Tokens
        BPT: '0xb204BF10bc3a5435017D3db247f56dA601dFe08A',
        BPTGauge: '0xf16BECC1Bcaf0fF0b865024a644a4da1A2f8585c',
        BalancerVault: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
        BAL: '0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3',
        USDC: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        THX: '0x2934b36ca9A4B31E633C5BE670C8C8b28b6aA015',

        // veTHX
        VotingEscrow: '0xE3B8E734e7BCcB64B63e032795896CC57012A51D',
        RewardDistributor: '0xCc62c812EfF9cA4c35623103B2Bb63E22f465E09',
        RewardFaucet: '0xA1D7671f73FbcB5e079d4dC4Cffb7dDD0967EA7E',
        SmartWalletWhitelist: '0x876625a92cEAa7f1Bddd40908B8eb5C6080cB83C',
        LensReward: '0xE8D9624E0B7f839540E7c13577550E3Eff3FC8aA',

        // Company
        THXRegistry: '',
        THXPaymentSplitter: '',
        CompanyMultiSig: '0x0b8e0aAF940cc99EDA5DA5Ab0a8d6Ed798eDc08A',
    },
    '1': {
        BalancerGaugeController: '0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD',
        BalancerRootGauge: '0x9902913ce5439d667774c8f9526064b2bc103b4a',
    },
} as any;

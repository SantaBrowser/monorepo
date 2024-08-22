// Safe
import DefaultCallbackHandler from './export/DefaultCallbackHandler.json';
import CreateCall from './export/CreateCall.json';
import GnosisSafeL2 from './export/GnosisSafeL2.json';
import GnosisSafeProxyFactory from './export/GnosisSafeProxyFactory.json';
import MultiSend from './export/MultiSend.json';
import MultiSendCallOnly from './export/MultiSendCallOnly.json';
import SignMessageLib from './export/SignMessageLib.json';
import SimulateTxAccessor from './export/SimulateTxAccessor.json';
// Balancer
import USDC from './export/USDC.json';
import THX from './export/THX.json';
import BPT from './export/BPT.json';
import BPTGauge from './export/BPTGauge.json';
import BalancerVault from './export/BalancerVault.json';
import BalancerMinter from './export/BalancerMinter.json';
import BalancerGaugeController from './export/BalancerGaugeController.json';
import BAL from './export/BAL.json';
import Launchpad from './export/Launchpad.json';
// Tokens
import THXERC20_LimitedSupply from './export/THXERC20_LimitedSupply.json';
import THXERC20_UnlimitedSupply from './export/THXERC20_UnlimitedSupply.json';
import THXERC721 from './export/THXERC721.json';
import THXERC1155 from './export/THXERC1155.json';
// Protocol
import THXPaymentSplitter from './export/THXPaymentSplitter.json';
import THXRegistry from './export/THXRegistry.json';
import VotingEscrow from './export/VotingEscrow.json';
import RewardDistributor from './export/RewardDistributor.json';
import RewardFaucet from './export/RewardFaucet.json';
import SmartWalletWhitelist from './export/SmartWalletWhitelist.json';
import LensReward from './export/LensReward.json';
import SafeWallet from './export/SafeWallet.json';

export const getArtifact = (contractName: TContractName) => {
    if (!contractArtifacts[contractName]) {
        throw new Error(`Contract ${contractName} not found in contractArtifacts`);
    }
    return contractArtifacts[contractName];
};

export const contractNetworks = {
    // Hardhat
    '31337': {
        // Safe
        simulateTxAccessorAddress: '0xBe900568F856c024a96Ea757c4Bb59A84C0feD1e',
        safeProxyFactoryAddress: '0xAdB96Fce55cdAabb6D8155093b440b4Fe5bADf34',
        fallbackHandlerAddress: '0x1a111e50fAd935C19E54b70841b36981a99b0a08',
        createCallAddress: '0xD44Af1f90B3dAe2Dd7C7C4189Ce6171Adb7F09a0',
        multiSendAddress: '0xd9e8E1ee7ea3B823347B4A031B7025CB76d3FC7c',
        multiSendCallOnlyAddress: '0xB90DaC4562A7451389d5c46f97363de286747773',
        signMessageLibAddress: '0x6a19bf92CA00FfFbfbf72c320A201Ad05a0800dB',
        safeMasterCopyAddress: '0x8b861ecB0231F698511745A597ffdF580C8A676d',

        // Tokens
        THX: '0x0e225E554f7B4D81F3cff9921f7065b921B90DbE',
        USDC: '0xEac6eeAa25873bF4e89a797B50a5a0f2cd956B65',
        BAL: '0xe400acDCddcD569C847710DC4b85795335B10E76',
        BPT: '0xDD2Da6d1345D1aa2F9F4AEade0204582aD21df2B',
        BPTGauge: '0x79f2ddCd9f94b46D6Bf66331F9D250cE20EFFE9E',
        BalancerVault: '0x8D237e28431911BC320430771cB11A231916873b',

        // veTHX
        VotingEscrow: '0xc5535aC62e1De7e8095A196149a9AB90ac3663b9',
        RewardDistributor: '0x9F1bBD3b552382CF6080ad94B27920eDC3617C15',
        RewardFaucet: '0xe943fb53A96e767AbB935A5314809fCAF4Ab0652',
        SmartWalletWhitelist: '0x866cf08660ef059FC644CFc19a98d73726963a5E',
        LensReward: '0x34b9F8c17FD543708356c966e593a44bb3601fc3',

        // Company
        THXRegistry: '0x6123Bb1df6380687458E3c67f7F3431A0E601c1E',
        THXPaymentSplitter: '0xB0ABe932009C221b97F4014870322Ec59E2259F8',

        CompanyMultiSig: '0x51A68B7625450D95b41C3fD880aaDF12dF078539',
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
    // Metis
    '1088': {
        simulateTxAccessorAddress: '0x727a77a074D1E6c4530e814F89E618a3298FC044',
        safeProxyFactoryAddress: '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC',
        fallbackHandlerAddress: '0x017062a1dE2FE6b99BE3d9d37841FeD19F573804',
        createCallAddress: '0xB19D6FFc2182150F8Eb585b79D4ABcd7C5640A9d',
        multiSendAddress: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
        multiSendCallOnlyAddress: '0xA1dabEF33b3B82c7814B6D82A79e50F4AC44102B',
        signMessageLibAddress: '0x98FFBBF51bb33A056B08ddf711f289936AafF717',
        safeMasterCopyAddress: '0xfb1bffC9d739B8D520DaF37dF666da4C687191EA',
    },
    // Linea
    '59144': {
        // Safe
        simulateTxAccessorAddress: '0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da',
        safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        fallbackHandlerAddress: '0x1AC114C2099aFAf5261731655Dc6c306bFcd4Dbd',
        createCallAddress: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
        signMessageLibAddress: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
        safeMasterCopyAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
    },
    // Polygon
    '137': {
        //Safe
        safeMasterCopyAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        safeSingletonAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        simulateTxAccessorAddress: '0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da',
        safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        fallbackHandlerAddress: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        createCallAddress: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
        signMessageLibAddress: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
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
    '42161': {
        //Safe
        safeMasterCopyAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        safeSingletonAddress: '0x3E5c63644E683549055b9Be8653de26E0B4CD36E',
        simulateTxAccessorAddress: '0x59AD6735bCd8152B84860Cb256dD9e96b85F69Da',
        safeProxyFactoryAddress: '0xa6B71E26C5e0845f74c812102Ca7114b6a896AB2',
        fallbackHandlerAddress: '0xf48f2B2d2a534e402487b3ee7C18c33Aec0Fe5e4',
        createCallAddress: '0x7cbB62EaA69F79e6873cD1ecB2392971036cFAa4',
        multiSendAddress: '0xA238CBeb142c10Ef7Ad8442C6D1f9E89e07e7761',
        multiSendCallOnlyAddress: '0x40A2aCCbd92BCA938b02010E17A5b8929b49130D',
        signMessageLibAddress: '0xA65387F16B013cf2Af4605Ad8aA5ec25a2cbA3a2',
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
} as unknown as { [chainId: string]: any } as any;

export type TContractName = (typeof contractNames)[number];

export const contractArtifacts: { [contractName: string]: { abi: any; bytecode: string } } = {
    // Safe
    DefaultCallbackHandler,
    CreateCall,
    GnosisSafeL2,
    GnosisSafeProxyFactory,
    MultiSend,
    MultiSendCallOnly,
    SignMessageLib,
    SimulateTxAccessor,
    // Balancer
    USDC,
    THX,
    BPT,
    BPTGauge,
    BalancerVault,
    BalancerMinter,
    BalancerGaugeController,
    BAL,
    Launchpad,
    // Tokens
    THXERC20_LimitedSupply,
    THXERC20_UnlimitedSupply,
    THXERC721,
    THXERC1155,
    // Protocol
    THXPaymentSplitter,
    THXRegistry,
    VotingEscrow,
    RewardDistributor,
    RewardFaucet,
    SmartWalletWhitelist,
    LensReward,
    SafeWallet,
};

export const contractNames = [
    // Safe
    'DefaultCallbackHandler',
    'CreateCall',
    'GnosisSafeL2',
    'GnosisSafeProxyFactory',
    'MultiSend',
    'MultiSendCallOnly',
    'SignMessageLib',
    'SimulateTxAccessor',
    // Balancer
    'USDC',
    'THX',
    'BPT',
    'BPTGauge',
    'BalancerVault',
    'BalancerMinter',
    'BalancerGaugeController',
    'BAL',
    'Launchpad',
    // Tokens
    'THXERC20_LimitedSupply',
    'THXERC20_UnlimitedSupply',
    'THXERC721',
    'THXERC1155',
    // Protocol
    'THXPaymentSplitter',
    'THXRegistry',
    'VotingEscrow',
    'RewardDistributor',
    'RewardFaucet',
    'SmartWalletWhitelist',
    'LensReward',
    'SafeWallet'
] as const;

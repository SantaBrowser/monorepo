import { ContractNetworksConfig } from '@safe-global/protocol-kit';
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
// import THXPaymentSplitter from './export/THXPaymentSplitter.json';
import THXRegistry from './export/THXRegistry.json';
import VotingEscrow from './export/VotingEscrow.json';
import RewardDistributor from './export/RewardDistributor.json';
import RewardFaucet from './export/RewardFaucet.json';
import SmartWalletWhitelist from './export/SmartWalletWhitelist.json';

export const getArtifact = (contractName: TContractName) => {
    if (!contractArtifacts[contractName]) {
        throw new Error(`Contract ${contractName} not found in contractArtifacts`);
    }
    return contractArtifacts[contractName];
};

export type TContractName = (typeof contractNames)[number];

export const contractArtifacts: { [contractName: string]: { abi: any; bytecode: string } } = {
    THXERC20_LimitedSupply,
    THXERC20_UnlimitedSupply,
};

export const contractNames = [
    'THXERC20_LimitedSupply',
    'THXERC20_UnlimitedSupply',
] as const;

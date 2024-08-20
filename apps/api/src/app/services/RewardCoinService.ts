import {
    ERC20,
    ERC20Document,
    RewardCoin,
    RewardCoinDocument,
    RewardCoinPaymentDocument,
    Transaction,
    WalletDocument,
} from '@thxnetwork/api/models';
import { RewardCoinPayment } from '@thxnetwork/api/models';
import { IRewardService } from './interfaces/IRewardService';
import { ChainId, ERC20Type, TransactionState } from '@thxnetwork/common/enums';
import { BigNumber } from 'alchemy-sdk';
import { parseUnits } from 'ethers/lib/utils';
import AccountProxy from '../proxies/AccountProxy';
import ERC20Service from './ERC20Service';
import MailService from './MailService';
import PoolService from './PoolService';
import SafeService from './SafeService';
import AptosService from './AptosService';
import SuiService from './SuiService';
import { AptosClient, TxnBuilderTypes, BCS, TypeTagParser } from "aptos";
import { SuiClient } from "@mysten/sui/client";
import { coinWithBalance, Transaction as SuiTransaction} from '@mysten/sui/transactions';
import { MultiSigPublicKey } from '@mysten/sui/multisig';
import { APTOS_NODE_URL, SUI_NODE_URL } from '../config/secrets';
import NetworkService from './NetworkService';
import { logger } from '../util/logger';

const { AccountAddress, EntryFunction, MultiSig, MultiSigTransactionPayload, TransactionPayloadMultisig } =
  TxnBuilderTypes;

export default class RewardCoinService implements IRewardService {
    models = {
        reward: RewardCoin,
        payment: RewardCoinPayment,
    };

    async decorate({ reward }) {
        const erc20 = await ERC20.findById(reward.erc20Id);
        return { ...reward.toJSON(), erc20 };
    }

    async decoratePayment(payment: RewardCoinPaymentDocument) {
        return payment.toJSON();
    }

    findById(id: string) {
        return this.models.reward.findById(id);
    }

    async create(data: Partial<TRewardCoin>) {
        const erc20 = await this.getERC20(data.erc20Id);
        await this.addMinter(erc20, data.poolId);

        return await this.models.reward.create(data);
    }

    async update(reward: RewardCoinDocument, updates: Partial<TRewardCoin>) {
        const erc20 = await this.getERC20(updates.erc20Id);
        await this.addMinter(erc20, reward.poolId);

        return await this.models.reward.findByIdAndUpdate(reward._id, updates, { new: true });
    }

    async remove(reward: RewardCoinDocument) {
        await this.models.reward.findOneAndDelete(reward._id);
    }

    async createPayment({ reward, wallet }: { reward: TRewardCoin; wallet?: WalletDocument }) {
        if (!wallet) return { result: false, reason: 'Wallet not found' };

        const erc20 = await ERC20.findById(reward.erc20Id);
        if (!erc20) return { result: false, reason: 'ERC20 not found' };

        const pool = await PoolService.getById(reward.poolId);
        const safe = await SafeService.findOneByPool(pool, erc20.chainId);
        if (!safe) return { result: false, reason: 'Safe not found' };

        if (erc20.chainId == ChainId.Aptos) {
            const client = new AptosClient(APTOS_NODE_URL);
            const [, , decimals] = await AptosService.getCoinInfo(erc20.address);
            const { signer } = NetworkService.getProvider(erc20.chainId);
            const transferTxPayload = new MultiSigTransactionPayload(
                EntryFunction.natural(
                  "0x1::aptos_account",
                  "transfer_coins",
                  [new TypeTagParser(erc20.address).parseTypeTag()],
                  [BCS.bcsToBytes(AccountAddress.fromHex(wallet.address)), BCS.bcsSerializeUint64(reward.amount * 10 ** decimals)],
                ),
            );
            const multisigTxExecution = new TransactionPayloadMultisig(
                new MultiSig(AccountAddress.fromHex(safe.address), transferTxPayload),
            );
            // We can simulate the transaction to see if it will succeed without having to create it on chain.
            const [simulationResp] = await client.simulateTransaction(
                signer,
                await client.generateRawTransaction(signer.address(), multisigTxExecution),
            );
            
              // Create the multisig tx on chain.
            const createMultisigTx = await client.generateTransaction(signer.address(), {
                function: "0x1::multisig_account::create_transaction",
                type_arguments: [],
                arguments: [safe.address, BCS.bcsToBytes(transferTxPayload)],
            });
            await client.generateSignSubmitWaitForTransaction(signer, createMultisigTx.payload);
            
            await client.generateSignSubmitWaitForTransaction(signer, multisigTxExecution);

            logger.debug("Safe TX Executed");
        }
        else if (erc20.chainId == ChainId.Sui) {
            const client = new SuiClient({ url: SUI_NODE_URL });
            const [, , decimals] = await SuiService.getCoinInfo(erc20.address);
            const { signer } = NetworkService.getProvider(erc20.chainId);
            const tx = new SuiTransaction();
            tx.transferObjects([
                coinWithBalance({ balance: reward.amount * 10 ** Number(decimals), type: erc20.address }),
            ], wallet.address);
            tx.setSender(safe.address);
            const bytes = await tx.build({ client: client });
            const signature = (await signer.signTransaction(bytes)).signature;
            const multiSigPublicKey = MultiSigPublicKey.fromPublicKeys({
                threshold: 1,
                publicKeys: [
                    {
                        publicKey: signer.getPublicKey(),
                        weight: 1,
                    },
                ],
            });
            const combinedSignature = multiSigPublicKey.combinePartialSignatures([signature]);
            const result = await client.executeTransactionBlock({
                transactionBlock: bytes,
                signature: combinedSignature,
                requestType: 'WaitForLocalExecution',
                options: {
                    showEffects: true,
                },
            });
            logger.debug("Safe TX Executed");
        }
        else {
            // TODO Wei should be determined in the FE
            const decimals = await erc20.contract.methods.decimals().call();
            const amount = parseUnits(reward.amount, decimals).toString();

            // Transfer ERC20 from safe to wallet
            await ERC20Service.transferFrom(erc20, safe, wallet.address, amount);
        }

        // Register the payment
        await RewardCoinPayment.create({
            walletId: wallet.id,
            rewardId: reward.id,
            sub: wallet.sub,
            poolId: reward.poolId,
            amount: reward.pointPrice,
        });
    }

    async getValidationResult({ reward, wallet }: { reward: RewardCoinDocument; wallet: WalletDocument }) {
        if (!wallet) return { result: false, reason: `No wallet provided for this reward transfer.` };

        // Check if wallet exists
        if (!wallet) {
            return { result: false, reason: 'Your wallet is not found. Please try again.' };
        }

        const erc20 = await ERC20.findById(reward.erc20Id);
        if (!erc20) return { result: false, reason: `ERC20 not found.` };

        const pool = await PoolService.getById(reward.poolId);
        const safe = await SafeService.findOneByPool(pool, erc20.chainId);
        if (!safe) return { result: false, reason: 'Campaign Safe is no longer available for this network' };

        // Check if there are pending transactions that are not mined or failed.
        const txs = await Transaction.find({
            walletId: safe.id,
            $or: [
                { state: TransactionState.Confirmed },
                { state: TransactionState.Sent },
                { state: TransactionState.Queued },
            ],
        }).sort({ createdAt: 'asc' });
        if (txs.length) {
            return { result: false, reason: `Found ${txs.length} pending transactions, please try again later.` };
        }

        // Check balances
        if (erc20.chainId == ChainId.Aptos) {
            const balanceOfPool = await AptosService.getCoinBalance(safe.address, erc20.address);
            const [, , decimals] = await AptosService.getCoinInfo(erc20.address);
            if (balanceOfPool < reward.amount * 10 ** decimals) {
                const owner = await AccountProxy.findById(safe.sub);
                const html = `Not enough ${erc20.symbol} available in campaign contract ${safe.address}. Please top up on ${
                    ChainId[erc20.chainId]
                }`;

                // Send email to campaign owner
                await MailService.send(owner.email, `⚠️ Out of ${erc20.symbol}!"`, html);

                return {
                    result: false,
                    reason: `We have notified the campaign owner that there is insufficient ${erc20.symbol} in the campaign wallet. Please try again later!`,
                };
            }
        }
        else if (erc20.chainId == ChainId.Sui) {
            const balanceOfPool = await SuiService.getCoinBalance(safe.address, erc20.address);
            const [, , decimals] = await SuiService.getCoinInfo(erc20.address);
            if (Number(balanceOfPool) < reward.amount * 10 ** Number(decimals)) {
                const owner = await AccountProxy.findById(safe.sub);
                const html = `Not enough ${erc20.symbol} available in campaign contract ${safe.address}. Please top up on ${
                    ChainId[erc20.chainId]
                }`;

                // Send email to campaign owner
                await MailService.send(owner.email, `⚠️ Out of ${erc20.symbol}!"`, html);

                return {
                    result: false,
                    reason: `We have notified the campaign owner that there is insufficient ${erc20.symbol} in the campaign wallet. Please try again later!`,
                };
            }
        }
        else {
            const balanceOfPool = await erc20.contract.methods.balanceOf(safe.address).call();
            const isTransferable = [ERC20Type.Unknown, ERC20Type.Limited].includes(erc20.type);
            const decimals = await erc20.contract.methods.decimals().call();
            const isBalanceInsufficient = BigNumber.from(balanceOfPool).lt(parseUnits(reward.amount, decimals));

            // Notifiy the campaign owner if token is transferrable and balance is insufficient
            if (isTransferable && isBalanceInsufficient) {
                const owner = await AccountProxy.findById(safe.sub);
                const html = `Not enough ${erc20.symbol} available in campaign contract ${safe.address}. Please top up on ${
                    ChainId[erc20.chainId]
                }`;

                // Send email to campaign owner
                await MailService.send(owner.email, `⚠️ Out of ${erc20.symbol}!"`, html);

                return {
                    result: false,
                    reason: `We have notified the campaign owner that there is insufficient ${erc20.symbol} in the campaign wallet. Please try again later!`,
                };
            }
        }

        return { result: true, reason: '' };
    }

    private getERC20(erc20Id: TERC20) {
        return ERC20.findById(erc20Id);
    }

    private async addMinter(erc20: ERC20Document, poolId: string) {
        if (erc20.type !== ERC20Type.Unlimited) return;

        const pool = await PoolService.getById(poolId);
        const wallet = await SafeService.findOneByPool(pool, erc20.chainId);
        if (!wallet) throw new Error('No campaign wallet found for this network');

        const isMinter = await ERC20Service.isMinter(erc20, wallet.address);
        if (!isMinter) {
            await ERC20Service.addMinter(erc20, wallet.address);
        }
    }
}

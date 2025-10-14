import { Identity, Pool, Transaction, WalletDocument, Webhook } from '../models';
import { IRewardService } from './interfaces/IRewardService';
import { ChainId, Event, TransactionState } from '@thxnetwork/common/enums';
import { RewardKanaLabs } from '../models/RewardKanaLabs';
import { RewardKanaLabsPayment, RewardKanaLabsPaymentDocument } from '../models/RewardKanaLabsPayment';
import PoolService from './PoolService';
import SafeService from './SafeService';
import AptosService from './AptosService';
import KanaLabsService from './KanaLabsService';
import { KanaLabsTransaction } from '../models/KanaLabsTransaction';

export default class RewardKanaLabsService implements IRewardService {
    models = {
        reward: RewardKanaLabs,
        payment: RewardKanaLabsPayment,
    };

    async decorate({ reward, account }) {
        const pool = await Pool.findById(reward.poolId);
        const identities = account ? await Identity.find({ sub: pool.sub, accountId: account.sub }) : [];
        return { ...reward.toJSON(), isAvailable: true, isDisabled: !identities.length };
    }

    async decoratePayment(payment: RewardKanaLabsPaymentDocument): Promise<TRewardPayment> {
        return payment.toJSON();
    }

    async getValidationResult({ reward, account, wallet }: { reward: TReward; account?: TAccount; wallet:WalletDocument }) {
        if (!wallet) return { result: false, reason: `No wallet provided for this reward transfer.` };

        if (!reward.amount) return { result: false, reason: `No reweard amount provided for this reward transfer.` };

        const pool = await PoolService.getById(reward.poolId);
        const safe = await SafeService.findOneByPool(pool, ChainId.Aptos);
        if (!safe) return { result: false, reason: 'Campaign Safe is no longer available for this network' };

        const USDTAddress = '0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b'

        const balanceOfPool = await AptosService.getCoinBalance(safe.address, USDTAddress);
        const [, , decimals] = await AptosService.getCoinInfo(USDTAddress);
        if (balanceOfPool < Number(reward.amount) * 10 ** decimals) {
            return {
                result: false,
                reason: `We have notified the campaign owner that there is insufficient USDT in the campaign wallet. Please try again later!`,
            };
        }

        return { result: true, reason: '' };
    }

    create(data: Partial<TReward>) {
        return this.models.reward.create(data);
    }

    update(reward: TReward, updates: Partial<TReward>): Promise<TReward> {
        return this.models.reward.findByIdAndUpdate(reward._id, updates, { new: true });
    }

    remove(reward: TReward): Promise<void> {
        return this.models.reward.findByIdAndDelete(reward._id);
    }

    findById(id: string): Promise<TReward> {
        return this.models.reward.findById(id);
    }

    async createPayment({
        reward,
        account,
        wallet
    }: {
        reward: TReward;
        account: TAccount;
        wallet?: WalletDocument;
    }): Promise<TValidationResult | void> {
      if (!wallet) return { result: false, reason: 'Wallet not found' };

      const pool = await PoolService.getById(reward.poolId);
      const safe = await SafeService.findOneByPool(pool, ChainId.Aptos);
      if (!safe) return { result: false, reason: 'Safe not found' };

      const result = await KanaLabsService.depositToPerps(wallet, reward.amount);

      if(result.success){
          await KanaLabsTransaction.create({
              to: '0x7a38039fffd016adcac2c53795ee49325e5ec6fddf3bf02651c09f9a583655a6::perpetual_scripts', // Kana smart contract
              state: TransactionState.Mined,
              amount: Number(reward.amount) * 10 ** Number(6), //USDT has 6 decimals
              chainId: wallet.chainId,
              walletId: wallet.id,
              transactionHash: result.hash
          });
      }

      if(!result.success){
          await KanaLabsTransaction.create({
              to: '0x7a38039fffd016adcac2c53795ee49325e5ec6fddf3bf02651c09f9a583655a6::perpetual_scripts', // Kana smart contract
              state: TransactionState.Failed,
              amount: Number(reward.amount) * 10 ** Number(6), //USDT has 6 decimals
              chainId: wallet.chainId,
              walletId: wallet.id,
              failReason: result.error
          });
      }

        // Register the payment
        await RewardKanaLabsPayment.create({
            walletId: wallet.id,
            rewardId: reward.id,
            sub: account.sub,
            poolId: reward.poolId,
            amount: reward.pointPrice,
        });
    }
}

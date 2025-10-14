import mongoose from 'mongoose';
import { rewardSchema } from './Reward';
import { RewardVariant } from '@thxnetwork/common/enums';

export type RewardCustomDocument = mongoose.Document & TRewardCustom;

export const RewardKanaLabs = mongoose.model<RewardCustomDocument>(
    'RewardKanaLabs',
    new mongoose.Schema(
        {
            ...rewardSchema,
            variant: { type: Number, default: RewardVariant.Custom },
            metadata: String,
            amount: String,
        },
        { timestamps: true },
    ),
    'rewardkanalabs',
);

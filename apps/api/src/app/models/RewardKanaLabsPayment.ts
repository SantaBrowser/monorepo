import mongoose from 'mongoose';
import { rewardPaymentSchema } from './Reward';

export type RewardKanaLabsPaymentDocument = mongoose.Document & TRewardKanaLabsPayment;

export const RewardKanaLabsPayment = mongoose.model<RewardKanaLabsPaymentDocument>(
    'RewardKanaLabsPayment',
    new mongoose.Schema(
        {
            ...rewardPaymentSchema,
        },
        { timestamps: true },
    ),
    'rewardkanalabspayment',
);

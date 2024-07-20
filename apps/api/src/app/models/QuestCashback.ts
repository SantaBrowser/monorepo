import mongoose from 'mongoose';
import { questSchema } from '@thxnetwork/api/models/Quest';

export type QuestCashbackDocument = mongoose.Document & TQuestCashback;

export const QuestCashback = mongoose.model<QuestCashbackDocument>(
    'QuestCashback',
    new mongoose.Schema(
        {
            ...(questSchema as any),
            limit: Number,
        },
        { timestamps: true },
    ),
    'questcashback',
);

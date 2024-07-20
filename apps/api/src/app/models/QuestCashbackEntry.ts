import mongoose from 'mongoose';

export type QuestCashbackEntryDocument = mongoose.Document & TQuestCashbackEntry;

export const QuestCashbackEntry = mongoose.model<QuestCashbackEntryDocument>(
    'QuestCashbackEntry',
    new mongoose.Schema(
        {
            questId: String,
            sub: String,
            uuid: String,
            amount: Number,
            isClaimed: Boolean,
            poolId: String,
            santaQuestType: String,
            santaQuestId: String,
        },
        { timestamps: true },
    ),
    'questcashbackentry',
);

import mongoose from 'mongoose';

export type KanaLabsTransactionDocument = mongoose.Document & TTransaction;

export const KanaLabsTransaction = mongoose.model<KanaLabsTransactionDocument>(
    'KanaLabsTransaction',
    new mongoose.Schema(
        {
            from: String,
            to: String,
            nonce: Number,
            walletId: String,
            data: String,
            amount: Number,
            transactionHash: String,
            safeTxHash: String,
            type: Number,
            state: { type: Number, index: { sparse: true } },
            chainId: Number,
            failReason: String,
            callback: {},
        },
        { timestamps: true },
    ),
    'kanalabstransaction',
);

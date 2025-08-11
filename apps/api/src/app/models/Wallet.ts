import mongoose from 'mongoose';

export type TWallet = {
    uuid?: string;
    expiresAt?: Date;
    poolId?: string;
    address?: string;
    sub?: string;
    chainId?: number;
    version?: string;
    safeVersion?: string;
    variant?: string;
    provider?: string; // Added for wallet service tracking
};

export type WalletDocument = mongoose.Document & TWallet;

export const Wallet = mongoose.model<WalletDocument>(
    'Wallet',
    new mongoose.Schema(
        {
            uuid: String,
            expiresAt: Date,
            poolId: String,
            address: String,
            sub: { type: String, index: 'hashed' },
            chainId: Number,
            version: String,
            safeVersion: String,
            variant: String,
            provider: String, // Added to track wallet service (petra, martian, etc.)
        },
        { timestamps: true },
    ),
    'wallet',
);

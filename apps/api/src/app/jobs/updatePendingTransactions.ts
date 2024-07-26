import { TransactionState, TransactionType } from '@thxnetwork/common/enums';
import { Transaction, TransactionDocument } from '@thxnetwork/api/models/Transaction';
import { Wallet } from '../models/Wallet';
import SafeService from '../services/SafeService';
import TransactionService from '../services/TransactionService';
import { logger } from '../util/logger';

export async function updatePendingTransactions() {
    const transactions: TransactionDocument[] = await Transaction.find({
        $or: [{ state: TransactionState.Confirmed }, { state: TransactionState.Sent }],
    }).sort({ createdAt: 'asc' });

    // Iterate over all tx sent to or proposed and confirmed by the relayer
    for (const tx of transactions) {
        try {
            switch (tx.state) {
                case TransactionState.Confirmed: {
                    if (!tx.walletId) continue;
    
                    const wallet = await Wallet.findById(tx.walletId);
    
                    let pendingTx;
                    try {
                        pendingTx = await SafeService.getTransaction(wallet, tx.safeTxHash);
                        logger.debug(`Safe TX Found: ${tx.safeTxHash}`);
                    } catch (error) {
                        logger.error(error);
                    }
    
                    // Safes for pools have a single signer (relayer) while safes for end users
                    // have 2 (relayer + web3auth mpc key)
                    const threshold = wallet.poolId ? 1 : 2;
                    if (pendingTx && pendingTx.confirmations.length >= threshold) {
                        logger.debug(`Safe TX Confirmed: ${tx.safeTxHash}`);
    
                        try {
                            await SafeService.executeTransaction(wallet, tx.safeTxHash);
                            logger.debug(`Safe TX Executed: ${tx.safeTxHash}`);
                            await tx.updateOne({ state: TransactionState.Executed });
                        } catch (error) {
                            await tx.updateOne({ state: TransactionState.Failed });
                            logger.error(error);
                        }
                    }
                    break;
                }
                case TransactionState.Sent: {
                    if (tx.type == TransactionType.Relayed) {
                        logger.debug(`Update transaction: ${tx.transactionHash}`);
                        await TransactionService.queryTransactionStatusReceipt(tx);
                    }
                    break;
                }
            }
        } catch (error) {
            logger.error(error.message);
        }
    }
}

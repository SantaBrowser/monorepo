import { TransactionState, TransactionType } from '@thxnetwork/common/enums';
import { Transaction, TransactionDocument } from '@thxnetwork/api/models/Transaction';
import { logger } from '../util/logger';
import { Wallet } from '../models/Wallet';
import SafeService from '../services/SafeService';

export async function updatePendingTransactions() {
    const transactions: TransactionDocument[] = await Transaction.find({
        $or: [{ state: TransactionState.Confirmed }, { state: TransactionState.Sent }],
    }).sort({ createdAt: 'asc' });

    // Iterate over all tx sent to or proposed and confirmed by the relayer
    for (const tx of transactions) {
        try {
            switch (tx.state) {
                case TransactionState.Confirmed: {
                    if (tx.walletId) {
                        await SafeService.executeTransaction(tx);
                        logger.debug("Safe TX Executed");
                    }
                    break;
                }
                case TransactionState.Sent: {
                    if (tx.type == TransactionType.Relayed) {
                        logger.debug(`Update transaction: ${tx.safeTxHash}`);
                        const wallet = await Wallet.findById(tx.walletId);
                        if (!wallet) {
                            logger.debug(`Wallet removed: ${tx.walletId}`);
                            continue;
                        }

                        await SafeService.updateTransactionState(wallet, tx.safeTxHash);
                    }
                    break;
                }
            }
        } catch (error) {
            logger.error(error.message);
        }
    }
}

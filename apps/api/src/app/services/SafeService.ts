import { Wallet, WalletDocument, PoolDocument, TransactionDocument, Transaction } from '@thxnetwork/api/models';
import { ChainId, JobType, TransactionState, WalletVariant } from '@thxnetwork/common/enums';
import { contractNetworks } from '@thxnetwork/api/hardhat';
import { toChecksumAddress } from 'web3-utils';
import { safeVersion } from '@thxnetwork/api/services/ContractService';
import { SafeTransaction, MetaTransactionData } from '@safe-global/safe-core-sdk-types';
import { convertObjectIdToNumber } from '../util';
import SafeApiKit from '@safe-global/api-kit';
import Safe, { SafeFactory, SafeAccountConfig } from '@safe-global/protocol-kit';
import NetworkService from '@thxnetwork/api/services/NetworkService';
import TransactionService from './TransactionService';
import { Job } from '@hokify/agenda';
import { agenda } from '../util/agenda';
import { logger } from '../util/logger';

class SafeService {
    async create(
        data: { sub: string; chainId: ChainId; safeVersion: '1.3.0'; address?: string; poolId?: string },
        userWalletAddress?: string,
    ) {
        const wallet = await Wallet.create({
            variant: WalletVariant.Safe,
            ...data,
        });
        // Present address means Metamask account so do not deploy and return early
        if (!safeVersion && wallet.address) return wallet;

        // Add relayer address and consider this a campaign safe
        const { defaultAccount } = NetworkService.getProvider(wallet.chainId);
        const owners = [toChecksumAddress(defaultAccount)];

        // Add user address as a signer and consider this a participant safe
        if (userWalletAddress) {
            owners.push(toChecksumAddress(userWalletAddress));
        }

        // If campaign safe we provide a nonce based on the timestamp in the MongoID the pool (poolId value)
        const saltNonce = wallet.poolId && String(convertObjectIdToNumber(wallet.poolId));
        const safeAddress = await this.deploy(wallet, owners, saltNonce);

        return await Wallet.findByIdAndUpdate(wallet.id, { address: safeAddress }, { new: true });
    }

    async deploy(wallet: WalletDocument, owners: string[], saltNonce?: string) {
        const { ethAdapter } = NetworkService.getProvider(wallet.chainId);
        const safeAccountConfig: SafeAccountConfig = {
            owners,
            threshold: owners.length,
        };
        const safeAddress = await this.predictAddress(wallet, safeAccountConfig, safeVersion, saltNonce);

        try {
            await Safe.create({
                ethAdapter,
                safeAddress,
                contractNetworks,
            });
        } catch (error) {
            await agenda.now(JobType.DeploySafe, { safeAccountConfig, saltNonce, chainId: wallet.chainId });
        }

        return safeAddress;
    }

    async deploySafeJob({ attrs }: Job) {
        const { safeAccountConfig, saltNonce, chainId } = attrs.data as TJobDeploySafe;
        const { provider, ethAdapter } = NetworkService.getProvider(chainId);
        const safeFactory = await SafeFactory.create({
            ethAdapter,
            safeVersion,
            contractNetworks,
        });
        const gasPriceMode = await provider.getGasPrice();
        const gasPrice = (gasPriceMode.toNumber() + 10000).toString();
        console.log(gasPrice);
        const args = { safeAccountConfig, options: { gasPrice: gasPrice } };
        if (saltNonce) args['saltNonce'] = saltNonce;

        try {
            await safeFactory.deploySafe(args);
            logger.debug("Deployed Safe");
        } catch (error) {
            logger.error(error.response ? error.response.data : error.message);
        }
    }

    async predictAddress(
        wallet: WalletDocument,
        safeAccountConfig: SafeAccountConfig,
        safeVersion: '1.3.0',
        saltNonce?: string,
    ) {
        if (wallet.address) return wallet.address;

        const { ethAdapter } = NetworkService.getProvider(wallet.chainId);
        const safeFactory = await SafeFactory.create({
            safeVersion,
            ethAdapter,
            contractNetworks,
        });
        const safeAddress = await safeFactory.predictSafeAddress(safeAccountConfig, saltNonce);

        return toChecksumAddress(safeAddress);
    }

    findById(id: string) {
        return Wallet.findById(id);
    }

    findOne(query) {
        return Wallet.findOne({ ...query, variant: WalletVariant.Safe, poolId: { $exists: false } });
    }

    findOneByAddress(address: string) {
        return Wallet.findOne({ address: toChecksumAddress(address) });
    }

    async findOneByPool(pool: PoolDocument, chainId: ChainId) {
        if (!pool) return;
        return await Wallet.findOne({
            poolId: pool.id,
            chainId,
            sub: pool.sub,
            safeVersion,
        });
    }

    async proposeTransaction(wallet: WalletDocument, safeTransactionData: MetaTransactionData) {
        const { ethAdapter, signer } = NetworkService.getProvider(wallet.chainId);
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: wallet.address,
            contractNetworks,
        });
    
        // Get nonce for this Safes transaction
        const nonce = await safe.getNonce();
        const safeTransaction = await safe.createTransaction({
            safeTransactionData,
            options: { nonce: nonce + 1 },
        });
    
        // Create hash for this transaction
        const safeTxHash = await safe.getTransactionHash(safeTransaction);
        const signature = await safe.signTransactionHash(safeTxHash);
        const apiKit = this.getApiKit(wallet);
    
        logger.info({ safeTxHash, nonce });
    
        try {
            await apiKit.proposeTransaction({
                safeAddress: wallet.address,
                safeTxHash,
                safeTransactionData: safeTransaction.data as any,
                senderAddress: toChecksumAddress(await signer.getAddress()),
                senderSignature: signature.data,
            });
    
            logger.info(`Safe TX Proposed: ${safeTxHash}`);
            return safeTxHash;
        } catch (error) {
            logger.error(error);
        }
    }

    async createTransaction(wallet: WalletDocument, { to, data }: Partial<MetaTransactionData>) {
        const safe = await this.getSafe(wallet);
        try {
            const apiKit = this.getApiKit(wallet);
            const nonce = await apiKit.getNextNonce(wallet.address);
            const safeTx = await safe.createTransaction({
                safeTransactionData: {
                    to,
                    data,
                    value: '0',
                    operation: 0,
                },
                options: { nonce },
            });
            logger.debug('Transaction created', { safeTx });
            return safeTx;
        } catch (error) {
            logger.error('Error creating transaction', error.response ? error.response.data : error.message);
        }
    }

    async signTransaction(wallet: WalletDocument, safeTx: SafeTransaction) {
        const safe = await this.getSafe(wallet);
        try {
            const signedTx = await safe.signTransaction(safeTx);
            logger.debug('Transaction Signatures', { count: Array.from(safeTx.signatures).length });
            return signedTx;
        } catch (error) {
            logger.error('Error signing transaction', error.response ? error.response.data : error.message);
        }
    }

    async confirmTransaction(wallet: WalletDocument, safeTxHash: string) {
        const { ethAdapter } = NetworkService.getProvider(wallet.chainId);
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: wallet.address,
            contractNetworks,
        });
        const signature = await safe.signTransactionHash(safeTxHash);
        return await this.confirm(wallet, safeTxHash, signature.data);
    }

    async confirm(wallet: WalletDocument, safeTxHash: string, signatureData: string) {
        const { txServiceUrl, ethAdapter } = NetworkService.getProvider(wallet.chainId);
        const apiKit = new SafeApiKit({ ethAdapter, txServiceUrl });
        return await apiKit.confirmTransaction(safeTxHash, signatureData);
    }

    async executeTransaction(wallet: WalletDocument, safeTxHash: string) {
        const { provider, ethAdapter } = NetworkService.getProvider(wallet.chainId);
        const apiKit = this.getApiKit(wallet);
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: wallet.address,
            contractNetworks,
        });
        const safeTransaction = await apiKit.getTransaction(safeTxHash);
        const gasPriceMode = await provider.getGasPrice();
        const gasPrice = (gasPriceMode.toNumber() + 10000).toString();
        const options = { gasPrice: gasPrice };
        const executeTxResponse = await safe.executeTransaction(safeTransaction as any, options );
        const receipt = await executeTxResponse.transactionResponse?.wait();
        logger.debug("Executed Transaction");
        const tx = await Transaction.findOne({ safeTxHash });
    
        await TransactionService.executeCallback(tx, receipt as any);
    
        return receipt;
    }

    async updateTransactionState(wallet: WalletDocument, safeTxHash: string) {
        const safeTx = await this.getTransaction(wallet, safeTxHash);
        if (!safeTx) return;

        const tx = await Transaction.findOne({ safeTxHash });
        const isSent = tx.state === TransactionState.Sent;

        if (isSent && safeTx.isExecuted && safeTx.isSuccessful) {
            await TransactionService.queryTransactionStatusReceipt(tx);
            logger.debug('Transaction success', { safeTx });
        }

        if (isSent && safeTx.isExecuted && !safeTx.isSuccessful) {
            await tx.updateOne({ state: TransactionState.Failed });
            logger.debug('Transaction failed', { safeTx });
        }
    }

    async getTransaction(wallet: WalletDocument, safeTxHash: string) {
        const apiKit = this.getApiKit(wallet);
        try {
            const safeTx = await apiKit.getTransaction(safeTxHash);
            logger.debug('Transaction get', { safeTx });
            return safeTx;
        } catch (error) {
            logger.error('Error transaction get', error.response ? error.response.data : error.message);
        }
    }

    async getTransactionHash(wallet: WalletDocument, safeTx: any) {
        const safe = await this.getSafe(wallet);
        try {
            const safeTxHash = await safe.getTransactionHash(safeTx);
            logger.debug('Transaction Hash created', { safeTxHash });
            return safeTxHash;
        } catch (error) {
            logger.error('Error creating transaction hash', error.response ? error.response.data : error.message);
        }
    }

    async getLastPendingTransactions(wallet: WalletDocument) {
        const apiKit = this.getApiKit(wallet);
        return await apiKit.getPendingTransactions(wallet.address);
    }

    private async getSafe(wallet: WalletDocument) {
        const { ethAdapter } = NetworkService.getProvider(wallet.chainId);
        const safe = await Safe.create({
            ethAdapter,
            safeAddress: wallet.address,
            contractNetworks,
        });
        return safe;
    }

    private getApiKit(wallet: WalletDocument) {
        const { txServiceUrl, ethAdapter } = NetworkService.getProvider(wallet.chainId);
        return new SafeApiKit({
            txServiceUrl,
            ethAdapter,
        });
    }
}

export default new SafeService();

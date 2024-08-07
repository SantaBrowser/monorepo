import { Request, Response } from 'express';
import { body, query } from 'express-validator';
import { ForbiddenError, NotFoundError } from '@thxnetwork/api/util/errors';
import NetworkService from '@thxnetwork/api/services/NetworkService';
import { BigNumber } from 'alchemy-sdk';
import { getArtifact } from '@thxnetwork/api/hardhat';
import TransactionService from '@thxnetwork/api/services/TransactionService';
import WalletService from '@thxnetwork/api/services/WalletService';
import { ChainId } from '@thxnetwork/common/enums';

const validation = [
    // body('tokenAddress').isEthereumAddress(),
    // body('spender').isEthereumAddress(),
    body('amountInWei').isString(),
    query('walletId').isMongoId(),
    query('chainId').isMongoId(),
];

const controller = async (req: Request, res: Response) => {
    const walletId = req.query.walletId as string;
    const chainId = Number(req.query.chainId) as ChainId;
    const wallet = await WalletService.findById(walletId);
    if (!wallet) throw new NotFoundError('Wallet not found');
    if (wallet.sub !== req.auth.sub) throw new ForbiddenError('Wallet not owned by sub.');

    const { web3 } = NetworkService.getProvider(chainId);
    const { abi } = getArtifact('THXERC20_LimitedSupply');
    const contract = new web3.eth.Contract(abi, req.body.tokenAddress);
    const amount = await contract.methods.balanceOf(wallet.address).call();

    // Check sufficient BPT Balance
    if (BigNumber.from(amount).lt(BigNumber.from(req.body.amountInWei))) {
        throw new ForbiddenError('Insufficient balance');
    }

    const fn = contract.methods.approve(req.body.spender, req.body.amountInWei);

    // Propose tx data to relayer and return safeTxHash to client to sign
    const tx = await TransactionService.sendSafeAsync(wallet, contract.options.address, fn);

    res.status(201).json([tx]);
};
export { controller, validation };

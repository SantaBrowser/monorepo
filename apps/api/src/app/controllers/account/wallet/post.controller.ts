import { Request, Response } from 'express';
import { body } from 'express-validator';
import NetworkService from '@thxnetwork/api/services/NetworkService';
import WalletService from '@thxnetwork/api/services/WalletService';
import { ChainId } from '@thxnetwork/common/enums';

const validation = [
    body('variant').isString(),
    body('message').optional().isString(),
    body('signature').optional().isString(),
    body('chainId').optional().isInt(),
];

const controller = async (req: Request, res: Response) => {
    const { message, signature, variant, chainId, rawAddress } = req.body;
    const data: Partial<TWallet> = { sub: req.auth.sub, chainId };

    // If no message and signature are present prepare a wallet to connect later
    if (data.chainId == ChainId.Aptos || data.chainId == ChainId.Sui) {
        data.address = rawAddress;
    }
    else {
        if (signature && message) {
            data.address = NetworkService.recoverSigner(message, signature);
        }
    }

    await WalletService.create(variant, data);

    res.status(201).end();
};

export default { controller, validation };

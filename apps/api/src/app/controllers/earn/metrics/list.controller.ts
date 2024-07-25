import { NODE_ENV } from '@thxnetwork/api/config/secrets';
import BalancerService from '@thxnetwork/api/services/BalancerService';
import WalletService from '@thxnetwork/api/services/WalletService';
import { ChainId } from '@thxnetwork/common/enums';
import { Request, Response } from 'express';
import { query } from 'express-validator';

const validation = [query('walletId').optional().isMongoId(), query('chainId').isInt()];

const controller = async (req: Request, res: Response) => {
    const result = BalancerService.getMetrics(Number(req.query.chainId));
    const wallet = await WalletService.findById(req.query.walletId as string);
    const result = BalancerService.getMetrics(wallet ? wallet.chainId : (NODE_ENV === 'production' ? ChainId.Polygon : ChainId.Sepolia));

    res.json(result);
};

export { controller, validation };

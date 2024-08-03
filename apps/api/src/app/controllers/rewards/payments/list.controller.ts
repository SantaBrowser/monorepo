import RewardService from '@thxnetwork/api/services/RewardService';
import { Request, Response } from 'express';
import { query } from 'express-validator';

const validation = [query('walletId').optional().isMongoId(), query('chainId').optional().isInt()];

const controller = async (req: Request, res: Response) => {
  console.log('controller----------------------------------------------------' , req);

  const payments = await RewardService.findPaymentsForSub(req.auth.sub);
    res.json(payments);
};

export { controller, validation };

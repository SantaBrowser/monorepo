import { Request, Response } from 'express';
import { Identity } from '@thxnetwork/api/models';
import { ForbiddenError } from '@thxnetwork/api/util/errors';
import { param } from 'express-validator';

const validation = [param('uuid').isUUID()];

const controller = async (req: Request, res: Response) => {
  const isConnected = await Identity.exists({ uuid: req.params.uuid, accountId: { $exists: true } });
    if (isConnected) throw new ForbiddenError('Identity already connected.');

    if(!await Identity.exists({ uuid: req.params.uuid })){
      await Identity.create({sub: req.auth.sub, uuid: req.params.uuid});
    }

    const identity = await Identity.findOneAndUpdate(
        { uuid: req.params.uuid },
        { accountId: req.auth.sub, uuid: req.params.uuid},
        { new: true },
    );

    res.json(identity);
};

export { controller, validation };

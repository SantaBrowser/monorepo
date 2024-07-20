import { Request, Response } from 'express';
import { Identity, Pool, QuestCustom } from '@thxnetwork/api/models';
import { body, param } from 'express-validator';
import { JobType, QuestVariant } from '@thxnetwork/common/enums';
import { agenda } from '@thxnetwork/api/util/agenda';
import QuestService from '@thxnetwork/api/services/QuestService';
import { NotFoundError } from '@thxnetwork/api/util/errors';
import { QuestCashback } from '@thxnetwork/api/models/QuestCashback';
import { logger } from '@thxnetwork/api/util/logger';
import AccountProxy from '@thxnetwork/api/proxies/AccountProxy';

const validation = [
    param('id').isMongoId(),
    body('amount').isNumeric(),
    body('identityUuid').isUUID(),
    body('santaQuestType')
        .isString()
        .custom((value) => {
            if (value !== 'cashback' && value !== 'offerwall') {
                throw new Error('Invalid santaQuestType. It must be either "cashback" or "offerwall".');
            }
            return true;
        }),
    body('santaQuestId').isString(),
];

const controller = async ({ params, body }: Request, res: Response) => {
    const { identityUuid, amount, santaQuestType, santaQuestId } = body;

    const quest = await QuestCashback.findById(params.id);
    if (!quest) throw new NotFoundError('Quest not found.');

    const pool = await Pool.findById(quest.poolId);
    if (!pool) throw new NotFoundError('Could not find pool for client');

    const identity = await Identity.findOne({ uuid: identityUuid });
    if (!identity) throw new NotFoundError('Could not find ID for uuid');
    
    const data = {
        amount,
        santaQuestType,
        santaQuestId
    }
    
    const account = await AccountProxy.findById(identity.sub);

    const { result, reason } = await QuestService.getValidationResult(quest.variant, {
        quest,
        account,
        data,
    });
    if (!result) return res.json({ error: reason });

    const job = await agenda.now(JobType.CreateQuestEntry, {
        variant: QuestVariant.CashbackPlaywall,
        questId: String(quest._id),
        sub: identity.sub,
        data: { ...data, isClaimed: true },
    });

    res.json({ jobId: job.attrs._id });
};

export { controller, validation };

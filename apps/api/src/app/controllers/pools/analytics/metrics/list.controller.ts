import { Request, Response } from 'express';
import { param } from 'express-validator';
import { Participant } from '@thxnetwork/api/models/Participant';
import AnalyticsService from '@thxnetwork/api/services/AnalyticsService';
import PoolService from '@thxnetwork/api/services/PoolService';

const validation = [
    param('id').isMongoId(),
];

const controller = async (req: Request, res: Response) => {
    const pool = await PoolService.getById(req.params.id);
    const [metrics, participantCount, participantActiveCount, subscriptionCount] = await Promise.all([
        AnalyticsService.getPoolMetrics(pool),
        Participant.countDocuments({ poolId: pool._id }),
        Participant.countDocuments({ poolId: pool._id, score: { $gt: 0 } }),
        Participant.countDocuments({ poolId: pool._id, isSubscribed: true }),
    ]);

    res.json({ _id: pool._id, participantCount, participantActiveCount, subscriptionCount, ...metrics });
};

export { controller, validation };

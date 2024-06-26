import express from 'express';
import { assertAccount, assertRequestInput } from '@thxnetwork/api/middlewares';
import { limitInSeconds } from '@thxnetwork/api/util/ratelimiter';
import * as CreateEntry from './entries/post.controller';

const router: express.Router = express.Router({ mergeParams: true });

router.post(
    '/:id/entries',
    limitInSeconds(3),
    assertRequestInput(CreateEntry.validation),
    assertAccount,
    CreateEntry.controller,
);

export default router;

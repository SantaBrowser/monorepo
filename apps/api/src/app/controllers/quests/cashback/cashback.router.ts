import express from 'express';
import * as CreateEntry from './entries/post.controller';
import { assertRequestInput, guard } from '@thxnetwork/api/middlewares';

const router: express.Router = express.Router({ mergeParams: true });

router.post('/:id/entries', guard.check(['pools:write']), assertRequestInput(CreateEntry.validation), CreateEntry.controller);

export default router;

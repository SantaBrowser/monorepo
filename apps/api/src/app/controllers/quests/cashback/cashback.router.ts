import express from 'express';
import * as CreateEntry from './entries/post.controller';
import { assertRequestInput } from '@thxnetwork/api/middlewares';

const router: express.Router = express.Router({ mergeParams: true });

router.post('/:id/entries', assertRequestInput(CreateEntry.validation), CreateEntry.controller);

export default router;

import express from 'express';
import { assertRequestInput } from '@thxnetwork/api/middlewares';
import * as ListLeaderboard from './list.controller';
import * as ReadLeaderboard from './get.controller';
import * as ReadPreviewController from './preview/get.controller';

export const router: express.Router = express.Router();

router.get(
    '/:platform/:id.png',
    assertRequestInput(ReadPreviewController.validation),
    ReadPreviewController.controller,
);
router.get('/', assertRequestInput(ListLeaderboard.validation), ListLeaderboard.controller);
router.get('/:campaignId', assertRequestInput(ReadLeaderboard.validation), ReadLeaderboard.controller);

export default router;

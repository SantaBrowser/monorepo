import { checkJwt, corsHandler } from '@thxnetwork/api/middlewares';
import express from 'express';
import * as ListQuests from './list.controller';
import * as ListQuestsPublic from './recent/list.controller';
import RouterQuestInvite from './invite/invite.router';
import RouterQuestSocial from './social/social.router';
import RouterQuestWeb3 from './web3/web3.router';
import RouterQuestGitcoin from './gitcoin/gitcoin.router';
import RouterQuestDaily from './daily/daily.router';
import RouterQuestCustom from './custom/custom.router';
import RouterQuestWebhook from './webhook/webhook.router';
import RouterQuestCashback from './cashback/cashback.router';

const router: express.Router = express.Router();

router.get('/', ListQuests.controller);
router.get('/public', ListQuestsPublic.controller);
router.use('/cashback', RouterQuestCashback);
router.use(checkJwt).use(corsHandler);
router.use('/invite', RouterQuestInvite);
router.use('/social', RouterQuestSocial);
router.use('/web3', RouterQuestWeb3);
router.use('/gitcoin', RouterQuestGitcoin);
router.use('/daily', RouterQuestDaily);
router.use('/custom', RouterQuestCustom);
router.use('/webhook', RouterQuestWebhook);
router.use('/cashback', RouterQuestCashback);

export default router;

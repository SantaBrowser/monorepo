import QuestService from './QuestService';
import TwitterDataProxy from '../proxies/TwitterDataProxy';
import TwitterCacheService from './TwitterCacheService';
import MailService from './MailService';
import AccountProxy from '../proxies/AccountProxy';
import { Pool, PoolDocument, QuestSocial, TwitterQuery, TwitterQueryDocument } from '../models';
import { DASHBOARD_URL } from '../config/secrets';
import { QuestSocialRequirement, QuestVariant } from '@thxnetwork/common/enums';
import { logger } from '../util/logger';
import { TwitterPost } from '../models/TwitterPost';
import { agenda } from '../util/agenda';

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

class TwitterQueryService {
    constructor() {
        // Define all the existing queries as agenda jobs
        TwitterQuery.find({}).then((queries: TwitterQueryDocument[]) =>
            queries.map((query) => agenda.define(query.jobName, this.searchJob)),
        );
    }

    async searchJob(job: TJob) {
        if (!job.attrs.data.queryId) return;
        logger.info(`Running ${job.attrs.name}`, job.attrs.data);
        const query = await TwitterQuery.findById(job.attrs.data.queryId);
        await this.run([query]);
    }

    async list(query: { poolId: string }): Promise<TwitterQueryDocument[]> {
        const queries = await TwitterQuery.find(query);
        return await Promise.all(
            queries.map(async (query) => {
                const posts = await TwitterPost.find({ queryId: query.id });
                return { ...query.toJSON(), posts };
            }),
        );
    }

    async run(queries: TwitterQueryDocument[]) {
        const poolIds = queries.map((query) => query.poolId);
        const pools = await Pool.find({ _id: { $in: poolIds } });
        const subs = pools.map((pool) => pool.sub);
        const accounts = await AccountProxy.find({ subs });

        for (const query of queries) {
            try {
                const pool = pools.find((pool) => pool.id === query.poolId);
                if (!pool) continue;

                const account = accounts.find((account) => account.sub === pool.sub);
                if (!account) continue;

                const posts = await this.search(account, query);
                if (!posts.length) continue;

                // Send notification to campaign owner if new quests are created
                await this.sendMail(account, pool, posts);
            } catch (error) {
                logger.error(error);
            }
        }
    }

    async search(account: TAccount, query: TwitterQueryDocument) {
        const posts = await TwitterDataProxy.search(account, query.query);

        // Filter out the posts that already have a quest
        const postIds = posts.map((post) => post.id);
        const quests = await QuestSocial.find({ poolId: query.poolId, content: { $in: postIds } });
        const postsWithoutQuest = posts.filter((post) => {
            return !quests.some((quest) => quest.content === post.id);
        });

        // Iterate over posts and create quests
        for (const post of postsWithoutQuest) {
            try {
                await this.createQuest(
                    query,
                    await TwitterCacheService.savePost(post, post.media, query),
                    await TwitterCacheService.saveUser(post.user),
                );
            } catch (error) {
                logger.error(error);
            }
        }

        return postsWithoutQuest;
    }

    async sendMail(account: TAccount, pool: PoolDocument, posts: TTwitterPostWithUserAndMedia[]) {
        const src = new URL(DASHBOARD_URL);
        src.pathname = `/pool/${pool.id}/quests`;
        src.searchParams.append('isPublished', 'false');

        await MailService.send(
            account.email,
            '👀 New matches for your query!',
            `<p>Hi!</p>
            <p>We found matches for your X query!</p>
            ${posts
                .map(
                    (post) =>
                        `<div><strong>${post.user.username}</strong> <span>(${
                            post.public_metrics.impression_count
                        } views)</span></div>
                    <p>${post.text.substring(0, 100)}... <a href="https://x.com/${post.user.username}/status/${
                            post.id
                        }" target="_blank">
                    View Post    
                    </a></p>`,
                )
                .join('<br />')}
            `,
            { src: src.toString(), text: 'Publish Quests' },
        );
    }

    async createQuest(query: TTwitterQuery, post: TTwitterPost, user: TTwitterUser) {
        const file = null; // TODO Download buffer for the media first URL and upload with quest
        const quest = {
            kind: 'twitter',
            interaction: QuestSocialRequirement.TwitterRetweet,
            title: query.defaults.title,
            description: query.defaults.description,
            amount: query.defaults.amount,
            locks: query.defaults.locks,
            isPublished: query.defaults.isPublished,
            content: post.postId,
            contentMetadata: JSON.stringify({
                url: `https://twitter.com/${user.username.toLowerCase()}/status/${post.postId}`,
                username: user.username,
                name: user.name,
                text: post.text,
                minFollowersCount: query.defaults.minFollowersCount,
            }),
        };

        if (query.defaults.expiryInDays > 0) {
            quest['expiryDate'] = new Date(Date.now() + query.defaults.expiryInDays * ONE_DAY_IN_MS);
        }

        await QuestService.create(QuestVariant.Twitter, query.poolId, quest, file);
    }
}

export default new TwitterQueryService();

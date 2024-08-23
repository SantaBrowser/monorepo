import {
    Identity,
    IdentityDocument,
    WalletDocument,
} from '@thxnetwork/api/models';
import { IQuestService } from './interfaces/IQuestService';
import { QuestCashback, QuestCashbackDocument } from '../models/QuestCashback';
import { QuestCashbackEntry } from '../models/QuestCashbackEntry';
import { logger } from '../util/logger';
import { Request } from 'express';

export default class QuestCashbackService implements IQuestService {
    models = {
        quest: QuestCashback,
        entry: QuestCashbackEntry,
    };

    async getDataForRequest(
        req: Request,
        options: { quest: TQuest; account: TAccount },
    ): Promise<Partial<TQuestEntry>> {
        return {};
    }

    async findEntryMetadata({ quest }: { quest: QuestCashbackDocument }) {
        const uniqueParticipantIds = await QuestCashbackEntry.countDocuments({
            questId: String(quest._id),
        }).distinct('sub');

        return { participantCount: uniqueParticipantIds.length };
    }

    async isAvailable({
        quest,
        account,
        data
    }: {
        quest: QuestCashbackDocument;
        wallet?: WalletDocument;
        account?: TAccount;
        data: Partial<TQuestCashbackEntry>;
    }): Promise<TValidationResult> {
        const { amount, santaQuestId, santaQuestType } = data;

        const existingEntries = await this.models.entry.find({
            questId: quest._id,
            sub: account._id,
            santaQuestId,
            santaQuestType,
        });

        // Only two entries allowed
        if (existingEntries.length >= 2) {
            return { result: false, reason: 'Entry already exists' };
        }

        if (existingEntries.length === 1) {
            const existingEntry = existingEntries[0];

            if (existingEntry.amount === amount) {
                return { result: false, reason: 'Entry already exists' };
            }

            if (existingEntry.amount !== -amount) {
                return { result: false, reason: 'Only an entry with the opposite amount is allowed.' };
            }
        }

        return { result: true, reason: '' };
    }

    async getAmount({ quest, data }: { quest: QuestCashbackDocument; wallet: WalletDocument; account: TAccount; data: any }) {
        return data.amount;
    }

    async decorate({
        quest,
        account,
        data,
    }: {
        quest: QuestCashbackDocument;
        account?: TAccount;
        data: Partial<TQuestCustomEntry>;
    }) {
        const entries = await this.findAllEntries({ quest, account });
        const isAvailable = await this.isAvailable({ quest, account, data });
        const pointsAvailable = 0;

        return {
            ...quest,
            eventName: '', // FK Deprecrates March 15th 2024
            isAvailable: isAvailable.result,
            pointsAvailable,
            entries
        };
    }

    async getValidationResult({
        quest,
        account,
    }: {
        quest: QuestCashbackDocument;
        account: TAccount;
        data: Partial<TQuestCustomEntry>;
    }): Promise<{ reason: string; result: boolean }> {
        // See if there are identities
        const identities = await this.findIdentities({ quest, account });
        if (!identities.length) {
            return {
                result: false,
                reason: 'No identity connected to this account. Please ask for this in your community!',
            };
        }

        // Find existing entries for this quest and check optional limit
        const entries = await this.findAllEntries({ quest, account });
        if (quest.limit && entries.length >= quest.limit) {
            return { result: false, reason: 'Quest entry limit has been reached' };
        }

        return { result: true, reason: '' };
    }

    private async findAllEntries({ quest, account}: { quest: QuestCashbackDocument; account: TAccount }) {
        if (!account) return [];
        return await this.models.entry.find({
            questId: quest._id,
            sub: account.sub,
            isClaimed: true,
        });
    }

    private async findIdentities({ quest, account }: { quest: QuestCashbackDocument; account: TAccount }) {
        if (!account || !account.sub) return [];
        return await Identity.find({ poolId: quest.poolId, accountId: account.sub });
    }
}

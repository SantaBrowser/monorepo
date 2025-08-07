import { client } from '../../discord';
import { DiscordGuild, DiscordMessage, DiscordReaction } from '../models';
import { DiscordUser } from '../models/DiscordUser';
import { logger } from '../util/logger';

export default class DiscordService {
    static async getGuild(poolId: string) {
        const discordGuild = await DiscordGuild.findOne({ poolId });
        if (!discordGuild) return;
        try {
            // Might fail if bot is removed from the guild
            return await client.guilds.fetch(discordGuild.guildId);
        } catch (error) {
            logger.error(error);
        }
    }

    static async getGuilds(poolId: string): Promise<TDiscordGuild[]> {
        const discordGuilds = await DiscordGuild.find({ poolId });
        if (!discordGuilds.length) return [];

        const guilds = [];
        for (const g of discordGuilds) {
            try {
                // Might fail if bot is removed from the guild
                await client.guilds.fetch(g.guildId);
                guilds.push(g);
            } catch (error: unknown) {
                // Handle specific Discord API errors gracefully
                const discordError = error as { code?: number; message?: string };
                
                if (discordError.code === 10004) {
                    // Unknown Guild - bot was likely removed or guild was deleted
                    logger.warn(`Guild ${g.guildId} is no longer accessible (Unknown Guild). Bot may have been removed or guild deleted. Pool: ${poolId}`);
                } else if (discordError.code === 50001) {
                    // Missing Access - bot doesn't have permission
                    logger.warn(`Missing access to guild ${g.guildId}. Bot may lack permissions. Pool: ${poolId}`);
                } else {
                    // Other Discord API errors
                    logger.error(`Failed to fetch guild ${g.guildId} for pool ${poolId}:`, {
                        code: discordError.code,
                        message: discordError.message,
                        guildId: g.guildId,
                        poolId
                    });
                }
                // Continue processing other guilds instead of failing the entire operation
                continue;
            }
        }
        return guilds;
    }

    static async getMember(guildId: string, userId: string) {
        try {
            // Might fail if bot is removed from the guild
            return await client.guilds.fetch(guildId).then((guild) => guild.members.fetch(userId));
        } catch (error) {
            logger.error(error);
        }
    }

    static async getRole(guildId: string, roleId: string) {
        try {
            return await client.guilds.fetch(guildId).then((guild) => guild.roles.fetch(roleId));
        } catch (error) {
            logger.error(error);
        }
    }

    static async getUserMetrics(poolId: string, userId: string) {
        const guild = await this.getGuild(poolId);
        if (!guild) return;

        const member = await this.getMember(guild.id, userId);
        if (!member) return;

        const profileImgUrl = member.user.displayAvatarURL({ forceStatic: true });
        const query = { guildId: guild.id, userId };

        return await DiscordUser.create({
            userId,
            guildId: guild.id,
            profileImgUrl,
            username: member.user.username,
            publicMetrics: {
                joinedAt: new Date(member.joinedTimestamp).toISOString(),
                reactionCount: guild ? await DiscordReaction.countDocuments(query) : 0,
                messageCount: guild ? await DiscordMessage.countDocuments(query) : 0,
            },
        });
    }
}

import { Request } from 'express';
import { authClient, getAuthAccessToken } from '@thxnetwork/api/util/auth';
import { BadRequestError, NotFoundError } from '../util/errors';
import { AccessTokenKind, AccountPlanType, AccountVariant, OAuthScope } from '@thxnetwork/common/enums';
import { AxiosRequestConfig } from 'axios';
import { supabaseClient } from '../util/supabase';
import { Account, AccountDocument } from '../models';
import { Token } from '../models/Token';
import { accountVariantProviderMap, providerAccountVariantMap } from '@thxnetwork/common/maps';
import { toChecksumAddress } from 'web3-utils';
import MailService from '../services/MailService';
import TokenService from '../services/TokenService';

export const supabase = supabaseClient();

export default class AccountProxy {
    static async request(config: AxiosRequestConfig) {
        const header = await getAuthAccessToken();
        const { status, data } = await authClient({
            ...config,
            headers: {
                Authorization: header,
            },
        });

        if (status >= 400 && status <= 500 && data.error) {
            throw new BadRequestError(data.error.message);
        }

        return data;
    }

    static async getToken(account: TAccount, kind: AccessTokenKind, requiredScopes: OAuthScope[] = []) {
        const token = await TokenService.get({ sub: account.sub, kind });
        if (token && requiredScopes.every((scope) => token.scopes.includes(scope))) return token;
    }

    static disconnect(account: TAccount, kind: AccessTokenKind) {
        return this.request({
            method: 'DELETE',
            url: `/accounts/${account.sub}/tokens/${kind}`,
        });
    }

    static async findById(sub: string) {
        return await Account.findById(sub);
    }

    static async findByRequest(req: Request) {
        const header = req.header('authorization');
        if (!header) return;

        const token = header.split(' ')[1];
        if (!token) return;

        const { data, error } = await supabase.auth.getUser(token);
        if (error) throw error;

        const provider = data.user.app_metadata.provider;
        const email = data.user.user_metadata.email;
        const address = data.user.user_metadata.address;

        let account;
        // Find the account for the user login provider and provider user id
        if (Object.values(accountVariantProviderMap).includes(provider as AccessTokenKind)) {
            account = await this.findByIdentityUserId(provider, data.user.identities[0].id);
            await TokenService.set({
                kind: provider,
                accessToken: '',
                refreshToken: '',
                userId: data.user.identities[0].id,
                sub: account.id,
            });
        }
        // Find the account for the email used in the OTP flow
        else if (provider === 'email') {
            account = await this.findByEmail(email);
        }
        // TODO Find the account for the recovered address from the signature
        else if (['walletconnect'].includes(provider)) {
            account = await this.findByAddress(address);
        }
        // If all of the above are skipped we create a new account
        else {
            // Create the account
            const variant = providerAccountVariantMap[provider];
            const isEmailVerified = variant === AccountVariant.EmailPassword;
            account = await this.create({ variant, email, address, isEmailVerified });

            // Store the tokens if any

            // TODO Change this into a welcome email
            if (email) {
                await MailService.send(email, 'Congratulations with your sign up!', 'Welcome to THX Network.');
            }
        }

        if (!account) {
            throw new NotFoundError('Account not found during request');
        }

        return await this.decorate(account);
    }

    private static async decorate(account: AccountDocument): Promise<TAccount> {
        return {
            ...account.toJSON(),
            sub: account.id,
            tokens: await this.findTokensBySub(account.id),
        };
    }

    private static async findTokensBySub(sub: string) {
        const tokens = await Token.find({ sub });
        return (
            tokens
                // Filters out the social auth providers
                .filter(({ kind }) => Object.values(accountVariantProviderMap).includes(kind))
                // Removes sensitive access and refresh tokens
                .map(({ kind, userId, scopes, metadata }) => ({
                    kind,
                    userId,
                    scopes,
                    metadata,
                })) as TToken[]
        );
    }

    private static async findByEmail(email: string) {
        return await Account.findOne({ email });
    }

    private static async findByIdentityUserId(kind: string, userId: string) {
        const token = await Token.findOne({ kind, userId });
        if (!token) return;
        return await Account.findById(token.sub);
    }

    private static async findByAddress(address: string) {
        return await Account.findOne({ address });
    }

    private static async create(data: Partial<TAccount>) {
        return await Account.create({
            plan: AccountPlanType.Lite,
            username: '',
            ...data,
            email: data.email && data.email.toLowerCase(),
            address: data.address && toChecksumAddress(data.address),
        });
    }

    static async find({ subs, query }: Partial<{ subs: string[]; query: string }>): Promise<TAccount[]> {
        if (subs && subs.length) {
            return await Account.find({ _id: { $in: subs } });
        } else if (query && query.length) {
            return await Account.find({
                $or: [{ username: new RegExp(query, 'i') }, { email: new RegExp(query, 'i') }],
            });
        } else {
            return [];
        }
    }

    static async update(sub: string, data: Partial<TAccount>) {
        const account = await Account.findById(sub);
        if (!account) throw new NotFoundError('Account not found.');

        // Test username when changing username
        if (data.username && account.username !== data.username) {
            const isUsed = await Account.exists({
                username: data.username,
                _id: { $ne: data._id, $exists: true },
            });
            if (isUsed) throw new BadRequestError('Username already in use.');
        }

        // Send verification email when changing email
        if (data.email) {
            // Only check if email is different than the current one
            if (data.email !== account.email) {
                const isUsed = await Account.exists({
                    email: data.email,
                    _id: { $ne: String(account._id), $exists: true },
                });
                if (isUsed) throw new BadRequestError('Email already in use.');
                data.isEmailVerified = false;
            }
        }

        return await this.decorate(await Account.findByIdAndUpdate(account.id, data, { new: true }));
    }

    static async getByDiscordId(discordId: string): Promise<TAccount> {
        const token = await Token.findOne({ kind: AccessTokenKind.Discord, userId: discordId });
        return await Account.findById(token.sub);
    }

    static getByIdentity(identity: string): Promise<TAccount> {
        return Account.findById({ identity });
    }

    static async isEmailDuplicate(email: string) {
        try {
            const accountExists = await Account.exists({ email: email.toLowerCase() });
            return !!accountExists;
        } catch (error) {
            if (error.response.status === 404) {
                return false;
            }
            throw error;
        }
    }

    static remove(sub: string) {
        return Account.findByIdAndDelete(sub);
    }
}

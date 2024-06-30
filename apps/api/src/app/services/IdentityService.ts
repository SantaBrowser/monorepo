import { WalletVariant } from '@thxnetwork/common/enums';
import { Wallet, Identity, PoolDocument } from '@thxnetwork/api/models';
import { uuidV1 } from '../util/uuid';
import { NotFoundError } from 'openai';
import { ForbiddenError } from '@thxnetwork/api/util/errors';

export default class IdentityService {
    static getUUID(pool: PoolDocument, salt: string) {
        const poolId = String(pool._id);
        return uuidV1(`${poolId}${salt}`);
    }

    // Derive uuid v1 from poolId + salt. Using uuid v1 format so we can
    // validate the input using express-validator
    static getIdentityForSalt(pool: PoolDocument, salt: string) {
        const uuid = this.getUUID(pool, salt);
        // const find = Identity.findOne({ poolId: pool._id, uuid })
        // if (find) {
        //   console.log('found....................................')
        //   return find;
        // }

        return Identity.findOneAndUpdate(
            { poolId: pool._id, uuid },
            { poolId: pool._id, uuid },
            { new: true, upsert: true },
        );
    }

    static async forceConnect(pool: PoolDocument, account: TAccount) {
        // Search for WalletConnect wallets for this sub
        const wallets = await Wallet.find({ sub: account.sub, variant: WalletVariant.WalletConnect });
        if (!wallets.length) return;

        // Create a list of uuids for these wallets
        const uuids = wallets.map((wallet) => this.getUUID(pool, wallet.address));

        // Find any identity for these uuids and update
        await Identity.findOneAndUpdate({ uuid: { $in: uuids } }, { sub: account.sub });
    }

  static async forceConnectClidUUID(pool: PoolDocument, account: TAccount, sub) {
      const clid = account.clid;
      const result = await this.getIdentityForSalt(pool, clid);
      const uuid = result.uuid;
      const isConnected = await Identity.exists({ uuid, sub: { $exists: true } });
      if (!isConnected) {
          const identity = await Identity.findOneAndUpdate({ uuid }, { sub }, { new: true });
      }
  }
}

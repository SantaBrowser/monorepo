import { safeVersion } from '@thxnetwork/api/services/ContractService';
import { toChecksumAddress } from 'web3-utils';
import { Wallet } from '@thxnetwork/api/models/Wallet';
import { ChainId } from '@thxnetwork/common/enums';
import { getProvider } from '@thxnetwork/api/util/network';
import { SafeFactory } from '@safe-global/protocol-kit';
import { NODE_ENV } from '@thxnetwork/api/config/secrets';

export default async function main() {
    const SAFE = toChecksumAddress(''); // Provide values
    const RELAYER = toChecksumAddress(''); // Provide values
    const ACCOUNT = toChecksumAddress(''); // Provide values
    const wallet = await Wallet.findOne({
        address: SAFE,
        chainId: NODE_ENV === 'production' ? ChainId.Polygon : ChainId.Sepolia,
    });
    if (SAFE !== wallet.address) throw new Error('Provided address does not equal Safe address.');

    const { ethAdapter } = getProvider(NODE_ENV === 'production' ? ChainId.Polygon : ChainId.Sepolia);
    const safeFactory = await SafeFactory.create({
        safeVersion,
        ethAdapter,
    });
    const safeAccountConfig = {
        owners: [RELAYER, ACCOUNT],
        threshold: 2,
    };
    const safeAddress = await safeFactory.predictSafeAddress(safeAccountConfig);
    console.log(safeAddress);

    await safeFactory.deploySafe({ safeAccountConfig, options: { gasLimit: '3000000' } });
}

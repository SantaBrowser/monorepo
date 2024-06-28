import { Request, Response } from 'express';
import { fromWei } from 'web3-utils';
import { NODE_ENV } from '@thxnetwork/api/config/secrets';
import { ChainId } from '@thxnetwork/common/enums';
import { logger } from '@thxnetwork/api/util/logger';
import { getProvider } from '@thxnetwork/api/util/network';
import { ethers } from 'ethers';
import { getArtifact } from '@thxnetwork/api/hardhat';
import { BigNumber } from 'alchemy-sdk';
import { name, version, license } from '../../../../package.json';

function handleError(error: Error) {
    logger.error(error);
    return { error: 'invalid response' };
}

async function getNetworkDetails(chainId: ChainId) {
}

const controller = async (req: Request, res: Response) => {
    const jsonData = {
        name,
        version,
        license,
    };

    const result = {
        ...jsonData,
        networks: {},
    };

    if (NODE_ENV !== 'production') {
        result.networks[ChainId.Hardhat] = await getNetworkDetails(ChainId.Hardhat);
    } else {
        // result.networks[ChainId.Polygon] = await getNetworkDetails(ChainId.Polygon);
        result.networks[ChainId.Sepolia] = await getNetworkDetails(ChainId.Sepolia);
    }

    res.header('Content-Type', 'application/json').send(JSON.stringify(result, null, 4));
};

export { controller };

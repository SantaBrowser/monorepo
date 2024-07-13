import { controller, validation } from '@thxnetwork/api/controllers/pools/rewards/post.controller'; // Adjust the path accordingly
import PoolService from '@thxnetwork/api/services/PoolService';
import RewardService from '@thxnetwork/api/services/RewardService';
import { NotFoundError } from '@thxnetwork/api/util/errors';

jest.mock('@thxnetwork/api/services/PoolService', () => ({
    getById: jest.fn(),
}));

jest.mock('@thxnetwork/api/services/RewardService', () => ({
    create: jest.fn(),
}));

describe('Controller Tests', () => {
    it('should handle successful creation of a reward', async () => {
        const mockReq = {
            params: { id: 'validMongoId', variant: 'someVariant' },
            body: {
                erc20Id: 'validErc20Id',
                amount: 100,
                erc721Id: 'validErc721Id',
                erc1155Id: 'validErc1155Id',
                metadataIds: 'validMetadataIds',
                tokenId: 'validTokenId',
                webshopURL: 'https://example.com',
                codes: '[["code1", "code2"]]',
                webhookId: 'validWebhookId',
                metadata: 'validMetadata',
                discordRoleId: 'validDiscordRoleId',
                contractChannelName: 'validChannelName',
                contractChaincodeName: 'validChaincodeName',
                contractContractName: 'validContractName',
                tokenCollection: 'validCollection',
                tokenCategory: 'validCategory',
                tokenType: 'validType',
                tokenAdditionalKey: 'validAdditionalKey',
            },
            file: null,
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (PoolService.getById as jest.Mock).mockResolvedValue({});
        (RewardService.create as jest.Mock).mockResolvedValue({});

        await controller(mockReq as any, mockRes as any);

        expect(PoolService.getById).toHaveBeenCalledWith(mockReq.params.id);
        expect(RewardService.create).toHaveBeenCalled();
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({});
    });

    it('should return a NotFoundError when the pool does not exist', async () => {
        const mockReq = {
            params: { id: 'invalidMongoId', variant: 'someVariant' },
            body: {},
            file: null,
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (PoolService.getById as jest.Mock).mockResolvedValue(null);

        await expect(controller(mockReq as any, mockRes as any)).rejects.toThrow(NotFoundError);

        expect(PoolService.getById).toHaveBeenCalledWith(mockReq.params.id);
        expect(mockRes.status).not.toHaveBeenCalled();
    });
});

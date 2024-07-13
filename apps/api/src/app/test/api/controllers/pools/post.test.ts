import { controller } from '@thxnetwork/api/controllers/pools/post.controller';
import PoolService from '@thxnetwork/api/services/PoolService';
import SafeService from '@thxnetwork/api/services/SafeService';

jest.mock('@thxnetwork/api/services/PoolService', () => ({
    deploy: jest.fn(),
}));

jest.mock('@thxnetwork/api/services/SafeService', () => ({
    create: jest.fn(),
}));

describe('Controller Tests', () => {
    it('should handle successful deployment of a pool and safe', async () => {
        const mockReq = {
            auth: { sub: 'testSub' },
            body: { settings: { title: 'My Quest Campaign' } },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (PoolService.deploy as jest.Mock).mockResolvedValue({
            _id: 'poolId',
            toJSON: jest.fn().mockReturnValue({}),
            updateOne: jest.fn(),
        });
        (SafeService.create as jest.Mock).mockResolvedValue({ address: 'safeAddress' });

        await controller(mockReq as any, mockRes as any);

        expect(PoolService.deploy).toHaveBeenCalledWith(mockReq.auth.sub, mockReq.body.settings.title);
        expect(SafeService.create).toHaveBeenCalledWith({
            sub: mockReq.auth.sub,
            safeVersion: '1.3.0',
            poolId: 'poolId',
        });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalled();
    });

    it('should handle missing title gracefully', async () => {
        const mockReq = {
            auth: { sub: 'testSub' },
            body: {},
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (PoolService.deploy as jest.Mock).mockResolvedValue({
            _id: 'poolId',
            toJSON: jest.fn().mockReturnValue({}),
            updateOne: jest.fn(),
        });
        (SafeService.create as jest.Mock).mockResolvedValue({ address: 'safeAddress' });

        await controller(mockReq as any, mockRes as any);

        expect(PoolService.deploy).toHaveBeenCalledWith(mockReq.auth.sub, 'My Quest Campaign'); // Default title used
        expect(SafeService.create).toHaveBeenCalledWith({
            sub: mockReq.auth.sub,
            safeVersion: '1.3.0',
            poolId: 'poolId',
        });
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalled();
    });
});

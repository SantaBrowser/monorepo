import { controller, validation } from '@thxnetwork/api/controllers/erc20/transfer/post.controller'; // Adjust the path accordingly
import { ERC20 } from '@thxnetwork/api/models';
import SafeService from '@thxnetwork/api/services/SafeService';
import ERC20Service from '@thxnetwork/api/services/ERC20Service';
import { InsufficientBalanceError, NotFoundError } from '@thxnetwork/api/util/errors';

jest.mock('@thxnetwork/api/models', () => ({
    ERC20:{
        findById: jest.fn(),
    }
}));

jest.mock('@thxnetwork/api/services/SafeService', () => ({
    findById: jest.fn(),
}));

jest.mock('@thxnetwork/api/services/ERC20Service', () => ({
    transferFrom: jest.fn(),
}));

describe('Controller Tests', () => {
    it('should handle successful ERC20 transfer', async () => {
        const mockReq = {
            body: {
                walletId: 'validWalletId',
                erc20Id: 'validErc20Id',
                to: 'recipientAddress',
                amount: '1000000000000000000',
            },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (ERC20.findById as jest.Mock).mockResolvedValue({
            contract: {
                methods: {
                    balanceOf: jest.fn().mockReturnThis(),
                    call: jest.fn().mockResolvedValue('1000000000000000000'),
                },
            },
        });

        (SafeService.findById as jest.Mock).mockResolvedValue({
            address: 'walletAddress',
        });

        (ERC20Service.transferFrom as jest.Mock).mockResolvedValue({
            transactionHash: 'txHash',
        });

        await controller(mockReq as any, mockRes as any);

        expect(ERC20.findById).toHaveBeenCalledWith('validErc20Id');
        expect(SafeService.findById).toHaveBeenCalledWith('validWalletId');
        expect(ERC20Service.transferFrom).toHaveBeenCalledWith(
            expect.any(Object),
            { address: 'walletAddress' },
            'recipientAddress',
            '1000000000000000000',
        );
        expect(mockRes.status).toHaveBeenCalledWith(201);
        expect(mockRes.json).toHaveBeenCalledWith({
            transactionHash: 'txHash',
        });
    });

    it('should return an InsufficientBalanceError when the wallet balance is insufficient', async () => {
        const mockReq = {
            body: {
                walletId: 'validWalletId',
                erc20Id: 'validErc20Id',
                to: 'recipientAddress',
                amount: '5000000000000000000',
            },
        };

        const mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        (ERC20.findById as jest.Mock).mockResolvedValue({
            contract: {
                methods: {
                    balanceOf: jest.fn().mockReturnThis(),
                    call: jest.fn().mockResolvedValue('1000000000000000000'),
                },
            },
        });

        (SafeService.findById as jest.Mock).mockResolvedValue({
            address: 'walletAddress',
        });

        (ERC20Service.transferFrom as jest.Mock).mockRejectedValue(new Error('Insufficient balance'));

        await expect(controller(mockReq as any, mockRes as any)).rejects.toThrow(InsufficientBalanceError);

        expect(ERC20.findById).toHaveBeenCalledWith('validErc20Id');
        expect(SafeService.findById).toHaveBeenCalledWith('validWalletId');
        expect(mockRes.status).not.toHaveBeenCalled();
    });
});

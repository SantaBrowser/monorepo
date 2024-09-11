import { Request, Response } from 'express';
import { query } from 'express-validator';
import { ChainId } from '@thxnetwork/common/enums';
import ContractService from '@thxnetwork/api/services/ContractService';
import AptosService from '@thxnetwork/api/services/AptosService';
import SuiService from '@thxnetwork/api/services/SuiService';
import SolanaService from '@thxnetwork/api/services/SolanaService';

const validation = [
    query('chainId').isInt(),
    // query('address').isEthereumAddress()
];

const controller = async (req: Request, res: Response) => {
    const chainId = req.query.chainId as unknown as ChainId;
    const contractAddress = req.query.address as string;
    if (chainId == ChainId.Aptos) {
        const [name, symbol] = await AptosService.getCoinInfo(contractAddress);
        res.json({ name, symbol, totalSupplyInWei: '' });
    } else if (chainId == ChainId.Sui) {
        const [name, symbol] = await SuiService.getCoinInfo(contractAddress);
        res.json({ name, symbol, totalSupplyInWei: '' });
    } else if (chainId == ChainId.Solana) {
        const [name, symbol] = await SolanaService.getCoinInfo(contractAddress);
        res.json({ name, symbol, totalSupplyInWei: '' });
    } else {
        const contract = ContractService.getContract('THXERC20_LimitedSupply', chainId, contractAddress);
        const [name, symbol, totalSupplyInWei] = await Promise.all([
            contract.name(),
            contract.symbol(),
            contract.totalSupply(),
        ]);
        res.json({ name, symbol, totalSupplyInWei: totalSupplyInWei.toString() });
    }
};
export { controller, validation };

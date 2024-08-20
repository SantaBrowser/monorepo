import { SuiClient } from "@mysten/sui/client";
import { SUI_NODE_URL } from '../config/secrets';

class SuiService {
    async getCoinInfo(contractAddress: string) {
        const client = new SuiClient({ url: SUI_NODE_URL });

        try {
            const coinInfo = await client.getCoinMetadata({
                coinType: contractAddress,
            });
            return [coinInfo?.name, coinInfo?.symbol, coinInfo?.decimals];
        } catch (error) {
            console.error('Failed to fetch coin info:', error);
            return ["", "", 0];
        }
    }

    async getCoinBalance(accountAddress: string, contractAddress: string) {
        const client = new SuiClient({ url: SUI_NODE_URL });

        try {
            const info = await client.getAllCoins({ owner: accountAddress, });
            const data = info.data.filter((dt) => dt.coinType == contractAddress);
            return data[0].balance;
        } catch (error) {
            console.error('Failed to fetch coin info:', error);
            return "0";
        }
    }
}

export default new SuiService();

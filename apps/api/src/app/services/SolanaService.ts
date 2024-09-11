import solanaWeb3 from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Metaplex } from '@metaplex-foundation/js';
import { SOLANA_URL } from '../config/secrets';

class SolanaService {
    async getCoinInfo(contractAddress: string) {
        try {
            const connection = new solanaWeb3.Connection(SOLANA_URL, {
                commitment: 'confirmed',
            });
            const metaplex = Metaplex.make(connection);
            const mintAddress = new solanaWeb3.PublicKey(contractAddress);
            const token = await metaplex.nfts().findByMint({ mintAddress: mintAddress });

            return [token.name, token.symbol, token.mint.decimals];
        } catch (error) {
            console.error('Failed to fetch coin info:', error);

            return ['', '', 0];
        }
    }

    async getCoinBalance(accountAddress: string, contractAddress: string) {
        try {
            const connection = new solanaWeb3.Connection(SOLANA_URL, {
                commitment: 'confirmed',
            });
            const associatedTokenAccount = await getAssociatedTokenAddress(
                new solanaWeb3.PublicKey(contractAddress),
                new solanaWeb3.PublicKey(accountAddress),
            );
            const info = await connection.getTokenAccountBalance(associatedTokenAccount);

            return info.value.amount;
        } catch (error) {
            console.error('Failed to fetch coin info:', error);

            return '0';
        }
    }
}

export default new SolanaService();

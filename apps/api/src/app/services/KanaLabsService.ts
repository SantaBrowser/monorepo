import { Account, AccountAddress, Aptos, AptosConfig, Ed25519PrivateKey, Network, PrivateKey, PrivateKeyVariants } from "@aptos-labs/ts-sdk";
import { WalletDocument } from "../models";

export default class KanaLabsService {
    static async depositToPerps(wallet: WalletDocument, amount: number) {
        try {
            const {
                KANA_DEPOSIT_PRIVATE_KEY,
            } = process.env;

            const depositAmount =  amount;
            const PERPS_MODULE_ADDRESS = '0x7a38039fffd016adcac2c53795ee49325e5ec6fddf3bf02651c09f9a583655a6::perpetual_scripts';

            if (!KANA_DEPOSIT_PRIVATE_KEY) {
                throw new Error('PRIVATE_KEY not set. Put your funded account private key in .env (PRIVATE_KEY).');
            }
            if (!wallet.address) {
                throw new Error(
                    'TARGET_USER_ADDRESS not set. Put the target user address in .env (TARGET_USER_ADDRESS).',
                );
            }

            const network = Network.MAINNET;
            const config = new AptosConfig({ network });
            const aptos = new Aptos(config);

            const DEPOSIT_FUNC = `${PERPS_MODULE_ADDRESS}::deposit`;

            const userAddress = AccountAddress.fromString(wallet.address);
            if (Number.isNaN(depositAmount) || depositAmount <= 0) {
                throw new Error('DEPOSIT_AMOUNT must be a positive integer (in smallest units).');
            }

            // Create signer Account from private key
            let signer: Account;

            const formattedKey = PrivateKey.formatPrivateKey(KANA_DEPOSIT_PRIVATE_KEY, PrivateKeyVariants.Ed25519);
            const privateKey = new Ed25519PrivateKey(formattedKey);
            signer = Account.fromPrivateKey({ privateKey: privateKey });

            const transaction = await aptos.transaction.build.simple({
                sender: signer.accountAddress,
                data: {
                    function: DEPOSIT_FUNC as '${string}::${string}::${string}',
                    functionArguments: [userAddress, depositAmount],
                },
            });

            const committedTxn = await aptos.signAndSubmitTransaction({ signer, transaction });
            const receipt = await aptos.waitForTransaction({
                transactionHash: committedTxn.hash,
                options: { checkSuccess: true },
            });

            return {success: true, hash: receipt.hash};
        } catch (err: any) {
            console.error('Deposit failed:', err?.message ?? err);
            return { success: false,  error: err?.message ?? err };
        }
    }
}

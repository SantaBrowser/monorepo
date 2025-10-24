<template>
    <b-alert v-model="isAlertShown" variant="primary" class="p-2" style="font-weight: 600; font-size: 14px">{{
        error
    }}</b-alert>
    <b-form-group label="Prove ownership">
        <p class="text-opaque">Sign this message using your wallet to confirm it's address.</p>
        <blockquote class="mb-0">
            <code>
                <em>{{ message }}</em>
            </code>
        </blockquote>
    </b-form-group>
    <b-form-group v-if="address" label="Address">
        <span class="text-opaque">{{ address }}</span>
    </b-form-group>
    <b-button v-if="!address" variant="primary" class="w-100" :disabled="isLoadingConnect" @click="onClickConnect">
        Connect Wallet
    </b-button>
    <b-button v-else :disabled="isLoading" class="w-100 btn-primary" @click="onClickAdd">
        <b-spinner v-if="isLoading" small />
        <template v-else>
            Add <strong>{{ walletStore.account.address && shortenAddress(walletStore.account.address) }}</strong>
        </template>
    </b-button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { mapStores } from 'pinia';
import { useWalletStore, walletLogoMap } from '../../stores/Wallet';
import { useAccountStore } from '../../stores/Account';
import { useAuthStore } from '../../stores/Auth';
import { WalletVariant } from '../../types/enums/accountVariant';
import { shortenAddress } from '@thxnetwork/app/utils/address';
import poll from 'promise-poller';
import { ChainId } from '@thxnetwork/common/enums';

export default defineComponent({
    name: 'BaseTabWalletWalletConnect',
    data() {
        return {
            error: '',
            variant: WalletVariant.WalletConnect,
            address: '',
            publicKey: '',
            walletLogoMap,
            WalletVariant,
            message: 'This signature will be used to prove ownership of a web3 account.',
            signature: '',
            isLoading: false,
            shortenAddress,
            isLoadingConnect: false,
        };
    },
    computed: {
        ...mapStores(useAccountStore, useAuthStore, useWalletStore),
        isAlertShown() {
            return !!this.error;
        },
    },
    watch: {
        error(newVal) {
            if (newVal) {
                setTimeout(() => {
                    this.error = '';
                }, 2500);
            }
        },
    },

    mounted() {
        this.walletStore.setWallet(null);
    },
    methods: {
        isMobile() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        async getAddress() {
            const taskFn = async () => {
                return this.walletStore.account.address ? Promise.resolve() : Promise.reject('Account address');
            };
            await poll({ taskFn, interval: 1000, retries: 60 });
            return this.walletStore.account.address;
        },
        async onClickConnect() {
            if (this.isLoadingConnect) return;
            this.isLoadingConnect = true;
            try {
                this.resetConnectionState();

                if (this.walletStore.currentChainId == ChainId.Aptos) {
                    console.log('Connecting to Aptos wallet');

                    // Determine which Aptos wallets are available
                    const isSantaWallet = !!window.santaAptos;
                    const isPetraWallet = !!window.aptos;
                    const isOkxWallet = !!window.okxwallet?.aptos;

                    console.log('Available wallets:', {
                        isSantaWallet,
                        isPetraWallet,
                        isOkxWallet,
                    });

                    try {
                        let response;

                        // Try to connect to available wallets in order of preference
                        if (isSantaWallet) {
                            console.log('Connecting to Santa wallet');
                            response = await window.santaAptos.connect();
                            console.log('Santa wallet connect response:', response);

                            // Santa wallet stores address in response.args
                            this.address = response.args?.address;
                            this.publicKey = response.args?.publicKey;
                            console.log('Santa wallet address:', this.address);
                            console.log('Santa wallet publicKey:', this.publicKey);

                            if (!this.address) {
                                console.warn('No address found in Santa wallet response');
                                if (response.address) {
                                    this.address = response.address;
                                    console.log('Using response.address instead:', this.address);
                                }
                            }

                            this.walletStore.account = { address: this.address };
                        } else if (isPetraWallet) {
                            console.log('Connecting to Petra wallet');
                            response = await window.aptos.connect();
                            console.log('Petra wallet connect response:', response);

                            this.address = response.address;
                            this.publicKey = response.publicKey;
                            this.walletStore.account = { address: response.address };
                        } else if (isOkxWallet) {
                            console.log('Connecting to OKX wallet');
                            response = await window.okxwallet.aptos.connect();
                            console.log('OKX wallet connect response:', response);

                            this.address = response.address;
                            this.publicKey = response.publicKey;
                            this.walletStore.account = { address: response.address };
                        } else {
                            this.error =
                                'No Aptos wallet extension found. Please install a wallet like Santa Wallet, Petra, or OKX.';
                            return;
                        }

                        // Verify we have an address
                        if (!this.address) {
                            this.error = 'Failed to get wallet address';
                            return;
                        }

                        console.log('Successfully connected to wallet with address:', this.address);
                    } catch (error) {
                        console.error('Wallet connect error:', error);
                        if (error.status === 'Rejected') {
                            this.error = 'Wallet connection rejected. Please check your wallet.';
                        } else {
                            this.error = 'Failed to connect wallet: ' + (error.message || error);
                        }
                    }
                } else if (this.walletStore.currentChainId == ChainId.Sui) {
                    console.log('Not supporting Sui at the moment.');
                    // try {
                    //     if (window.martian.sui._isConnected) await window.martian.sui.disconnect();
                    //     const accountInfo = await window.martian.sui.connect(['viewAccount', 'suggestTransactions']);
                    //     try {
                    //         await this.walletStore.create({
                    //             chainId: ChainId.Sui,
                    //             variant: this.variant,
                    //             rawAddress: accountInfo.address,
                    //         });
                    //         const wallet = this.walletStore.wallets.find(
                    //             (wallet: TWallet) => wallet.address === accountInfo.address,
                    //         );
                    //         if (!wallet) throw new Error('New wallet not found');

                    //         this.walletStore.setWallet(wallet);
                    //         this.$emit('close');
                    //     } catch (error) {
                    //         console.error(error);
                    //         this.error = 'An issue occured while creating your wallet. Please try again.';
                    //     } finally {
                    //         this.isLoading = false;
                    //     }
                    // } catch (error) {
                    //     console.error(error);
                    // }
                } else if (this.walletStore.currentChainId == ChainId.Solana) {
                    console.log('Not supporting Solana at the moment.');
                    // try {
                    //     const provider = window.phantom?.solana;
                    //     const resp = await provider.connect();
                    //     const accountAddress = resp.publicKey.toString();
                    //     console.log(accountAddress);
                    //     try {
                    //         await this.walletStore.create({
                    //             chainId: ChainId.Solana,
                    //             variant: this.variant,
                    //             rawAddress: accountAddress,
                    //         });
                    //         const wallet = this.walletStore.wallets.find(
                    //             (wallet: TWallet) => wallet.address === accountAddress,
                    //         );
                    //         if (!wallet) throw new Error('New wallet not found');

                    //         this.walletStore.setWallet(wallet);
                    //         this.$emit('close');
                    //     } catch (error) {
                    //         console.error(error);
                    //         this.error = 'An issue occured while creating your wallet. Please try again.';
                    //     } finally {
                    //         this.isLoading = false;
                    //     }
                    // } catch (error) {
                    //     console.error(error);
                    // }
                } else {
                    try {
                        await this.walletStore.disconnect();
                        await this.walletStore.connect();
                        this.address = await this.getAddress();
                    } catch (error) {
                        console.error(error);
                        this.error = 'An issue occured while connecting your wallet. Please try again.';
                    }
                }
            } finally {
                this.isLoadingConnect = false;
            }
        },
        resetConnectionState() {
            this.address = '';
            this.publicKey = '';
            this.signature = '';
            this.walletStore.setWallet(null);
            this.walletStore.account = { address: '' };
        },
        async onClickAdd() {
            if (this.walletStore.currentChainId == ChainId.Aptos) {
                this.isLoading = true;
                let signature, publicKey, address;
                let message = this.message;

                try {
                    // Determine which Aptos wallet is connected
                    const isSantaWallet = !!window.santaAptos;
                    const isPetraWallet = !!window.aptos;
                    const isOkxWallet = !!window.okxwallet?.aptos;

                    console.log('Connected wallets:', {
                        isSantaWallet,
                        isPetraWallet,
                        isOkxWallet,
                    });

                    // Handle Santa wallet
                    if (isSantaWallet) {
                        console.log('Using Santa wallet for signing');
                        // Format message the way Santa wallet expects it
                        const formattedMessage = `APTOS\nmessage: ${this.message}\nnonce: random`;
                        console.log('Signing with formatted message:', formattedMessage);

                        const response = await window.santaAptos.signMessage(formattedMessage);
                        console.log('Santa wallet sign response:', response);

                        // Extract signature from response - try all possible locations
                        signature =
                            response.signature ||
                            response.signatureHex ||
                            response.args?.signature ||
                            response.args?.signatureHex;
                        console.log('Extracted signature:', signature);

                        if (!signature && typeof response === 'object') {
                            // Try to find signature in any property of the response
                            console.log('Searching for signature in response object...');
                            for (const key in response) {
                                if (key.toLowerCase().includes('signature')) {
                                    signature = response[key];
                                    console.log(`Found signature in response.${key}:`, signature);
                                    break;
                                }
                            }
                        }

                        // Use existing values from connection step or extract from sign response
                        publicKey = this.publicKey || response.publicKey || response.args?.publicKey;
                        address = this.address || response.address || response.args?.address;

                        console.log('After signing:', {
                            signature,
                            publicKey,
                            address,
                        });

                        message = formattedMessage; // Use the formatted message
                    }
                    // Handle Petra wallet
                    else if (isPetraWallet) {
                        console.log('Using Petra wallet for signing');
                        const response = await window.aptos.signMessage({
                            message: this.message,
                            nonce: 'random',
                        });
                        console.log('Petra wallet sign response:', response);

                        signature = response.signature;
                        publicKey = response.publicKey;
                        address = this.address; // Already set during connect
                    }
                    // Handle OKX wallet
                    else if (isOkxWallet) {
                        console.log('Using OKX wallet for signing');
                        const response = await window.okxwallet.aptos.signMessage({
                            message: this.message,
                            nonce: 'random',
                        });
                        console.log('OKX wallet sign response:', response);

                        signature = response.signature;
                        publicKey = response.publicKey;
                        address = this.address; // Already set during connect
                    } else {
                        throw new Error('No supported Aptos wallet found');
                    }

                    // Verify we have all required fields before creating the wallet
                    if (!address) {
                        console.error('Missing address for wallet creation');
                        this.error = 'Failed to get wallet address';
                        return;
                    }

                    if (!signature) {
                        console.error('Missing signature for wallet creation');
                        this.error = 'Failed to get wallet signature';
                        return;
                    }

                    console.log('Creating wallet with data:', {
                        chainId: ChainId.Aptos,
                        variant: this.variant,
                        message: message,
                        publicKey: publicKey,
                        signature: signature,
                        rawAddress: address,
                        address: address,
                    });

                    // Create wallet with all required fields
                    await this.walletStore.create({
                        chainId: ChainId.Aptos,
                        variant: this.variant,
                        message: message,
                        publicKey: publicKey,
                        signature: signature,
                        rawAddress: address,
                        address: address, // Explicitly add address field for the API
                    });
                    const wallet = this.walletStore.wallets.find((wallet: TWallet) => wallet.address === this.address);
                    if (!wallet) throw new Error('New wallet not found');

                    this.walletStore.setWallet(wallet);

                    if (this.isMobile()) {
                        alert(`Wallet added successfully! Please return to Santa app.`);
                    }
                    this.$emit('close');
                } catch (error) {
                    console.error(error);
                    this.error = 'Wallet connect is rejected. Please check your wallet.';
                } finally {
                    this.isLoading = false;
                }
            } else {
                this.isLoading = true;
                try {
                    const signature = await this.walletStore.signMessage(this.message);
                    await this.walletStore.create({
                        chainId: this.walletStore.chainId,
                        variant: this.variant,
                        message: this.message,
                        signature,
                    });
                    const wallet = this.walletStore.wallets.find((wallet: TWallet) => wallet.address === this.address);
                    if (!wallet) throw new Error('New wallet not found');

                    this.walletStore.setWallet(wallet);
                    this.$emit('close');
                } catch (error) {
                    console.error(error);
                    this.error = 'An issue occured while creating your wallet. Please try again.';
                } finally {
                    this.isLoading = false;
                }
            }
        },
    },
});
</script>

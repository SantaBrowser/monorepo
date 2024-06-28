import hre from 'hardhat';
import { parseUnits } from 'ethers/lib/utils';
import { contractArtifacts, getArtifact, TContractName } from '..';
import { Signer } from '@ethersproject/abstract-signer';

const deployERC20 = async (contractName: TContractName, args: string[], signer: Signer) => {
    const artifact = getArtifact(contractName);
    const factory = new hre.ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    const contract = await factory.deploy(...args);
    console.log(`${contractName} ${contract.address}`);
    return contract;
};

async function main() {
    const [signer] = (await hre.ethers.getSigners()) as unknown as Signer[];
    // Deploy Safe infrastructure
    for (const contractName of [
        'SimulateTxAccessor',
        'GnosisSafeProxyFactory',
        'DefaultCallbackHandler',
        'CreateCall',
        'MultiSend',
        'MultiSendCallOnly',
        'SignMessageLib',
        'GnosisSafeL2',
    ] as TContractName[]) {
        await deployERC20(contractName, [], signer);
    }
    // Deploy Balancer infrastructure
    const totalSupply = parseUnits('1000000', 'ether').toString();
    const thx = await deployERC20('THX', [await signer.getAddress(), totalSupply], signer);
    const usdc = await deployERC20('USDC', [await signer.getAddress(), totalSupply], signer);
    const bal = await deployERC20('BAL', [await signer.getAddress(), totalSupply], signer);
    const bpt = await deployERC20('BPT', [await signer.getAddress(), totalSupply], signer);
    const gauge = await deployERC20('BPTGauge', [bpt.address], signer);
    const vault = await deployERC20('BalancerVault', [bpt.address, usdc.address, thx.address], signer);
}

export default deployERC20;

import hre from 'hardhat';
import { getArtifact, TContractName } from '..';
import { Signer } from '@ethersproject/abstract-signer';

const deploy = async (contractName: TContractName, args: string[], signer: Signer) => {
    const artifact = getArtifact(contractName);
    const factory = new hre.ethers.ContractFactory(artifact.abi, artifact.bytecode, signer);
    const contract = await factory.deploy(...args);
    console.log(`${contractName} ${contract.address}`);
    return contract;
};

async function main() {
    const [signer] = (await hre.ethers.getSigners()) as unknown as Signer[];
      await deploy('THXERC20_LimitedSupply', ['TST', 'TST', '0x2690A3f027B6B9FA68B3DAf4CC3A01805aC5a11f', '10000000000000000000000'], signer);
}

main().catch(console.error);

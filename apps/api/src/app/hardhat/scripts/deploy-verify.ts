import hre, { ethers } from 'hardhat';

/**
 * Run the deployment script
 * @dev npx hardhat run --network arbitrum scripts/deploy-verify.ts
 */
async function main() {
    const BondPurchaseCheckerFactory = await ethers.getContractFactory('BondPurchaseCheckerFactory');
    const factory = await BondPurchaseCheckerFactory.deploy();
    await factory.deployed();

    console.log('Factory deployed to:', factory.address);

    const BOND_ADDRESS = '0xBONDADDRESS';
    const tx = await factory.deploy(BOND_ADDRESS);
    const receipt: any = await tx.wait();
    const newContractAddress = receipt.events[0].args[0];
    console.log('New BondPurchaseChecker deployed to:', newContractAddress);

    await hre.run('verify:verify', {
        address: '0xb292e5930b120dAe29F8308E696813f596A91f94',
        constructorArguments: [],
    });
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

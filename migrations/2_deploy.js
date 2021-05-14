const aliToken = artifacts.require("aliToken");
const dBank = artifacts.require("dBank");

module.exports = async function (deployer) {
	//deploy Token
	await deployer.deploy(aliToken)

	//assign token into variable to get it's address
	const aToken = await aliToken.deployed()

	//pass token address for dBank contract(for future minting)
	await deployer.deploy(dBank, aToken.address)
	
	//assign dBank contract into variable to get it's address
	const dbank = dBank.deployed()

	//change token's owner/minter from deployer to dBank
	await aToken.passMinterRole(dbank.address)
};
//0x3b9EC2C33cE569b1728b1e694d2E96286Cb8b5e8
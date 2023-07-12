const test = artifacts.require("./ENSRegistry")
const web3= require('web3')

const Web3 = new web3('http://127.0.0.1:8546')

module.exports = function(deployer) {
    Web3.eth.personal.unlockAccount("0x228Fd47dE8DaAeabC487450cc863EeCf2430bDf0","asdfg35800",36000)
    deployer.then(async () => {
    await Web3.eth.personal.unlockAccount("0x228Fd47dE8DaAeabC487450cc863EeCf2430bDf0","asdfg35800",36000)
    await deployer.deploy(test, { from: "0x228Fd47dE8DaAeabC487450cc863EeCf2430bDf0"});
    console.log("Contract Deployed");
    });
};

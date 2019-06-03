const Owokan = artifacts.require("Owokan");
const OwokanSale = artifacts.require("OwokanSale");

module.exports = function(deployer) {
    // subsequent arguments will be passed into the constructor function for the contract
    deployer.deploy(Owokan, 1000000).then(function() {
        // token price is 0.001 ether
        const tokenPrice = 1000000000000000;
        return deployer.deploy(OwokanSale, Owokan.address, tokenPrice);
    });
};

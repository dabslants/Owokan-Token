const Owokan = artifacts.require("Owokan");

module.exports = function(deployer) {
    // subsequent arguments will be passed into the constructor function for the contract
    deployer.deploy(Owokan, 1000000);
};

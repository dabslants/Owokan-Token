const Owokan = artifacts.require("Owokan");

contract("Owokan", function(accounts) {

    var owokanInstance;

    it("initializes the contract to the correct values", function() {
        return Owokan.deployed().then(function(instance) {
            owokanInstance = instance;
            return owokanInstance.name();
        }).then(function(name) {
            assert.equal(name, 'Owokan', 'erc-20 token name equals Owokan');
            return owokanInstance.symbol();
        }).then(function(symbol){
            assert.equal(symbol, 'OWO', 'erc-20 token symbol equals OWO');
            return owokanInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, 'Owokan v1.0', 'Current version: Owokan v1.0');
        });
    });

    it("total supply is allocated upon deployment", function() {
        return Owokan.deployed().then(function(instance) {
            owokanInstance = instance;
            return owokanInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply, 1000000, 'total supply equals to 1000000');
            return owokanInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), 1000000, 'it allocates the inital supply to the admin account');
        });
    });
});

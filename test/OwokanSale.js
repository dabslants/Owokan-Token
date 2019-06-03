const OwokanSale = artifacts.require('OwokanSale.sol');

contract('OwokanSale', function(accounts) {

    var owokanSaleInstance;
    const tokenPrice = 1000000000000000; // in wei

    it('initilizes contract with the correct values', function() {
        return OwokanSale.deployed().then(function(instance) {
            owokanSaleInstance = instance;
            return owokanSaleInstance.address;
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has a contract address');
            return owokanSaleInstance.tokenContract();
        }).then(function(address) {
            assert.notEqual(address, 0x0, 'has a token contract');
            return owokanSaleInstance.tokenPrice();
        }).then(function(price) {
            assert.equal(price, tokenPrice, 'token price is correct');
        });
    });

})

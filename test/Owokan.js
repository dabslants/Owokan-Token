const Owokan = artifacts.require("Owokan");

contract("Owokan", function(accounts) {

    var owokanInstance;

    it("total supply is set on deployment", function() {
        return Owokan.deployed().then(function(instance) {
            owokanInstance = instance;
            return owokanInstance.totalSupply();
        }).then(function(totalSupply) {
            assert.equal(totalSupply, 1000000, 'total supply equals to 1000000')
        });
    });
});

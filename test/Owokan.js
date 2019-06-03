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

    it("transfer token ownership", function() {
        return Owokan.deployed().then(function(instance) {
            owokanInstance = instance;
            // test require statement by transferring something larger than the sender's balance
            // call calls the function without creating a transaction
            return owokanInstance.transfer.call(accounts[1], 999999999999999);
            // assert fail for require exception
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must conatain revert');
            return owokanInstance.transfer.call(accounts[1], 250000, {from: accounts[0]});
        }).then(function(success) {
            assert.equal(success, true, 'it returns true');
            return owokanInstance.transfer(accounts[1], 250000, {from: accounts[0]});
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event is triggered");
            assert.equal(receipt.logs[0].event, "Transfer", "the event type is of 'Transfer'");
            assert.equal(receipt.logs[0].args._from, accounts[0], "logs the account the tokens are transferred from");
            assert.equal(receipt.logs[0].args._to, accounts[1], "logs the account the tokens are transferred to");
            assert.equal(receipt.logs[0].args._value, 250000, "logs the amount transferred");
            return owokanInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 250000, 'adds the amount to receiving account');
            return owokanInstance.balanceOf(accounts[0]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 750000, 'deducts the amount from sending account');
        });
    });
});

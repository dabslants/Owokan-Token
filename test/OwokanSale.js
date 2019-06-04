const Owokan = artifacts.require('Owokan.sol');
const OwokanSale = artifacts.require('OwokanSale.sol');

contract('OwokanSale', function(accounts) {

    var owokanInstance;
    var owokanSaleInstance;
    const admin = accounts[0];
    const buyer = accounts[1];
    const tokenPrice = 1000000000000000; // in wei
    const tokensAvailable = 750;
    var numberOfTokens;

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

    it('facilitates token purchase', function() {
        return Owokan.deployed().then(function(instance) {
            // grab owokan instance first
            owokanInstance = instance;
            return OwokanSale.deployed();
        }).then(function(instance) {
            // grab owokanSale instance
            owokanSaleInstance = instance;

            // transfer 75% of all token to owokanSale contract
            return owokanInstance.transfer(owokanSaleInstance.address, tokensAvailable, { from: admin });
        }).then(function(receipt) {
            numberOfTokens = 10;
            return owokanSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
        }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, "an event is triggered");
            assert.equal(receipt.logs[0].event, "Sell", "the event type is of 'Sell'");
            assert.equal(receipt.logs[0].args._buyer, buyer, "logs the account that bought tokens");
            assert.equal(receipt.logs[0].args._amount, numberOfTokens, "logs the number of tokens bought");
            return owokanSaleInstance.tokenSold();
        }).then(function(amount) {
            assert.equal(amount.toNumber(), numberOfTokens, ' increments the number of tokens sold');
            return owokanInstance.balanceOf(owokanSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), tokensAvailable - numberOfTokens, 'balance is available');
            return owokanInstance.balanceOf(buyer);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), numberOfTokens, 'balance is available');
            // try to buy token at a different price
            return owokanSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: 1 });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'msg.value must equal number of tokens in wei');
            numberOfTokens = 1000;
            return owokanSaleInstance.buyTokens(numberOfTokens, { from: buyer, value: numberOfTokens * tokenPrice });
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'cannot purchase more than available tokens');
        });
    });

    it('ends owokan token sale', function() {
        return Owokan.deployed().then(function(instance) {
            // grab owokan instance first
            owokanInstance = instance;
            return OwokanSale.deployed();
        }).then(function(instance) {
            // grab owokanSale instance
            owokanSaleInstance = instance;
            // end sale by someone other than admin
            return owokanSaleInstance.endSale({from: buyer});
        }).then(assert.fail).catch(function(error) {
            assert(error.message.indexOf('revert') >= 0, 'must be admin to end this sale');
            // send sale as admin
            return owokanSaleInstance.endSale({from: admin});
        }).then(function(receipt) {
            // receipt
            // transfer all remaining tokens to the admin
            return owokanInstance.balanceOf(admin);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), 999990, 'returns all unsold owokan token to admin')
            // check that the contract has zero balance
            return web3.eth.getBalance(owokanSaleInstance.address);
        }).then(function(balance) {
            assert.equal(balance, 0, 'no balance in owokan sale address');
        });
    })

});

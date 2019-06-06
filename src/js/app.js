App = {
    web3Provider: null,
    contracts: {},
    loading: false,
    tokenPrice: 1000000000000000,
    tokensAvailable: 800000,

    init: function() {
        console.log("App initialized...");
        return App.initWeb3();
    },

    initWeb3: async function() {

        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            window.web3 = new Web3(ethereum);
            try {
                // Request account access if needed
                await ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.log('User denied account access')
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = web3.currentProvider;
            window.web3 = new Web3(web3.currentProvider);
        }
        // Non-dapp browsers...
        else {
            App.web3Provider = Web3.givenProvider || 'ws://localhost:7545';
            window.web3 = new Web3(App.web3Provider);
            console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        }

        return App.initContracts();

    },

    initContracts: function() {
        $.getJSON("OwokanSale.json", function(owokanSale) {
            App.contracts.OwokanSale = TruffleContract(owokanSale);
            App.contracts.OwokanSale.setProvider(App.web3Provider);
            App.contracts.OwokanSale.deployed().then(function(owokanSale) {
                console.log("Owokan Sale Address: ", owokanSale.address);
            })
        }).done(function() {
            $.getJSON("Owokan.json", function(owokan) {
                App.contracts.Owokan = TruffleContract(owokan);
                App.contracts.Owokan.setProvider(App.web3Provider);
                App.contracts.Owokan.deployed().then(function(owokan) {
                    console.log("Owokan Address: ", owokan.address);
                });

                // listen for events
                App.listenForEvents();

                // render page
                return App.render();
            });
        });
    },

    // listen for events emitted by contracts
    listenForEvents: function() {
        App.contracts.OwokanSale.deployed().then(function(instance) {
            instance.Sell({}, {
                fromBlock: 0,
                to: 'latest'
            }).watch(function(error, event) {
                console.log('event triggered: ', event);
                App.render();
            });
        });
    },

    render: function() {
        // show page
        if (App.loading) {
            return;
        }

        // set loading
        App.loading = true;

        var loader = $('#loader');
        var content = $('#content');

        // toogle loader and content
        loader.show();
        content.hide();

        // load account data
        web3.eth.getCoinbase(function(err, account) {
            if (err === null) {
                App.account = account;
                $('#accountAddress').html('Your Account: ' + account);
            }
            console.log('account:', account);
        });

        // load owokan contract
        App.contracts.OwokanSale.deployed().then(function(instance) {
            owokanSaleInstance = instance;
            return owokanSaleInstance.tokenPrice();
        }).then(function(tokenPrice){
            console.log(tokenPrice.toNumber());
            App.tokenPrice = tokenPrice;
            $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber());
            return owokanSaleInstance.tokensSold();
        }).then(function(tokensSold) {
            console.log(tokensSold.toNumber());
            App.tokensSold = tokensSold.toNumber();
            $('.tokens-sold').html(App.tokensSold);
            $('.tokens-available').html(App.tokensAvailable);

            var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
            $('#progress').css("width", progressPercent + '%');

            console.log('percent: ', progressPercent);
            console.log('App.tokensSold: ', App.tokensSold);
            console.log('App.tokensAvailable: ', App.tokensAvailable);

            // load owokan contract
            App.contracts.Owokan.deployed().then(function(instance) {
                owokanInstance = instance;
                return instance.balanceOf(App.account);
            }).then(function(balance) {
                console.log('balance:', balance.toNumber())
                $('.owokan-balance').html(balance.toNumber());
                // done loading
                App.loading = false;
                loader.hide();
                content.show();
            })
        });
    },

    buyTokens: function() {
        $('#content').hide();
        $('#loader').show();
        var numberOfTokens = $('#numberOfTokens').val();
        console.log('numberOfTokens', numberOfTokens)
        App.contracts.OwokanSale.deployed().then(function(instance) {
            return instance.buyTokens(numberOfTokens, {
                from: App.account,
                value: numberOfTokens * App.tokenPrice,
                gas: 500000
            });
        }).then(function(result) {
            console.log('Tokens bought...');
            $('form').trigger('reset'); // reset form fields

            // wait for Sell event
        });
    }
}

$(function() {
    $(window).load(function() {
        App.init();
    })
});

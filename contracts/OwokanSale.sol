pragma solidity ^0.5.0;

import "./Owokan.sol";

contract OwokanSale {
    // provide token to token sale contract
    // end sale

    address admin;
    Owokan public tokenContract;
    uint256 public tokenPrice;

    // token solidity
    uint256 public tokenSold;

    // sell event
    event Sell(address _buyer, uint256 _amount);


    constructor(Owokan _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    // multiply numberOfTokens and tokenPrice
    /*DS_Math:

        function mul(uint x, uint y) internal pure returns (uint z) {
            require(y == 0 || (z = x * y) / y == x,                 "ds-math-mul-overflow");
        }*/
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        // require the value is equal to tokens
        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        // require contract has enough tokens available
        // use this to referece this contrat
        // it returns owokanSale contract address
        /* address myAddress = address(this); */
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

        // require a transfer is successful
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        // track number of tokens sold
        tokenSold += _numberOfTokens;

        // trigget a sell event
        emit Sell(msg.sender, _numberOfTokens);
    }
}

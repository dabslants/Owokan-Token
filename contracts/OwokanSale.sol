pragma solidity ^0.5.0;

import "./Owokan.sol";

contract OwokanSale {

    address payable admin;
    Owokan public tokenContract;
    uint256 public tokenPrice;

    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _amount);


    constructor(Owokan _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }

    // buy tokens
    function buyTokens(uint256 _numberOfTokens) public payable {
        require(msg.value == multiply(_numberOfTokens, tokenPrice));
        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        require(tokenContract.transfer(msg.sender, _numberOfTokens));

        tokensSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);
    }

    // end sale
    function endSale() public {
        // require admin
        require(msg.sender == admin);
        // transfer the remaining owokan tokens to admin
        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
        // transfer all tokens to the admin
        admin.transfer(address(this).balance);
    }
}

pragma solidity ^0.5.0;

import "./Owokan.sol";

contract OwokanSale {
    // provide token to token sale contract
    // buy token
    // end sale

    // admin
    // not exposed to the public
    address admin;

    // token contrat
    Owokan public tokenContract;

    // token price
    uint256 public tokenPrice;


    constructor(Owokan _tokenContract, uint256 _tokenPrice) public {
        // asign an admin
        admin = msg.sender;

        // assign token contract
        tokenContract = _tokenContract;

        // set token price
        tokenPrice = _tokenPrice;
    }
}

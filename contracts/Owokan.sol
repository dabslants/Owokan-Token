pragma solidity ^0.5.0;

contract Owokan {

    // name
    string public name = "Owokan";

    // symbol
    string public symbol = "OWO";

    // standard
    string public standard = "Owokan v1.0";

    uint256 public totalSupply;

    // hashmap of address balance using the address as key
    mapping(address => uint256) public balanceOf;

    // underscore denotes local variable with a function scope
    constructor(uint256 _initialSupply) public {

        // msg.sender will be passed as a metadata to this function
        // require admin address set
        /* require(msg.sender); */

        // allocate the initial supply
        balanceOf[msg.sender] = _initialSupply;

        totalSupply = _initialSupply;
    }
}

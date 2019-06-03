pragma solidity ^0.5.0;

contract Owokan {

    string public name = "Owokan";
    string public symbol = "OWO";
    string public standard = "Owokan v1.0";

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    // transfer token between two address
    function transfer(address _to, uint256 _value) public returns (bool success) {
        // trigger exception if the account doesn't have enough
        require(balanceOf[msg.sender] >= _value);

        // transfer the balance
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        // trigger transfer event
        emit Transfer(msg.sender, _to, _value);

        // return boolean
        return true;
    }

}

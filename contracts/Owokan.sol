pragma solidity ^0.5.0;

contract Owokan {

    string public name = "Owokan";
    string public symbol = "OWO";
    string public standard = "Owokan v1.0";

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);

        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(msg.sender, _to, _value);

        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // transferFrom
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {

        // requirements _from has enough tokens
        require(balanceOf[_from] >= _value);

        // require the allowance is big enough for the _value
        require(allowance[_from][msg.sender] >= _value);

        // change balance
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        // update the allowance
        allowance[_from][msg.sender] -= _value;

        // call transfer event
        emit Transfer(_from, _to, _value);

        // return boolean
        return true;
    }

}

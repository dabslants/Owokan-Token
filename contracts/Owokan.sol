pragma solidity ^0.5.0;

contract Owokan {

    string public name = "Owokan";
    string public symbol = "OWO";
    string public standard = "Owokan v1.0";

    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;

    // allowance mapping
    mapping(address => mapping(address => uint256)) public allowance;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    // approve
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

    // delegated trandfer
    // approve transfer
    function approve(address _spender, uint256 _value) public returns (bool success) {
        // allowance
        // maximum amount an account is allowed to spend on behalf of the owner
        allowance[msg.sender][_spender] = _value;

        // approvement
        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    // trandferFrom

}

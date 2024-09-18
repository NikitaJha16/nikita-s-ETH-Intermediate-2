// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event Purchase(address indexed user, string item, uint256 price);

    constructor() {
        owner = payable(msg.sender);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than 0");

        // Update user's balance
        balances[msg.sender] += msg.value;

        // Emit deposit event
        emit Deposit(msg.sender, msg.value);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        uint256 userBalance = balances[msg.sender];
        require(userBalance >= _withdrawAmount, "Insufficient balance");

        // Decrease user balance and transfer the ETH
        balances[msg.sender] -= _withdrawAmount;
        payable(msg.sender).transfer(_withdrawAmount);

        // Emit withdraw event
        emit Withdraw(msg.sender, _withdrawAmount);
    }

    function purchase(string memory itemName, uint256 itemPrice) public {
        uint256 userBalance = balances[msg.sender];
        require(userBalance >= itemPrice, "Insufficient balance for purchase");

        // Deduct the item price from user balance
        balances[msg.sender] -= itemPrice;

        // Emit purchase event
        emit Purchase(msg.sender, itemName, itemPrice);
    }

    // Fallback function to receive ETH directly
    receive() external payable {
        deposit();
    }
}

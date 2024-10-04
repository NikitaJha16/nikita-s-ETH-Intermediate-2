// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;
    mapping(string => uint256) public itemPrices;  // Mapping to store item prices

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event Purchase(string item, uint256 price);  // Event to log purchases

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;

        // Initialize some items and their prices
        itemPrices["ItemA"] = 1 ether;
        itemPrices["ItemB"] = 0.5 ether;
        itemPrices["ItemC"] = 0.3 ether;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    function purchase(string memory itemName) public {
        uint256 itemPrice = itemPrices[itemName];  // Get the price of the item
        require(itemPrice > 0, "Item does not exist");  // Ensure the item exists
        require(balance >= itemPrice, "Insufficient balance for purchase");

        // Deduct the item price from balance
        uint256 _previousBalance = balance;
        balance -= itemPrice;

        // Assert the balance after purchase
        assert(balance == (_previousBalance - itemPrice));

        // Emit purchase event
        emit Purchase(itemName, itemPrice);
    }

    // Add or update item prices (only owner can do this)
    function setItemPrice(string memory itemName, uint256 price) public {
        require(msg.sender == owner, "Only owner can set item prices");
        itemPrices[itemName] = price;
    }
}

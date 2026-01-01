// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CharityTracker {
    address public owner;
    uint public totalDonations;

    struct Donation {
        address donor;
        uint amount;
        uint timestamp;
    }

    Donation[] public donations;

    event DonationReceived(address indexed donor, uint amount, uint timestamp);
    event FundsWithdrawn(address indexed owner, uint amount, uint timestamp);

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation must be > 0");
        donations.push(Donation(msg.sender, msg.value, block.timestamp));
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    function withdraw(uint amount) public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount <= address(this).balance, "Not enough funds");
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount, block.timestamp);
    }

    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }
}

contract FundManager{
    address public owner;
    uint public totalDonations;

    struct Donation {
        address donor;
        uint amount;
        uint timestamp;
    }

    Donation[] public donations;

    event DonationReceived(address indexed donor, uint amount, uint timestamp);
    event FundsWithdrawn(address indexed owner, uint amount, uint timestamp);

    constructor() {
        owner = msg.sender;
    }

    function donate() public payable {
        require(msg.value > 0, "Donation must be > 0");
        donations.push(Donation(msg.sender, msg.value, block.timestamp));
        totalDonations += msg.value;
        emit DonationReceived(msg.sender, msg.value, block.timestamp);
    }

    function withdraw(uint amount) public {
        require(msg.sender == owner, "Only owner can withdraw");
        require(amount <= address(this).balance, "Not enough funds");
        payable(owner).transfer(amount);
        emit FundsWithdrawn(owner, amount, block.timestamp);
    }

    function getDonations() public view returns (Donation[] memory) {
        return donations;
    }
}

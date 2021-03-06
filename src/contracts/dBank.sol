// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./aliToken.sol";

contract dBank {
    //assign Token contract to variable
    aliToken private aToken;

    //add mappings
    mapping(address => uint256) public etherBalanceOf; 

    //add events

    //pass as constructo r argument deployed Token contract
    constructor(aliToken _token) public {
        //assign token deployed contract to variable
        aToken = _token;
    }

    function deposit() public payable {
        //check if msg.sender didn't already deposited funds
        //check if msg.value is >= than 0.01 ETH
        
        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

        //increase msg.sender ether deposit balance
        //start msg.sender hodling time
        //set msg.sender deposit status to true
        //emit Deposit event
    }

    function withdraw() public {
        //check if msg.sender deposit status is true
        //assign msg.sender ether deposit balance to variable for event
        //check user's hodl time
        //calc interest per second
        //calc accrued interest
        //send eth to user
        //send interest in tokens to user
        //reset depositer data
        //emit event
    }

    function borrow() public payable {
        //check if collateral is >= than 0.01 ETH
        //check if user doesn't have active loan
        //add msg.value to ether collateral
        //calc tokens amount to mint, 50% of msg.value
        //mint&send tokens to user
        //activate borrower's loan status
        //emit event
    }

    function payOff() public {
        //check if loan is active
        //transfer tokens from user back to the contract
        //calc fee
        //send user's collateral minus fee
        //reset borrower's data
        //emit event
    }
}

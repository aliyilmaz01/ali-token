// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract aliToken is ERC20 {
  
  address public minter;

  constructor() public payable ERC20("Ali Token", "ALI") {
    //asign initial minter
    minter=msg.sender;
  }

  //Add pass minter role function

  event MinterChanged(address indexed from, address to);

function passMinterRole(address dBank) public returns (bool){
    require(msg.sender==minter,"Error, only owner can change pass minter role");
    minter= dBank;

    emit MinterChanged(msg.sender,dBank);
    return true;
}
  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role  
    require(msg.sender==minter,"Hata: msg.sender madenci degil! Sadece madencilerin uretimine izin verilir");
	_mint(account, amount);
}
}

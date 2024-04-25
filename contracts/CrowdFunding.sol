//SPDX-License-Identifier: MIT

pragma solidity ^0.8.24;

contract CrowdFunding{

       uint number;


    function getNumber() public view returns(uint256){
        return number;
    }

    function changeNumber(uint256 _newNumber) public payable returns(uint256){
        require(msg.value >= 10 );
         number = _newNumber;
         return number;
    }

}
// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract SmartStorage {

    uint256 number = 0;
    mapping(address => uint) numbers;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        numbers[msg.sender] = num;
        number++;
    }

    /**
     * @dev Return value 
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256){
        return numbers[msg.sender];
    }

    function getTotalStoringTransactions() public view returns(uint256) {
        return number;
    }
}
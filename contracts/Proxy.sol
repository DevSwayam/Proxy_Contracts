// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

// EOA -> pROXY -> lOGIC1 
// We will be changing it to
// Eoa -> Proxy -> Logic 2

contract Proxy {
    uint x =0;
    address implementation ;
    function changeImplementation(address _implmentation) external {
        implementation = _implmentation;
    }

    fallback() external{
      (bool success ,)  = implementation.delegatecall(msg.data);
      require(success);
    }
}

contract Logic1{
    uint x =0;
    function changeX(uint _x) external{
        x =_x +1;
    }
}
contract Logic2{
     uint x = 0;
    function changeX(uint _x) external{
        x =_x +3;
    }

    function tripleX() external{
        x *= 3;
    }

}

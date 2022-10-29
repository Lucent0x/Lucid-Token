//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract LucidToken is ERC20Capped {
    address payable public owner;
    uint256 public blockReward;

    constructor(uint256 cap, uint256 reward)
        ERC20("LUCID TOKEN", "LUCID")
        ERC20Capped(cap * (10**decimals()))
    {
        owner = payable(msg.sender);
        _mint(owner, 15000000 * (10**decimals()));
        blockReward = reward * (10**decimals());
    }

    function _mintMinerReward() internal {
        //send block reward to address of current node resolver or miner
        _mint(block.coinbase, blockReward);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        if (
            from != address(0) &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            _mintMinerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        blockReward = reward * (10**decimals());
    }

    function destory() public onlyOwner {
        selfdestruct(owner);
    }

    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only this smart contract deployer only can call this function!"
        );
        _;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {StrategyBet} from "./StrategyBet.sol";
import {IERC20} from "./interfaces/IERC20.sol";
import {IERC4626} from "./interfaces/IERC4626.sol";

contract StrategyFactory {
    event StrategyProposed(address indexed trader, address strategyBet, address[] vaults, uint256[] amounts, address[] tokens);

    address public ausd; // Address of AUSD token

    address[] public allStrategies;

    constructor(address _ausd) {
        ausd = _ausd;
    }

    function proposeStrategy(
        address[] calldata vaults,
        uint256[] calldata amounts,
        address[] calldata tokens,
        uint256 objectivePercent,
        uint256 duration,
        uint256 commission
    ) external returns (address) {
        require(vaults.length == amounts.length, "vaults/amounts mismatch");
        for (uint i = 0; i < tokens.length; i++) {
            require(IERC20(tokens[i]).allowance(address(msg.sender), address(this)) == amounts[i] && IERC20(tokens[i]).balanceOf(address(msg.sender)) >= amounts[i], "Token amount invalid");
            require(IERC4626(vaults[i]).maxDeposit(address(this)) >= amounts[i], "Vault max deposit below amount");
        }

        // Deploy the StrategyBet contract
        StrategyBet bet = new StrategyBet(
            msg.sender,
            vaults,
            amounts,
            tokens,
            ausd,
            objectivePercent,
            duration,
            commission,
            address(this)
        );


        for (uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).transferFrom(msg.sender, address(bet), amounts[i]);
        }

        // Execute the strategy
        bet.executeStrategy();

        // Add the strategy to the list of all strategies
        allStrategies.push(address(bet));
        emit StrategyProposed(msg.sender, address(bet), vaults, amounts, tokens);
        return address(bet);
    }

    function sum(uint256[] memory arr) internal pure returns (uint256 s) {
        for (uint i = 0; i < arr.length; i++) s += arr[i];
    }

    function getAllStrategies() external view returns (address[] memory) {
        return allStrategies;
    }
}
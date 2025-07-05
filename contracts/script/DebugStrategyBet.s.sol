// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Script.sol";
import "../lib/forge-std/src/console.sol";
import "../src/StrategyBet.sol";

contract DebugStrategyBet is Script {
    function run() external view {
        // Replace with your deployed contract address
        address strategyBetAddr = vm.envAddress("STRATEGY_BET");
        StrategyBet bet = StrategyBet(strategyBetAddr);

        // Log primitive storage variables
        console.log("trader:", bet.trader());
        console.log("ausd:", bet.ausd());
        console.log("objectivePercent:", bet.objectivePercent());
        console.log("duration:", bet.duration());
        console.log("commission:", bet.commission());
        console.log("startTime:", bet.startTime());
        console.log("lockTime:", bet.lockTime());
        console.log("endTime:", bet.endTime());
        console.log("initialValue:", bet.initialValue());
        console.log("finalValue:", bet.finalValue());
        console.log("betsClosed:", bet.betsClosed());
        console.log("resolved:", bet.resolved());
        console.log("strategyExecuted:", bet.strategyExecuted());
        console.log("factory:", bet.factory());
        console.log("ausdVault:", bet.ausdVault());
        console.log("yieldAmount:", bet.yieldAmount());
        console.log("totalYes:", bet.totalYes());
        console.log("totalNo:", bet.totalNo());
        console.log("bettingPhaseDuration:", bet.bettingPhaseDuration());

        // Log arrays (vaults, amounts, tokens)
        uint256 vaultsLen = 1; // <-- Set this to the actual length of the arrays in your contract
        for (uint256 i = 0; i < vaultsLen; i++) {
            console.log("vaults[", i, "]:", bet.vaults(i));
            console.log("amounts[", i, "]:", bet.amounts(i));
            console.log("tokens[", i, "]:", bet.tokens(i));
        }

        // Log winner enum
        // If winner is not public, comment out the next line or make it public in the contract
        // console.log("winner (enum as uint):", uint(bet.winner()));

        // Log a few bets (replace with actual addresses you want to check)
        address[] memory testAddresses = new address[](2);
        testAddresses[0] = 0xf858c5EC7d413966B5940f01cBf57B8EaF4071C7; // replace with a bettor address
        testAddresses[1] = 0xf858c5EC7d413966B5940f01cBf57B8EaF4071C7; // replace with another bettor address

        for (uint256 i = 0; i < testAddresses.length; i++) {
            (uint256 amount, StrategyBet.BetSide side, bool claimed) = bet.bets(testAddresses[i]);
            console.log("bets for address:");
            console.log(testAddresses[i]);
            console.log("amount:");
            console.log(amount);
            console.log("side (as uint8):");
            console.log(uint8(side));
            console.log("claimed:");
            console.log(claimed);
        }
    }
}
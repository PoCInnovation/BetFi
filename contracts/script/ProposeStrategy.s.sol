// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../lib/forge-std/src/Script.sol";
import "../src/StrategyFactory.sol";
import "../src/interfaces/IERC20.sol";

contract ProposeStrategyScript is Script {
    // Set these before running the script
    address immutable FACTORY = vm.envAddress("STRATEGY_FACTORY");
    address[] TRADER_TOKEN = [0x203A662b0BD271A6ed5a60EdFbd04bFce608FD36]; // vbUSDC
    address[] VAULTS = [address(0xCE2b8e464Fc7b5E58710C24b7e5EBFB6027f29D7)];
    uint256[] AMOUNTS = [100]; // Amounts to deposit in each vault (in token decimals): 0.0001
    address constant AUSD = 0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a; // Address of AUSD token

    uint256 constant OBJECTIVE_PERCENT = 500; // 5% (in basis points)
    uint256 constant DURATION = 5 minutes; // Duration in seconds
    uint256 constant COMMISSION = 500; // 1% (in basis points)

    function run() external {
        // Load your private key from environment variable
        uint256 pk = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(pk);

        // Approve the factory to spend the trader's tokens
        IERC20(TRADER_TOKEN[0]).approve(FACTORY, AMOUNTS[0]);

        // Propose the strategy
        address strategy = StrategyFactory(FACTORY).proposeStrategy(
            VAULTS,
            AMOUNTS,
            TRADER_TOKEN,
            OBJECTIVE_PERCENT,
            DURATION,
            COMMISSION
        );
        console.log("Strategy deployed at:", strategy);

        vm.stopBroadcast();
    }
}
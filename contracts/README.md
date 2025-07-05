# BetFi Smart Contracts

> For a high-level project overview and user flow, see the [main README](../README.md).

## Contract Architecture

BetFi is powered by a set of smart contracts that manage the lifecycle of strategy betting, from proposal to resolution and payout. The core contracts are:

### 1. StrategyFactory
- **Role:**
  - Entry point for traders to propose new strategies.
  - Validates strategy parameters (vaults, tokens, amounts, etc.).
  - Deploys a new `StrategyBet` contract for each valid strategy.
  - Transfers the trader's funds to the deployed contract.
  - Keeps track of all deployed strategies.

### 2. StrategyBet
- **Role:**
  - Manages a single strategy instance.
  - Handles the execution of the strategy (deposits into ERC4626 vaults).
  - Accepts and tracks bets (YES/NO) from users in AUSD.
  - Locks bets and strategy after the betting phase.
  - Snapshots the strategy value at the start of the lock phase.
  - Resolves the outcome at the end of the strategy duration.
  - Distributes winnings, yield, and commission according to the protocol rules.

#### Key Functions
- `executeStrategy()`: Called after deployment to deposit trader funds into the specified vaults.
- `placeBet(bool isYes, uint256 amount)`: Place a YES/NO bet in AUSD during the betting phase.
- `closeBetsAndLock()`: Ends the betting phase, locks all positions, and snapshots the strategy value.
- `resolveStrategy()`: At the end of the strategy, withdraws funds, determines the outcome, and sets the winner.
- `claim()`: Allows bettors on the winning side to claim their payout.
- `withdrawStrategy()`: Allows the trader to withdraw their commission and any remaining funds after resolution.

#### Protocol Logic
- **Strategy Execution:**
  - Trader's tokens are deposited into the specified ERC4626 vaults.
  - AUSD from bets is also deposited into a yield vault during the betting phase.
- **Betting:**
  - Users can only bet once per strategy.
  - Bets are tracked in a mapping with amount, side, and claim status.
- **Resolution:**
  - At the end of the strategy, the contract checks if the target yield is met.
  - The winning side receives their original bet, a share of the losing side's bets, and a share of the yield (minus commission).
  - The trader receives their commission on the yield.

#### Security & Notes
- All funds are non-custodial and managed by the contracts.
- Only the trader or factory can execute the strategy.
- Only the trader can withdraw strategy funds after resolution.
- Some test functions need to be deleted before deploying to mainnet.

## Deployment

`StrategyFactory` is deployed on the Katana network at `0xC93BEDC364B170c332CEFE65023906A06165511f`

---

## Manual Interaction: Full User Flow with Foundry & Cast

Below are the main commands to interact with the contracts by hand, covering the full user flow for both traders and bettors.

### 1. Approve tokens and propose a New Strategy (Trader)
```bash
forge script ./contracts/script/ProposeStrategy.s.sol:ProposeStrategyScript --rpc-url https://rpc.katana.network/ --broadcast --private-key $PRIVATE_KEY
```

### 2. Approve AUSD to Place Bets (Bettor)
```bash
cast send 0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a "approve(address,uint256)" $STRATEGY_BET 10 --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

### 3. Place a Bet (Bettor)
```bash
cast send $STRATEGY_BET "placeBet(bool,uint256)" false 10 --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

### 4. Close Bets and Lock Funds (anyone)
```bash
cast send $STRATEGY_BET "closeBetsAndLock()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

### 5. Resolve the Strategy (Anyone)
```bash
cast send $STRATEGY_BET "resolveStrategy()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

### 6. Claim Funds (Bettor)
```bash
cast send $STRATEGY_BET "claim()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

### 7. Withdraw Strategy (Trader)
```bash
cast send $STRATEGY_BET "withdrawStrategy()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```


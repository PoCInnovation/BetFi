# BetFi: DeFi Strategy Betting Protocol

## Overview
BetFi is a betting plateform on Katana that allows users to bet on the success or failure of DeFi strategies proposed by traders. The goal is to handle any DeFi protocol. At the moment, the protocol is designed to handle any ERC4626 vault.

- **Traders** propose and execute multi-step DeFi strategies, specifying a target yield, duration, and commission.
- **Bettors** wager on whether the strategy will achieve its target (YES/NO) using the AUSD stablecoin.
- All capital is invested on-chain, and outcomes are resolved and distributed automatically.

## User Flow

### Trader Side
1. **Propose a Strategy**
   - Select DeFi vaults (ERC4626) and tokens.
   - Specify allocation, target yield, duration, and commission.
   - Deposit funds and execute the strategy (providing a live preview during the betting phase).
2. **Wait for Bets**
   - Bettors can place YES/NO bets during the open phase.
3. **Lock and Monitor**
   - After the betting phase, the contract snapshots the strategy's value and locks all positions.
4. **Resolution and Withdrawal**
   - At the end of the strategy, the contract resolves the outcome, distributes winnings, and the trader can withdraw their commission and any remaining funds.

### Bettor Side
1. **Browse Strategies**
   - View live strategies and their parameters (target, duration, preview performance).
2. **Place a Bet**
   - Bet YES or NO on the outcome using AUSD during the open phase.
3. **Wait for Resolution**
   - Bets are locked after the open phase; funds are invested in yield vaults.
4. **Claim Winnings**
   - After resolution, claim your payout if you are on the winning side (original bet + share of losers' bets + share of yield).

## Smart Contracts
The protocol is powered by a set of smart contracts that manage strategy creation, execution, betting, and resolution. For a detailed explanation of the contract architecture and logic, see the [contracts/README.md](contracts/README.md).


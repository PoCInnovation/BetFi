# StrategyBet

## Description

StrategyBet is a contract that allows users to bet on the outcome of a strategy.

## Functions

- `proposeStrategy`: Propose a new strategy.
- `closeBetsAndLock`: Close the betting phase and lock the funds.
- `resolveStrategy`: Resolve the strategy.

commands to do a full user flow:

create a new strategy:

```
forge script ./contracts/script/ProposeStrategy.s.sol:ProposeStrategyScript --via-ir --rpc-url https://rpc.katana.network/ --broadcast --private-key $PRIVATE_KEY
```

approve the ausd to place bets:

```
cast send 0x00000000eFE302BEAA2b3e6e1b18d08D69a9012a "approve(address,uint256)" $STRATEGY_BET 10 --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

place a bet:

```
cast send $STRATEGY_BET "placeBet(bool,uint256)(string)" false 10 --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

close the bets and lock the funds:
```
cast send $STRATEGY_BET "closeBetsAndLock()()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

resolve the strategy:

```
cast send $STRATEGY_BET "resolveStrategy()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

claim the funds (for betters):

```
cast send $STRATEGY_BET "claim()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```

withdraw the strategy (for trader):

```
cast send $STRATEGY_BET "withdrawStrategy()" --rpc-url https://rpc.katana.network/ --private-key $PRIVATE_KEY
```


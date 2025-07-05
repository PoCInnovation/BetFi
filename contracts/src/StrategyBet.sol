// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "./interfaces/IERC20.sol";
import {IERC4626} from "./interfaces/IERC4626.sol";

contract StrategyBet {
    enum BetSide { None, Yes, No }

    struct Bet {
        uint256 amount;
        BetSide side;
        bool claimed;
    }

    address public trader;
    address[] public vaults;
    uint256[] public amounts;
    address[] public tokens;
    address public ausd;
    uint256 public objectivePercent;
    uint256 public duration;
    uint256 public commission; // in basis points (e.g. 100 = 1%)
    uint256 public startTime;
    uint256 public lockTime;
    uint256 public endTime;
    uint256 public initialValue;
    uint256 public finalValue;
    bool public betsClosed;
    bool public resolved;
    bool public strategyExecuted;
    BetSide winner;
    address public factory;
    address public ausdVault;
    uint256 public yieldAmount;

    mapping(address => Bet) public bets;
    uint256 public totalYes;
    uint256 public totalNo;
    uint256 public bettingPhaseDuration;

    event BetPlaced(address indexed user, BetSide side, uint256 amount);
    event BetsClosed(uint256 snapshotValue);
    event StrategyResolved(bool success, uint256 finalValue);
    event Claimed(address indexed user, uint256 amount);

    modifier onlyTrader() {
        require(msg.sender == trader, "not trader");
        _;
    }

    modifier onlyFactoryOrTrader() {
        require(msg.sender == factory || msg.sender == trader, "not allowed");
        _;
    }

    constructor(
        address _trader,
        address[] memory _vaults,
        uint256[] memory _amounts,
        address[] memory _tokens,
        address _ausd,
        uint256 _objectivePercent,
        uint256 _duration,
        uint256 _commission,
        address _factory,
        address _ausdVault
    ) {
        trader = _trader;
        vaults = _vaults;
        amounts = _amounts;
        tokens = _tokens;
        ausd = _ausd;
        objectivePercent = _objectivePercent;
        duration = _duration;
        commission = _commission;
        startTime = block.timestamp;
        factory = _factory;
        strategyExecuted = false;
        bettingPhaseDuration = 2 days;
        ausdVault = _ausdVault;
    }

    function executeStrategy() external onlyFactoryOrTrader {
        require(!strategyExecuted, "already executed");
        strategyExecuted = true;
        for (uint i = 0; i < vaults.length; i++) {
            IERC20(tokens[i]).approve(vaults[i], amounts[i]);
            IERC4626(vaults[i]).deposit(amounts[i], address(this));
        }
    }

    // only for testing purposes to retreive test funds. Need to be removed in production
    function withdrawFunds() external {
        for (uint i = 0; i < vaults.length; i++) {
            IERC4626(vaults[i]).withdraw(IERC4626(vaults[i]).maxWithdraw(address(this)), address(this), address(this));
            IERC20(tokens[i]).transfer(trader, IERC20(tokens[i]).balanceOf(address(this)));
        }
        IERC20(ausd).transfer(trader, IERC20(ausd).balanceOf(address(this)));
    }

    // only for testing purposes to change the betting phase duration. Need to be removed in production
    function changeBettingPhaseDuration(uint256 newDuration) external onlyTrader {
        bettingPhaseDuration = newDuration;
        startTime = block.timestamp;
    }

    function placeBet(bool isYes, uint256 amount) external {
        require(!betsClosed, "bets closed");
        require(amount > 0, "zero amount");
        require(bets[msg.sender].amount == 0, "already bet");
        require(IERC20(ausd).allowance(msg.sender, address(this)) >= amount, "not enough allowance");

        IERC20(ausd).transferFrom(msg.sender, address(this), amount);

        bets[msg.sender] = Bet({
            amount: amount,
            side: isYes ? BetSide.Yes : BetSide.No,
            claimed: false
        });

        if (isYes) totalYes += amount;
        else totalNo += amount;

        // Deposit the AUSD into the vault
        IERC20(ausd).approve(ausdVault, amount);
        IERC4626(ausdVault).deposit(amount, address(this));

        emit BetPlaced(msg.sender, isYes ? BetSide.Yes : BetSide.No, amount);
    }

    function closeBetsAndLock() external {
        require(!betsClosed, "already closed");
        require(block.timestamp >= startTime + bettingPhaseDuration, "betting phase not over");
        betsClosed = true;
        lockTime = block.timestamp;
        endTime = lockTime + duration;

        // Snapshot the value of the strategy
        initialValue = getCurrentValue();
        emit BetsClosed(initialValue);
    }

    function getCurrentValue() public view returns (uint256 total) {
        for (uint i = 0; i < vaults.length; i++) {
            uint256 balance = IERC4626(vaults[i]).balanceOf(address(this));
            total += IERC4626(vaults[i]).previewRedeem(balance);
        }
    }

    function resolveStrategy() external {
        require(betsClosed, "bets not closed");
        require(!resolved, "already resolved");
        require(block.timestamp >= endTime, "not finished");

        finalValue = getCurrentValue();
        resolved = true;

        // Withdraw the AUSD from the vault
        yieldAmount = IERC4626(ausdVault).maxWithdraw(address(this));
        IERC4626(ausdVault).withdraw(yieldAmount, address(this), address(this));

        bool success = (finalValue > initialValue * (10000 + objectivePercent) / 10000);
        winner = success ? BetSide.Yes : BetSide.No;
        emit StrategyResolved(success, finalValue);
    }

    function claim() external {
        require(resolved, "not resolved");
        Bet storage b = bets[msg.sender];
        require(!b.claimed, "already claimed");
        require(b.amount > 0, "no bet");

        uint256 totalWinner = winner == BetSide.Yes ? totalYes : totalNo;
        uint256 totalLoser = winner == BetSide.Yes ? totalNo : totalYes;

        uint256 payout = 0;
        if (b.side == winner && totalWinner > 0 && yieldAmount > 0) {
            int256 yield = int256(yieldAmount) - int256(totalWinner + totalLoser);
            yield = yield < 0 ? int256(0) : yield;
            uint256 traderCommission = yield == 0 ? 0 : (uint256(yield) * commission / 10000);
            require(yieldAmount >= traderCommission, "commission underflow");
            // Each winner gets their bet back plus a share of the losing side's bets
            // Distribute the yield to winners, minus the commission for the trader
            payout = ((b.amount / totalWinner) * (yieldAmount - traderCommission));
        }
        b.claimed = true;
        if (payout > 0 && IERC20(ausd).balanceOf(address(this)) >= payout) {
            IERC20(ausd).transfer(msg.sender, payout);
        } else {
            revert("not enough funds");
        }

        emit Claimed(msg.sender, payout);
    }

    function withdrawStrategy() external onlyTrader {
        require(resolved, "not resolved");
        require(block.timestamp >= endTime, "not finished");
        for (uint i = 0; i < vaults.length; i++) {
            uint256 maxWithdraw = IERC4626(vaults[i]).maxWithdraw(address(this));
            IERC4626(vaults[i]).withdraw(maxWithdraw, address(this), address(this));
            IERC20(tokens[i]).transfer(trader, IERC20(tokens[i]).balanceOf(address(this)));
        }
        if (yieldAmount <= totalNo + totalYes)
            return;
        // Compute the yield generated by the vault (total AUSD withdrawn - total bets on the winning side)
        int256 yield = int256(yieldAmount) - int256(totalYes + totalNo);
        yield = yield < 0 ? int256(0) : yield;
        // The trader receives the commission on the yield
        uint256 payout = uint256(yield) - (uint256(yield) * commission / 10000);
        IERC20(ausd).transfer(address(trader), payout);
    }
}
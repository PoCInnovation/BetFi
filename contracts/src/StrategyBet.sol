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
    address public factory;

    mapping(address => Bet) public bets;
    uint256 public totalYes;
    uint256 public totalNo;

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
        address _factory
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

    function placeBet(bool isYes, uint256 amount) external {
        require(!betsClosed, "bets closed");
        require(amount > 0, "zero amount");
        require(bets[msg.sender].amount == 0, "already bet");

        IERC20(ausd).transferFrom(msg.sender, address(this), amount);

        bets[msg.sender] = Bet({
            amount: amount,
            side: isYes ? BetSide.Yes : BetSide.No,
            claimed: false
        });

        if (isYes) totalYes += amount;
        else totalNo += amount;

        emit BetPlaced(msg.sender, isYes ? BetSide.Yes : BetSide.No, amount);
    }

    function closeBetsAndLock() external onlyTrader {
        require(!betsClosed, "already closed");
        require(block.timestamp >= startTime + 2 days, "betting phase not over"); // 48h
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

        bool success = (finalValue >= initialValue * (10000 + objectivePercent) / 10000);
        emit StrategyResolved(success, finalValue);
    }

    function claim() external {
        require(resolved, "not resolved");
        Bet storage b = bets[msg.sender];
        require(!b.claimed, "already claimed");
        require(b.amount > 0, "no bet");

        bool success = (finalValue >= initialValue * (10000 + objectivePercent) / 10000);
        BetSide winner = success ? BetSide.Yes : BetSide.No;

        uint256 totalWinner = success ? totalYes : totalNo;
        uint256 totalLoser = success ? totalNo : totalYes;

        uint256 payout = 0;
        if (b.side == winner && totalWinner > 0) {
            // Redistribute losing bets proportionally
            payout = b.amount + (b.amount / totalWinner) * totalLoser;
            // Optionally: add yield share here
        }
        b.claimed = true;
        if (payout > 0) IERC20(ausd).transfer(msg.sender, payout);

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
        // add yield share here
    }
}
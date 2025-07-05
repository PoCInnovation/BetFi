import {
  BetPlaced as BetPlacedEvent,
  BetsClosed as BetsClosedEvent,
  Claimed as ClaimedEvent,
  StrategyResolved as StrategyResolvedEvent,
  Strategy as StrategyContract
} from "../generated/templates/Strategy/Strategy"
import { Strategy, Bet } from "../generated/schema"
import { Address, BigInt } from "@graphprotocol/graph-ts"

export function handleBetPlaced(event: BetPlacedEvent): void {
  // Load the strategy entity
  let strategyAddress = event.address
  let strategy = Strategy.load(strategyAddress)
  
  if (strategy) {
    // Update the total bets based on side
    if (event.params.side == 1) { // YES
      strategy.totalYes = strategy.totalYes.plus(event.params.amount)
    } else { // NO
      strategy.totalNo = strategy.totalNo.plus(event.params.amount)
    }
    
    // Save the updated strategy
    strategy.save()
    
    // Create a new bet entity with a unique ID (strategy address + user address)
    let betId = strategyAddress.concat(event.params.user)
    let bet = new Bet(betId)
    
    bet.strategy = strategyAddress
    bet.user = event.params.user
    bet.amount = event.params.amount
    bet.side = event.params.side
    bet.claimed = false
    bet.blockNumber = event.block.number
    bet.blockTimestamp = event.block.timestamp
    bet.transactionHash = event.transaction.hash
    
    bet.save()
  }
}

export function handleBetsClosed(event: BetsClosedEvent): void {
  // Load the strategy entity
  let strategyAddress = event.address
  let strategy = Strategy.load(strategyAddress)
  
  if (strategy) {
    // Mark betting phase as closed
    strategy.betsClosed = true
    strategy.initialValue = event.params.snapshotValue
    
    // Load additional data from the contract
    let contract = StrategyContract.bind(strategyAddress)
    
    // Try to load values from the contract
    let objectivePercentCall = contract.try_objectivePercent()
    if (!objectivePercentCall.reverted) {
      strategy.objectivePercent = objectivePercentCall.value
    }
    
    let durationCall = contract.try_duration()
    if (!durationCall.reverted) {
      strategy.duration = durationCall.value
    }
    
    let endTimeCall = contract.try_endTime()
    if (!endTimeCall.reverted) {
      strategy.endTime = endTimeCall.value
    }
    
    let commissionCall = contract.try_commission()
    if (!commissionCall.reverted) {
      strategy.commission = commissionCall.value
    }
    
    // Save the updated strategy
    strategy.save()
  }
}

export function handleClaimed(event: ClaimedEvent): void {
  // Load the strategy entity
  let strategyAddress = event.address
  
  // Create the bet ID using strategy address + user address
  let betId = strategyAddress.concat(event.params.user)
  let bet = Bet.load(betId)
  
  if (bet) {
    // Mark the bet as claimed
    bet.claimed = true
    bet.save()
  }
}

export function handleStrategyResolved(event: StrategyResolvedEvent): void {
  // Load the strategy entity
  let strategyAddress = event.address
  let strategy = Strategy.load(strategyAddress)
  
  if (strategy) {
    // Update the strategy resolution status
    strategy.resolved = true
    strategy.finalValue = event.params.finalValue
    strategy.strategyExecuted = event.params.success
    
    // Save the updated strategy
    strategy.save()
  }
}

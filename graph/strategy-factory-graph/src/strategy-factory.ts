import { StrategyProposed as StrategyProposedEvent } from "../generated/Strategy_factory/Strategy_factory"
import { StrategyProposed, Strategy } from "../generated/schema"
import { Strategy as StrategyTemplate } from "../generated/templates"
import { Bytes, BigInt } from "@graphprotocol/graph-ts"

export function handleStrategyProposed(event: StrategyProposedEvent): void {
  // Create the StrategyProposed entity
  let entity = new StrategyProposed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.trader = event.params.trader
  entity.strategyBet = event.params.strategyBet
  entity.vaults = changetype<Bytes[]>(event.params.vaults)
  entity.amounts = event.params.amounts
  entity.tokens = changetype<Bytes[]>(event.params.tokens)

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  // Create a new Strategy entity
  let strategyAddress = event.params.strategyBet
  let strategy = new Strategy(strategyAddress)
  
  // Set initial values
  strategy.trader = event.params.trader
  strategy.vaults = changetype<Bytes[]>(event.params.vaults)
  strategy.amounts = event.params.amounts
  strategy.tokens = changetype<Bytes[]>(event.params.tokens)
  
  // Set default values for fields that will be updated later
  strategy.initialValue = BigInt.fromI32(0)
  strategy.objectivePercent = BigInt.fromI32(0)
  strategy.duration = BigInt.fromI32(0)
  strategy.commission = BigInt.fromI32(0)
  strategy.totalYes = BigInt.fromI32(0)
  strategy.totalNo = BigInt.fromI32(0)
  strategy.startTime = event.block.timestamp
  strategy.endTime = BigInt.fromI32(0)
  strategy.betsClosed = false
  strategy.strategyExecuted = false
  strategy.resolved = false
  strategy.finalValue = BigInt.fromI32(0)

  // Save the entities
  strategy.save()
  entity.strategy = strategyAddress
  entity.save()
  
  // Start indexing the Strategy contract
  StrategyTemplate.create(strategyAddress)
}

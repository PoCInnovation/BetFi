import { StrategyProposed as StrategyProposedEvent } from "../generated/Strategy_factory/Strategy_factory"
import { StrategyProposed } from "../generated/schema"
import { Bytes } from "@graphprotocol/graph-ts"

export function handleStrategyProposed(event: StrategyProposedEvent): void {
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

  entity.save()
}

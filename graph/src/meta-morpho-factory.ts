import { CreateMetaMorpho as CreateMetaMorphoEvent } from "../generated/MetaMorpho_factory/MetaMorpho_factory"
import { CreateMetaMorpho } from "../generated/schema"

export function handleCreateMetaMorpho(event: CreateMetaMorphoEvent): void {
  let entity = new CreateMetaMorpho(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.metaMorpho = event.params.metaMorpho
  entity.caller = event.params.caller
  entity.initialOwner = event.params.initialOwner
  entity.initialTimelock = event.params.initialTimelock
  entity.asset = event.params.asset
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.salt = event.params.salt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

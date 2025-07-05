import { CreateMetaMorpho as CreateMetaMorphoEvent } from "../generated/MetaMorpho_factory/MetaMorpho_factory"
import { CreateMetaMorpho, Token } from "../generated/schema"
import { ERC20 } from "../generated/MetaMorpho_factory/ERC20"
import { Address, BigInt } from "@graphprotocol/graph-ts"

function getOrCreateToken(address: Address): Token {
  let token = Token.load(address)
  
  if (token == null) {
    token = new Token(address)
    let erc20Contract = ERC20.bind(address)
    
    // Try to fetch token data, with fallbacks for failed calls
    let nameCall = erc20Contract.try_name()
    token.name = nameCall.reverted ? "Unknown" : nameCall.value
    
    let symbolCall = erc20Contract.try_symbol()
    token.symbol = symbolCall.reverted ? "UNK" : symbolCall.value
    
    let decimalsCall = erc20Contract.try_decimals()
    token.decimals = decimalsCall.reverted ? BigInt.fromI32(18) : BigInt.fromI32(decimalsCall.value)
    
    let totalSupplyCall = erc20Contract.try_totalSupply()
    token.totalSupply = totalSupplyCall.reverted ? null : totalSupplyCall.value
    
    token.save()
  }
  
  return token as Token
}

export function handleCreateMetaMorpho(event: CreateMetaMorphoEvent): void {
  let entity = new CreateMetaMorpho(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  
  // Get or create the token entity
  let token = getOrCreateToken(event.params.asset)
  
  entity.metaMorpho = event.params.metaMorpho
  entity.caller = event.params.caller
  entity.initialOwner = event.params.initialOwner
  entity.initialTimelock = event.params.initialTimelock
  entity.asset = event.params.asset
  entity.assetToken = token.id // Link to token entity
  entity.name = event.params.name
  entity.symbol = event.params.symbol
  entity.salt = event.params.salt

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

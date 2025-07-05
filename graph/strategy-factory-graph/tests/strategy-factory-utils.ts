import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import { StrategyProposed } from "../generated/Strategy_factory/Strategy_factory"

export function createStrategyProposedEvent(
  trader: Address,
  strategyBet: Address,
  vaults: Array<Address>,
  amounts: Array<BigInt>,
  tokens: Array<Address>
): StrategyProposed {
  let strategyProposedEvent = changetype<StrategyProposed>(newMockEvent())

  strategyProposedEvent.parameters = new Array()

  strategyProposedEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  strategyProposedEvent.parameters.push(
    new ethereum.EventParam(
      "strategyBet",
      ethereum.Value.fromAddress(strategyBet)
    )
  )
  strategyProposedEvent.parameters.push(
    new ethereum.EventParam("vaults", ethereum.Value.fromAddressArray(vaults))
  )
  strategyProposedEvent.parameters.push(
    new ethereum.EventParam(
      "amounts",
      ethereum.Value.fromUnsignedBigIntArray(amounts)
    )
  )
  strategyProposedEvent.parameters.push(
    new ethereum.EventParam("tokens", ethereum.Value.fromAddressArray(tokens))
  )

  return strategyProposedEvent
}

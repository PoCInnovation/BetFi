import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { StrategyProposed } from "../generated/schema"
import { StrategyProposed as StrategyProposedEvent } from "../generated/Strategy_factory/Strategy_factory"
import { handleStrategyProposed } from "../src/strategy-factory"
import { createStrategyProposedEvent } from "./strategy-factory-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let trader = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let strategyBet = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let vaults = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let amounts = [BigInt.fromI32(234)]
    let tokens = [
      Address.fromString("0x0000000000000000000000000000000000000001")
    ]
    let newStrategyProposedEvent = createStrategyProposedEvent(
      trader,
      strategyBet,
      vaults,
      amounts,
      tokens
    )
    handleStrategyProposed(newStrategyProposedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("StrategyProposed created and stored", () => {
    assert.entityCount("StrategyProposed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "StrategyProposed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "trader",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "StrategyProposed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "strategyBet",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "StrategyProposed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "vaults",
      "[0x0000000000000000000000000000000000000001]"
    )
    assert.fieldEquals(
      "StrategyProposed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "amounts",
      "[234]"
    )
    assert.fieldEquals(
      "StrategyProposed",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "tokens",
      "[0x0000000000000000000000000000000000000001]"
    )

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})

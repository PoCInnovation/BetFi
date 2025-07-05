import { KnowledgeGraphSDK } from "@graphprotocol/grc-20-sdk"; // Le nom peut varier
import { event, BigInt } from "@graphprotocol/graph-ts";
import { StrategyCreated, BetPlaced } from "../generated/BetFi/BetFi";
import { BETFI_USER_TYPE_ID, BETFI_STRATEGY_TYPE_ID, BETFI_BET_TYPE_ID } from "./constants";
import { Id } from "@graphprotocol/grc-20";

const sdk = new KnowledgeGraphSDK({ space: "betfi.hackathon.eth" });

export const mapping: Mapping = {
  BetFiBet: {
    typeIds: [Id.Id('cb69723f-7456-471a-a8ad-3e93ddc3edfe')],
    properties: {
      id: Id.Id('1a1fff33-5782-4c33-93c7-c3a5f3592b60'),
    },
  },
};
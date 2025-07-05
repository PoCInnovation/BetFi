import { Entity, Type } from '@graphprotocol/hypergraph';

export class BetFiUser extends Entity.Class<BetFiUser>('BetFiUser')({
  id: Type.Text,
  winCount: Type.Number,
  lossCount: Type.Number,
  totalBetAmount: Type.Number
}) {}

export class BetFiStrategy extends Entity.Class<BetFiStrategy>('BetFiStrategy')({
  id: Type.Text,
  creatorId: Type.Text,
  description: Type.Text,
  targetYield: Type.Number,
  deadline: Type.Date,
  totalAmountBet: Type.Number,
  isResolved: Type.Checkbox,
  didSucceed: Type.Checkbox,
  finalYield: Type.Number
}) {}

export class BetFiBet extends Entity.Class<BetFiBet>('BetFiBet')({
  id: Type.Text,
  strategyId: Type.Text,
  bettorId: Type.Text
}) {}
import { Entity, Type } from '@graphprotocol/hypergraph';

export class Strategy extends Entity.Class<Strategy>('Strategy')({
  Trader: Type.Text,
  Status: Type.Text,
  Description: Type.Text,
  Risk: Type.Text,
  CreatedAt: Type.Date,
}) {}

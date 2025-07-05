import { Injectable } from '@nestjs/common';
import {
  Graph,
  Ipfs,
  Op,
  getSmartAccountWalletClient,
} from '@graphprotocol/grc-20';
import { CreateGraphStrategyDto } from './types.dto';

@Injectable()
export class TheGraphService {
  private readonly API_ORIGIN =
    process.env.GRAPH_API_ORIGIN ||
    'https://hypergraph-v2-testnet.up.railway.app';
  private readonly NETWORK = process.env.GRAPH_NETWORK || 'TESTNET';
  private readonly APP_ADDRESS =
    process.env.APP_ADDRESS || '0x0000000000000000000000000000000000000';
  private readonly SPACE_ID = process.env.GRAPH_SPACE_ID || 'default-space';
  private readonly PRIVATE_KEY = process.env.PRIVATE_KEY || '';

  constructor() {}

  async publishStrategyToKnowlege(
    createGraphStrategy: CreateGraphStrategyDto,
  ): Promise<{
    strategyId: string;
    cid: string;
    txHash: string;
    message: string;
  }> {
    const spaceId = this.SPACE_ID;
    const privateKey = this.PRIVATE_KEY;
    try {
      const { strategyId, cid, message } =
        await this.createGraphStrategy(createGraphStrategy);

      let txHash: string;

      if (privateKey) {
        const walletClient = await this.getSmartAccountWalletClient(privateKey);
        txHash = await this.publishStrategyOnchain(spaceId, cid, walletClient);
      } else {
        const txData = await this.publishStrategyOnchain(spaceId, cid);
        txHash = txData;
      }

      return {
        strategyId,
        cid,
        txHash,
        message: `Strategy ${createGraphStrategy.id} published to Knowledge Graph successfully!`,
      };
    } catch (error) {
      throw new Error(`Failed to publish to Knowledge Graph: ${error.message}`);
    }
  }

  private async createGraphStrategy(
    createGraphStrategy: CreateGraphStrategyDto,
  ): Promise<{
    strategyId: string;
    cid: string;
    message: string;
  }> {
    try {
      const ops: Array<Op> = [];

      const { id: traderPropertyId, ops: createTraderPropertyOps } =
        Graph.createProperty({
          dataType: 'TEXT',
          name: 'Trader',
        });
      ops.push(...createTraderPropertyOps);

      const { id: statusPropertyId, ops: createStatusPropertyOps } =
        Graph.createProperty({
          dataType: 'TEXT',
          name: 'Status',
        });
      ops.push(...createStatusPropertyOps);

      const { id: descriptionPropertyId, ops: createDescriptionPropertyOps } =
        Graph.createProperty({
          dataType: 'TEXT',
          name: 'Description',
        });
      ops.push(...createDescriptionPropertyOps);

      const { id: riskPropertyId, ops: createRiskPropertyOps } =
        Graph.createProperty({
          dataType: 'TEXT',
          name: 'Risk',
        });
      ops.push(...createRiskPropertyOps);

      const { id: createdAtPropertyId, ops: createCreatedAtPropertyOps } =
        Graph.createProperty({
          dataType: 'TIME',
          name: 'Created At',
        });
      ops.push(...createCreatedAtPropertyOps);

      const { id: strategyTypeId, ops: createStrategyTypeOps } =
        Graph.createType({
          name: 'Trading Strategy',
          properties: [
            traderPropertyId,
            statusPropertyId,
            descriptionPropertyId,
            riskPropertyId,
            createdAtPropertyId,
          ],
        });
      ops.push(...createStrategyTypeOps);

      const values = [
        {
          property: traderPropertyId,
          value: createGraphStrategy.trader,
        },
        {
          property: statusPropertyId,
          value: createGraphStrategy.status,
        },
        {
          property: descriptionPropertyId,
          value: createGraphStrategy.description,
        },
        {
          property: riskPropertyId,
          value: createGraphStrategy.risk,
        },
        {
          property: createdAtPropertyId,
          value: Graph.serializeDate(new Date()),
        },
      ];

      const { id: strategyId, ops: createStrategyOps } = Graph.createEntity({
        name: `Strategy ${createGraphStrategy.id}`,
        cover: createGraphStrategy.id,
        description: createGraphStrategy.description,
        types: [strategyTypeId],
        values,
      });
      ops.push(...createStrategyOps);

      const { cid } = await Ipfs.publishEdit({
        name: `Create Strategy: ${createGraphStrategy.id}`,
        ops: ops,
        author: (this.APP_ADDRESS.startsWith('0x')
          ? this.APP_ADDRESS
          : `0x${this.APP_ADDRESS}`) as `0x${string}`,
        network: this.NETWORK as 'TESTNET' | 'MAINNET',
      });

      return {
        strategyId,
        cid,
        message: `Strategy ${createGraphStrategy.id} created successfully and published to IPFS with CID: ${cid}`,
      };
    } catch (error) {
      throw new Error(
        `Failed to create strategy in The Graph: ${error.message}`,
      );
    }
  }

  async publishStrategyOnchain(
    spaceId: string,
    cid: string,
    walletClient?: any,
  ): Promise<string> {
    try {
      const result = await fetch(
        `${this.API_ORIGIN}/space/${spaceId}/edit/calldata`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cid }),
        },
      );

      if (!result.ok) {
        throw new Error(`Failed to get calldata: ${result.statusText}`);
      }

      const { to, data } = await result.json();

      if (walletClient) {
        const txResult = await walletClient.sendTransaction({
          to: to,
          value: 0n,
          data: data,
        });
        return txResult.hash;
      } else {
        return JSON.stringify({ to, data });
      }
    } catch (error) {
      throw new Error(`Failed to publish strategy onchain: ${error.message}`);
    }
  }

  async createSpace(spaceName: string, editorAddress: string): Promise<string> {
    try {
      const spaceId = (
        await Graph.createSpace({
          editorAddress: editorAddress,
          name: spaceName,
          network: this.NETWORK as 'TESTNET' | 'MAINNET',
        })
      ).id;

      return spaceId;
    } catch (error) {
      throw new Error(`Failed to create space: ${error.message}`);
    }
  }
  
  async getSmartAccountWalletClient(privateKey: string, rpcUrl?: string) {

    try {
      return await getSmartAccountWalletClient({
        privateKey: (privateKey.startsWith('0x')
          ? privateKey
          : `0x${privateKey}`) as `0x${string}`,
        rpcUrl,
      });
    } catch (error) {
      throw new Error(
        `Failed to get smart account wallet client: ${error.message}`,
      );
    }
  }
}

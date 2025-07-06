import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Strategy } from './interfaces/strategy.interface';
import { Bet } from './interfaces/bet.interface';
import { CreateBetDto } from './interfaces/bet.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getSmartAccountWalletClient } from '@graphprotocol/grc-20';
import { getWalletClient, Graph, Ipfs, Op } from '@graphprotocol/grc-20';
import {
  AdditionalStrategyDataDto,
  CreateStrategyDto,
} from './interfaces/strategy.dto';

const GET_ALL_STRATEGIES = `
  query GetAllStrategies {
    entities(where: { types: { some: { name: { equals: "Strategy" } } } }) {
      id
      name
      description
      values {
        property {
          name
        }
        value
      }
      createdAt
    }
  }
`;

const GET_STRATEGY_BY_ID = `
  query GetStrategyById($id: String!) {
    entity(where: { id: $id }) {
      id
      name
      description
      values {
        property {
          name
        }
        value
      }
      createdAt
    }
  }
`;

const GET_STRATEGIES_BY_TRADER = `
  query GetStrategiesByTrader($trader: String!) {
    entities(
      where: { 
        types: { some: { name: { equals: "Strategy" } } },
        values: {
          some: {
            property: { name: { equals: "Trader" } },
            value: { equals: $trader }
          }
        }
      }
    ) {
      id
      name
      description
      values {
        property {
          name
        }
        value
      }
      createdAt
    }
  }
`;

@Injectable()
export class SubgraphService implements OnModuleInit {
  private readonly logger = new Logger(SubgraphService.name);
  private readonly subgraphUrl: string;
  private readonly supabaseClient: SupabaseClient<any, 'public'>;

  constructor(private configService: ConfigService) {
    this.subgraphUrl = this.configService.get<string>(
      'SUBGRAPH_URL',
      'https://api.studio.thegraph.com/query/115527/strategy-factory/version/latest',
    );
    this.logger.log(`Initialized with subgraph URL: ${this.subgraphUrl}`);
     this.supabaseClient = createClient("https://avjgtfjouqsndcbsfjly.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2amd0ZmpvdXFzbmRjYnNmamx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3NzAyNDMsImV4cCI6MjA2NzM0NjI0M30.BvrC88nYEgt2wYhJhFgMmycsudrd5CofueIfL1-MiYM")
  }

  transformGraphQLResponseToDto(entity: any): AdditionalStrategyDataDto {
    const valuesMap = new Map();

    entity.values?.forEach((val: any) => {
      valuesMap.set(val.property.name, val.value);
    });

    return {
      id: entity.id,
      trader: valuesMap.get('Trader') || '',
      status: valuesMap.get('Status')?.toLowerCase() || 'active',
      description: valuesMap.get('Description') || '',
      risk: valuesMap.get('Risk')?.toLowerCase() || 'low',
      createdAt: entity.createdAt || valuesMap.get('Created At'),
    };
  }

  async getAllAdditionalStrategyData(): Promise<AdditionalStrategyDataDto[]> {
    const { data, error } = await this.supabaseClient
      .from('strategies')
      .select('*');

    if (error) {
      this.logger.error(`Failed to fetch strategies from Supabase: ${error.message}`);
      return [];
    }

    // Map Supabase fields to AdditionalStrategyDataDto fields
    return (data || []).map((item: any) => ({
      id: item.id,
      trader: item.trader,
      status: item.status,
      description: item.description,
      risk: item.risk,
      createdAt: item.created_at,
    }));
  }

  async onModuleInit() {
    try {
      await this.testConnection();
    } catch (error) {
      this.logger.error(
        `Failed to connect to subgraph during initialization: ${error.message}`,
      );
    }
  }

  /**
   * Test connection to the subgraph
   */
  async testConnection() {
    try {
      // Simple query to test if the subgraph is accessible
      const query = `
        query {
          _meta {
            block {
              number
            }
            deployment
            hasIndexingErrors
          }
        }
      `;

      this.logger.log('Testing connection to subgraph...');
      const response = await axios.post(
        this.subgraphUrl,
        { query },
        { timeout: 5000 }, // 5 second timeout
      );

      if (response.data.errors) {
        this.logger.error(
          `Subgraph connection test returned errors: ${JSON.stringify(response.data.errors)}`,
        );
        return false;
      }

      this.logger.log(
        `Successfully connected to subgraph. Current block: ${response.data.data?._meta?.block?.number}`,
      );
      return true;
    } catch (error) {
      this.logger.error(`Subgraph connection test failed: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        this.logger.error(
          `Could not connect to subgraph at ${this.subgraphUrl}. Make sure the service is running.`,
        );
      } else if (error.code === 'ENOTFOUND') {
        this.logger.error(
          `Hostname not found for ${this.subgraphUrl}. Check your SUBGRAPH_URL configuration.`,
        );
      } else if (error.response) {
        this.logger.error(
          `Received HTTP ${error.response.status} from subgraph service: ${JSON.stringify(error.response.data)}`,
        );
      }
      return false;
    }
  }

  /**
   * Fetch strategies from the subgraph
   */
  async getStrategies() {
    try {
      const query = `
        query {
          strategies {
            id
            trader
            initialValue
            objectivePercent
            totalYes
            totalNo
            resolved
            finalValue
            betsClosed
            strategyExecuted
            startTime
            endTime
            vaults
            tokens
            amounts
          }
        }
      `;

      this.logger.log(`Sending request to subgraph at: ${this.subgraphUrl}`);
      const response = await axios.post(this.subgraphUrl, { query });

      if (!response.data) {
        this.logger.error('No data returned from subgraph');
        return [];
      }

      if (response.data.errors) {
        this.logger.error(
          `GraphQL errors: ${JSON.stringify(response.data.errors)}`,
        );
        return [];
      }

      const rawStrategies = response.data.data?.strategies || [];
      return this.parseStrategies(rawStrategies);
    } catch (error) {
      this.logger.error(`Failed to fetch strategies: ${error.message}`);
      this.logger.error(
        `Error details: ${JSON.stringify(error.response?.data || {})}`,
      );
      return []; // Return empty array instead of throwing to prevent 500 error
    }
  }

  /**
   * Parse raw strategy data from the subgraph into our domain model
   */
  async parseStrategies(rawStrategies: any[]): Promise<Strategy[]> {
    this.logger.log(`Parsing ${rawStrategies.length} strategies`);

    const additionalStrategiesData = await this.getAllAdditionalStrategyData();
    // const additionalStrategiesData = [] as AdditionalStrategyDataDto[]
    const onchainStrategiesData = rawStrategies.map((rawStrategy) => {
      // Calculate current return
      const initialValue = parseInt(rawStrategy.initialValue || '0');
      const finalValue = parseInt(rawStrategy.finalValue || '0');
      const currentReturn = rawStrategy.resolved ? finalValue : initialValue;

      // Calculate total bets
      const votesYes = parseInt(rawStrategy.totalYes || '0');
      const votesNo = parseInt(rawStrategy.totalNo || '0');
      const totalBets = votesYes + votesNo;

      // Calculate status
      const status = rawStrategy.resolved ? 'completed' : 'active';

      // Calculate deadline (endTime if set, otherwise estimate from startTime)
      const startTime = parseInt(rawStrategy.startTime || '0');
      let deadline = parseInt(rawStrategy.endTime || '0');
      if (deadline === 0 && startTime > 0) {
        // If endTime is not set but we have a startTime, estimate deadline
        // Assuming duration is in seconds (e.g. 7 days = 604800 seconds)
        const duration = parseInt(rawStrategy.duration || '604800'); // Default to 7 days
        deadline = startTime + duration;
      }

      // Calculate objective
      const objectivePercent = parseInt(rawStrategy.objectivePercent || '0');

      return {
        id: rawStrategy.id,
        trader: rawStrategy.trader,
        objective: objectivePercent,
        deadline,
        currentReturn,
        totalBets,
        votesYes,
        votesNo,
        status,
        description: '',
        traderReputation: 0,
        risk: 'medium',
      };
    });
    
     

    return onchainStrategiesData.map((onchainStrategy) => {
      const additional = additionalStrategiesData.find(
        (a) => a.id === onchainStrategy.id,
      );
      return {
        id: onchainStrategy.id,
        trader: onchainStrategy.trader,
        objective: onchainStrategy.objective,
        deadline: onchainStrategy.deadline,
        currentReturn: onchainStrategy.currentReturn,
        totalBets: onchainStrategy.totalBets,
        votesYes: onchainStrategy.votesYes,
        votesNo: onchainStrategy.votesNo,
        status: onchainStrategy.status as 'active' | 'completed',
        description: additional?.description || '',
        traderReputation: 50, // TODO: Replace with actual reputation logic
        risk: additional?.risk || 'medium',
        createdAt: additional?.createdAt || Date.now(),
      };
    });
  }

  /**
   * Fetch a specific strategy by ID
   */
  async getStrategyById(id: string) {
    try {
      const query = `
        query {
          strategy(id: "${id}") {
            id
            trader
            initialValue
            objectivePercent
            totalYes
            totalNo
            resolved
            finalValue
            betsClosed
            strategyExecuted
            startTime
            endTime
            duration
            vaults
            tokens
            amounts
            bets {
              id
              user
              amount
              side
              claimed
            }
          }
        }
      `;

      this.logger.log(
        `Fetching strategy with ID: ${id} from subgraph: ${this.subgraphUrl}`,
      );
      const response = await axios.post(this.subgraphUrl, { query });

      if (!response.data) {
        this.logger.error(`No data returned when fetching strategy ${id}`);
        return null;
      }

      if (response.data.errors) {
        this.logger.error(
          `GraphQL errors for strategy ${id}: ${JSON.stringify(response.data.errors)}`,
        );
        return null;
      }

      const rawStrategy = response.data.data?.strategy;
      if (!rawStrategy) {
        return null;
      }

      // Parse the strategy to our domain model
      const parsedStrategies = await this.parseStrategies([rawStrategy]);
      return parsedStrategies[0] || null;
    } catch (error) {
      this.logger.error(`Failed to fetch strategy ${id}: ${error.message}`);
      this.logger.error(
        `Error details: ${JSON.stringify(error.response?.data || {})}`,
      );
      return null; // Return null instead of throwing to prevent 500 error
    }
  }

  /**
   * Fetch all bets for a strategy
   */
  async getStrategyBets(strategyId: string) {
    try {
      const query = `
        query {
          bets(where: { strategy: "${strategyId}" }) {
            id
            user
            amount
            side
            claimed
            blockNumber
            blockTimestamp
            transactionHash
          }
        }
      `;

      this.logger.log(
        `Fetching bets for strategy: ${strategyId} from subgraph: ${this.subgraphUrl}`,
      );
      const response = await axios.post(this.subgraphUrl, { query });

      if (!response.data) {
        this.logger.error(
          `No data returned when fetching bets for strategy ${strategyId}`,
        );
        return [];
      }

      if (response.data.errors) {
        this.logger.error(
          `GraphQL errors for bets in strategy ${strategyId}: ${JSON.stringify(response.data.errors)}`,
        );
        return [];
      }

      return response.data.data?.bets || [];
    } catch (error) {
      this.logger.error(
        `Failed to fetch bets for strategy ${strategyId}: ${error.message}`,
      );
      this.logger.error(
        `Error details: ${JSON.stringify(error.response?.data || {})}`,
      );
      return []; // Return empty array instead of throwing to prevent 500 error
    }
  }

  
  async storeStrategyInSupabase(createStrategy: CreateStrategyDto) {
    try {
      const { data, error } = await this.supabaseClient
        .from('strategies')
        .insert([
          {
            id: createStrategy.id,
            trader: createStrategy.trader,
            status: createStrategy.status,
            description: createStrategy.description,
            risk: createStrategy.risk,
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        this.logger.error(`Failed to store strategy in Supabase: ${error.message}`);
        throw error;
      }

      this.logger.log(`Strategy stored in Supabase with ID: ${data.id}`);
      return data;
    } catch (err) {
      this.logger.error(`Error storing strategy in Supabase: ${err.message}`);
      throw err;
    }
    return "Strategy stored successfully in Supabase";
  }


  async storeStrategy(createStrategy: CreateStrategyDto) {
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

    const { id: strategyTypeId, ops: createStrategyTypeOps } = Graph.createType(
      {
        name: 'Strategy',
        properties: [
          traderPropertyId,
          statusPropertyId,
          descriptionPropertyId,
          riskPropertyId,
          createdAtPropertyId,
        ],
      },
    );
    ops.push(...createStrategyTypeOps);

    const values = [
      {
        property: traderPropertyId,
        value: createStrategy.trader,
      },
      {
        property: statusPropertyId,
        value: createStrategy.status,
      },
      {
        property: descriptionPropertyId,
        value: createStrategy.description,
      },
      {
        property: riskPropertyId,
        value: createStrategy.risk,
      },
      {
        property: createdAtPropertyId,
        value: Graph.serializeDate(new Date()),
      },
    ];

    const { id: strategyId, ops: createStrategyOps } = Graph.createEntity({
      name: `Strategy ${createStrategy.trader}`,
      cover: strategyTypeId,
      description: `Trading strategy created by ${createStrategy.trader}: ${createStrategy.description}`,
      types: [strategyTypeId],
      values,
    });
    ops.push(...createStrategyOps);

    console.log(
      `Strategy created with ID: ${strategyId} for trader: ${createStrategy.trader}`,
    );

    const publishData = async () => {
      const result = await Ipfs.publishEdit({
        name: `Create Strategy: ${createStrategy.trader}`,
        ops: ops,
        author: '0x4603f0060Bc55FC24381f6d9A9a5b16F3f82EF38' as `0x${string}`,
        network: 'TESTNET',
      });
      console.log(`Edit published with ID: ${result.cid}`);

      const spaceId = await Graph.createSpace({
        editorAddress:
          '0x4603f0060Bc55FC24381f6d9A9a5b16F3f82EF38' as `0x${string}`,
        name: 'BetFi Test',
        network: 'TESTNET',
      });
      console.log(`Space created with ID: ${spaceId.id}`);

      /* const spaceId = { id: '3f8873d8-f8a4-43de-bbed-d8de16bf090a' } as {
        id: string;
      }; */
      console.log(`Space created with ID: ${spaceId.id}`);

      const res = await fetch(
        `https://hypergraph-v2-testnet.up.railway.app/space/${spaceId.id}/edit/calldata`,
        {
          method: 'POST',
          body: JSON.stringify({ cid: result.cid }),
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to get transaction details: ${res.statusText}`);
      }

      const { to, data } = await res.json();
      console.log(`Transaction details: to=${to}, data=${data}`);

      const smartAccountWallet = await getSmartAccountWalletClient({
        privateKey: "0x066fe03ce1f6fa771749d598bebf1d624823635372b3121e31a4f475f5d16d83" as `0x${string}`,
      });

      /* const smartAccountWalletClient = await getWalletClient({
        privateKey:
          'Oxce79c4c92de28296bcc6b3a0900079679c86144fddedf8414772562d1f29e9f9' as `0x${string}`,
      }); */

      /* const chain = await smartAccountWalletClient.getChainId();
      console.log(`Chain ID: ${chain}`); */
     
      const txResult = await smartAccountWallet.sendTransaction({
        to: to,
        value: 0n,
        data: data,
      });

      /* const txResult = await smartAccountWalletClient.sendTransaction({
        to: to,
        value: 0n,
        data: data,
      } as unknown as any); */

      console.log(`Transaction sent with hash: ${txResult}`);
    };

    await publishData();

    return {
      strategyId,
      transactionHash: await publishData(),
    };
  }

  /**
   * Store a bet in Supabase
   */
  async storeBet(createBet: CreateBetDto) {
    try {
      const { data, error } = await this.supabaseClient
        .from('bets')
        .insert([
          {
            id: `bet_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            strategy_id: createBet.strategyId,
            user_address: createBet.user,
            side: createBet.side,
            amount: createBet.amount,
            transaction_hash: createBet.transactionHash,
            status: 'active',
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        this.logger.error(`Failed to store bet in Supabase: ${error.message}`);
        throw error;
      }

      this.logger.log(`Bet stored in Supabase with ID: ${data.id}`);
      return data;
    } catch (err) {
      this.logger.error(`Error storing bet in Supabase: ${err.message}`);
      throw err;
    }
  }

  /**
   * Get all bets from Supabase
   */
  async getBets(): Promise<Bet[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('bets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Failed to fetch bets from Supabase: ${error.message}`);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        strategyId: item.strategy_id,
        user: item.user_address,
        side: item.side,
        amount: item.amount,
        transactionHash: item.transaction_hash,
        createdAt: item.created_at,
        status: item.status,
      }));
    } catch (err) {
      this.logger.error(`Error fetching bets from Supabase: ${err.message}`);
      return [];
    }
  }

  /**
   * Get bets for a specific strategy
   */
  async getBetsByStrategy(strategyId: string): Promise<Bet[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('bets')
        .select('*')
        .eq('strategy_id', strategyId)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Failed to fetch bets for strategy ${strategyId}: ${error.message}`);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        strategyId: item.strategy_id,
        user: item.user_address,
        side: item.side,
        amount: item.amount,
        transactionHash: item.transaction_hash,
        createdAt: item.created_at,
        status: item.status,
      }));
    } catch (err) {
      this.logger.error(`Error fetching bets for strategy ${strategyId}: ${err.message}`);
      return [];
    }
  }

  /**
   * Get bets for a specific user
   */
  async getBetsByUser(userAddress: string): Promise<Bet[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('bets')
        .select('*')
        .eq('user_address', userAddress)
        .order('created_at', { ascending: false });

      if (error) {
        this.logger.error(`Failed to fetch bets for user ${userAddress}: ${error.message}`);
        return [];
      }

      return (data || []).map((item: any) => ({
        id: item.id,
        strategyId: item.strategy_id,
        user: item.user_address,
        side: item.side,
        amount: item.amount,
        transactionHash: item.transaction_hash,
        createdAt: item.created_at,
        status: item.status,
      }));
    } catch (err) {
      this.logger.error(`Error fetching bets for user ${userAddress}: ${err.message}`);
      return [];
    }
  }
}

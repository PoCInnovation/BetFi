import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Strategy } from './interfaces/strategy.interface';

@Injectable()
export class SubgraphService implements OnModuleInit {
  private readonly logger = new Logger(SubgraphService.name);
  private readonly subgraphUrl: string;

  constructor(private configService: ConfigService) {
    this.subgraphUrl = this.configService.get<string>('SUBGRAPH_URL', 'https://api.studio.thegraph.com/query/115527/strategy-factory/version/latest');
    this.logger.log(`Initialized with subgraph URL: ${this.subgraphUrl}`);
  }

  async onModuleInit() {
    try {
      await this.testConnection();
    } catch (error) {
      this.logger.error(`Failed to connect to subgraph during initialization: ${error.message}`);
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
        { timeout: 5000 } // 5 second timeout
      );

      if (response.data.errors) {
        this.logger.error(`Subgraph connection test returned errors: ${JSON.stringify(response.data.errors)}`);
        return false;
      }

      this.logger.log(`Successfully connected to subgraph. Current block: ${response.data.data?._meta?.block?.number}`);
      return true;
    } catch (error) {
      this.logger.error(`Subgraph connection test failed: ${error.message}`);
      if (error.code === 'ECONNREFUSED') {
        this.logger.error(`Could not connect to subgraph at ${this.subgraphUrl}. Make sure the service is running.`);
      } else if (error.code === 'ENOTFOUND') {
        this.logger.error(`Hostname not found for ${this.subgraphUrl}. Check your SUBGRAPH_URL configuration.`);
      } else if (error.response) {
        this.logger.error(`Received HTTP ${error.response.status} from subgraph service: ${JSON.stringify(error.response.data)}`);
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
      const response = await axios.post(
        this.subgraphUrl,
        { query },
      );

      if (!response.data) {
        this.logger.error('No data returned from subgraph');
        return [];
      }

      if (response.data.errors) {
        this.logger.error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
        return [];
      }

      const rawStrategies = response.data.data?.strategies || [];
      return this.parseStrategies(rawStrategies);
    } catch (error) {
      this.logger.error(`Failed to fetch strategies: ${error.message}`);
      this.logger.error(`Error details: ${JSON.stringify(error.response?.data || {})}`);
      return [];  // Return empty array instead of throwing to prevent 500 error
    }
  }
  
  /**
   * Parse raw strategy data from the subgraph into our domain model
   */
  parseStrategies(rawStrategies: any[]): Strategy[] {
    this.logger.log(`Parsing ${rawStrategies.length} strategies`);
    
    return rawStrategies.map(rawStrategy => {
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
        status
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

      this.logger.log(`Fetching strategy with ID: ${id} from subgraph: ${this.subgraphUrl}`);
      const response = await axios.post(
        this.subgraphUrl,
        { query },
      );

      if (!response.data) {
        this.logger.error(`No data returned when fetching strategy ${id}`);
        return null;
      }

      if (response.data.errors) {
        this.logger.error(`GraphQL errors for strategy ${id}: ${JSON.stringify(response.data.errors)}`);
        return null;
      }

      const rawStrategy = response.data.data?.strategy;
      if (!rawStrategy) {
        return null;
      }

      // Parse the strategy to our domain model
      const parsedStrategies = this.parseStrategies([rawStrategy]);
      return parsedStrategies[0] || null;
    } catch (error) {
      this.logger.error(`Failed to fetch strategy ${id}: ${error.message}`);
      this.logger.error(`Error details: ${JSON.stringify(error.response?.data || {})}`);
      return null;  // Return null instead of throwing to prevent 500 error
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

      this.logger.log(`Fetching bets for strategy: ${strategyId} from subgraph: ${this.subgraphUrl}`);
      const response = await axios.post(
        this.subgraphUrl,
        { query },
      );

      if (!response.data) {
        this.logger.error(`No data returned when fetching bets for strategy ${strategyId}`);
        return [];
      }

      if (response.data.errors) {
        this.logger.error(`GraphQL errors for bets in strategy ${strategyId}: ${JSON.stringify(response.data.errors)}`);
        return [];
      }

      return response.data.data?.bets || [];
    } catch (error) {
      this.logger.error(`Failed to fetch bets for strategy ${strategyId}: ${error.message}`);
      this.logger.error(`Error details: ${JSON.stringify(error.response?.data || {})}`);
      return [];  // Return empty array instead of throwing to prevent 500 error
    }
  }
}

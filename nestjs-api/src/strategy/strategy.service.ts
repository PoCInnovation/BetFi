import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import strategyABI from './strategy.contract.abi.json';
import { Strategy } from './strategy.interface';

@Injectable()
export class StrategyService {
  private readonly logger = new Logger(StrategyService.name);
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet | null = null;
  private contractAddress: string;
  
  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL') || 'https://rpc.ankr.com/eth';
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    this.contractAddress = this.configService.get<string>('STRATEGY_CONTRACT_ADDRESS') || '0x1234567890123456789012345678901234567890';
    
    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    
    if (privateKey && privateKey !== 'your-private-key-here') {
      try {
        this.wallet = new ethers.Wallet(privateKey, this.provider);
        this.logger.log('Wallet initialized successfully');
      } catch (error) {
        this.logger.error('Failed to initialize wallet', error);
      }
    } else {
      this.logger.warn('No private key provided - read-only mode');
    }
  }

  private getContract(signer = false) {
    if (signer && this.wallet) {
      return new ethers.Contract(this.contractAddress, strategyABI, this.wallet);
    }
    return new ethers.Contract(this.contractAddress, strategyABI, this.provider);
  }
  
  private statusToString(statusCode: number): 'active' | 'completed' | 'failed' {
    switch(statusCode) {
      case 0: return 'active';
      case 1: return 'completed';
      case 2: return 'failed';
      default: return 'active';
    }
  }
  
  private mapContractStrategyToInterface(
    id: string, 
    [trader, objective, deadline, currentReturn, totalBets, votesYes, votesNo, status]: any[]
  ): Strategy {
    return {
      id,
      trader,
      objective: Number(objective) / 100, // Convert from basis points
      deadline: Number(deadline),
      currentReturn: Number(currentReturn) / 100, // Convert from basis points
      totalBets: Number(totalBets),
      votesYes: Number(votesYes),
      votesNo: Number(votesNo),
      status: this.statusToString(Number(status))
    };
  }

  async findAll(): Promise<Strategy[]> {
    try {
      const contract = this.getContract();
      // The ABI shows getAllStrategies returns an array of addresses
      const strategyAddresses = await contract.getAllStrategies();
      
      // We need to fetch details for each strategy
      // Note: Since your ABI doesn't have a getStrategy method, 
      // you'll need a separate ABI for the individual strategy contracts
      
      // For now, we'll return placeholder data mapped to addresses
      return strategyAddresses.map((address: string, index: number) => {
        return {
          id: index.toString(),
          trader: "0x0000000000000000000000000000000000000000", // Placeholder
          objective: 15, // Placeholder 15%
          deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days from now
          currentReturn: 5, // Placeholder 5%
          totalBets: 0,
          votesYes: 0,
          votesNo: 0,
          status: 'active' as const
        };
      });
    } catch (error) {
      this.logger.error('Error fetching all strategies', error);
      throw error;
    }
  }

  async findOne(id: string): Promise<Strategy> {
    try {
      // Get all strategies and find by index
      const contract = this.getContract();
      const strategyAddresses = await contract.getAllStrategies();
      
      if (id >= strategyAddresses.length) {
        throw new NotFoundException(`Strategy with ID ${id} not found`);
      }
      
      const strategyAddress = strategyAddresses[parseInt(id)];
      
      // Here you would use the strategy address to get data from the strategy contract
      // For now we'll return placeholder data
      return {
        id,
        trader: "0x0000000000000000000000000000000000000000", // Placeholder
        objective: 15, // Placeholder 15%
        deadline: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
        currentReturn: 5, // Placeholder 5%
        totalBets: 0,
        votesYes: 0,
        votesNo: 0,
        status: 'active' as const
      };
    } catch (error) {
      this.logger.error(`Error fetching strategy ${id}`, error);
      throw error;
    }
  }

  async findByTrader(trader: string): Promise<Strategy[]> {
    try {
      // The ABI doesn't have a getTraderStrategies method
      // We need to filter strategies manually
      
      const allStrategies = await this.findAll();
      
      // In reality, you'd need to check each strategy contract
      // to see if it was created by the trader
      // For now, we'll return all strategies as a placeholder
      return allStrategies;
    } catch (error) {
      this.logger.error(`Error fetching strategies for trader ${trader}`, error);
      throw error;
    }
  }

  async findByStatus(status: 'active' | 'completed' | 'failed'): Promise<Strategy[]> {
    try {
      const strategies = await this.findAll();
      return strategies.filter(strategy => strategy.status === status);
    } catch (error) {
      this.logger.error(`Error fetching strategies with status ${status}`, error);
      throw error;
    }
  }

  async create(strategyData: {
    vaults: string[],
    amounts: string[],
    tokens: string[],
    objective: number,
    duration: number,
    commission?: number
  }): Promise<Strategy> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured for write operations');
      }
      
      const contract = this.getContract(true);
      
      // Based on your ABI, the proposeStrategy function takes these parameters
      const tx = await contract.proposeStrategy(
        strategyData.vaults,
        strategyData.amounts.map((amt: string) => ethers.parseEther(amt)),
        strategyData.tokens,
        Math.floor(strategyData.objective * 100), // Convert % to basis points
        strategyData.duration,
        strategyData.commission || 500, // Default 5% commission
        { gasLimit: 3000000 }
      );
      
      const receipt = await tx.wait();
      
      // Extract the new strategy address from the transaction logs
      let strategyAddress = null;
      for (const log of receipt.logs) {
        try {
          const parsedLog = contract.interface.parseLog(log);
          if (parsedLog.name === 'StrategyProposed') {
            strategyAddress = parsedLog.args.strategyBet;
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!strategyAddress) {
        throw new Error('Failed to extract strategy address from transaction receipt');
      }
      
      // Get all strategies to find the index of the new strategy
      const allStrategies = await contract.getAllStrategies();
      const strategyId = allStrategies.findIndex((addr: string) => 
        addr.toLowerCase() === strategyAddress.toLowerCase()
      ).toString();
      
      // Return the newly created strategy
      return this.findOne(strategyId);
    } catch (error) {
      this.logger.error('Error creating strategy', error);
      throw error;
    }
  }

  // Note: The ABI you provided doesn't include these methods
  // They would need to be implemented in the individual strategy contracts
  // For now, we'll create placeholder implementations
  
  async updateReturn(id: string, currentReturn: number): Promise<Strategy> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured for write operations');
      }
      
      // Get the strategy address
      const contract = this.getContract();
      const strategyAddresses = await contract.getAllStrategies();
      
      if (parseInt(id) >= strategyAddresses.length) {
        throw new NotFoundException(`Strategy with ID ${id} not found`);
      }
      
      const strategyAddress = strategyAddresses[parseInt(id)];
      
      // Note: You would need to create an interface to the strategy contract
      // and call its updateReturn method
      
      this.logger.log(`Would update return for strategy at ${strategyAddress} to ${currentReturn}%`);
      
      // Return the strategy with updated return
      const strategy = await this.findOne(id);
      return {
        ...strategy,
        currentReturn
      };
    } catch (error) {
      this.logger.error(`Error updating return for strategy ${id}`, error);
      throw error;
    }
  }

  async completeStrategy(id: string, successful: boolean): Promise<Strategy> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured for write operations');
      }
      
      // Get the strategy address
      const contract = this.getContract();
      const strategyAddresses = await contract.getAllStrategies();
      
      if (parseInt(id) >= strategyAddresses.length) {
        throw new NotFoundException(`Strategy with ID ${id} not found`);
      }
      
      const strategyAddress = strategyAddresses[parseInt(id)];
      
      // Note: You would need to create an interface to the strategy contract
      // and call its complete method
      
      this.logger.log(`Would mark strategy at ${strategyAddress} as ${successful ? 'completed' : 'failed'}`);
      
      // Return the strategy with updated status
      const strategy = await this.findOne(id);
      return {
        ...strategy,
        status: successful ? 'completed' : 'failed'
      };
    } catch (error) {
      this.logger.error(`Error completing strategy ${id}`, error);
      throw error;
    }
  }

  async vote(id: string, voteYes: boolean, amount?: string): Promise<Strategy> {
    try {
      if (!this.wallet) {
        throw new Error('Wallet not configured for write operations');
      }
      
      // Get the strategy address
      const contract = this.getContract();
      const strategyAddresses = await contract.getAllStrategies();
      
      if (parseInt(id) >= strategyAddresses.length) {
        throw new NotFoundException(`Strategy with ID ${id} not found`);
      }
      
      const strategyAddress = strategyAddresses[parseInt(id)];
      
      // Note: You would need to create an interface to the strategy contract
      // and call its vote method
      
      this.logger.log(`Would vote ${voteYes ? 'YES' : 'NO'} on strategy at ${strategyAddress} with ${amount || 0} ETH`);
      
      // Return the strategy with updated votes
      const strategy = await this.findOne(id);
      return {
        ...strategy,
        totalBets: strategy.totalBets + 1,
        votesYes: voteYes ? strategy.votesYes + 1 : strategy.votesYes,
        votesNo: !voteYes ? strategy.votesNo + 1 : strategy.votesNo
      };
    } catch (error) {
      this.logger.error(`Error voting on strategy ${id}`, error);
      throw error;
    }
  }
}

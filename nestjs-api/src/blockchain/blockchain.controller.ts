import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { Strategy } from './interfaces/strategy.interface';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}
  
  @Get('strategy')
  async getAllStrategiesAsList(): Promise<Strategy[]> {
    try {
      console.log('Getting all strategies list...');
      // Get all strategy addresses from the blockchain
      const strategyAddresses = await this.blockchainService.getAllStrategies();
      console.log('Fetched strategy addresses:', strategyAddresses);
      
      if (!strategyAddresses || strategyAddresses.length === 0) {
        console.log('No strategies found');
        return [];
      }
      
      // For each address, fetch detailed strategy information
      const strategies: Strategy[] = await Promise.all(
        strategyAddresses.map(async (address, index) => {
          console.log(`Processing strategy ${index}: ${address}`);
          // Here we would ideally fetch actual data from the contract for each strategy
          return {
            id: address,
            trader: `0x${index}`, // This would be fetched from the contract
            objective: 5, // This would be fetched from the contract
            deadline: new Date().getTime() + 604800000, // This would be fetched from the contract
            currentReturn: 0, // This would be fetched from the contract
            totalBets: 0, // This would be fetched from the contract
            votesYes: 0, // This would be fetched from the contract
            votesNo: 0, // This would be fetched from the contract
          };
        })
      );
      
      console.log(`Returning ${strategies.length} strategies`);
      return strategies;
    } catch (error) {
      console.error('Error in getAllStrategiesAsList:', error);
      throw new Error(`Failed to fetch strategies from blockchain: ${error.message || 'Unknown error'}. Make sure your Katana node is running and accessible.`);
    }
  }

//   @Get('strategies/:index')
//   async getStrategyAtIndex(@Param('index', ParseIntPipe) index: number) {
//     const strategy = await this.blockchainService.getStrategyAtIndex(index);
//     return { strategy };
//   }

  @Get('ausd')
  async getAusdAddress() {
    const ausdAddress = await this.blockchainService.getAusdAddress();
    return { ausdAddress };
  }


}

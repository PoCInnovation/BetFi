import { Controller, Get, Param, Logger, HttpException, HttpStatus, Post, Body } from '@nestjs/common';
import { SubgraphService } from './subgraph.service';
import { Strategy } from './interfaces/strategy.interface';
import { CreateStrategyDto } from './interfaces/strategy.dto';

@Controller('subgraph')
export class SubgraphController {
  private readonly logger = new Logger(SubgraphController.name);

  constructor(private readonly subgraphService: SubgraphService) {}
  
  @Post('strategies')
  async postStrategies(@Body() body: CreateStrategyDto) {
    this.logger.log('Creating a new strategy');
    return await this.subgraphService.storeStrategy(body);
  }

  @Get('strategies')
  async getFormattedStrategies(): Promise<Strategy[]> {
    this.logger.log('Getting all strategies in formatted structure');
    return await this.subgraphService.getStrategies();
  }
  
  @Get('strategies/:id')
  async getFormattedStrategyById(@Param('id') id: string): Promise<Strategy> {
    this.logger.log(`Getting formatted strategy by ID: ${id}`);
    const strategy = await this.subgraphService.getStrategyById(id);
    
    if (!strategy) {
      throw new HttpException(`Strategy with ID ${id} not found`, HttpStatus.NOT_FOUND);
    }
    
    return strategy;
  }
}

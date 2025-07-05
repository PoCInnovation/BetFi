import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  Query, 
  ParseIntPipe, 
  HttpStatus, 
  HttpCode,
  NotFoundException,
  HttpException
} from '@nestjs/common';
import { StrategyService } from './strategy.service';
import { Strategy } from './strategy.interface';

interface CreateStrategyDto {
  trader: string;
  objective: number;
  deadline: number;
  currentReturn: number;
  totalBets: number;
  votesYes: number;
  votesNo: number;
  status: 'active' | 'completed' | 'failed';
}

interface UpdateReturnDto {
  currentReturn: number;
}

interface VoteDto {
  voteYes: boolean;
}

@Controller('strategies')
export class StrategyController {
  constructor(private readonly strategyService: StrategyService) {}

  @Get()
  async findAll(@Query('status') status?: 'active' | 'completed' | 'failed'): Promise<Strategy[]> {
    try {
      if (status) {
        return await this.strategyService.findByStatus(status);
      }
      return await this.strategyService.findAll();
    } catch (error) {
      throw new HttpException(
        'Failed to fetch strategies',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Strategy> {
    try {
      return await this.strategyService.findOne(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException(`Strategy with ID ${id} not found`);
    }
  }

  @Get('trader/:address')
  async findByTrader(@Param('address') trader: string): Promise<Strategy[]> {
    try {
      return await this.strategyService.findByTrader(trader);
    } catch (error) {
      throw new HttpException(
        `Failed to fetch strategies for trader ${trader}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createStrategyDto: CreateStrategyDto): Promise<Strategy> {
    try {
      return await this.strategyService.create(createStrategyDto);
    } catch (error) {
      throw new HttpException(
        `Failed to create strategy: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/return')
  async updateReturn(
    @Param('id') id: string, 
    @Body() updateReturnDto: UpdateReturnDto
  ): Promise<Strategy> {
    try {
      return await this.strategyService.updateReturn(id, updateReturnDto.currentReturn);
    } catch (error) {
      throw new HttpException(
        `Failed to update strategy return: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id/complete')
  async completeStrategy(
    @Param('id') id: string, 
    @Body('successful') successful: boolean
  ): Promise<Strategy> {
    try {
      return await this.strategyService.completeStrategy(id, successful);
    } catch (error) {
      throw new HttpException(
        `Failed to complete strategy: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post(':id/vote')
  async vote(
    @Param('id') id: string, 
    @Body() voteDto: VoteDto & { amount?: string }
  ): Promise<Strategy> {
    try {
      return await this.strategyService.vote(id, voteDto.voteYes, voteDto.amount);
    } catch (error) {
      throw new HttpException(
        `Failed to vote on strategy: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}

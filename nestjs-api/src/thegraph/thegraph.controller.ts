import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateGraphStrategyDto } from './types.dto';
import { TheGraphService } from './thegraph.services';

@Controller('thegraph')
export class TheGraphController {
  constructor(private readonly theGraphService: TheGraphService) {}  

  @Post('strategies')
  async createStrategy(@Body() createStrategyDto: CreateGraphStrategyDto) {
    return await this.theGraphService.publishStrategyToKnowlege(createStrategyDto, );
  }


}

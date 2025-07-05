import { Module } from '@nestjs/common';
import { TheGraphController } from './thegraph.controller';
import { TheGraphService } from './thegraph.services';

@Module({
  controllers: [TheGraphController],
  providers: [TheGraphService],
  exports: [TheGraphService], 
})
export class TheGraphModule {}

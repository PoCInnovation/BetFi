import { Module } from '@nestjs/common';
import { StrategyController } from './strategy.controller';
import { StrategyService } from './strategy.service';

@Module({
  controllers: [StrategyController],
  providers: [StrategyService],
  exports: [StrategyService], // Export le service au cas où d'autres modules en auraient besoin
})
export class StrategyModule {}

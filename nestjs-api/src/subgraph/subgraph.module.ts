import { Module } from '@nestjs/common';
import { SubgraphService } from './subgraph.service';
import { SubgraphController } from './subgraph.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [SubgraphController],
  providers: [SubgraphService],
  exports: [SubgraphService],
})
export class SubgraphModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubgraphModule } from './subgraph/subgraph.module';

@Module({
  imports: [SubgraphModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

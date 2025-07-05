import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubgraphModule } from './subgraph/subgraph.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SubgraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

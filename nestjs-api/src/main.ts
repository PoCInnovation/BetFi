import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  try {
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    const configService = app.get(ConfigService);
    const port = configService.get<number>('PORT', 3000);
    
    // Enable CORS for frontend integration
    app.enableCors();
    
    // Global prefix for all routes
    app.setGlobalPrefix('api');
    
    // Add global error logging
    app.useGlobalFilters();
    
    await app.listen(port);
    logger.log(`🚀 NestJS API running on http://localhost:${port}/api`);
    logger.log(`📊 Subgraph URL: ${configService.get('SUBGRAPH_URL')}`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

bootstrap().catch(err => {
  console.error('Fatal error during application bootstrap', err);
  process.exit(1);
});

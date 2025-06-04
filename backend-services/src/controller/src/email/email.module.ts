import { Module } from '@nestjs/common';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { CacheForRedisModule } from '../cache-for-redis/cache-redis.module';

@Module({
  imports: [CacheForRedisModule],
  controllers: [EmailController],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}

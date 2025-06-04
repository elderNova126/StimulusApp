import { Module } from '@nestjs/common';
import { CacheForRedisModule } from 'src/cache-for-redis/cache-redis.module';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';

@Module({
  imports: [CacheForRedisModule],
  providers: [TagService],
  controllers: [TagController],
  exports: [TagService],
})
export class TagModule {}

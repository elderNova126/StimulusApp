import { Global, Module } from '@nestjs/common';
import { TenantCompanyRelationshipController } from './tenant-company-relationship.controller';
import { TenantCompanyRelationshipService } from './tenant-company-relationship.service';
import { EventModule } from '../event/event.module';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { BullModule } from '@nestjs/bull';
import { SEARCH_QUEUE } from '../search/search.constants';
import { CacheForRedisModule } from 'src/cache-for-redis/cache-redis.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: SEARCH_QUEUE,
    }),
    EventModule,
    UserProfileModule,
    CacheForRedisModule,
  ],
  providers: [TenantCompanyRelationshipService],
  controllers: [TenantCompanyRelationshipController],
  exports: [TenantCompanyRelationshipService],
})
export class TenantCompanyRelationshipModule {}

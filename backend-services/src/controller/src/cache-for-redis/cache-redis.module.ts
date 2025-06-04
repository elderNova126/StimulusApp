import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { CacheRedisService } from './cache-redis.service';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { StimulusSecretClientService } from '../core/stimulus-secret-client.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CacheModule.register({
      useFactory: async (configService: ConfigService, stimulusSecretClientService: StimulusSecretClientService) => {
        const { value: auth_pass } = await stimulusSecretClientService.getSecret('REDIS-SECRET-PASSWORD');
        return {
          isGlobal: true,
          store: redisStore,
          db: 1,
          host: configService.get<string>('REDIS_HOST'),
          auth_pass,
          port: configService.get<string>('REDIS_PORT'),
          tls: {
            host: configService.get<string>('REDIS_HOST'),
          },
          redis_ssl: true,
          no_ready_check: true,
        };
      },
    }),
  ],
  providers: [CacheRedisService],
  exports: [CacheRedisService],
})
export class CacheForRedisModule {}

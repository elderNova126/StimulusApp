import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import * as Bull from 'bull';
import * as Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { StimulusSecretClientService } from '../core/stimulus-secret-client.service';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService, stimulusSecretClientService: StimulusSecretClientService) => {
        const { value: password } = await stimulusSecretClientService.getSecret('REDIS-SECRET-PASSWORD');
        const redis = {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          password,
        } as Redis.RedisOptions;

        const redisTls = configService.get<string>('REDIS_TLS');
        if (redisTls === 'true') {
          redis.tls = {
            servername: configService.get<string>('REDIS_HOST'),
          };
        }
        const prefix = configService.get<string>('REDIS_JOB_PREFIX');
        return {
          prefix,
          redis,
        } as Bull.QueueOptions;
      },
      inject: [ConfigService, StimulusSecretClientService],
    }),
  ],
})
export class SchedulerModule {}

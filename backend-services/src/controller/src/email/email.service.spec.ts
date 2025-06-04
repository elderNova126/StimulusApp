import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mailProviders } from 'src/core/mail.providers';
import { EmailService } from './email.service';
import { CacheForRedisModule } from 'src/cache-for-redis/cache-redis.module';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheForRedisModule],
      providers: [EmailService, ConfigService, ...mailProviders],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

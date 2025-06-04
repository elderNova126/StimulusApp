import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { mailProviders } from 'src/core/mail.providers';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { EmailController } from './email.controller';
import { EmailService } from './email.service';
import { CacheForRedisModule } from 'src/cache-for-redis/cache-redis.module';

describe('EmailController', () => {
  let controller: EmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CacheForRedisModule],
      controllers: [EmailController],
      providers: [
        EmailService,
        ConfigService,
        ...mailProviders,
        {
          provide: StimulusLogger,
          useValue: {
            log: jest.fn(),
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EmailController>(EmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

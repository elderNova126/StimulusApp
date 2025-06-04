import { Test, TestingModule } from '@nestjs/testing';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { ReqContextResolutionService } from 'src/core/req-context-resolution.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { InternalEventService } from 'src/event/internal-event.service';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { cacheRedisMock } from 'test/cacheRedisMock';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {},
        },
        {
          provide: ReqContextResolutionService,
          useValue: {},
        },
        {
          provide: InternalEventService,
          useValue: {},
        },
        {
          provide: CacheRedisService,
          useValue: cacheRedisMock,
        },
      ],
    }).compile();

    service = await module.resolve<ContactService>(ContactService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

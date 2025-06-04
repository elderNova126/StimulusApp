import { Test, TestingModule } from '@nestjs/testing';
import { CacheRedisService } from 'src/cache-for-redis/cache-redis.service';
import { GLOBAL_CONNECTION } from 'src/database/database.constants';
import { StimulusLogger } from 'src/logging/stimulus-logger.service';
import { globalConnectionMock } from 'test/typeormConnectionMock';
import { TagService } from './tag.service';

describe('TagService', () => {
  let service: TagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagService,
        {
          provide: GLOBAL_CONNECTION,
          useValue: globalConnectionMock,
        },
        {
          provide: StimulusLogger,
          useValue: {},
        },
        {
          provide: CacheRedisService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TagService>(TagService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

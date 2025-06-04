import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheRedisService } from './cache-redis.service';

describe('CacheRedisService', () => {
  let service: CacheRedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CacheRedisService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CacheRedisService>(CacheRedisService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.skip('should be able to set a value', async () => {
    await service.set('test', 'value', 1000);
    expect(await service.get('test')).toBe('test');
  });

  it.skip('should be able to delete a value', async () => {
    await service.set('test', 'value', 1000);
    await service.del('test');
    expect(await service.get('test')).toBeNull();
  });
});

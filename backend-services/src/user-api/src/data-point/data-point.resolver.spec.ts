import { Test, TestingModule } from '@nestjs/testing';
import { DataPointResolver } from './data-point.resolver';

describe('DataPointResolver', () => {
  let resolver: DataPointResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataPointResolver],
    }).compile();

    resolver = module.get<DataPointResolver>(DataPointResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});

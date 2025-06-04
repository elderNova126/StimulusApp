import { Test, TestingModule } from '@nestjs/testing';
import { IngestorResolver } from './ingestor.resolver';

describe('IngestorResolver', () => {
  let resolver: IngestorResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IngestorResolver],
    }).compile();

    resolver = module.get<IngestorResolver>(IngestorResolver);
  });

  it.skip('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
